"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { toast } from "sonner";
import {
    Download,
    FileSpreadsheet,
    FileJson,
    FileText,
    Lock,
    Loader2,
    ShieldCheck,
    AlertCircle,
    CheckCircle2,
} from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

import { useGetVaults } from "@/lib/queries/VaultQueries";
import { VaultSummary } from "@/lib/types/VaultType";
import { useVaultStore } from "@/stores/vault";
import { deriveKey, fromBase64 } from "@/lib/crypto/argon2";
import { decryptVaultKey, verifyVaultKey, decryptData } from "@/lib/crypto/aes";
import { getVaultPageData } from "@/actions/vault/getVaultPageData";
import { RenderIcon } from "@/components/IconMap";
import {
    exportCredentialsToCSV,
    exportCredentialsToJSON,
    exportCredentialsToTXT,
    downloadFile,
} from "@/lib/utils/credential-transfer";

type ExportFormat = "csv" | "json" | "txt";

const FORMAT_OPTIONS: { id: ExportFormat; label: string; ext: string; desc: string; icon: any }[] = [
    {
        id: "csv",
        label: "CSV Spreadsheet",
        ext: ".csv",
        desc: "Compatible with Chrome, Bitwarden, 1Password & Excel",
        icon: FileSpreadsheet,
    },
    {
        id: "json",
        label: "JSON Document",
        ext: ".json",
        desc: "Complete structured data backup",
        icon: FileJson,
    },
    {
        id: "txt",
        label: "Plain Text Summary",
        ext: ".txt",
        desc: "Formatted human-readable text document",
        icon: FileText,
    },
];

