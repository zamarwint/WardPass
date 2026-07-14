/**
 * stores/vault.ts
 *
 * Zustand vault store — manages the in-memory vault key and lock state.
 *
 * Security design
 * ───────────────
 *  • The vault key exists ONLY in memory (never in localStorage, sessionStorage,
 *    cookies, IndexedDB, or any form of persistent storage).
 *  • On lock(), the key bytes are zeroed out (fill(0)) before the reference is
 *    released. JavaScript's GC cannot guarantee when memory is freed, but
 *    zeroing eliminates the key value from any memory dump.
 *  • The store auto-locks after INACTIVITY_TIMEOUT_MS of no refreshActivity()
 *    calls. Call refreshActivity() on meaningful vault interactions (copy,
 *    open, edit) — not on every mouse move.
 *  • When the browser tab is hidden, a shorter HIDDEN_TAB_TIMEOUT_MS timer
 *    fires. If the user returns within that window, the timer is cancelled.
 *
 * ⚠️  Never add the Zustand devtools middleware to this store in production.
 *     The Redux DevTools panel would expose the raw vault key bytes to anyone
 *     who opens the browser's developer tools.
 *
 * Install: npm install zustand
 */

import { create } from "zustand";

// ─── Auto-lock configuration ──────────────────────────────────────────────────

/** Lock the vault after this period of no activity (ms). */
const INACTIVITY_TIMEOUT_MS = 15 * 60 * 1000; // 15 minutes

/**
 * Lock the vault after the browser tab has been hidden for this long (ms).
 * Shorter than the inactivity timeout — tab hiding is a stronger signal
 * that the user has left their device unattended.
 */
const HIDDEN_TAB_TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes

// ─── Types ────────────────────────────────────────────────────────────────────

/**
 * Thrown by getVaultKey() when the vault is locked.
 * Catch this in components that read from the vault to redirect the user
 * to the unlock screen.
 */
export class VaultLockedError extends Error {
    constructor() {
        super(
            "Vault is locked. Unlock the vault with your master password first."
        );
        this.name = "VaultLockedError";
    }
}

interface VaultState {
    // ── State ───────────────────────────────────────────────────────────────────

    /**
     * The 32-byte AES-256 vault key, held in a Uint8Array.
     * null at all times when the vault is locked.
     *
     * Access via getVaultKey() rather than reading this field directly —
     * getVaultKey() throws a typed error if the vault is locked, making
     * callsites explicit about handling the locked state.
     */
    vaultKey: Uint8Array | null;

    /** Whether the vault is currently unlocked and the key is in memory. */
    isUnlocked: boolean;

    /**
     * Unix timestamp (ms) when the vault was last unlocked.
     * Useful for displaying "unlocked 4 minutes ago" in the UI.
     * null when the vault is locked.
     */
    unlockedAt: number | null;

    // ── Actions ─────────────────────────────────────────────────────────────────

    /**
     * Unlock the vault by storing the decrypted vault key in memory.
     *
     * Call this after a successful decryptVaultKey() + verifyVaultKey()
     * sequence in the unlock form handler. Starts the inactivity timer.
     *
     * @param vaultKey  The plaintext 32-byte vault key from decryptVaultKey().
     */
    unlock: (vaultKey: Uint8Array) => void;

    /**
     * Lock the vault.
     *
     * Zeros out the vault key bytes, clears all timers, and resets state.
     * Safe to call even when already locked (idempotent).
     */
    lock: () => void;

    /**
     * Retrieve the in-memory vault key.
     *
     * @throws VaultLockedError  if the vault is locked.
     * @returns The 32-byte vault key Uint8Array.
     *
     * @example
     * // In a vault item hook
     * try {
     *   const key = useVaultStore.getState().getVaultKey();
     *   const decrypted = decryptData(item.encrypted_data, item.iv, key);
     * } catch (error) {
     *   if (error instanceof VaultLockedError) router.push("/vault/unlock");
     * }
     */
    getVaultKey: () => Uint8Array;

    /**
     * Reset the inactivity auto-lock timer.
     *
     * Call this on meaningful vault interactions — copying a password,
     * opening an item, saving a new entry — not on continuous events like
     * mouse move or scroll. Calling it when locked is a no-op.
     */
    refreshActivity: () => void;
}

