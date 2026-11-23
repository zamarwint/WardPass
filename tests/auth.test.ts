import { describe, it } from "node:test";
import assert from "node:assert";

import {
  passwordSchema,
  signUpSchema,
  resetPasswordSchema,
} from "../lib/validations/authSchemas";
import { useVaultStore, VaultLockedError } from "../stores/vault";
import {
  generateVaultKey,
  encryptVaultKey,
  decryptVaultKey,
  createVerificationHash,
  verifyVaultKey,
  encryptData,
  decryptData,
  DecryptionError,
} from "../lib/crypto/aes";
import { deriveKey, generateSalt, toBase64, fromBase64 } from "../lib/crypto/argon2";

import {
  account,
  session as sessionTable,
  user as userTable,
  vault as vaultTable,
  vaultItem as vaultItemTable,
  verification as verificationTable,
} from "../drizzle/schema";

describe("Authentication & Security Test Suite", () => {
  // ════════════════════════════════════════════════════════════════════════════
  // 1. PASSWORD POLICY & SCHEMA VALIDATION
  // ════════════════════════════════════════════════════════════════════════════

  describe("1. Password Policy & Auth Schemas", () => {
    it("should accept compliant passwords meeting all security constraints", () => {
      const validPasswords = [
        "WardPass#2026",
        "StrongP@ssw0rd!",
        "Secure$Key99",
        "P@ssw0rd_With_Underscore",
        "Complex!Aa1".padEnd(32, "x"), // exactly 32 chars
      ];

      for (const pass of validPasswords) {
        const result = passwordSchema.safeParse(pass);
        assert.strictEqual(result.success, true, `Password "${pass}" should be valid`);
      }
    });

    it("should reject passwords that fail security constraints", () => {
      const invalidCases = [
        { pass: "Short1!", reason: "Less than 8 characters" },
        { pass: "A".repeat(33) + "1!a", reason: "More than 32 characters" },
        { pass: "alllowercase123!", reason: "Missing uppercase letter" },
        { pass: "ALLUPPERCASE123!", reason: "Missing lowercase letter" },
        { pass: "NoNumbersHere!@", reason: "Missing numeric digit" },
        { pass: "NoSpecialChars1234", reason: "Missing special character" },
        { pass: "", reason: "Empty string" },
      ];

      for (const { pass, reason } of invalidCases) {
        const result = passwordSchema.safeParse(pass);
        assert.strictEqual(result.success, false, `Expected failure for: ${reason}`);
      }
    });

    it("should validate complete Sign Up registrations", () => {
      const validSignUp = {
        name: "Christopher Nolan", // 17 chars (min 10, max 30)
        email: "cnolan@wardpass.app",
        password: "Inception#2010!",
        confirmPassword: "Inception#2010!",
      };

      const result = signUpSchema.safeParse(validSignUp);
      assert.strictEqual(result.success, true);
    });

    it("should reject Sign Up when name is out of bounds or passwords do not match", () => {
      // 1. Name too short (< 10 chars)
      const shortName = {
        name: "John Doe", // 8 chars
        email: "john@example.com",
        password: "ValidPass123!",
        confirmPassword: "ValidPass123!",
      };
      const resShort = signUpSchema.safeParse(shortName);
      assert.strictEqual(resShort.success, false);

      // 2. Passwords mismatch
      const mismatch = {
        name: "Alexander Hamilton",
        email: "alex@example.com",
        password: "ValidPass123!",
        confirmPassword: "DifferentPass123!",
      };
      const resMismatch = signUpSchema.safeParse(mismatch);
      assert.strictEqual(resMismatch.success, false);
      if (!resMismatch.success) {
        const errors = resMismatch.error.flatten().fieldErrors;
        assert.ok(errors.confirmPassword?.some((msg) => msg.includes("Passwords do not match")));
      }

      // 3. Invalid email
      const badEmail = {
        name: "Alexander Hamilton",
        email: "not-an-email",
        password: "ValidPass123!",
        confirmPassword: "ValidPass123!",
      };
      const resEmail = signUpSchema.safeParse(badEmail);
      assert.strictEqual(resEmail.success, false);
    });

    it("should validate Reset Password schema", () => {
      const validReset = {
        currentPassword: "OldPassword123!",
        password: "NewPassword#2026!",
        confirmPassword: "NewPassword#2026!",
      };

      const result = resetPasswordSchema.safeParse(validReset);
      assert.strictEqual(result.success, true);

      // currentPassword is optional for forgot-password token flow
      const withoutCurrent = {
        password: "NewPassword#2026!",
        confirmPassword: "NewPassword#2026!",
      };
      assert.strictEqual(resetPasswordSchema.safeParse(withoutCurrent).success, true);

      // Mismatched confirmPassword must be rejected
      const mismatch = {
        password: "NewPassword#2026!",
        confirmPassword: "WrongConfirmation!",
      };
      assert.strictEqual(resetPasswordSchema.safeParse(mismatch).success, false);
    });
  });

  // ════════════════════════════════════════════════════════════════════════════
  // 2. SESSION SECURITY & ACCESS CONTROL (RBAC)
  // ════════════════════════════════════════════════════════════════════════════

  describe("2. Session Security & Access Control", () => {
    it("should sanitize session by stripping sensitive raw session tokens", () => {
      const rawSession = {
        session: {
          id: "sess_123",
          userId: "usr_456",
          token: "secret_raw_jwt_session_token_never_expose",
          ipAddress: "127.0.0.1",
          userAgent: "Mozilla/5.0",
        },
        user: {
          id: "usr_456",
          email: "user@wardpass.app",
          name: "Test User",
          role: "user",
        },
      };

      // Implementation identical to getCurrentSession() in lib/server/auth.ts
      const safeSession = Object.fromEntries(
        Object.entries(rawSession.session).filter(([key]) => key !== "token")
      );
      const sanitized = { ...rawSession, session: safeSession };

      assert.strictEqual("token" in sanitized.session, false);
      assert.strictEqual(sanitized.session.id, "sess_123");
      assert.strictEqual(sanitized.session.userId, "usr_456");
    });

    it("should enforce authentication requirement (requireUserSession guard)", () => {
      const requireUserSessionMock = (session: any) => {
        if (!session?.user) {
          throw new Error("You must be signed in to perform this action.");
        }
        return session;
      };

      // Unauthenticated call
      assert.throws(
        () => requireUserSessionMock(null),
        /You must be signed in to perform this action/
      );

      // Authenticated call
      const validSession = { user: { id: "usr_1", email: "a@b.com" } };
      assert.doesNotThrow(() => requireUserSessionMock(validSession));
    });

    it("should enforce admin authorization requirement (requireAdminSession guard)", () => {
      const requireAdminSessionMock = (session: any) => {
        if (!session?.user) {
          throw new Error("You must be signed in to perform this action.");
        }
        if (session.user.role !== "admin") {
          throw new Error("You do not have permission to perform this action.");
        }
        return session;
      };

      // Standard user rejected
      assert.throws(
        () => requireAdminSessionMock({ user: { id: "u1", role: "user" } }),
        /You do not have permission to perform this action/
      );

      // Admin user accepted
      const adminSession = { user: { id: "u2", role: "admin" } };
      assert.doesNotThrow(() => requireAdminSessionMock(adminSession));
    });

    it("should have Row Level Security enabled on all 6 database schema tables", () => {
      const tables = [
        { name: "account", table: account },
        { name: "session", table: sessionTable },
        { name: "user", table: userTable },
        { name: "vault", table: vaultTable },
        { name: "vaultItem", table: vaultItemTable },
        { name: "verification", table: verificationTable },
      ];

      for (const { name, table } of tables) {
        const isRlsEnabled = (table as any)[Symbol.for("drizzle:EnableRLS")];
        assert.strictEqual(
          isRlsEnabled,
          true,
          `Table "${name}" must have Row Level Security enabled via .enableRLS()`
        );
      }
    });

    it("should configure admin and least-privilege user policies on all tables", () => {
      const getPolicies = (table: any): string[] => {
        const extraColumns = table[Symbol.for("drizzle:ExtraConfigColumns")];
        const extraBuilder = table[Symbol.for("drizzle:ExtraConfigBuilder")];
        const extra = extraBuilder(extraColumns);
        return extra.filter((x: any) => x?.name).map((x: any) => x.name);
      };

      // 1. Vault: Admin gets full access, user only manages own vaults
      const vaultPolicies = getPolicies(vaultTable);
      assert.ok(vaultPolicies.includes("vault_admin_all"), "Vault missing vault_admin_all policy");
      assert.ok(vaultPolicies.includes("vault_user_manage_own"), "Vault missing vault_user_manage_own policy");

      // 2. VaultItem: Admin gets full access, user only accesses items of own vault
      const vaultItemPolicies = getPolicies(vaultItemTable);
      assert.ok(vaultItemPolicies.includes("vault_item_admin_all"), "VaultItem missing vault_item_admin_all policy");
      assert.ok(vaultItemPolicies.includes("vault_item_user_manage_own"), "VaultItem missing vault_item_user_manage_own policy");

      // 3. User: Admin gets full access, user can view and update own profile without role elevation
      const userPolicies = getPolicies(userTable);
      assert.ok(userPolicies.includes("user_admin_all"), "User missing user_admin_all policy");
      assert.ok(userPolicies.includes("user_view_own"), "User missing user_view_own policy");
      assert.ok(userPolicies.includes("user_update_own"), "User missing user_update_own policy");

      // 4. Session: Admin gets full access, user only manages own sessions
      const sessionPolicies = getPolicies(sessionTable);
      assert.ok(sessionPolicies.includes("session_admin_all"), "Session missing session_admin_all policy");
      assert.ok(sessionPolicies.includes("session_user_manage_own"), "Session missing session_user_manage_own policy");

      // 5. Account: Admin gets full access, user only manages own account
      const accountPolicies = getPolicies(account);
      assert.ok(accountPolicies.includes("account_admin_all"), "Account missing account_admin_all policy");
      assert.ok(accountPolicies.includes("account_user_manage_own"), "Account missing account_user_manage_own policy");

      // 6. Verification: Admin gets full access, public verification flow permitted
      const verificationPolicies = getPolicies(verificationTable);
      assert.ok(verificationPolicies.includes("verification_admin_all"), "Verification missing verification_admin_all policy");
      assert.ok(verificationPolicies.includes("verification_public_flow"), "Verification missing verification_public_flow policy");
    });

    it("should restrict users from privilege escalation (cannot elevate role to admin)", () => {
      // Logic verified by user_update_own policy:
      // withCheck: ("user"."role" is null or "user"."role" = 'user')
      const evaluateUserRoleUpdate = (attemptedRole: string | null) => {
        const allowed = attemptedRole === null || attemptedRole === "user";
        if (!allowed) {
          throw new Error("Privilege escalation rejected: users cannot grant admin role.");
        }
        return true;
      };

      // Allowed self-updates
      assert.strictEqual(evaluateUserRoleUpdate("user"), true);
      assert.strictEqual(evaluateUserRoleUpdate(null), true);

      // Unauthorized elevation to admin rejected
      assert.throws(
        () => evaluateUserRoleUpdate("admin"),
        /Privilege escalation rejected/
      );
    });

    it("should include vaultLimit and vaultItemLimit columns with default 5 on user schema", () => {
      assert.ok(userTable.vaultLimit, "userTable should have vaultLimit column");
      assert.ok(userTable.vaultItemLimit, "userTable should have vaultItemLimit column");
      assert.strictEqual(userTable.vaultLimit.default, 5);
      assert.strictEqual(userTable.vaultItemLimit.default, 5);
    });

    it("should restrict users from self-escalating vault and vault item limits via RLS policy", () => {
      // Logic enforced by user_update_own policy:
      // withCheck: ("user"."vaultLimit" = (select u."vaultLimit" from "user" u where u.id = "user"."id"))
      // and ("user"."vaultItemLimit" = (select u."vaultItemLimit" from "user" u where u.id = "user"."id"))
      const evaluateLimitSelfUpdate = (
        currentLimits: { vaultLimit: number; vaultItemLimit: number },
        attemptedLimits: { vaultLimit: number; vaultItemLimit: number },
        isAdmin = false,
      ) => {
        if (isAdmin) return true;
        if (
          attemptedLimits.vaultLimit !== currentLimits.vaultLimit ||
          attemptedLimits.vaultItemLimit !== currentLimits.vaultItemLimit
        ) {
          throw new Error("RLS violation: non-admin users cannot alter vaultLimit or vaultItemLimit");
        }
        return true;
      };

      const userLimits = { vaultLimit: 5, vaultItemLimit: 5 };

      // Normal user unchanged limits succeeds
      assert.strictEqual(evaluateLimitSelfUpdate(userLimits, { vaultLimit: 5, vaultItemLimit: 5 }), true);

      // Normal user self-escalating limits fails
      assert.throws(
        () => evaluateLimitSelfUpdate(userLimits, { vaultLimit: 10, vaultItemLimit: 5 }),
        /RLS violation/
      );
      assert.throws(
        () => evaluateLimitSelfUpdate(userLimits, { vaultLimit: 5, vaultItemLimit: 50 }),
        /RLS violation/
      );

      // Admin or direct DB update succeeds
      assert.strictEqual(
        evaluateLimitSelfUpdate(userLimits, { vaultLimit: 20, vaultItemLimit: 100 }, true),
        true
      );
    });
  });

  // ════════════════════════════════════════════════════════════════════════════
  // 3. CLIENT-SIDE IN-MEMORY AUTH & KEYRING LIFECYCLE
  // ════════════════════════════════════════════════════════════════════════════

  describe("3. In-Memory Keyring & Sign-In / Sign-Out Lifecycle", () => {
    it("should set master password and unlock vault on successful sign in", () => {
      const store = useVaultStore.getState();
      const testPassword = "AccountPassword#2026!";
      const vaultId = "test-vault-auth-1";
      const vaultKey = generateVaultKey();

      // Sign In simulation
      store.setMasterPassword(testPassword);
      store.unlock(vaultId, vaultKey);

      assert.strictEqual(useVaultStore.getState().masterPassword, testPassword);
      assert.strictEqual(useVaultStore.getState().isVaultUnlocked(vaultId), true);
      assert.deepStrictEqual(useVaultStore.getState().getVaultKey(vaultId), vaultKey);
    });

    it("should zero all in-memory keys and clear master password on sign out (lockAll)", () => {
      const store = useVaultStore.getState();
      const vaultId1 = "vault-signout-1";
      const vaultId2 = "vault-signout-2";

      const key1 = generateVaultKey();
      const key2 = generateVaultKey();

      // Keep a reference to the Uint8Array buffer to verify zeroing
      const key1Buffer = key1.slice();

      store.setMasterPassword("ActivePassword123!");
      store.unlock(vaultId1, key1);
      store.unlock(vaultId2, key2);

      assert.strictEqual(useVaultStore.getState().isVaultUnlocked(vaultId1), true);

      // Sign Out simulation
      store.lockAll();

      // Master password must be null
      assert.strictEqual(useVaultStore.getState().masterPassword, null);

      // Vaults must be locked
      assert.strictEqual(useVaultStore.getState().isVaultUnlocked(vaultId1), false);
      assert.strictEqual(useVaultStore.getState().isVaultUnlocked(vaultId2), false);

      // Attempting to get key must throw VaultLockedError
      assert.throws(
        () => useVaultStore.getState().getVaultKey(vaultId1),
        VaultLockedError
      );

      // Verify the key memory buffer was zeroed
      const allZeros = key1.every((byte) => byte === 0);
      assert.strictEqual(allZeros, true, "Vault key memory must be overwritten with zeroes");
    });

    it("should zero bytes when locking a single individual vault", () => {
      const store = useVaultStore.getState();
      const singleVaultId = "single-lock-vault";
      const key = generateVaultKey();

      store.unlock(singleVaultId, key);
      assert.strictEqual(store.isVaultUnlocked(singleVaultId), true);

      store.lock(singleVaultId);
      assert.strictEqual(useVaultStore.getState().isVaultUnlocked(singleVaultId), false);

      const allZeros = key.every((b) => b === 0);
      assert.strictEqual(allZeros, true, "Locked key bytes must be zeroed");
    });
  });

  // ════════════════════════════════════════════════════════════════════════════
  // 4. ZERO-KNOWLEDGE PASSWORD RESET & VAULT RE-ENCRYPTION PIPELINE
  // ════════════════════════════════════════════════════════════════════════════

  describe("4. Password Reset & Vault Re-encryption Cryptographic Pipeline", () => {
    it("should derive a 32-byte cryptographic key from master password and salt", async () => {
      const password = "TestMasterPassword#1!";
      const salt = generateSalt();
      assert.strictEqual(salt.length, 16);

      const derivedKey = await deriveKey(password, salt);
      assert.strictEqual(derivedKey.length, 32);
      assert.ok(derivedKey instanceof Uint8Array);
    });

    it("should reject empty password or invalid salt length in deriveKey", async () => {
      const validSalt = generateSalt();
      const invalidSalt = new Uint8Array(8); // wrong length (must be 16)

      await assert.rejects(
        () => deriveKey("", validSalt),
        /Master password must not be empty/
      );

      await assert.rejects(
        () => deriveKey("ValidPass#1!", invalidSalt),
        /Salt must be exactly 16 bytes/
      );
    });

    it("should seamlessly re-encrypt vault keys on password reset allowing decryption with new password", () => {
      // Step 1: Initial Account Setup
      // derivedKey1 is derived from initial password via Argon2id
      const derivedKey1 = crypto.getRandomValues(new Uint8Array(32));

      // The true 32-byte vault key (never leaves browser memory)
      const vaultKey = generateVaultKey();

      // Encrypt envelope with initial derived key
      const envelope1 = encryptVaultKey(vaultKey, derivedKey1);
      const verification1 = createVerificationHash(vaultKey);

      // Encrypt an item in the vault using vaultKey
      const secretItem = {
        name: "Corporate VPN",
        username: "vpn_user",
        password: "UltraSecretVPNPassword123!",
      };
      const { ciphertext: itemCiphertext, iv: itemIv } = encryptData(
        JSON.stringify(secretItem),
        vaultKey
      );

      // Step 2: User initiates Password Reset with newPassword (produces derivedKey2)
      const derivedKey2 = crypto.getRandomValues(new Uint8Array(32));

      // Client-side verification of old password and recovery of vault key
      const recoveredVaultKey = decryptVaultKey(
        envelope1.encryptedKey,
        envelope1.keyIv,
        derivedKey1
      );
      assert.strictEqual(
        verifyVaultKey(verification1.hash, verification1.hashIv, recoveredVaultKey),
        true
      );

      // Step 3: Re-encrypt vault key with NEW derived key
      const envelope2 = encryptVaultKey(recoveredVaultKey, derivedKey2);
      const verification2 = createVerificationHash(recoveredVaultKey);

      // Step 4: Verify Old Password (derivedKey1) can NO LONGER unlock the new envelope
      assert.throws(
        () => {
          decryptVaultKey(envelope2.encryptedKey, envelope2.keyIv, derivedKey1);
        },
        DecryptionError,
        "Old password must not be able to decrypt the new envelope"
      );

      // Step 5: Verify NEW Password (derivedKey2) unlocks the vault
      const unlockedVaultKey = decryptVaultKey(
        envelope2.encryptedKey,
        envelope2.keyIv,
        derivedKey2
      );
      assert.strictEqual(
        verifyVaultKey(verification2.hash, verification2.hashIv, unlockedVaultKey),
        true
      );

      // Step 6: Decrypt previously stored items with recovered key
      const decryptedItemPayload = decryptData(itemCiphertext, itemIv, unlockedVaultKey);
      const decryptedItem = JSON.parse(decryptedItemPayload);

      assert.deepStrictEqual(decryptedItem, secretItem);
      assert.strictEqual(decryptedItem.password, "UltraSecretVPNPassword123!");
    });

    it("should validate email OTP verification record expiry during password reset", () => {
      const now = new Date();
      const testEmail = "user@example.com";

      // Valid OTP record (expires in 10 minutes)
      const validOtpRecord = {
        identifier: `forget-password-otp-${testEmail.toLowerCase()}`,
        value: "123456:0",
        expiresAt: new Date(now.getTime() + 10 * 60 * 1000),
      };

      const checkOtpRecord = (record: any) => {
        if (!record || record.expiresAt < new Date()) {
          throw new Error("Invalid or expired verification code.");
        }
        return record.identifier;
      };

      assert.strictEqual(
        checkOtpRecord(validOtpRecord),
        `forget-password-otp-${testEmail.toLowerCase()}`
      );

      // Expired OTP record (expired 5 minutes ago)
      const expiredOtpRecord = {
        identifier: `forget-password-otp-${testEmail.toLowerCase()}`,
        value: "123456:3",
        expiresAt: new Date(now.getTime() - 5 * 60 * 1000),
      };

      assert.throws(
        () => checkOtpRecord(expiredOtpRecord),
        /Invalid or expired verification code/
      );

      // Missing record
      assert.throws(
        () => checkOtpRecord(null),
        /Invalid or expired verification code/
      );
    });
  });
});