export default function Export() {
    const store = useVaultStore();
    const { data: vaults, isLoading: vaultsLoading } = useGetVaults();

    const [selectedVaultId, setSelectedVaultId] = useState<string>("");
    const [selectedFormat, setSelectedFormat] = useState<ExportFormat>("csv");

    const [passwordInput, setPasswordInput] = useState<string>("");
    const effectivePassword = store.masterPassword || passwordInput;

    const [isExporting, setIsExporting] = useState<boolean>(false);
    const [lastExportCount, setLastExportCount] = useState<number | null>(null);

    const selectedVault = vaults?.find((v: VaultSummary) => v.id === selectedVaultId);

    const handleExport = async () => {
        if (!selectedVaultId) {
            toast.error("Please select a vault to export.");
            return;
        }

        if (!effectivePassword) {
            toast.error("Please enter your account password to decrypt the vault.");
            return;
        }

        setIsExporting(true);
        toast.loading("Decrypting vault items and preparing export...");

        try {
            // 1. Fetch vault data from server
            const vaultData = await getVaultPageData(selectedVaultId);
            if (!vaultData) {
                throw new Error("Vault not found.");
            }

            const rawItems = vaultData.vaultItems || [];
            if (rawItems.length === 0) {
                throw new Error("This vault contains no active credentials to export.");
            }

            // 2. Unlock & obtain vault key
            let vaultKey: Uint8Array;
            if (store.isVaultUnlocked(selectedVaultId)) {
                vaultKey = store.getVaultKey(selectedVaultId);
            } else {
                const saltBytes = fromBase64(vaultData.salt!);
                const derivedKey = await deriveKey(effectivePassword, saltBytes);
                vaultKey = decryptVaultKey(vaultData.encryptedKey!, vaultData.keyIv!, derivedKey);

                if (!verifyVaultKey(vaultData.verificationHash!, vaultData.hashIv!, vaultKey)) {
                    throw new Error("Incorrect account password. Unable to decrypt vault.");
                }

                store.setMasterPassword(effectivePassword);
                store.unlock(selectedVaultId, vaultKey);
            }

            // 3. Decrypt each item client-side
            const decryptedItems = rawItems
                .map((item) => {
                    if (!item.encryptedData || !item.iv) return null;
                    try {
                        const json = decryptData(item.encryptedData, item.iv, vaultKey);
                        return { ...item, ...JSON.parse(json) };
                    } catch (e) {
                        console.error("Failed to decrypt item during export:", item.id, e);
                        return null;
                    }
                })
                .filter(Boolean);

            if (decryptedItems.length === 0) {
                throw new Error("No items could be decrypted. Please verify your password.");
            }

            // 4. Format according to selected choice
            const safeVaultName = (vaultData.name || "vault").toLowerCase().replace(/[^a-z0-9_-]/gi, "_");
            const timestamp = new Date().toISOString().split("T")[0];

            let content = "";
            let filename = "";
            let mimeType = "";

            if (selectedFormat === "csv") {
                content = exportCredentialsToCSV(decryptedItems);
                filename = `wardpass-${safeVaultName}-${timestamp}.csv`;
                mimeType = "text/csv";
            } else if (selectedFormat === "json") {
                content = exportCredentialsToJSON(vaultData.name, decryptedItems);
                filename = `wardpass-${safeVaultName}-${timestamp}.json`;
                mimeType = "application/json";
            } else {
                content = exportCredentialsToTXT(vaultData.name, decryptedItems);
                filename = `wardpass-${safeVaultName}-${timestamp}.txt`;
                mimeType = "text/plain";
            }

            // 5. Trigger download
            downloadFile(content, filename, mimeType);
            setLastExportCount(decryptedItems.length);

            toast.dismiss();
            toast.success(
                `Exported ${decryptedItems.length} credential${decryptedItems.length !== 1 ? "s" : ""
                } to ${filename}!`
            );
        } catch (err: any) {
            toast.dismiss();
            console.error("Export error:", err);
            toast.error(err?.message || "Failed to export vault credentials.");
        } finally {
            setIsExporting(false);
        }
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
                        <div className="flex flex-col items-start gap-1">
                            <CardTitle className="text-2xl font-bold flex items-center gap-2">
                                <Download className="text-primary size-6" />
                                Export Credentials
                            </CardTitle>
                            <CardDescription>
                                Export decrypted credentials from a specific vault to a CSV, JSON, or TXT file.
                            </CardDescription>
                        </div>
                        <Badge variant="outline" className="border-primary/50 text-primary">
                            Client Decrypted
                        </Badge>
                    </div>
                </CardHeader>

                <CardContent className="space-y-6">
                    {/* STEP 1: SELECT VAULT */}
                    <div className="space-y-2">
                        <Label htmlFor="vault-select" className="text-sm font-semibold">
                            1. Select a Vault to Export
                        </Label>
                        {vaultsLoading ? (
                            <div className="h-10 bg-muted/40 rounded-md animate-pulse" />
                        ) : (
                            <Select value={selectedVaultId} onValueChange={(val) => {
                                if (val) setSelectedVaultId(val);
                                setLastExportCount(null);
                            }}>
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
                        {vaults && vaults.length === 0 && (
                            <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-1">
                                <AlertCircle className="size-3.5" />
                                You don&apos;t have any vaults yet. Create one first to store credentials.
                            </p>
                        )}
                    </div>

                    {/* STEP 2: CHOOSE FORMAT */}
                    <div className="space-y-3">
                        <Label className="text-sm font-semibold">2. Choose Export Format</Label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            {FORMAT_OPTIONS.map((opt) => {
                                const IconComponent = opt.icon;
                                const isSelected = selectedFormat === opt.id;
                                return (
                                    <button
                                        key={opt.id}
                                        type="button"
                                        onClick={() => setSelectedFormat(opt.id)}
                                        className={`p-3.5 rounded-xl border text-left transition-all flex flex-col gap-1.5 cursor-pointer ${isSelected
                                            ? "border-primary bg-primary/10 shadow-xs ring-1 ring-primary"
                                            : "border-border hover:bg-muted/40"
                                            }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="font-semibold text-sm">{opt.label}</span>
                                            <IconComponent className="size-4 text-primary" />
                                        </div>
                                        <p className="text-xs text-muted-foreground">{opt.desc}</p>
                                        <span className="text-xs font-mono font-semibold text-primary mt-1">
                                            {opt.ext}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* STEP 3: ACCOUNT PASSWORD (IF NEEDED) */}
                    {selectedVaultId && !store.masterPassword && (
                        <div className="space-y-2 pt-2 border-t border-border">
                            <Label htmlFor="export-password" className="text-sm font-semibold flex items-center gap-2">
                                <Lock className="size-4 text-primary" />
                                <span>3. Enter Account Password</span>
                            </Label>
                            <p className="text-xs text-muted-foreground">
                                Your credentials are encrypted end-to-end. Your account password is required to decrypt them for export.
                            </p>
                            <Input
                                id="export-password"
                                type="password"
                                placeholder="Enter your account password"
                                value={passwordInput}
                                onChange={(e) => setPasswordInput(e.target.value)}
                            />
                        </div>
                    )}

                    {selectedVaultId && store.masterPassword && (
                        <div className="flex items-center gap-2 text-xs text-emerald-500 font-medium pt-1">
                            <ShieldCheck className="size-4" />
                            <span>Account password unlocked. Vault keys are ready in active session.</span>
                        </div>
                    )}

                    {/* SUBMIT BUTTON */}
                    <div className="pt-2">
                        <Button
                            onClick={handleExport}
                            disabled={
                                isExporting ||
                                !selectedVaultId ||
                                !effectivePassword
                            }
                            className="w-full h-11 text-base font-semibold cursor-pointer"
                        >
                            {isExporting ? (
                                <div className="flex items-center gap-2">
                                    <Loader2 className="size-4 animate-spin" />
                                    <span>Decrypting & Exporting...</span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <Download className="size-4" />
                                    <span>
                                        Export {selectedVault ? `"${selectedVault.name}"` : "Credentials"} (
                                        {selectedFormat.toUpperCase()})
                                    </span>
                                </div>
                            )}
                        </Button>
                    </div>

                    {lastExportCount !== null && (
                        <div className="p-4 rounded-xl bg-primary/10 border border-primary/30 flex items-center gap-3">
                            <CheckCircle2 className="size-5 text-primary shrink-0" />
                            <div className="text-sm">
                                <p className="font-semibold text-foreground">Export Successful</p>
                                <p className="text-xs text-muted-foreground">
                                    Downloaded {lastExportCount} credentials in {selectedFormat.toUpperCase()} format.
                                    Keep this file safe as it contains decrypted plaintext passwords.
                                </p>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    );
}
