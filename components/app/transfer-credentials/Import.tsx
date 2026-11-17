"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  FileUp,
  FolderPlus,
  FolderSync,
  Globe,
  Loader2,
  Lock,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  FileJson,
  FileText,
} from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

import { useGetVaults } from "@/lib/queries/VaultQueries";
import { VaultSummary, VaultItemType } from "@/lib/types/VaultType";
import { useVaultStore } from "@/stores/vault";
import { deriveKey, fromBase64, toBase64, generateSalt } from "@/lib/crypto/argon2";
import {
  decryptVaultKey,
  verifyVaultKey,
  generateVaultKey,
  encryptVaultKey,
  createVerificationHash,
  encryptData,
} from "@/lib/crypto/aes";
import { getVaultPageData } from "@/actions/vault/getVaultPageData";
import { createVault } from "@/actions/vault/createVault";
import { createVaultItemsBatch } from "@/actions/vault-item/createVaultItemsBatch";
import { parseCredentialFile, ParsedCredential } from "@/lib/utils/credential-transfer";
import { IconMap, RenderIcon } from "@/components/IconMap";
import { useTheme } from "next-themes";

const POPULAR_ICONS = ["key-round", "shield", "lock", "circle-user", "inbox", "bookmark", "star", "wallet"];

export default function Import() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { resolvedTheme } = useTheme();
  const store = useVaultStore();

  const { data: vaults, isLoading: vaultsLoading } = useGetVaults();

  // File state
  const [file, setFile] = useState<File | null>(null);
  const [parsedItems, setParsedItems] = useState<ParsedCredential[]>([]);
  const [isParsing, setIsParsing] = useState(false);

  // Vault choice: "existing" | "new"
  const [targetType, setTargetType] = useState<"existing" | "new">("existing");

  // Existing vault selection
  const [selectedVaultId, setSelectedVaultId] = useState<string>("");
  const [existingVaultItemCount, setExistingVaultItemCount] = useState<number | null>(null);

  // New vault creation fields
  const [newVaultName, setNewVaultName] = useState("");
  const [selectedIcon, setSelectedIcon] = useState<string>("key-round");
  const [vaultColor, setVaultColor] = useState<string>("#D6A51D");

  // Account password (if not already in memory)
  const [passwordInput, setPasswordInput] = useState("");
  const effectivePassword = store.masterPassword || passwordInput;

  // Processing state
  const [isImporting, setIsImporting] = useState(false);
  const [importedVaultId, setImportedVaultId] = useState<string | null>(null);

  // Handle file selection
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    setFile(selected);
    setIsParsing(true);
    setImportedVaultId(null);

    try {
      const text = await selected.text();
      const results = parseCredentialFile(text, selected.name);
      setParsedItems(results);

      if (results.length === 0) {
        toast.error("Could not find any credentials in this file. Please check the file format.");
      } else {
        toast.success(`Parsed ${results.length} credential${results.length !== 1 ? "s" : ""} from ${selected.name}`);
      }
    } catch (err: any) {
      console.error("Error reading file:", err);
      toast.error("Failed to read file: " + (err?.message || "Unknown error"));
      setParsedItems([]);
    } finally {
      setIsParsing(false);
    }
  };

  // Handle existing vault change and load item count
  const handleSelectVault = async (vaultId: string) => {
    setSelectedVaultId(vaultId);
    try {
      const data = await getVaultPageData(vaultId);
      if (data) {
        const totalCount = (data.vaultItems?.length ?? 0) + (data.trashedCount ?? 0);
        setExistingVaultItemCount(totalCount);
      }
    } catch {
      setExistingVaultItemCount(null);
    }
  };

  // Execute import
  const handleImport = async () => {
    if (parsedItems.length === 0) {
      toast.error("No credentials to import.");
      return;
    }

    if (!effectivePassword) {
      toast.error("Please enter your account password to encrypt your credentials.");
      return;
    }

    setIsImporting(true);
    toast.loading("Preparing encryption and importing credentials...");

    try {
      let targetVaultId = selectedVaultId;
      let vaultKey: Uint8Array;

      // ─── 1. Determine or Create Target Vault ─────────────────────────────
      if (targetType === "new") {
        if (!newVaultName.trim()) {
          throw new Error("Please enter a name for the new vault.");
        }

        const salt = generateSalt();
        const derivedKey = await deriveKey(effectivePassword, salt);
        vaultKey = generateVaultKey();

        const { encryptedKey, keyIv } = encryptVaultKey(vaultKey, derivedKey);
        const { hash: verificationHash, hashIv } = createVerificationHash(vaultKey);

        const newVault = await createVault(
          newVaultName.trim(),
          selectedIcon,
          vaultColor,
          toBase64(salt),
          encryptedKey,
          keyIv,
          verificationHash,
          hashIv,
        );

        targetVaultId = newVault.id;
        store.setMasterPassword(effectivePassword);
        store.unlock(targetVaultId, vaultKey);
      } else {
        // Existing vault
        if (!targetVaultId) {
          throw new Error("Please select an existing vault to import into.");
        }

        const vaultData = await getVaultPageData(targetVaultId);
        if (!vaultData) {
          throw new Error("Selected vault not found.");
        }

        // Check if unlocked or unlock now
        if (store.isVaultUnlocked(targetVaultId)) {
          vaultKey = store.getVaultKey(targetVaultId);
        } else {
          const saltBytes = fromBase64(vaultData.salt!);
          const derivedKey = await deriveKey(effectivePassword, saltBytes);
          vaultKey = decryptVaultKey(vaultData.encryptedKey!, vaultData.keyIv!, derivedKey);

          if (!verifyVaultKey(vaultData.verificationHash!, vaultData.hashIv!, vaultKey)) {
            throw new Error("Incorrect account password. Unable to unlock vault.");
          }

          store.setMasterPassword(effectivePassword);
          store.unlock(targetVaultId, vaultKey);
        }
      }

      // ─── 2. Encrypt Credentials ──────────────────────────────────────────
      const encryptedBatch = parsedItems.map((item) => {
        const payload = JSON.stringify({
          name: item.name,
          url: item.url || "",
          username: item.username || "",
          email: item.email || "",
          password: item.password || "",
          note: item.note || "",
          // extra types if present
          ...(item.title && { title: item.title }),
          ...(item.content && { content: item.content }),
          ...(item.cardHolderName && { cardHolderName: item.cardHolderName }),
          ...(item.cardNumber && { cardNumber: item.cardNumber }),
          ...(item.cvv && { cvv: item.cvv }),
          ...(item.expiryDate && { expiryDate: item.expiryDate }),
        });

        const { ciphertext, iv } = encryptData(payload, vaultKey);
        return {
          encryptedData: ciphertext,
          iv,
          itemType: item.itemType || VaultItemType.LOGIN,
        };
      });

      // ─── 3. Save to Database ─────────────────────────────────────────────
      const res = await createVaultItemsBatch({
        vaultId: targetVaultId,
        items: encryptedBatch,
      });

      // ─── 4. Invalidate React Query Caches ────────────────────────────────
      queryClient.invalidateQueries({ queryKey: ["vaults"] });
      queryClient.invalidateQueries({ queryKey: ["vaultPage", targetVaultId] });

      toast.dismiss();
      toast.success(
        `Successfully imported ${res.insertedCount} credential${res.insertedCount !== 1 ? "s" : ""
        }!` +
        (res.insertedCount < res.totalAttempted
          ? ` (${res.totalAttempted - res.insertedCount} skipped: 5 item limit reached)`
          : "")
      );

      setImportedVaultId(targetVaultId);
    } catch (err: any) {
      toast.dismiss();
      console.error("Import failed:", err);
      toast.error(err?.message || "Failed to import credentials.");
    } finally {
      setIsImporting(false);
    }
  };

  const getFileIcon = (filename: string) => {
    if (filename.endsWith(".json")) return <FileJson className="size-8 text-primary" />;
    if (filename.endsWith(".csv")) return <FileSpreadsheet className="size-8 text-primary" />;
    return <FileText className="size-8 text-primary" />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="size-full flex flex-col items-center gap-8"
    >
      <Card className="size-full max-w-3xl shadow-sm border-border bg-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex flex-col items-start gap-2">
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <FileUp className="text-primary size-6" />
                Import Credentials
              </CardTitle>
              <CardDescription>
                Import passwords and items from a CSV, JSON, or TXT file into your secure vault.
              </CardDescription>
            </div>
            <Badge variant="outline" className="border-primary/50 text-primary">
              E2E Encrypted
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* STEP 1: FILE UPLOAD */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold">1. Choose a file (.csv, .json, .txt)</Label>
            <div className="border-2 border-dashed border-border rounded-xl p-6 hover:border-primary/60 transition-colors flex flex-col items-center justify-center gap-3 bg-muted/20">
              {file ? (
                <div className="flex items-center gap-4 w-full">
                  {getFileIcon(file.name)}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground font-mono">
                      {(file.size / 1024).toFixed(1)} KB • {file.type || "text/plain"}
                    </p>
                  </div>
                  <Label
                    htmlFor="credential-file-input"
                    className="cursor-pointer text-xs font-semibold px-3 py-2 rounded-lg bg-secondary hover:bg-secondary/80 text-foreground transition-colors"
                  >
                    Change File
                  </Label>
                </div>
              ) : (
                <>
                  <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <FileUp className="size-6" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium">Drag and drop or select your credential file</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Supports Chrome, Bitwarden, 1Password, or standard CSV / JSON / TXT exports
                    </p>
                  </div>
                  <Label
                    htmlFor="credential-file-input"
                    className="cursor-pointer text-sm font-medium px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors mt-2"
                  >
                    Browse Files
                  </Label>
                </>
              )}
              <Input
                id="credential-file-input"
                type="file"
                accept=".csv,.json,.txt"
                onChange={handleFileChange}
                className="hidden"
                disabled={isImporting}
              />
            </div>
          </div>

          {/* STEP 2: CREDENTIAL PREVIEW */}
          {isParsing && (
            <div className="flex items-center justify-center gap-2 py-6 text-muted-foreground">
              <Loader2 className="size-5 animate-spin text-primary" />
              <span>Analyzing file content...</span>
            </div>
          )}

          {parsedItems.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-semibold flex items-center gap-2">
                  <span>2. Preview Parsed Items</span>
                  <Badge variant="secondary" className="font-mono">
                    {parsedItems.length} found
                  </Badge>
                </Label>
                <span className="text-xs text-muted-foreground">
                  (Showing up to 5 items)
                </span>
              </div>

              <div className="max-h-56 overflow-y-auto rounded-lg border border-border divide-y divide-border bg-background">
                {parsedItems.slice(0, 5).map((item, idx) => (
                  <div key={item.id || idx} className="p-3 flex items-center justify-between gap-4 text-sm">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="size-8 rounded-md bg-muted flex items-center justify-center text-primary shrink-0">
                        <Globe className="size-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-foreground truncate">{item.name}</p>
                        <p className="text-xs text-muted-foreground font-mono truncate">
                          {item.username || item.email || "No username"}
                        </p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <Badge variant="outline" className="text-xs font-mono">
                        {item.password ? "••••••••" : "No Password"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>

              {parsedItems.length > 5 && (
                <p className="text-xs text-muted-foreground text-center">
                  +{parsedItems.length - 5} more items will be imported (subject to vault capacity of 5 items).
                </p>
              )}
            </div>
          )}

          {/* STEP 3: DESTINATION VAULT */}
          {parsedItems.length > 0 && (
            <div className="space-y-4 pt-2">
              <Label className="text-sm font-semibold">3. Destination Vault</Label>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setTargetType("existing")}
                  className={`p-4 rounded-xl border text-left transition-all flex flex-col gap-1.5 cursor-pointer ${targetType === "existing"
                    ? "border-primary bg-primary/10 shadow-xs ring-1 ring-primary"
                    : "border-border hover:bg-muted/40"
                    }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm">Add to Existing Vault</span>
                    <FolderSync className="size-4 text-primary" />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Append credentials to a vault you already have.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setTargetType("new")}
                  className={`p-4 rounded-xl border text-left transition-all flex flex-col gap-1.5 cursor-pointer ${targetType === "new"
                    ? "border-primary bg-primary/10 shadow-xs ring-1 ring-primary"
                    : "border-border hover:bg-muted/40"
                    }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm">Create a New Vault</span>
                    <FolderPlus className="size-4 text-primary" />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Create a dedicated vault for these credentials.
                  </p>
                </button>
              </div>

              {/* OPTION A: EXISTING VAULT SELECTION */}
              {targetType === "existing" && (
                <div className="space-y-3 pt-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="vault-select" className="text-xs text-muted-foreground">
                      Select Target Vault
                    </Label>
                    {vaultsLoading ? (
                      <div className="h-10 bg-muted/40 rounded-md animate-pulse" />
                    ) : (
                      <Select value={selectedVaultId} onValueChange={(val) => { if (val) handleSelectVault(val); }}>
                        <SelectTrigger id="vault-select" className="w-full">
                          <SelectValue placeholder="Choose a vault..." />
                        </SelectTrigger>
                        <SelectContent>
                          {vaults?.map((v: VaultSummary) => (
                            <SelectItem key={v.id} value={v.id} className="cursor-pointer">
                              <div className="flex items-center gap-2">
                                <RenderIcon name={v.icon || "shield"} size={16} />
                                <span>{v.name}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>

                  {existingVaultItemCount !== null && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <AlertCircle className="size-4 text-primary" />
                      <span>
                        Current items in vault: <strong>{existingVaultItemCount} / 5</strong>.{" "}
                        {Math.max(0, 5 - existingVaultItemCount)} slots available.
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* OPTION B: NEW VAULT FORM */}
              {targetType === "new" && (
                <div className="space-y-4 pt-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="new-vault-name" className="text-xs text-muted-foreground">
                      Vault Name
                    </Label>
                    <Input
                      id="new-vault-name"
                      placeholder="e.g. Imported Logins, Work Accounts"
                      value={newVaultName}
                      onChange={(e) => setNewVaultName(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Choose Icon</Label>
                    <div className="flex flex-wrap gap-2">
                      {POPULAR_ICONS.map((iconName) => (
                        <Button
                          key={iconName}
                          type="button"
                          variant={selectedIcon === iconName ? "default" : "outline"}
                          size="sm"
                          className="size-9 p-0"
                          onClick={() => setSelectedIcon(iconName)}
                        >
                          <RenderIcon
                            name={iconName}
                            size={18}
                            color={
                              selectedIcon === iconName
                                ? resolvedTheme === "light"
                                  ? "#fff"
                                  : "#000"
                                : "currentColor"
                            }
                          />
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="new-vault-color" className="text-xs text-muted-foreground">
                      Vault Color (Hex or CSS name)
                    </Label>
                    <div className="flex items-center gap-3">
                      <Input
                        id="new-vault-color"
                        type="text"
                        value={vaultColor}
                        onChange={(e) => setVaultColor(e.target.value)}
                        className="font-mono text-xs"
                      />
                      <input
                        type="color"
                        value={vaultColor.startsWith("#") ? vaultColor : "#D6A51D"}
                        onChange={(e) => setVaultColor(e.target.value)}
                        className="size-9 p-0 border rounded-md cursor-pointer bg-transparent"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: ACCOUNT PASSWORD (IF NEEDED) */}
              {!store.masterPassword && (
                <div className="space-y-2 pt-2 border-t border-border">
                  <Label htmlFor="account-password" className="text-sm font-semibold flex items-center gap-2">
                    <Lock className="size-4 text-primary" />
                    <span>Enter Account Password</span>
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Required to perform client-side encryption and unlock the target vault.
                  </p>
                  <Input
                    id="account-password"
                    type="password"
                    placeholder="Enter your account password"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                  />
                </div>
              )}

              {store.masterPassword && (
                <div className="flex items-center gap-2 text-xs text-emerald-500 font-medium pt-1">
                  <ShieldCheck className="size-4" />
                  <span>Account password unlocked in active session. Ready to encrypt.</span>
                </div>
              )}

              {/* SUBMIT BUTTON */}
              <div className="pt-2">
                <Button
                  onClick={handleImport}
                  disabled={
                    isImporting ||
                    parsedItems.length === 0 ||
                    !effectivePassword ||
                    (targetType === "existing" && !selectedVaultId) ||
                    (targetType === "new" && !newVaultName.trim())
                  }
                  className="w-full h-11 text-base font-semibold cursor-pointer"
                >
                  {isImporting ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="size-4 animate-spin" />
                      <span>Encrypting & Importing...</span>
                    </div>
                  ) : (
                    <span>
                      Import {parsedItems.length} Credential{parsedItems.length !== 1 ? "s" : ""}
                    </span>
                  )}
                </Button>
              </div>

              {importedVaultId && (
                <div className="p-4 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-between">
                  <div className="flex items-center gap-2.5 text-sm font-medium text-foreground">
                    <CheckCircle2 className="size-5 text-primary" />
                    <span>Import complete! Ready to view your updated vault.</span>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => router.push(`/strongroom/${importedVaultId}`)}
                    className="cursor-pointer"
                  >
                    View Vault
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
