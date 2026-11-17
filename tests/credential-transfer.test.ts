import { describe, it } from "node:test";
import assert from "node:assert";
import {
  parseCredentialFile,
  exportCredentialsToCSV,
  exportCredentialsToJSON,
  exportCredentialsToTXT,
} from "../lib/utils/credential-transfer";

describe("Credential Transfer Utilities", () => {
  describe("CSV Parsing", () => {
    it("should parse standard Chrome / Bitwarden style CSV files", () => {
      const csv = `name,url,username,password,note
Google,https://accounts.google.com,test@gmail.com,p@ssword123,Personal
GitHub,https://github.com,octocat,ghp_mytoken,Developer`;

      const results = parseCredentialFile(csv, "passwords.csv");
      assert.strictEqual(results.length, 2);
      assert.strictEqual(results[0].name, "Google");
      assert.strictEqual(results[0].username, "test@gmail.com");
      assert.strictEqual(results[0].password, "p@ssword123");
      assert.strictEqual(results[0].url, "https://accounts.google.com");
      assert.strictEqual(results[1].name, "GitHub");
      assert.strictEqual(results[1].username, "octocat");
    });

    it("should handle commas and quotes inside fields", () => {
      const csv = `name,url,username,password,note
"Company, Inc.",https://company.com,"john, doe",secret,"Note with, comma and ""quotes"""`;

      const results = parseCredentialFile(csv, "export.csv");
      assert.strictEqual(results.length, 1);
      assert.strictEqual(results[0].name, "Company, Inc.");
      assert.strictEqual(results[0].username, "john, doe");
      assert.strictEqual(results[0].note, 'Note with, comma and "quotes"');
    });
  });

  describe("JSON Parsing", () => {
    it("should parse an array of credential objects", () => {
      const json = JSON.stringify([
        {
          name: "AWS Console",
          url: "https://aws.amazon.com",
          username: "admin",
          email: "admin@corp.internal",
          password: "SuperSecretKey99!",
          note: "Root account",
        },
      ]);

      const results = parseCredentialFile(json, "backup.json");
      assert.strictEqual(results.length, 1);
      assert.strictEqual(results[0].name, "AWS Console");
      assert.strictEqual(results[0].email, "admin@corp.internal");
      assert.strictEqual(results[0].password, "SuperSecretKey99!");
    });

    it("should parse Bitwarden-style JSON exports with nested login objects", () => {
      const bwJson = JSON.stringify({
        items: [
          {
            name: "Slack",
            login: {
              username: "dev_user",
              password: "SlackPassword456!",
              uris: [{ uri: "https://slack.com" }],
            },
            notes: "Engineering workspace",
          },
        ],
      });

      const results = parseCredentialFile(bwJson, "bitwarden_export.json");
      assert.strictEqual(results.length, 1);
      assert.strictEqual(results[0].name, "Slack");
      assert.strictEqual(results[0].username, "dev_user");
      assert.strictEqual(results[0].password, "SlackPassword456!");
      assert.strictEqual(results[0].url, "https://slack.com");
      assert.strictEqual(results[0].note, "Engineering workspace");
    });
  });

  describe("TXT Parsing", () => {
    it("should parse key-value text blocks", () => {
      const txt = `Title: ProtonMail
Username: secure_user@proton.me
Password: ProtonPassword789!
URL: https://mail.proton.me
---
Title: Discord
Username: gamer_tag
Password: DiscordPassword101!
---`;

      const results = parseCredentialFile(txt, "logins.txt");
      assert.strictEqual(results.length, 2);
      assert.strictEqual(results[0].name, "ProtonMail");
      assert.strictEqual(results[0].username, "secure_user@proton.me");
      assert.strictEqual(results[0].password, "ProtonPassword789!");
      assert.strictEqual(results[1].name, "Discord");
      assert.strictEqual(results[1].username, "gamer_tag");
      assert.strictEqual(results[1].password, "DiscordPassword101!");
    });

    it("should parse colon-delimited user:pass lines", () => {
      const txt = `user1@example.com:passwordOne!
github.com:octo_user:passwordTwo!`;

      const results = parseCredentialFile(txt, "credentials.txt");
      assert.strictEqual(results.length, 2);
      assert.strictEqual(results[0].username, "user1@example.com");
      assert.strictEqual(results[0].password, "passwordOne!");
      assert.strictEqual(results[1].name, "github.com");
      assert.strictEqual(results[1].password, "passwordTwo!");
    });
  });

  describe("Export Generators", () => {
    const items = [
      {
        name: "Test Bank",
        url: "https://bank.com",
        username: "banker",
        email: "banker@gmail.com",
        password: "VaultSafePassword#1",
        note: "Checking account",
        itemType: "LOGIN",
        createdAt: new Date().toISOString(),
      },
    ];

    it("should export properly to CSV", () => {
      const csv = exportCredentialsToCSV(items);
      assert.ok(csv.includes("Test Bank"));
      assert.ok(csv.includes("banker"));
      assert.ok(csv.includes("VaultSafePassword#1"));
    });

    it("should export properly to JSON", () => {
      const jsonStr = exportCredentialsToJSON("Primary Vault", items);
      const parsed = JSON.parse(jsonStr);
      assert.strictEqual(parsed.vaultName, "Primary Vault");
      assert.strictEqual(parsed.totalItems, 1);
      assert.strictEqual(parsed.items[0].name, "Test Bank");
    });

    it("should export properly to TXT", () => {
      const txt = exportCredentialsToTXT("Primary Vault", items);
      assert.ok(txt.includes("WARDPASS CREDENTIAL EXPORT: PRIMARY VAULT"));
      assert.ok(txt.includes("Test Bank"));
      assert.ok(txt.includes("VaultSafePassword#1"));
    });
  });
});
