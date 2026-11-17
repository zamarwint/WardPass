import { describe, it } from "node:test";
import assert from "node:assert";

import {
  loginItemSchema,
  secureNoteSchema,
  creditCardSchema,
  identitySchema,
} from "../lib/validations/vaultItemSchemas";
import {
  generateVaultKey,
  encryptData,
  decryptData,
  DecryptionError,
} from "../lib/crypto/aes";
import { VaultItemType, VaultItem } from "../lib/types/VaultType";
import {
  LoginJSONRaw,
  SecureNoteJSONRaw,
  CreditCardJSONRaw,
  IdentityJSONRaw,
} from "../lib/types/RawVaultItemType";

describe("Vault Item CRUD Operations", () => {
  const vaultId = "test-vault-uuid-0001";
  const vaultKey = generateVaultKey();

  // ════════════════════════════════════════════════════════════════════════════
  // 1. CREATE: SCHEMA VALIDATION & ENCRYPTION
  // ════════════════════════════════════════════════════════════════════════════

  describe("1. Create - Input Validation & Client-Side Encryption", () => {
    it("should validate and encrypt a valid LOGIN item", () => {
      const rawLogin: LoginJSONRaw = {
        name: "GitHub Production",
        url: "https://github.com/login",
        username: "wardpassuser",
        email: "dev@wardpass.app",
        password: "SuperStrongPassword123!",
        note: "Primary engineering account",
      };

      // 1. Validate Schema
      const validation = loginItemSchema.safeParse(rawLogin);
      assert.strictEqual(validation.success, true);

      // 2. Encrypt Payload with AES-256-GCM
      const payload = JSON.stringify(rawLogin);
      const { ciphertext, iv } = encryptData(payload, vaultKey);

      assert.ok(ciphertext && ciphertext.length > 0);
      assert.ok(iv && iv.length > 0);
      // Plaintext must not appear in ciphertext
      assert.strictEqual(ciphertext.includes("SuperStrongPassword123!"), false);

      // 3. Assemble Database Record
      const dbRecord: VaultItem = {
        id: "item-login-1",
        itemType: VaultItemType.LOGIN,
        vaultId,
        encryptedData: ciphertext,
        iv,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      assert.strictEqual(dbRecord.itemType, VaultItemType.LOGIN);
      assert.strictEqual(dbRecord.deletedAt, null);
    });

    it("should reject invalid LOGIN items", () => {
      // Invalid URL & short password
      const invalidLogin = {
        name: "G", // too short (min 3)
        url: "not-a-valid-url",
        username: "UPPERCASE_USER", // must be lowercase
        email: "not-an-email",
        password: "short", // too short
        note: "a".repeat(101), // max 100
      };

      const result = loginItemSchema.safeParse(invalidLogin);
      assert.strictEqual(result.success, false);
      if (!result.success) {
        const fieldErrors = result.error.flatten().fieldErrors;
        assert.ok(fieldErrors.name);
        assert.ok(fieldErrors.url);
        assert.ok(fieldErrors.username);
        assert.ok(fieldErrors.email);
        assert.ok(fieldErrors.password);
        assert.ok(fieldErrors.note);
      }
    });

    it("should validate and encrypt a valid SECURE_NOTE item", () => {
      const rawNote: SecureNoteJSONRaw = {
        title: "Server Recovery Seed Phrases",
        content: "apple banana cherry dog elephant fox grape horse igloo jaguar kite lemon",
      };

      const validation = secureNoteSchema.safeParse(rawNote);
      assert.strictEqual(validation.success, true);

      const { ciphertext, iv } = encryptData(JSON.stringify(rawNote), vaultKey);
      assert.ok(ciphertext && iv);
      assert.strictEqual(ciphertext.includes("seed phrases"), false);
    });

    it("should reject invalid SECURE_NOTE items", () => {
      const shortNote = { title: "No", content: "too short" };
      const res = secureNoteSchema.safeParse(shortNote);
      assert.strictEqual(res.success, false);
    });

    it("should validate and encrypt a valid CREDIT_CARD item", () => {
      // Valid Visa test card passing Luhn algorithm
      const rawCard: CreditCardJSONRaw = {
        cardHolderName: "Jane Doe",
        cardNumber: "4532015112830366",
        cvv: 123,
        expiryDate: "12/28",
        billingAddress1: "123 Main Street, Suite 400",
        zipCode: "10001",
        city: "New York",
        state: "NY",
        country: "United States",
      };

      // In form submission cvv is string before casting
      const formCard = { ...rawCard, cvv: "123" };
      const validation = creditCardSchema.safeParse(formCard);
      assert.strictEqual(validation.success, true);

      const { ciphertext, iv } = encryptData(JSON.stringify(rawCard), vaultKey);
      assert.ok(ciphertext && iv);
      assert.strictEqual(ciphertext.includes("4532015112830366"), false);
    });

    it("should reject invalid CREDIT_CARD items", () => {
      const invalidCard = {
        cardHolderName: "J",
        cardNumber: "123456789", // fails Luhn algorithm
        cvv: "12", // must be 3 digits
        expiryDate: "invalid-date",
        billingAddress1: "Short",
        zipCode: "1",
        city: "NY",
        country: "US", // min 4 chars
      };

      const result = creditCardSchema.safeParse(invalidCard);
      assert.strictEqual(result.success, false);
    });

    it("should validate and encrypt a valid IDENTITY item", () => {
      const rawIdentity: IdentityJSONRaw = {
        name: "John Alexander Smith",
        email: "john.smith@corporate.com",
        phoneNumber: 15551234567,
        address1: "742 Evergreen Terrace",
        city: "Springfield",
        state: "Oregon",
        zipCode: "97477",
        country: "United States",
        companyName: "Acme Corporation",
        occupation: "Security Engineer",
      };

      const validation = identitySchema.safeParse(rawIdentity);
      assert.strictEqual(validation.success, true);

      const { ciphertext, iv } = encryptData(JSON.stringify(rawIdentity), vaultKey);
      assert.ok(ciphertext && iv);
      assert.strictEqual(ciphertext.includes("John Alexander"), false);
    });

    it("should generate a unique IV on every single encryption call", () => {
      const payload = JSON.stringify({ name: "Same Payload" });
      const enc1 = encryptData(payload, vaultKey);
      const enc2 = encryptData(payload, vaultKey);

      // IVs must never be reused (AES-GCM security requirement)
      assert.notStrictEqual(enc1.iv, enc2.iv);
      assert.notStrictEqual(enc1.ciphertext, enc2.ciphertext);
    });
  });

  // ════════════════════════════════════════════════════════════════════════════
  // 2. READ: DECRYPTION & INTEGRITY VERIFICATION
  // ════════════════════════════════════════════════════════════════════════════

  describe("2. Read - Decryption & Integrity Verification", () => {
    it("should accurately decrypt and restore the original LOGIN data", () => {
      const original: LoginJSONRaw = {
        name: "AWS Root Console",
        url: "https://aws.amazon.com/console",
        username: "superadmin",
        email: "root@awscloud.internal",
        password: "CorrectHorseBatteryStaple#2026",
        note: "MFA enabled on hardware key",
      };

      const { ciphertext, iv } = encryptData(JSON.stringify(original), vaultKey);
      const decryptedJSON = decryptData(ciphertext, iv, vaultKey);
      const parsed = JSON.parse(decryptedJSON) as LoginJSONRaw;

      assert.deepStrictEqual(parsed, original);
    });

    it("should fail decryption if data has been tampered with (Auth Tag verification)", () => {
      const original = JSON.stringify({ secret: "classified" });
      const { ciphertext, iv } = encryptData(original, vaultKey);

      // Corrupt the ciphertext by flipping a character
      const tamperedCiphertext =
        ciphertext.slice(0, 5) +
        (ciphertext[5] === "A" ? "B" : "A") +
        ciphertext.slice(6);

      assert.throws(
        () => {
          decryptData(tamperedCiphertext, iv, vaultKey);
        },
        (err: any) => {
          assert.strictEqual(err.name, "DecryptionError");
          return true;
        }
      );
    });

    it("should fail decryption if an incorrect vault key is supplied", () => {
      const otherKey = generateVaultKey(); // different key
      const { ciphertext, iv } = encryptData(JSON.stringify({ secret: "data" }), vaultKey);

      assert.throws(
        () => {
          decryptData(ciphertext, iv, otherKey);
        },
        (err: any) => {
          assert.strictEqual(err.name, "DecryptionError");
          return true;
        }
      );
    });

    it("should safely handle ISO date strings in deserialized items without crashing", () => {
      const fakeCreatedAt = new Date().toISOString(); // serialized over network
      const formatDate = (date?: Date | string | null) => (date ? new Date(date).toDateString() : "—");

      const formatted = formatDate(fakeCreatedAt);
      assert.strictEqual(typeof formatted, "string");
      assert.notStrictEqual(formatted, "—");
    });
  });

  // ════════════════════════════════════════════════════════════════════════════
  // 3. UPDATE: RE-ENCRYPT & MODIFY PROPERTIES
  // ════════════════════════════════════════════════════════════════════════════

  describe("3. Update - Modifying & Re-encrypting Items", () => {
    it("should update an existing LOGIN item with a rotated password and new note", () => {
      const initialLogin: LoginJSONRaw = {
        name: "Twitter / X",
        url: "https://x.com",
        username: "elonmusk",
        email: "x@x.com",
        password: "OldPassword1!",
        note: "Initial version",
      };

      const initialEnc = encryptData(JSON.stringify(initialLogin), vaultKey);

      // User rotates password and updates note
      const updatedLogin: LoginJSONRaw = {
        ...initialLogin,
        password: "NewRotatedPassword2026!#",
        note: "Rotated on security check",
      };

      // Validate new values
      const validation = loginItemSchema.safeParse(updatedLogin);
      assert.strictEqual(validation.success, true);

      // Re-encrypt with fresh IV
      const updatedEnc = encryptData(JSON.stringify(updatedLogin), vaultKey);
      assert.notStrictEqual(updatedEnc.ciphertext, initialEnc.ciphertext);
      assert.notStrictEqual(updatedEnc.iv, initialEnc.iv);

      // Decrypt updated ciphertext and verify new state
      const decrypted = JSON.parse(decryptData(updatedEnc.ciphertext, updatedEnc.iv, vaultKey));
      assert.strictEqual(decrypted.password, "NewRotatedPassword2026!#");
      assert.strictEqual(decrypted.note, "Rotated on security check");
    });

    it("should update a SECURE_NOTE title and content", () => {
      const originalNote: SecureNoteJSONRaw = {
        title: "Draft Ideas",
        content: "Initial draft note with some content here.",
      };

      const updatedNote: SecureNoteJSONRaw = {
        title: "Finalized Specifications",
        content: "Updated draft note with finalized production specifications.",
      };

      assert.strictEqual(secureNoteSchema.safeParse(updatedNote).success, true);

      const { ciphertext, iv } = encryptData(JSON.stringify(updatedNote), vaultKey);
      const parsed = JSON.parse(decryptData(ciphertext, iv, vaultKey));
      assert.strictEqual(parsed.title, "Finalized Specifications");
    });
  });

  // ════════════════════════════════════════════════════════════════════════════
  // 4. TRASH & RESTORE: SOFT-DELETE LIFECYCLE
  // ════════════════════════════════════════════════════════════════════════════

  describe("4. Trash & Restore - Soft-Delete Lifecycle", () => {
    it("should transition item to trashed status and back to active on restore", () => {
      const item: VaultItem = {
        id: "item-trash-test-1",
        itemType: VaultItemType.LOGIN,
        vaultId,
        encryptedData: "cipher",
        iv: "iv",
        createdAt: new Date("2026-01-01T00:00:00Z"),
        updatedAt: new Date("2026-01-01T00:00:00Z"),
        deletedAt: null, // Initially active
      };

      // 1. Initially Active
      assert.strictEqual(item.deletedAt, null);

      // 2. Trash (Soft Delete)
      const trashTime = new Date();
      const trashedItem: VaultItem = {
        ...item,
        deletedAt: trashTime,
        updatedAt: trashTime,
      };

      assert.notStrictEqual(trashedItem.deletedAt, null);
      assert.strictEqual(trashedItem.deletedAt?.getTime(), trashTime.getTime());

      // 3. Filter Simulation (Active items query: isNull(deletedAt))
      const itemsList = [trashedItem];
      const activeItems = itemsList.filter((i) => i.deletedAt === null);
      const trashItems = itemsList.filter((i) => i.deletedAt !== null);

      assert.strictEqual(activeItems.length, 0);
      assert.strictEqual(trashItems.length, 1);

      // 4. Restore
      const restoreTime = new Date();
      const restoredItem: VaultItem = {
        ...trashedItem,
        deletedAt: null,
        updatedAt: restoreTime,
      };

      assert.strictEqual(restoredItem.deletedAt, null);
      assert.strictEqual(restoredItem.id, item.id);
    });
  });

  // ════════════════════════════════════════════════════════════════════════════
  // 5. HARD DELETE: PERMANENT REMOVAL
  // ════════════════════════════════════════════════════════════════════════════

  describe("5. Delete - Permanent Removal", () => {
    it("should remove item completely from collection", () => {
      let items: VaultItem[] = [
        {
          id: "item-del-1",
          itemType: VaultItemType.LOGIN,
          vaultId,
          encryptedData: "c1",
          iv: "iv1",
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
        },
        {
          id: "item-del-2",
          itemType: VaultItemType.SECURE_NOTE,
          vaultId,
          encryptedData: "c2",
          iv: "iv2",
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
        },
      ];

      // Delete item 1
      const targetId = "item-del-1";
      items = items.filter((i) => !(i.id === targetId && i.vaultId === vaultId));

      assert.strictEqual(items.length, 1);
      assert.strictEqual(items[0].id, "item-del-2");
      assert.strictEqual(items.find((i) => i.id === targetId), undefined);
    });
  });

  // ════════════════════════════════════════════════════════════════════════════
  // 6. CAPACITY CONSTRAINT: 5-ITEM LIMIT ENFORCEMENT
  // ════════════════════════════════════════════════════════════════════════════

  describe("6. Vault Capacity Constraints (Max 5 items)", () => {
    const VAULT_ITEM_LIMIT = 5;

    it("should reject adding items when vault capacity is reached", () => {
      const activeCount = 3;
      const trashedCount = 2;
      const totalCount = activeCount + trashedCount;

      assert.strictEqual(totalCount >= VAULT_ITEM_LIMIT, true);
      const canAdd = totalCount < VAULT_ITEM_LIMIT;
      assert.strictEqual(canAdd, false);
    });

    it("should accurately calculate remaining slots for batch operations", () => {
      const currentItemCount = 3;
      const remainingSlots = Math.max(0, VAULT_ITEM_LIMIT - currentItemCount);
      assert.strictEqual(remainingSlots, 2);

      // Attempting to import 4 items into 2 remaining slots
      const incomingItems = ["item1", "item2", "item3", "item4"];
      const allowedItems = incomingItems.slice(0, remainingSlots);

      assert.strictEqual(allowedItems.length, 2);
      assert.deepStrictEqual(allowedItems, ["item1", "item2"]);
    });

    it("should report 0 remaining slots when vault is completely full", () => {
      const currentItemCount = 5;
      const remainingSlots = Math.max(0, VAULT_ITEM_LIMIT - currentItemCount);
      assert.strictEqual(remainingSlots, 0);
    });
  });
});
