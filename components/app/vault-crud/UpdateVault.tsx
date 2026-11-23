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

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { motion } from "motion/react";
import { IconMap, RenderIcon } from "@/components/IconMap";
import { Loader2Icon } from "lucide-react";
import { VaultSummary } from "@/lib/types/VaultType";
import { useUpdateVault } from "@/lib/mutations/CoreUpdateMutations";
import { useTheme } from "next-themes";
import { ColorWheel } from "./ColorWheel";

export default function UpdateVault({ open, onOpenChange, vault }: { open: boolean, onOpenChange: (open: boolean) => void, vault: VaultSummary }) {
    const { resolvedTheme } = useTheme();

    const [selectedIcon, setSelectedIcon] = useState<string>(vault.icon);
    const [vaultName, setVaultName] = useState<string>(vault.name);
    const [vaultColor, setVaultColor] = useState<string>(vault.iconColor || "#3b82f6");

    const { mutate, isPending } = useUpdateVault(vault.id, vaultName, selectedIcon as string, vaultColor, onOpenChange);

    const hasChanges = vaultName !== vault.name || selectedIcon !== vault.icon || vaultColor !== (vault.iconColor || "");

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90vh] overflow-y-auto no-scrollbar">
                <DialogHeader>
                    <DialogTitle className="font-bold text-xl">Update <span className="font-bold">{vault.name}</span></DialogTitle>
                    <DialogDescription>
                        Update <span className="font-bold">{vault.name}</span> settings and theme below.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-3">
                    <Label htmlFor="vaultName">Vault Name</Label>
                    <Input id="vaultName" placeholder="e.g. Work, Personal, etc." value={vaultName} onChange={(e) => setVaultName(e.target.value)} />
                </div>
                <div className="flex flex-col gap-3">
                    <Label htmlFor="vaultIcon">Vault Icon</Label>
                    <div className="flex flex-wrap gap-1.5 p-0.75 rounded-xl bg-muted/30 border border-border/40">
                        {Object.keys(IconMap).map((iconName) => (
                            <Button
                                variant={selectedIcon === iconName ? "default" : "ghost"}
                                size="sm"
                                className="size-11 p-0 m-1 flex items-center justify-center rounded-lg transition-transform hover:scale-105 cursor-pointer"
                                key={iconName}
                                onClick={() => setSelectedIcon(iconName)}
                                type="button"
                            >
                                <RenderIcon
                                    name={iconName}
                                    size={24}
                                    color={
                                        selectedIcon === iconName
                                            ? (vaultColor || "#3b82f6")
                                            : (resolvedTheme === 'light' ? 'black' : 'white')
                                    }
                                />
                            </Button>
                        ))}
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <Label>Vault Color & Theme</Label>
                    <ColorWheel value={vaultColor} onChange={setVaultColor} />
                </div>
                <DialogFooter>
                    <DialogClose className="text-md mr-1">Cancel</DialogClose>
                    <Button disabled={isPending || !hasChanges || !vaultName} variant="default" size="lg" className="text-md font-bold" onClick={() => mutate()}>
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
