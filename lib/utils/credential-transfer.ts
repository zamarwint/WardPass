import { VaultItemType } from "@/lib/types/VaultType";

export type ParsedCredential = {
  id: string;
  name: string;
  url?: string;
  username?: string;
  email: string;
  password: string;
  note?: string;
  itemType: VaultItemType;
  // Optional extra fields for other item types
  title?: string;
  content?: string;
  cardHolderName?: string;
  cardNumber?: string;
  cvv?: number;
  expiryDate?: string;
  billingAddress1?: string;
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;
  phoneNumber?: number;
};

/**
 * Standard RFC-4180 CSV line parser that handles quotes, escaped quotes (""), and commas
 */
export function parseCSV(text: string): string[][] {
  const lines: string[][] = [];
  const cleanText = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

  let currentRow: string[] = [];
  let currentField = "";
  let inQuotes = false;

  for (let i = 0; i < cleanText.length; i++) {
    const char = cleanText[i];
    const nextChar = cleanText[i + 1];

    if (inQuotes) {
      if (char === '"' && nextChar === '"') {
        currentField += '"';
        i++; // skip escaped quote
      } else if (char === '"') {
        inQuotes = false;
      } else {
        currentField += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === "," || char === "\t" || char === ";") {
        currentRow.push(currentField.trim());
        currentField = "";
      } else if (char === "\n") {
        currentRow.push(currentField.trim());
        if (currentRow.some((field) => field.length > 0)) {
          lines.push(currentRow);
        }
        currentRow = [];
        currentField = "";
      } else {
        currentField += char;
      }
    }
  }

  // Push last field & row if present
  if (currentField.length > 0 || currentRow.length > 0) {
    currentRow.push(currentField.trim());
    if (currentRow.some((field) => field.length > 0)) {
      lines.push(currentRow);
    }
  }

  return lines;
}

/**
 * Maps CSV rows to ParsedCredential objects using header detection
 */
function parseCSVRows(rows: string[][]): ParsedCredential[] {
  if (rows.length < 2) return [];

  const headers = rows[0].map((h) =>
    h
      .toLowerCase()
      .trim()
      .replace(/[\s_-]+/g, ""),
  );
  const findHeaderIndex = (aliases: string[]) => {
    return headers.findIndex((h) =>
      aliases.some((alias) => h === alias || h.includes(alias)),
    );
  };

  const nameIdx = findHeaderIndex([
    "name",
    "title",
    "loginname",
    "account",
    "service",
    "label",
    "folder",
  ]);
  const urlIdx = findHeaderIndex([
    "url",
    "website",
    "uri",
    "loginuri",
    "link",
    "host",
    "address",
  ]);
  const userIdx = findHeaderIndex([
    "username",
    "loginusername",
    "user",
    "login",
    "id",
    "loginuser",
  ]);
  const emailIdx = findHeaderIndex(["email", "mail", "useremail"]);
  const passIdx = findHeaderIndex([
    "password",
    "loginpassword",
    "pass",
    "pwd",
    "secret",
  ]);
  const noteIdx = findHeaderIndex([
    "note",
    "notes",
    "comment",
    "memo",
    "description",
    "fields",
    "extra",
  ]);

  const credentials: ParsedCredential[] = [];

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (row.length === 0 || row.every((f) => !f)) continue;

    const rawName = nameIdx >= 0 ? row[nameIdx] : "";
    const rawUrl = urlIdx >= 0 ? row[urlIdx] : "";
    const rawUser = userIdx >= 0 ? row[userIdx] : "";
    const rawEmail = emailIdx >= 0 ? row[emailIdx] : "";
    const rawPass = passIdx >= 0 ? row[passIdx] : "";
    const rawNote = noteIdx >= 0 ? row[noteIdx] : "";

    // Derive name if empty
    let name = rawName;
    if (!name && rawUrl) {
      try {
        const parsedUrl = new URL(
          rawUrl.startsWith("http") ? rawUrl : `https://${rawUrl}`,
        );
        name = parsedUrl.hostname.replace(/^www\./, "");
      } catch {
        name = rawUrl;
      }
    }
    if (!name) name = rawUser || `Imported Item ${i}`;

    // Derive email if empty
    let email = rawEmail;
    if (!email && rawUser && rawUser.includes("@")) {
      email = rawUser;
    }

    credentials.push({
      id: `imported-${i}-${Date.now()}`,
      name,
      url: rawUrl || undefined,
      username: rawUser || undefined,
      email: email || rawUser || "unspecified@wardpass.app",
      password: rawPass || "",
      note: rawNote || undefined,
      itemType: VaultItemType.LOGIN,
    });
  }

  return credentials;
}

/**
 * Parses JSON content (supports WardPass, Bitwarden, 1Password, or standard object array)
 */
