/**
 * lib/crypto/aes.ts
 *
 * AES-256-GCM authenticated encryption.
 *
 * AES-256-GCM simultaneously encrypts and authenticates data. Any byte-level
 * tampering with a stored ciphertext will cause decryption to throw — the
 * 16-byte GCM authentication tag verifies integrity on every decrypt call.
 *
 * This file is responsible for three things:
 *
 *  1. Vault key envelope  — the randomly generated vault key is itself
 *     encrypted with the Argon2id-derived key and stored on the server.
 *     The server never sees the plaintext vault key.
 *
 *  2. Verification hash   — a known constant is encrypted with the vault
 *     key at setup time. On every unlock attempt we try to decrypt it; if
 *     it matches, the master password was correct.
 *
 *  3. Item encryption     — individual vault items (logins, cards, notes)
 *     are JSON-serialised and encrypted with the vault key before being
 *     sent to the server.
 *
 * Install: npm install @noble/ciphers
 */

import { gcm } from "@noble/ciphers/aes.js";
import { toBase64, fromBase64 } from "./utils";

// ─── Constants ────────────────────────────────────────────────────────────────

/**
 * AES-GCM nonce (IV) length in bytes.
 * 12 bytes (96 bits) is the NIST SP 800-38D recommended size for GCM.
 * It maximises the size of the authentication field and avoids performance
 * penalties that occur with other IV lengths.
 */
const IV_LENGTH = 12;

/**
 * Vault key length in bytes (32 bytes = 256-bit AES key).
 * Must match the dkLen used in argon2.ts (ARGON2_PARAMS.KEY_LEN).
 */
const VAULT_KEY_LENGTH = 32;

/**
 * Known plaintext used for zero-knowledge vault key verification.
 *
 * During vault setup, this string is encrypted with the vault key and the
 * ciphertext is stored in the database. On every unlock attempt, we decrypt
 * it and check that the result matches — proving the correct master password
 * was entered without storing the vault key or password anywhere.
 *
 * Versioned so we can rotate the constant in future without ambiguity.
 */
const VERIFICATION_PLAINTEXT = "wardpass:vault:verification:v1";

// ─── Custom errors ────────────────────────────────────────────────────────────

/**
 * Thrown when AES-GCM authentication fails (wrong key, tampered ciphertext)
 * or when data is structurally malformed.
 *
 * Do not expose the underlying noble error message to the user — it can
 * leak information about what exactly failed. Always surface a generic message.
 */
export class DecryptionError extends Error {
    constructor(
        message = "Decryption failed. The master password may be incorrect, or the data may be corrupted."
    ) {
        super(message);
        this.name = "DecryptionError";
    }
}

// ─── IV generation ────────────────────────────────────────────────────────────

/**
 * Generate a cryptographically random 12-byte Initialization Vector.
 *
 * CRITICAL: A fresh IV MUST be generated for every single encryption call.
 * Reusing an IV with the same key in GCM mode is catastrophic — it allows
 * an attacker to XOR two ciphertexts and recover the plaintexts.
 *
 * Since we call crypto.getRandomValues, the probability of a collision across
 * 2^96 possible IVs is negligible for any realistic number of vault items.
 */
function generateIV(): Uint8Array {
    return crypto.getRandomValues(new Uint8Array(IV_LENGTH));
}

// ─── Vault key management ─────────────────────────────────────────────────────

/**
 * Generate a cryptographically random 32-byte vault key.
 *
 * This key is the true encryption key for all vault items. It is itself
 * encrypted with the Argon2id-derived key (key envelope pattern) and stored
 * on the server. In plaintext, it only ever lives in the Zustand store.
 *
 * Called once during vault setup. Never called again — the same vault key
 * is decrypted from the envelope on every subsequent unlock.
 */
export function generateVaultKey(): Uint8Array {
    return crypto.getRandomValues(new Uint8Array(VAULT_KEY_LENGTH));
}

/**
 * Encrypt the vault key with the Argon2id-derived key (key envelope).
 *
 * The resulting encryptedKey and keyIv are stored in the database
 * (vaults.encrypted_key, vaults.key_iv). The server sees only ciphertext.
 *
 * @param vaultKey    The 32-byte random vault key (from generateVaultKey).
 * @param derivedKey  The 32-byte key derived from the master password (from deriveKey).
 * @returns           Base64-encoded encrypted key and IV for database storage.
 *
 * @example
 * // During vault setup
 * const salt       = generateSalt();
 * const derivedKey = await deriveKey(masterPassword, salt);
 * const vaultKey   = generateVaultKey();
 * const { encryptedKey, keyIv } = encryptVaultKey(vaultKey, derivedKey);
 * // → POST /api/vault/setup { salt, encryptedKey, keyIv, ...verificationHash }
 */
export function encryptVaultKey(
    vaultKey: Uint8Array,
    derivedKey: Uint8Array
): { encryptedKey: string; keyIv: string } {
    const iv = generateIV();
    const cipher = gcm(derivedKey, iv);
    const encryptedBytes = cipher.encrypt(vaultKey);

    return {
        encryptedKey: toBase64(encryptedBytes),
        keyIv: toBase64(iv),
    };
}

/**
 * Decrypt the vault key envelope to recover the vault key in browser memory.
 *
 * Called during vault unlock after the Argon2id-derived key has been
 * computed from the master password attempt. If the master password is
 * wrong, the GCM authentication tag will not match and this throws.
 *
 * @param encryptedKey  Base64 encrypted vault key (vaults.encrypted_key).
 * @param keyIv         Base64 IV used during encryption (vaults.key_iv).
 * @param derivedKey    32-byte key derived from the master password attempt.
 * @returns             The 32-byte plaintext vault key, ready for the Zustand store.
 * @throws              DecryptionError if the password is wrong or data is tampered.
 *
 * @example
 * // During vault unlock
 * const salt       = fromBase64(vaultRow.salt);
 * const derivedKey = await deriveKey(masterPasswordAttempt, salt);
 * const vaultKey   = decryptVaultKey(vaultRow.encryptedKey, vaultRow.keyIv, derivedKey);
 * // If no error thrown, vaultKey is correct — store it:
 * useVaultStore.getState().unlock(vaultKey);
 */
