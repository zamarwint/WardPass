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
import { ColorWheel } from "./ColorWheel";
import { cn } from "@/lib/utils";

interface CreateVaultProps {
    disabled: boolean;
    className?: string;
    variant?: "default" | "secondary" | "outline" | "ghost";
    size?: "default" | "sm" | "lg" | "icon";
    label?: string;
}

export default function CreateVault({
    disabled,
    className,
    variant = "secondary",
    size = "lg",
    label,
}: CreateVaultProps) {
    const { resolvedTheme } = useTheme();

    const [selectedIcon, setSelectedIcon] = useState<string>("vault");
    const [vaultName, setVaultName] = useState<string>("");
    const [vaultColor, setVaultColor] = useState<string>("#3b82f6");
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
                <Button
                    disabled={disabled}
                    variant={variant}
                    size={size}
                    className={cn(
                        "cursor-pointer font-semibold gap-1.5 transition-all",
                        size === "lg" && !className && "p-5 w-full",
                        className
                    )}
                >
                    {!disabled ? (
                        <>
                            <span>{label || "Create Vault"}</span>
                            <Plus className="size-4 shrink-0" />
                        </>
                    ) : (
                        <>
                            <span>Limit Reached</span>
                            <X className="size-4 shrink-0" />
                        </>
                    )}
                </Button>
            }>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto no-scrollbar">
                <DialogHeader>
                    <DialogTitle className="font-bold text-xl">New Vault</DialogTitle>
                    <DialogDescription>
                        Create a new vault encrypted with your account password.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-3">
                    <Label htmlFor="vaultName">Vault Name</Label>
                    <Input id="vaultName" placeholder="e.g. Work, Personal, Finances" value={vaultName} onChange={(e) => setVaultName(e.target.value)} />
                </div>
                <div className="flex flex-col gap-3">
                    <Label htmlFor="vaultIcon">Vault Icon</Label>
                    <div className="flex flex-wrap justify-center gap-1.5 items-center p-0.75 rounded-xl bg-muted/30 border border-border/40">
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