function parseJSON(content: string): ParsedCredential[] {
  const data = JSON.parse(content);
  const rawList: any[] = Array.isArray(data)
    ? data
    : Array.isArray(data.items)
      ? data.items
      : Array.isArray(data.credentials)
        ? data.credentials
        : Array.isArray(data.passwords)
          ? data.passwords
          : Array.isArray(data.vaultItems)
            ? data.vaultItems
            : typeof data === "object" && data !== null
              ? [data]
              : [];

  const credentials: ParsedCredential[] = [];

  rawList.forEach((item, index) => {
    if (!item || typeof item !== "object") return;

    // Bitwarden format: item.login.username, item.login.password, item.login.uris[0].uri
    const bwLogin = item.login;
    const rawName =
      item.name || item.title || bwLogin?.username || `Item ${index + 1}`;
    const rawUser = item.username || bwLogin?.username || item.user || "";
    const rawPass = item.password || bwLogin?.password || item.pass || "";
    const rawEmail = item.email || (rawUser.includes("@") ? rawUser : "");
    const rawUrl =
      item.url ||
      item.website ||
      (Array.isArray(bwLogin?.uris) && bwLogin.uris.length > 0
        ? bwLogin.uris[0]?.uri
        : "") ||
      "";
    const rawNote = item.note || item.notes || item.content || "";

    const type = item.itemType || VaultItemType.LOGIN;

    credentials.push({
      id: `json-${index}-${Date.now()}`,
      name: String(rawName),
      url: rawUrl ? String(rawUrl) : undefined,
      username: rawUser ? String(rawUser) : undefined,
      email: String(rawEmail || rawUser || "unspecified@wardpass.app"),
      password: String(rawPass),
      note: rawNote ? String(rawNote) : undefined,
      itemType: Object.values(VaultItemType).includes(type)
        ? type
        : VaultItemType.LOGIN,
      // Pass other fields if present
      title: item.title,
      content: item.content,
      cardHolderName: item.cardHolderName,
      cardNumber: item.cardNumber,
      cvv: item.cvv ? Number(item.cvv) : undefined,
      expiryDate: item.expiryDate,
      billingAddress1: item.billingAddress1,
      city: item.city,
      state: item.state,
      country: item.country,
      zipCode: item.zipCode,
      phoneNumber: item.phoneNumber ? Number(item.phoneNumber) : undefined,
    });
  });

  return credentials;
}

/**
 * Parses TXT content:
 * 1. Checks if it's JSON
 * 2. Checks if it's CSV / TSV
 * 3. Checks if it's key-value blocks (Title: ..., Username: ...)
 * 4. Checks if it's user:pass or url:user:pass
 */
function parseTXT(content: string): ParsedCredential[] {
  const trimmed = content.trim();

  // 1. Try JSON
  if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
    try {
      return parseJSON(trimmed);
    } catch {
      // not JSON, continue
    }
  }

  // 2. Try CSV if first line looks like CSV header
  const lines = trimmed.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (
    lines.length > 1 &&
    (lines[0].includes(",") ||
      lines[0].includes("\t") ||
      lines[0].includes(";"))
  ) {
    const csvRows = parseCSV(trimmed);
    const parsed = parseCSVRows(csvRows);
    if (parsed.length > 0) return parsed;
  }

  // 3. Try Key-Value blocks
  // Split on delimiters like '---' or '===' or multiple blank lines
  const blocks = trimmed
    .split(/(?:---+|===+|\n\s*\n\s*\n)/)
    .map((b) => b.trim())
    .filter((b) => b.length > 0);
  const kvCredentials: ParsedCredential[] = [];

  for (let b = 0; b < blocks.length; b++) {
    const block = blocks[b];
    const blockLines = block.split(/\r?\n/);
    const map = new Map<string, string>();

    for (const line of blockLines) {
      const match = line.match(/^([^:]+):\s*(.*)$/);
      if (match) {
        const key = match[1].toLowerCase().replace(/[\s_-]+/g, "");
        const value = match[2].trim();
        map.set(key, value);
      }
    }

    if (
      map.size > 0 &&
      (map.has("password") ||
        map.has("pass") ||
        map.has("username") ||
        map.has("user"))
    ) {
      const name =
        map.get("name") ||
        map.get("title") ||
        map.get("account") ||
        map.get("service") ||
        `Account ${b + 1}`;
      const username =
        map.get("username") || map.get("user") || map.get("login") || "";
      const email =
        map.get("email") || (username.includes("@") ? username : "");
      const password =
        map.get("password") || map.get("pass") || map.get("pwd") || "";
      const url = map.get("url") || map.get("website") || map.get("uri") || "";
      const note =
        map.get("note") || map.get("notes") || map.get("comment") || "";

      kvCredentials.push({
        id: `txt-kv-${b}-${Date.now()}`,
        name,
        url: url || undefined,
        username: username || undefined,
        email: email || username || "unspecified@wardpass.app",
        password,
        note: note || undefined,
        itemType: VaultItemType.LOGIN,
      });
      continue;
    }
  }

  if (kvCredentials.length > 0) {
    return kvCredentials;
  }

  // 4. Try delimited lines: user:password or url:user:password
  const lineCredentials: ParsedCredential[] = [];
  lines.forEach((line, index) => {
    const cleanLine = line.trim();
    if (!cleanLine || cleanLine.startsWith("#")) return;

    // Check url:user:pass or user:pass
    const parts = cleanLine.split(":");
    if (parts.length === 2) {
      // user:pass
      const [user, pass] = parts.map((p) => p.trim());
      lineCredentials.push({
        id: `txt-line-${index}-${Date.now()}`,
        name: user,
        username: user,
        email: user.includes("@") ? user : "unspecified@wardpass.app",
        password: pass,
        itemType: VaultItemType.LOGIN,
      });
    } else if (parts.length >= 3) {
      // url:user:pass or name:user:pass
      const hostOrName = parts[0].trim();
      const user = parts[1].trim();
      const pass = parts.slice(2).join(":").trim(); // password might contain colons

      lineCredentials.push({
        id: `txt-line-${index}-${Date.now()}`,
        name: hostOrName,
        url: hostOrName.includes(".")
          ? hostOrName.startsWith("http")
            ? hostOrName
            : `https://${hostOrName}`
          : undefined,
        username: user,
        email: user.includes("@") ? user : "unspecified@wardpass.app",
        password: pass,
        itemType: VaultItemType.LOGIN,
      });
    }
  });

  return lineCredentials;
}