// ─── Timer management (module-level, outside the store) ───────────────────────
//
// Timers live at module scope so they survive Zustand state updates.
// A state update triggers re-renders but does not re-initialise this module.

let inactivityTimer: ReturnType<typeof setTimeout> | null = null;
let hiddenTabTimer: ReturnType<typeof setTimeout> | null = null;

/** Cancel the inactivity timer if one is running. */
function clearInactivityTimer(): void {
    if (inactivityTimer !== null) {
        clearTimeout(inactivityTimer);
        inactivityTimer = null;
    }
}

/** Cancel the hidden-tab timer if one is running. */
function clearHiddenTabTimer(): void {
    if (hiddenTabTimer !== null) {
        clearTimeout(hiddenTabTimer);
        hiddenTabTimer = null;
    }
}

/** Cancel all running timers. */
function clearAllTimers(): void {
    clearInactivityTimer();
    clearHiddenTabTimer();
}

/**
 * (Re)start the inactivity auto-lock timer.
 * Each call resets the 15-minute countdown from zero.
 */
function scheduleInactivityLock(): void {
    clearInactivityTimer();
    inactivityTimer = setTimeout(() => {
        useVaultStore.getState().lock();
    }, INACTIVITY_TIMEOUT_MS);
}

// ─── Zustand store ────────────────────────────────────────────────────────────

export const useVaultStore = create<VaultState>()((set, get) => ({
    vaultKey: null,
    isUnlocked: false,
    unlockedAt: null,

    // ── unlock ─────────────────────────────────────────────────────────────────
    unlock: (vaultKey: Uint8Array) => {
        // Cancel any existing timers from a previous session.
        clearAllTimers();

        set({
            vaultKey,
            isUnlocked: true,
            unlockedAt: Date.now(),
        });

        // Start the inactivity countdown.
        scheduleInactivityLock();
    },

    // ── lock ───────────────────────────────────────────────────────────────────
    lock: () => {
        clearAllTimers();

        // Zero out the vault key bytes before releasing the reference.
        // This minimises the window during which the key value could be
        // recovered from a memory snapshot.
        const { vaultKey } = get();
        if (vaultKey !== null) {
            vaultKey.fill(0);
        }

        set({
            vaultKey: null,
            isUnlocked: false,
            unlockedAt: null,
        });
    },

    // ── getVaultKey ────────────────────────────────────────────────────────────
    getVaultKey: () => {
        const { vaultKey, isUnlocked } = get();

        if (!isUnlocked || vaultKey === null) {
            throw new VaultLockedError();
        }

        return vaultKey;
    },

    // ── refreshActivity ────────────────────────────────────────────────────────
    refreshActivity: () => {
        // No-op when locked — no timer to reset.
        if (!get().isUnlocked) return;
        scheduleInactivityLock();
    },
}));

// ─── Visibility-change auto-lock ─────────────────────────────────────────────
//
// When the user backgrounds the tab (switches apps, minimises, locks screen),
// start a shorter countdown. If they return within HIDDEN_TAB_TIMEOUT_MS,
// cancel the countdown. If they stay away longer, lock the vault.
//
// This prevents an attacker from walking up to an unattended machine and
// seeing an unlocked vault just by switching browser tabs.
//
// Guard with typeof window to prevent this side effect running during
// Next.js server-side rendering (where document is undefined).

if (typeof window !== "undefined") {
    document.addEventListener("visibilitychange", () => {
        const store = useVaultStore.getState();

        if (document.hidden) {
            // ── Tab went to background ────────────────────────────────────────────
            // Only start the hidden timer if the vault is currently unlocked.
            if (!store.isUnlocked) return;

            hiddenTabTimer = setTimeout(() => {
                useVaultStore.getState().lock();
            }, HIDDEN_TAB_TIMEOUT_MS);
        } else {
            // ── Tab came back to foreground ───────────────────────────────────────
            // Cancel the hidden-tab timer — the user returned in time.
            clearHiddenTabTimer();

            // If the vault is still unlocked, reset the inactivity timer
            // (the user returning counts as activity).
            if (useVaultStore.getState().isUnlocked) {
                scheduleInactivityLock();
            }
        }
    });
}