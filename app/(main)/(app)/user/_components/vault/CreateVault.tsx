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
import { Plus, X, Loader2Icon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { RenderIcon } from "@/components/IconMap";
import { useCreateVault } from "@/lib/mutations/CoreCreateMutations";

const iconsToRender: string[] = ['user', 'lock', 'settings', 'credit-card', 'wallet', 'activity', 'alarm-check', 'alarm-clock', 'alarm-minus', 'alarm-plus', 'album', 'accessibility', 'anchor', 'apple', 'archive', 'archive-restore', 'arrow-down', 'arrow-up', 'arrow-left', 'arrow-right', 'arrow-right-from-line', 'arrow-right-to-line', 'arrow-left-from-line', 'arrow-left-to-line', 'badge', 'banana', 'bar-chart', 'bar-chart-3', 'battery-charging', 'at-sign', 'badge-alert', 'bell', 'fingerprint-pattern', 'heart-handshake', 'flag-off'];

export default function CreateVault({ disabled }: { disabled: boolean }) {
    const [selectedIcon, setSelectedIcon] = useState<string>();
    const [vaultName, setVaultName] = useState<string>("");
    const [vaultColor, setVaultColor] = useState<string>("");
    const [open, setOpen] = useState<boolean>(false);

    // ✅ Master password lives in local state — form input only
    const [masterPassword, setMasterPassword] = useState<string>("");
    const { mutate, isPending } = useCreateVault(vaultName, selectedIcon!, vaultColor, masterPassword, setMasterPassword, setOpen);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button disabled={disabled} variant="secondary" size="lg" className="p-5 w-full">{!disabled ? <>Create Vault <Plus size="16" /></> : <> Vault Limit Reached <X size="16" /></>}</Button>
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
                                onClick={() => setSelectedIcon(iconName)}
                            >
                                <RenderIcon name={iconName} size={32} />
                            </Button>
                        ))}
                    </div>
                </div>
                <div className="flex flex-col gap-3">
                    <Label htmlFor="vaultColor">Enter Vault Color</Label>
                    <Input id="vaultColor" placeholder="e.g. red, green, blue" value={vaultColor} onChange={(e) => setVaultColor(e.target.value)} />
                </div>
                <div className="flex flex-col gap-3">
                    <Label htmlFor="masterPassword">Enter Master Password</Label>
                    <Input type="password" id="masterPassword" placeholder="Enter your master password to create vault" value={masterPassword} onChange={(e) => setMasterPassword(e.target.value)} />
                </div>
                <DialogFooter className="font-geist">
                    <DialogClose className="text-md mr-1">Cancel</DialogClose>
                    <Button disabled={isPending || !vaultName || !selectedIcon || !vaultColor || !masterPassword} variant="default" size="lg" className="text-md font-bold" onClick={() => mutate()}>
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