export function decryptVaultKey(
    encryptedKey: string,
    keyIv: string,
    derivedKey: Uint8Array
): Uint8Array {
    try {
        const encryptedBytes = fromBase64(encryptedKey);
        const ivBytes = fromBase64(keyIv);
        const cipher = gcm(derivedKey, ivBytes);
        return cipher.decrypt(encryptedBytes);
    } catch (error) {
        // @noble/ciphers throws a generic Error on tag mismatch.
        // Re-throw as a typed DecryptionError with a safe user-facing message.
        throw new DecryptionError(
            "Failed to unlock vault. Please check your master password and try again."
        );
    }
}

// ─── Verification hash ────────────────────────────────────────────────────────

/**
 * Create a verification token by encrypting a known constant with the vault key.
 *
 * Store { hash, hashIv } in the database (vaults.verification_hash, vaults.hash_iv).
 * On every unlock attempt, call verifyVaultKey() before storing the key in memory.
 *
 * This is a zero-knowledge check: we prove the vault key is correct without
 * storing the vault key or the master password anywhere.
 *
 * @param vaultKey  The newly generated vault key (from generateVaultKey).
 * @returns         Base64-encoded hash and IV for database storage.
 */
export function createVerificationHash(
    vaultKey: Uint8Array
): { hash: string; hashIv: string } {
    const { ciphertext, iv } = encryptData(VERIFICATION_PLAINTEXT, vaultKey);
    return { hash: ciphertext, hashIv: iv };
}

/**
 * Verify a vault key by decrypting the known verification constant.
 *
 * Returns true only if the vault key successfully decrypts the ciphertext
 * stored during vault setup AND the result matches VERIFICATION_PLAINTEXT.
 *
 * Always call this after decryptVaultKey() and before passing the key to
 * useVaultStore.unlock() — it is the final safety check before the vault opens.
 *
 * @param hash      Base64 verification ciphertext (vaults.verification_hash).
 * @param hashIv    Base64 IV (vaults.hash_iv).
 * @param vaultKey  The candidate vault key to verify.
 * @returns         true if the key is correct, false otherwise.
 */
export function verifyVaultKey(
    hash: string,
    hashIv: string,
    vaultKey: Uint8Array
): boolean {
    try {
        const decrypted = decryptData(hash, hashIv, vaultKey);
        return decrypted === VERIFICATION_PLAINTEXT;
    } catch {
        // Decryption threw — wrong vault key or corrupted verification data.
        return false;
    }
}

// ─── Item encryption / decryption ─────────────────────────────────────────────

/**
 * Encrypt any UTF-8 string with AES-256-GCM using the vault key.
 *
 * Typically called with JSON.stringify(itemData) where itemData is a
 * LoginItem, CardItem, or NoteItem. The caller is responsible for serialisation.
 *
 * @param plaintext  UTF-8 string to encrypt (usually JSON-serialised item data).
 * @param key        32-byte vault key from useVaultStore.getState().getVaultKey().
 * @returns          Base64-encoded ciphertext and IV for vault_items table storage.
 *
 * @example
 * const vaultKey = useVaultStore.getState().getVaultKey();
 * const payload  = JSON.stringify({ username: "alice", password: "s3cr3t", url: "..." });
 * const { ciphertext, iv } = encryptData(payload, vaultKey);
 * // → POST /api/vault/items { name, type, encrypted_data: ciphertext, iv }
 */
export function encryptData(
    plaintext: string,
    key: Uint8Array
): { ciphertext: string; iv: string } {
    const iv = generateIV();
    const plaintextBytes = new TextEncoder().encode(plaintext);
    const cipher = gcm(key, iv);

    // cipher.encrypt returns ciphertext || auth_tag (tag appended, 16 bytes).
    const ciphertextBytes = cipher.encrypt(plaintextBytes);

    return {
        ciphertext: toBase64(ciphertextBytes),
        iv: toBase64(iv),
    };
}

/**
 * Decrypt an AES-256-GCM encrypted string.
 *
 * AES-GCM verifies the 16-byte authentication tag on every decryption call.
 * If even a single byte of the stored ciphertext has been modified in the
 * database, this will throw — providing tamper detection for free.
 *
 * @param ciphertext  Base64 ciphertext (vault_items.encrypted_data).
 * @param iv          Base64 IV (vault_items.iv).
 * @param key         32-byte vault key from useVaultStore.getState().getVaultKey().
 * @returns           The original plaintext string (JSON to be parsed by the caller).
 * @throws            DecryptionError on tag mismatch or malformed input.
 *
 * @example
 * const vaultKey = useVaultStore.getState().getVaultKey();
 * const json     = decryptData(item.encrypted_data, item.iv, vaultKey);
 * const data     = JSON.parse(json) as LoginItem;
 */
export function decryptData(
    ciphertext: string,
    iv: string,
    key: Uint8Array
): string {
    try {
        const ciphertextBytes = fromBase64(ciphertext);
        const ivBytes = fromBase64(iv);
        const cipher = gcm(key, ivBytes);
        const plaintextBytes = cipher.decrypt(ciphertextBytes);
        return new TextDecoder().decode(plaintextBytes);
    } catch (error) {
        if (error instanceof DecryptionError) throw error;
        throw new DecryptionError();
    }
}