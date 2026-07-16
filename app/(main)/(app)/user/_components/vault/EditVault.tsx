"use client";

import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import { Button } from "../../../../../../components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { motion } from "motion/react";
import { DynamicIcon, IconName } from 'lucide-react/dynamic';
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";
import { editVault } from "@/app/actions/vault/editVault";

const iconsToRender: IconName[] = ['user', 'lock', 'settings', 'credit-card', 'wallet', 'activity', 'alarm-check', 'alarm-clock', 'alarm-minus', 'alarm-plus', 'album', 'accessibility', 'anchor', 'apple', 'archive', 'archive-restore', 'arrow-down', 'arrow-up', 'arrow-left', 'arrow-right', 'arrow-right-from-line', 'arrow-right-to-line', 'arrow-left-from-line', 'arrow-left-to-line', 'badge', 'banana', 'bar-chart', 'bar-chart-3', 'battery-charging'];

export default function EditVault({ open, onOpenChange, vault }: { open: boolean, onOpenChange: (open: boolean) => void, vault: { id: string, name: string, slug: string, icon: string, iconColor: string | null } }) {
    const [selectedIcon, setSelectedIcon] = useState<IconName>(vault.icon as IconName);
    const [vaultName, setVaultName] = useState<string>(vault.name);
    const [vaultColor, setVaultColor] = useState<string>(vault.iconColor!);

    const { mutate, data, isPending } = useMutation({
        mutationFn: () => editVault(vault.id, vaultName, selectedIcon, vaultColor),
        onMutate: () => {
            toast.dismiss();
            toast.loading("Updating vault...");
        },
        onSuccess: () => {
            toast.dismiss();
            toast.success("Vault updated successfully!" + data);
            onOpenChange(false);
        },
        onError: () => {
            toast.dismiss();
            toast.error("There was an error updating your vault. Please try again later.");
        }
    });

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="font-geist">
                <DialogHeader>
                    <DialogTitle className="font-bold">Edit <span className="font-bold">{vault.name}</span></DialogTitle>
                    <DialogDescription>
                        Edit <span className="font-bold">{vault.name}</span> details below.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-3">
                    <Label htmlFor="vaultName">Edit Vault Name</Label>
                    <Input id="vaultName" placeholder="e.g. Work, Personal, etc." value={vaultName} onChange={(e) => setVaultName(e.target.value)} />
                </div>
                <div className="flex flex-col gap-3">
                    <Label htmlFor="vaultIcon">Edit icon</Label>
                    <motion.div className="flex flex-wrap">
                        {iconsToRender.map((iconName) => (
                            <Button
                                variant={selectedIcon === iconName ? "default" : "ghost"}
                                size="lg"
                                className="w-fit flex justify-between text-lg font-bold"
                                key={iconName}
                                onClick={() => setSelectedIcon(iconName as IconName)}
                            >
                                <DynamicIcon name={iconName as IconName} size={32} />
                            </Button>
                        ))}
                    </motion.div>
                </div>
                <div className="flex flex-col gap-3">
                    <Label htmlFor="vaultColor">Edit Vault Color</Label>
                    <Input id="vaultColor" placeholder="e.g. red, green, blue" value={vaultColor} onChange={(e) => setVaultColor(e.target.value)} />
                </div>
                <DialogFooter className="font-geist">
                    <DialogClose className="text-md mr-1">Cancel</DialogClose>
                    <Button disabled={isPending || (vaultName === vault.name && selectedIcon === vault.icon && vaultColor === vault.iconColor)} variant="default" size="lg" className="text-md font-bold" onClick={() => mutate()}>
                        {isPending ? (
                            <>
                                <Loader2Icon className="size-4 animate-spin" />
                                <span>Updating...</span>
                            </>
                        ) : (
                            <span>Edit Vault</span>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}