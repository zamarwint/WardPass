"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2Icon, LockIcon } from "lucide-react";
import { useVaultStore } from "@/stores/vault";
import { toast } from "sonner";
import { deriveKey, fromBase64 } from "@/lib/crypto/argon2";
import { decryptVaultKey, verifyVaultKey } from "@/lib/crypto/aes";
import { Vault } from "@/lib/types/VaultType";

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
            toast.error("Please enter your master password.");
            return;
        }

        setIsUnlocking(true);
        toast.loading("Unlocking vault...");

        try {
            // Delay to let UI render loading state before heavy CPU task
            await new Promise((resolve) => setTimeout(resolve, 50));

            const saltBytes = fromBase64(vault.salt!);
            const derivedKey = await deriveKey(password, saltBytes);
            const vaultKey = decryptVaultKey(vault.encryptedKey!, vault.keyIv!, derivedKey);

            if (verifyVaultKey(vault.verificationHash!, vault.hashIv!, vaultKey)) {
                useVaultStore.getState().setMasterPassword(password);
                useVaultStore.getState().unlock(vaultKey);
                toast.dismiss();
                toast.success("Vault unlocked successfully!");
            } else {
                toast.dismiss();
                toast.error("Incorrect master password or corrupted data.");
            }
        } catch (error) {
            toast.dismiss();
            toast.error("Failed to unlock vault. Please check your password.");
            console.error(error);
        } finally {
            setIsUnlocking(false);
            setPassword("");
        }
    };

    return (
        <Dialog open={open}>
            <DialogContent className="font-geist" showCloseButton>
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <LockIcon className="text-primary w-5 h-5" />
                        Vault Locked
                    </DialogTitle>
                    <DialogDescription>
                        Your vault is locked. Please enter your master password to decrypt your data.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleUnlock} className="flex flex-col gap-4 mt-4">
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="masterPassword">Master Password</Label>
                        <Input
                            id="masterPassword"
                            type="password"
                            placeholder="Enter your master password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoFocus
                        />
                    </div>
                    <Button type="submit" disabled={isUnlocking} className="w-full mt-2">
                        {isUnlocking ? (
                            <>
                                <Loader2Icon className="w-4 h-4 mr-2 animate-spin" />
                                Unlocking...
                            </>
                        ) : (
                            "Unlock Vault"
                        )}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