/**
 * Main parse function that detects file type and returns clean credentials
 */
export function parseCredentialFile(
  content: string,
  filename: string,
): ParsedCredential[] {
  const extension = filename.split(".").pop()?.toLowerCase();

  try {
    if (extension === "json") {
      return parseJSON(content);
    }
    if (extension === "csv") {
      const csvRows = parseCSV(content);
      return parseCSVRows(csvRows);
    }
    // txt or fallback
    return parseTXT(content);
  } catch (err) {
    console.error("Failed to parse file:", err);
    // If json or csv parsing threw, attempt txt as fallback
    try {
      return parseTXT(content);
    } catch {
      return [];
    }
  }
}

/**
 * Convert decrypted vault items to standard JSON string
 */
export function exportCredentialsToJSON(
  vaultName: string,
  items: any[],
): string {
  const exportPayload = {
    vaultName,
    exportedAt: new Date().toISOString(),
    generator: "WardPass Password Manager",
    totalItems: items.length,
    items: items.map((item) => {
      const { encryptedData, iv, ...cleanItem } = item;
      return cleanItem;
    }),
  };

  return JSON.stringify(exportPayload, null, 2);
}

/**
 * Convert decrypted vault items to CSV format
 */
export function exportCredentialsToCSV(items: any[]): string {
  const escapeCSV = (str?: string | number | null) => {
    if (str === null || str === undefined) return '""';
    const s = String(str).replace(/"/g, '""');
    return `"${s}"`;
  };

  const headers = [
    "type",
    "name",
    "username",
    "email",
    "password",
    "url",
    "note",
    "created_at",
  ];
  const rows = items.map((item) => {
    const type = item.itemType || "LOGIN";
    const name = item.name || item.title || item.cardHolderName || "";
    const username = item.username || "";
    const email = item.email || "";
    const password = item.password || "";
    const url = item.url || "";
    const note = item.note || item.content || "";
    const createdAt = item.createdAt
      ? new Date(item.createdAt).toISOString()
      : "";

    return [
      escapeCSV(type),
      escapeCSV(name),
      escapeCSV(username),
      escapeCSV(email),
      escapeCSV(password),
      escapeCSV(url),
      escapeCSV(note),
      escapeCSV(createdAt),
    ].join(",");
  });

  return [headers.join(","), ...rows].join("\r\n");
}

/**
 * Convert decrypted vault items to a formatted human-readable TXT format
 */
export function exportCredentialsToTXT(
  vaultName: string,
  items: any[],
): string {
  const separator = "=".repeat(60);
  const subSeparator = "-".repeat(40);

  let output = `${separator}\r\n`;
  output += `WARDPASS CREDENTIAL EXPORT: ${vaultName.toUpperCase()}\r\n`;
  output += `Exported At: ${new Date().toLocaleString()}\r\n`;
  output += `Total Items: ${items.length}\r\n`;
  output += `${separator}\r\n\r\n`;

  items.forEach((item, index) => {
    const type = item.itemType || "LOGIN";
    const name =
      item.name || item.title || item.cardHolderName || `Item ${index + 1}`;

    output += `[${index + 1}] ${type}: ${name}\r\n`;
    output += `${subSeparator}\r\n`;

    if (item.username) output += `Username:  ${item.username}\r\n`;
    if (item.email) output += `Email:     ${item.email}\r\n`;
    if (item.password) output += `Password:  ${item.password}\r\n`;
    if (item.url) output += `URL:       ${item.url}\r\n`;
    if (item.content) output += `Content:   ${item.content}\r\n`;
    if (item.cardNumber) output += `Card Number: ${item.cardNumber}\r\n`;
    if (item.expiryDate) output += `Expires:     ${item.expiryDate}\r\n`;
    if (item.cvv) output += `CVV:         ${item.cvv}\r\n`;
    if (item.note) output += `Note:      ${item.note}\r\n`;
    output += `\r\n`;
  });

  return output;
}

/**
 * Trigger browser file download using Blob
 */
export function downloadFile(
  content: string,
  filename: string,
  mimeType: string,
) {
  const blob = new Blob([content], { type: `${mimeType};charset=utf-8;` });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
