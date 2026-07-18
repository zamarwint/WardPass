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
import * as Lucide from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { DynamicIcon, IconName } from 'lucide-react/dynamic';
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { createVault } from "@/app/actions/vault/createVault";
import { Loader2Icon } from "lucide-react";

const iconsToRender: IconName[] = ['user', 'lock', 'settings', 'credit-card', 'wallet', 'activity', 'alarm-check', 'alarm-clock', 'alarm-minus', 'alarm-plus', 'album', 'accessibility', 'anchor', 'apple', 'archive', 'archive-restore', 'arrow-down', 'arrow-up', 'arrow-left', 'arrow-right', 'arrow-right-from-line', 'arrow-right-to-line', 'arrow-left-from-line', 'arrow-left-to-line', 'badge', 'banana', 'bar-chart', 'bar-chart-3', 'battery-charging', 'at-sign', 'badge-alert', 'bell', 'fingerprint-pattern', 'heart-handshake', 'flag-off'];

export default function CreateVault() {
    const [selectedIcon, setSelectedIcon] = useState<IconName>();
    const [vaultName, setVaultName] = useState<string>("");
    const [vaultColor, setVaultColor] = useState<string>("");

    const { mutate, error, isPending } = useMutation({
        mutationFn: () => createVault(vaultName, selectedIcon as string, vaultColor),
        onMutate: () => {
            toast.dismiss();
            toast.loading("Creating vault...");
        },
        onSuccess: () => {
            toast.dismiss();
            toast.success("Vault created successfully!");
        },
        onError: () => {
            toast.dismiss();
            toast.error("There was an error creating your vault. Please try again later." + error);
        }
    });

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="secondary" size="lg" className="p-5 w-full">Create Vault <Lucide.PlusIcon size="16" /></Button>
            </DialogTrigger>
            <DialogContent className="font-geist">
                <DialogHeader>
                    <DialogTitle className="font-bold">New Vault</DialogTitle>
                    <DialogDescription>
                        Create a new vault.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-3">
                    <Label htmlFor="vaultName">Enter Vault Name</Label>
                    <Input id="vaultName" placeholder="e.g. Work, Personal, etc." value={vaultName} onChange={(e) => setVaultName(e.target.value)} />
                </div>
                <div className="flex flex-col gap-3">
                    <Label htmlFor="vaultIcon">Choose an icon</Label>
                    <div className="flex flex-wrap">
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
                    </div>
                </div>
                <div className="flex flex-col gap-3">
                    <Label htmlFor="vaultColor">Enter Vault Color</Label>
                    <Input id="vaultColor" placeholder="e.g. red, green, blue" value={vaultColor} onChange={(e) => setVaultColor(e.target.value)} />
                </div>
                <DialogFooter className="font-geist">
                    <DialogClose className="text-md mr-1">Cancel</DialogClose>
                    <Button disabled={isPending || !vaultName || !selectedIcon || !vaultColor} variant="default" size="lg" className="text-md font-bold" onClick={() => mutate()}>
                        {isPending ? (
                            <>
                                <Loader2Icon className="size-4 animate-spin" />
                                <span>Creating...</span>
                            </>
                        ) : (
                            <span>Create Vault</span>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}