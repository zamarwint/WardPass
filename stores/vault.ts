/**
 * stores/vault.ts
 *
 * Zustand vault store — manages a KEYRING of in-memory vault keys.
 *
 * Each vault has its own unique salt → derived key → vault key chain,
 * so the store maps vaultId → vaultKey rather than holding a single key.
 * Think of it as a physical keyring: one ring, one key per vault, each
 * key labelled with the vault ID it opens.
 *
 * Security rules (unchanged from single-vault version):
 *  • Keys exist ONLY in memory — never written to any persistent storage.
 *  • On lock, each key's bytes are zeroed (fill(0)) before the reference drops.
 *  • All vaults auto-lock after INACTIVITY_TIMEOUT_MS of no activity.
 *  • All vaults auto-lock after HIDDEN_TAB_TIMEOUT_MS when the tab is hidden.
 *  • Never add devtools middleware — it would expose all keys in DevTools.
 */

import { create } from "zustand";

// ─── Auto-lock configuration ──────────────────────────────────────────────────

/** Lock ALL vaults after this period of no activity (ms). */
const INACTIVITY_TIMEOUT_MS = 15 * 60 * 1000; // 15 minutes

/** Lock ALL vaults if the browser tab stays hidden for this long (ms). */
const HIDDEN_TAB_TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes

// ─── Custom errors ────────────────────────────────────────────────────────────

export class VaultLockedError extends Error {
    constructor(vaultId: string) {
        super(
            `Vault "${vaultId}" is locked. Unlock it with your master password first.`
        );
        this.name = "VaultLockedError";
    }
}

// ─── Store types ──────────────────────────────────────────────────────────────

interface VaultState {
    // ── State ───────────────────────────────────────────────────────────────────

    /**
     * Keyring: a map of vaultId → decrypted 32-byte vault key.
     *
     * A vault is "unlocked" if and only if its ID exists as a key in this map.
     * Using a plain Record (not Map) so Zustand's spread-based updates
     * produce a new object reference, which React's useMemo can detect.
     */
    vaultKeys: Record<string, Uint8Array>;

    // ── Actions ─────────────────────────────────────────────────────────────────

    /**
     * Add a vault's decrypted key to the keyring.
     * Call after a successful decryptVaultKey() + verifyVaultKey() sequence.
     *
     * @param vaultId  The vault's database ID (from the URL / route params).
     * @param vaultKey The 32-byte plaintext vault key from decryptVaultKey().
     */
    unlock: (vaultId: string, vaultKey: Uint8Array) => void;

    /**
     * Remove a single vault's key from the keyring and zero its bytes.
     * Use when the user explicitly locks one vault while keeping others open.
     *
     * @param vaultId  The vault ID to lock.
     */
    lock: (vaultId: string) => void;

    /**
     * Zero and remove ALL vault keys from the keyring.
     * Called by the auto-lock timers (inactivity, hidden tab).
     */
    lockAll: () => void;

    /**
     * Retrieve the in-memory key for a specific vault.
     *
     * @param vaultId  The vault ID whose key to retrieve.
     * @throws VaultLockedError if that vault is not currently unlocked.
     */
    getVaultKey: (vaultId: string) => Uint8Array;

    /**
     * Check whether a specific vault is currently unlocked.
     * Use this for the needsUnlock guard and conditional rendering.
     *
     * @param vaultId  The vault ID to check.
     */
    isVaultUnlocked: (vaultId: string) => boolean;

    /**
     * Reset the inactivity auto-lock timer.
     * Call on meaningful vault interactions (copy, open item, save).
     * A no-op when all vaults are locked.
     */
    refreshActivity: () => void;

    // In VaultState interface — add these two:
    masterPassword: string | null;
    setMasterPassword: (password: string) => void;
}

// ─── Timer management ─────────────────────────────────────────────────────────

let inactivityTimer: ReturnType<typeof setTimeout> | null = null;
let hiddenTabTimer: ReturnType<typeof setTimeout> | null = null;

function clearInactivityTimer(): void {
    if (inactivityTimer !== null) {
        clearTimeout(inactivityTimer);
        inactivityTimer = null;
    }
}

function clearHiddenTabTimer(): void {
    if (hiddenTabTimer !== null) {
        clearTimeout(hiddenTabTimer);
        hiddenTabTimer = null;
    }
}

function clearAllTimers(): void {
    clearInactivityTimer();
    clearHiddenTabTimer();
}

function scheduleInactivityLock(): void {
    clearInactivityTimer();
    inactivityTimer = setTimeout(() => {
        useVaultStore.getState().lockAll();
    }, INACTIVITY_TIMEOUT_MS);
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useVaultStore = create<VaultState>()((set, get) => ({
    vaultKeys: {},

    // ── unlock ─────────────────────────────────────────────────────────────────
    unlock: (vaultId: string, vaultKey: Uint8Array) => {
        // Spread creates a new object reference → useMemo dependencies update.
        set((state) => ({
            vaultKeys: { ...state.vaultKeys, [vaultId]: vaultKey },
        }));

        // (Re)start the inactivity timer on any unlock.
        scheduleInactivityLock();
    },

    // ── lock (single vault) ───────────────────────────────────────────────────
    lock: (vaultId: string) => {
        const { vaultKeys } = get();
        const vaultKey = vaultKeys[vaultId];

        if (vaultKey) {
            vaultKey.fill(0); // Zero bytes before releasing reference
        }

        const remaining = { ...vaultKeys };
        delete remaining[vaultId];

        set({ vaultKeys: remaining });

        // If no vaults remain unlocked, stop the inactivity timer.
        if (Object.keys(remaining).length === 0) {
            clearAllTimers();
        }
    },

    // In create() — add the implementation:
    masterPassword: null,
    setMasterPassword: (password) => set({ masterPassword: password }),

    // In lockAll() — clear it when everything locks:
    // ── lockAll ───────────────────────────────────────────────────────────────
    lockAll: () => {
        clearAllTimers();
        Object.values(get().vaultKeys).forEach((key) => key.fill(0));
        set({ vaultKeys: {}, masterPassword: null }); // ← add masterPassword: null
    },

    // ── getVaultKey ───────────────────────────────────────────────────────────
    getVaultKey: (vaultId: string) => {
        const key = get().vaultKeys[vaultId];
        if (!key) throw new VaultLockedError(vaultId);
        return key;
    },

    // ── isVaultUnlocked ───────────────────────────────────────────────────────
    isVaultUnlocked: (vaultId: string) => {
        return vaultId in get().vaultKeys;
    },

    // ── refreshActivity ───────────────────────────────────────────────────────
    refreshActivity: () => {
        // No-op when no vaults are open.
        if (Object.keys(get().vaultKeys).length === 0) return;
        scheduleInactivityLock();
    },
}));

// ─── Visibility-change auto-lock ─────────────────────────────────────────────

if (typeof window !== "undefined") {
    document.addEventListener("visibilitychange", () => {
        const { vaultKeys, lockAll } = useVaultStore.getState();
        const hasUnlockedVaults = Object.keys(vaultKeys).length > 0;

        if (document.hidden) {
            if (!hasUnlockedVaults) return;

            hiddenTabTimer = setTimeout(() => {
                useVaultStore.getState().lockAll();
            }, HIDDEN_TAB_TIMEOUT_MS);
        } else {
            clearHiddenTabTimer();

            // If vaults are still unlocked, reset the inactivity timer.
            if (Object.keys(useVaultStore.getState().vaultKeys).length > 0) {
                scheduleInactivityLock();
            }
        }
    });
}