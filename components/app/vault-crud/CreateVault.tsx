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

import { Button } from "@/components/ui/button";
import { Plus, X, Loader2Icon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { IconMap, RenderIcon } from "@/components/IconMap";
import { useCreateVault } from "@/lib/mutations/CoreCreateMutations";
import { useVaultStore } from "@/stores/vault";
import { useTheme } from "next-themes";

export default function CreateVault({ disabled }: { disabled: boolean }) {
    const { resolvedTheme } = useTheme();

    const [selectedIcon, setSelectedIcon] = useState<string>();
    const [vaultName, setVaultName] = useState<string>("");
    const [vaultColor, setVaultColor] = useState<string>("");
    const [open, setOpen] = useState<boolean>(false);

    const storePassword = useVaultStore((state) => state.masterPassword);
    const [passwordInput, setPasswordInput] = useState<string>("");
    const effectivePassword = storePassword || passwordInput;

    const { mutate, isPending } = useCreateVault(
        vaultName,
        selectedIcon!,
        vaultColor,
        effectivePassword,
        setPasswordInput,
        setOpen
    );

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger render={
                <Button disabled={disabled} variant="secondary" size="lg" className="p-5 w-full">{!disabled ? <>Create Vault <Plus size="16" /></> : <> Vault Limit Reached <X size="16" /></>}</Button>
            }>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="font-bold">New Vault</DialogTitle>
                    <DialogDescription>
                        Create a new vault encrypted with your account password.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-3">
                    <Label htmlFor="vaultName">Enter Vault Name</Label>
                    <Input id="vaultName" placeholder="e.g. Work, Personal, etc." value={vaultName} onChange={(e) => setVaultName(e.target.value)} />
                </div>
                <div className="flex flex-col gap-3">
                    <Label htmlFor="vaultIcon">Choose an icon</Label>
                    <div className="flex flex-wrap">
                        {Object.keys(IconMap).map((iconName) => (
                            <Button
                                variant={selectedIcon === iconName ? "default" : "ghost"}
                                size="lg"
                                className="w-fit flex justify-between text-lg font-bold"
                                key={iconName}
                                onClick={() => setSelectedIcon(iconName)}
                            >
                                <RenderIcon name={iconName} size={32} color={resolvedTheme === 'light' ? (selectedIcon === iconName ? 'white' : 'black') : (selectedIcon === iconName ? 'black' : 'white')} />
                            </Button>
                        ))}
                    </div>
                </div>
                <div className="flex flex-col gap-3">
                    <Label htmlFor="vaultColor">Enter Vault Color</Label>
                    <Input id="vaultColor" placeholder="e.g. red, green, blue" value={vaultColor} onChange={(e) => setVaultColor(e.target.value)} />
                </div>
                {!storePassword ? (
                    <div className="flex flex-col gap-3">
                        <Label htmlFor="accountPassword">Enter Account Password</Label>
                        <Input
                            type="password"
                            id="accountPassword"
                            placeholder="Enter your account password"
                            value={passwordInput}
                            onChange={(e) => setPasswordInput(e.target.value)}
                        />
                    </div>
                ) : (
                    <p className="text-xs text-muted-foreground">
                        This vault will be encrypted using your active account password.
                    </p>
                )}
                <DialogFooter>
                    <DialogClose className="text-md mr-1">Cancel</DialogClose>
                    <Button disabled={isPending || !vaultName || !selectedIcon || !vaultColor || !effectivePassword} variant="default" size="lg" className="text-md font-bold" onClick={() => mutate()}>
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