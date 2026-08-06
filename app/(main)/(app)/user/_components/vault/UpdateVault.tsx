"use client";

import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

import { useVaultStore } from "@/stores/vault";

import { Button } from "../../../../../../components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { motion } from "motion/react";
import { IconMap, RenderIcon } from "@/components/IconMap";
import { Loader2Icon } from "lucide-react";
import { Vault } from "@/lib/types/VaultType";
import { useUpdateVault } from "@/lib/mutations/CoreUpdateMutations";

export default function UpdateVault({ open, onOpenChange, vault }: { open: boolean, onOpenChange: (open: boolean) => void, vault: Vault }) {
    const [selectedIcon, setSelectedIcon] = useState<string>(vault.icon);
    const [vaultName, setVaultName] = useState<string>(vault.name);
    const [vaultColor, setVaultColor] = useState<string>(vault.iconColor!);

    // ✅ Master password lives in local state — form input only
    const [masterPassword, setMasterPassword] = useState<string>(useVaultStore.getState().masterPassword || "");
    const { mutate, isPending } = useUpdateVault(vault.id, vaultName, selectedIcon as string, vaultColor, masterPassword, setMasterPassword, onOpenChange)

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="font-geist">
                <DialogHeader>
                    <DialogTitle className="font-bold">Update <span className="font-bold">{vault.name}</span></DialogTitle>
                    <DialogDescription>
                        Update <span className="font-bold">{vault.name}</span> details below.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-3">
                    <Label htmlFor="vaultName">Update Vault Name</Label>
                    <Input id="vaultName" placeholder="e.g. Work, Personal, etc." value={vaultName} onChange={(e) => setVaultName(e.target.value)} />
                </div>
                <div className="flex flex-col gap-3">
                    <Label htmlFor="vaultIcon">Update icon</Label>
                    <motion.div className="flex flex-wrap">
                        {Object.keys(IconMap).map((iconName) => (
                            <Button
                                variant={selectedIcon === iconName ? "default" : "ghost"}
                                size="lg"
                                className="w-fit flex justify-between text-lg font-bold"
                                key={iconName}
                                onClick={() => setSelectedIcon(iconName)}
                            >
                                <RenderIcon name={iconName} size={32} />
                            </Button>
                        ))}
                    </motion.div>
                </div>
                <div className="flex flex-col gap-3">
                    <Label htmlFor="vaultColor">Update Vault Color</Label>
                    <Input id="vaultColor" placeholder="e.g. red, green, blue" value={vaultColor} onChange={(e) => setVaultColor(e.target.value)} />
                </div>
                <div className="flex flex-col gap-3">
                    <Label htmlFor="masterPassword">Update Master Password</Label>
                    <Input type="password" id="masterPassword" placeholder="Enter your master password to update vault" value={masterPassword} onChange={(e) => setMasterPassword(e.target.value)} />
                </div>
                <DialogFooter className="font-geist">
                    <DialogClose className="text-md mr-1">Cancel</DialogClose>
                    <Button disabled={isPending || (vaultName === vault.name && selectedIcon === vault.icon && vaultColor === vault.iconColor && !masterPassword)} variant="default" size="lg" className="text-md font-bold" onClick={() => mutate()}>
                        {isPending ? (
                            <>
                                <Loader2Icon className="size-4 animate-spin" />
                                <span>Updating...</span>
                            </>
                        ) : (
                            <span>Update Vault</span>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}