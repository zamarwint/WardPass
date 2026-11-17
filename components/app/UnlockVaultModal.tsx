"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { BrickWallShield, Loader2Icon } from "lucide-react";
import { useVaultStore } from "@/stores/vault";
import { toast } from "sonner";
import { deriveKey, fromBase64 } from "@/lib/crypto/argon2";
import { decryptVaultKey, verifyVaultKey } from "@/lib/crypto/aes";
import { Vault } from "@/lib/types/VaultType";
import { SvgCircle } from "./SVG";

export function UnlockVaultModal({
    open,
    vault
}: {
    open: boolean,
    vault: Vault
}) {
    const [password, setPassword] = useState("");
    const [isUnlocking, setIsUnlocking] = useState(false);

    const handleUnlock = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!password) {
            toast.error("Please enter your account password.");
            return;
        }

        setIsUnlocking(true);
        toast.loading("Unlocking Wardpass...");

        try {
            // Delay to let UI render loading state before heavy CPU task
            await new Promise((resolve) => setTimeout(resolve, 50));

            const saltBytes = fromBase64(vault.salt!);
            const derivedKey = await deriveKey(password, saltBytes);
            const vaultKey = decryptVaultKey(vault.encryptedKey!, vault.keyIv!, derivedKey);

            if (verifyVaultKey(vault.verificationHash!, vault.hashIv!, vaultKey)) {
                useVaultStore.getState().setMasterPassword(password);
                // ✅ After creating the vault, unlock it immediately by passing its ID
                useVaultStore.getState().unlock(vault.id, vaultKey);
                toast.dismiss();
                toast.success("Strongroom unlocked successfully!");
            } else {
                toast.dismiss();
                toast.error("Incorrect account password.");
            }
        } catch (error) {
            toast.dismiss();
            toast.error("Failed to unlock strongroom. Please check your password.");
            console.error(error);
        } finally {
            setIsUnlocking(false);
            setPassword("");
        }
    };

    return open ? (
        <div className="size-full bg-background backdrop-blur-lg absolute inset-0 z-50 flex flex-col gap-6 items-center justify-center">
            <div className="flex items-center justify-center">
                <div className="flex flex-col items-center gap-6">
                    <SvgCircle>
                        <BrickWallShield className="text-primary size-20" />
                    </SvgCircle>
                    <div className="flex flex-col items-center gap-1 text-center">
                        <h1 className="text-2xl font-bold">WardPass Strongroom Vaults Locked</h1>
                        <p className="text-muted-foreground w-xl">Your strongroom&apos;s vaults are locked. Please enter your account password to decrypt your data.</p>
                    </div>
                </div>
            </div>
            <form onSubmit={handleUnlock} className="flex flex-col gap-4 mt-4 min-w-lg max-w-full">
                <div className="flex flex-col gap-2">
                    <Label htmlFor="masterPassword">Account Password</Label>
                    <Input
                        id="masterPassword"
                        type="password"
                        placeholder="Enter your account password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoFocus
                        className="h-12"
                    />
                </div>
                <Button type="submit" disabled={isUnlocking} className="w-full h-12">
                    {isUnlocking ? (
                        <>
                            <Loader2Icon className="w-4 h-4 mr-2 animate-spin" />
                            Unlocking...
                        </>
                    ) : (
                        "Unlock WardPass Vaults"
                    )}
                </Button>
            </form>
        </div>
    ) : null;
}
