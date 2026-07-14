/**
 * lib/crypto/utils.ts
 *
 * Shared binary ↔ URL-safe base64 encoding utilities for the crypto module.
 *
 * All binary data (keys, IVs, ciphertext) is encoded as URL-safe base64
 * before being transmitted over JSON APIs or stored in the database.
 * URL-safe base64 (RFC 4648 §5) replaces + with - and / with _ so the
 * strings are safe to use in URLs, query params, and JSON without escaping.
 */

/**
 * Encode a Uint8Array to a URL-safe base64 string (no padding).
 *
 * Uses a for-loop instead of spread operator (String.fromCharCode(...data))
 * to safely handle large ciphertexts without hitting the call stack limit.
 */
export function toBase64(data: Uint8Array): string {
    let binary = "";
    for (let i = 0; i < data.length; i++) {
        binary += String.fromCharCode(data[i]);
    }
    return btoa(binary)
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");
}

/**
 * Decode a URL-safe base64 string back to a Uint8Array.
 * Handles both standard (+/) and URL-safe (-_) base64 variants.
 */
export function fromBase64(base64: string): Uint8Array {
    // Normalise URL-safe chars back to standard base64
    const standard = base64.replace(/-/g, "+").replace(/_/g, "/");

    // Re-add padding that was stripped during encoding
    const padded = standard.padEnd(
        standard.length + ((4 - (standard.length % 4)) % 4),
        "="
    );

    const binary = atob(padded);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
}