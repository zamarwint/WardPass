/**
 * lib/crypto/argon2.ts
 *
 * Argon2id key derivation.
 *
 * Argon2id won the Password Hashing Competition (2015) and is the algorithm
 * recommended by OWASP for deriving encryption keys from user passwords.
 * It is memory-hard (requiring a fixed amount of RAM to compute), which makes
 * it resistant to GPU brute-force attacks and ASICs.
 *
 * Role in WardPass:
 *   masterPassword + salt  ──► Argon2id ──►  derivedKey (32 bytes)
 *   derivedKey is NEVER stored or sent to the server. It exists only in
 *   browser memory long enough to encrypt/decrypt the vault key envelope.
 *
 * Install: npm install @noble/hashes
 */

import { argon2id } from "@noble/hashes/argon2.js";
export { toBase64, fromBase64 } from "./utils";

// ─── Argon2id parameters ──────────────────────────────────────────────────────
//
// These match the OWASP 2023 recommendation for key derivation.
// The operation takes ~0.5–2 s on a modern browser — intentionally slow
// to make offline brute-force attacks computationally infeasible.
//
// Before calling deriveKey(), always show a loading spinner so the user
// knows the UI is not frozen.

export const ARGON2_PARAMS = {
    /**
     * Memory cost in kibibytes.
     * 65 536 KiB = 64 MiB. An attacker needs 64 MB of RAM per guess attempt.
     */
    MEM: 65_536,

    /**
     * Time cost — number of passes over the allocated memory.
     * Higher values increase security at the cost of more computation time.
     */
    TIME: 3,

    /**
     * Degree of parallelism.
     * Set to 1 because browsers are single-threaded (no worker threads for
     * this synchronous implementation). Increase only if you move deriveKey
     * into a Web Worker with SharedArrayBuffer support.
     */
    PARALLELISM: 1,

    /**
     * Output key length in bytes.
     * 32 bytes = 256 bits, matching the AES-256 key size in aes.ts.
     */
    KEY_LEN: 32,

    /**
     * Salt length in bytes.
     * 16 bytes = 128 bits. The salt is randomly generated once per vault
     * and stored in the database (it is not secret, but must be unique).
     */
    SALT_LEN: 16,
} as const;

// ─── Salt generation ──────────────────────────────────────────────────────────

/**
 * Generate a cryptographically random 16-byte salt using the Web Crypto API.
 *
 * Rules:
 *  - Generate ONCE per vault during vault setup. Store base64(salt) in the
 *    database (vaults.salt). Fetch it on every subsequent unlock.
 *  - Never generate a new salt on each unlock — doing so would produce a
 *    different derivedKey and make it impossible to decrypt the vault key.
 *  - The salt is not secret; it exists to make identical master passwords
 *    produce unique keys across different user vaults.
 */
export function generateSalt(): Uint8Array {
    return crypto.getRandomValues(new Uint8Array(ARGON2_PARAMS.SALT_LEN));
}

// ─── Key derivation ───────────────────────────────────────────────────────────

/**
 * Derive a 32-byte AES-256 encryption key from the user's master password.
 *
 * This is an async wrapper around the synchronous @noble/hashes argon2id
 * implementation. The single `await` before the computation yields the event
 * loop once, giving the browser a chance to render a loading spinner before
 * the blocking CPU work begins (~0.5–2 s on typical hardware).
 *
 * @param masterPassword  Plaintext master password typed by the user.
 *                        Never stored, never transmitted — used only here.
 * @param salt            The 16-byte salt retrieved from vaults.salt (DB).
 *                        Must be the same salt used at vault creation time.
 * @returns               A 32-byte Uint8Array key-encryption key (KEK).
 *
 * @throws Error if masterPassword is empty or salt is the wrong length.
 *
 * @example
 * // Vault setup (first time)
 * const salt       = generateSalt();
 * const derivedKey = await deriveKey(masterPassword, salt);
 * const { encryptedKey, keyIv } = encryptVaultKey(vaultKey, derivedKey);
 * // Store: toBase64(salt), encryptedKey, keyIv in the database
 *
 * @example
 * // Vault unlock (every subsequent visit)
 * const salt       = fromBase64(vaultRow.salt);   // fetch from DB
 * const derivedKey = await deriveKey(masterPassword, salt);
 * const vaultKey   = decryptVaultKey(encryptedKey, keyIv, derivedKey);
 * // vaultKey goes into the Zustand store — never touches the server
 */
export async function deriveKey(
    masterPassword: string,
    salt: Uint8Array
): Promise<Uint8Array> {
    if (!masterPassword || masterPassword.length === 0) {
        throw new Error("Master password must not be empty.");
    }
    if (salt.length !== ARGON2_PARAMS.SALT_LEN) {
        throw new Error(
            `Salt must be exactly ${ARGON2_PARAMS.SALT_LEN} bytes. Received ${salt.length}.`
        );
    }

    // Encode the password as UTF-8 bytes — Argon2 operates on raw bytes,
    // not JavaScript strings.
    const passwordBytes = new TextEncoder().encode(masterPassword);

    // Yield to the event loop once so the calling component can render
    // its loading state before the synchronous, CPU-heavy work starts.
    await new Promise<void>((resolve) => setTimeout(resolve, 0));

    // argon2id is synchronous in @noble/hashes. It will block the main
    // thread for the duration of the computation. This is expected and
    // intentional — moving it to a Web Worker is a future improvement.
    return argon2id(passwordBytes, salt, {
        t: ARGON2_PARAMS.TIME,
        m: ARGON2_PARAMS.MEM,
        p: ARGON2_PARAMS.PARALLELISM,
        dkLen: ARGON2_PARAMS.KEY_LEN,
        // version: 19 is the default (Argon2 spec v1.3) — no need to specify.
    });
}