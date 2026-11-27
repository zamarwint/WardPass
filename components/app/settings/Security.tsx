"use client";

import { Clock, EyeOff, LockKeyholeIcon, ShieldCheck } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { toast } from "sonner";
import { useSettingsStore } from "@/stores/settings";

const autoLockOptions = [
    { label: "1 minute", value: "1" },
    { label: "5 minutes", value: "5" },
    { label: "10 minutes", value: "10" },
    { label: "15 minutes", value: "15" },
    { label: "20 minutes", value: "20" },
    { label: "30 minutes", value: "30" },
    { label: "1 hour", value: "60" },
];

const hiddenTabTimeoutOptions = [
    { label: "1 minute", value: "1" },
    { label: "2 minutes", value: "2" },
    { label: "3 minutes", value: "3" },
    { label: "4 minutes", value: "4" },
    { label: "5 minutes", value: "5" },
    { label: "10 minutes", value: "10" },
    { label: "15 minutes", value: "15" },
    { label: "20 minutes", value: "20" },
    { label: "30 minutes", value: "30" },
    { label: "1 hour", value: "60" },
];

export default function Security() {
    const {
        autoLockTimeInMinutes,
        hiddenTabTimeoutInMinutes,
        setAutoLockTimeInMinutes,
        setHiddenTabTimeoutInMinutes,
    } = useSettingsStore();

    const [selectedAutoLock, setSelectedAutoLock] = useState<string | undefined>();
    const [selectedHiddenTabTimeout, setSelectedHiddenTabTimeout] = useState<string | undefined>();

    const displayAutoLock = selectedAutoLock ?? autoLockTimeInMinutes.toString();
    const displayHiddenTab = selectedHiddenTabTimeout ?? hiddenTabTimeoutInMinutes.toString();

    const hasChanges =
        displayAutoLock !== autoLockTimeInMinutes.toString() ||
        displayHiddenTab !== hiddenTabTimeoutInMinutes.toString();

    const handleSave = () => {
        setAutoLockTimeInMinutes(parseInt(displayAutoLock));
        setHiddenTabTimeoutInMinutes(parseInt(displayHiddenTab));
        setSelectedAutoLock(undefined);
        setSelectedHiddenTabTimeout(undefined);
        toast.success("Security settings updated successfully!");
    };

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-8 py-6 sm:py-8 flex flex-col gap-6">
            {/* Top Bar */}
            <div className="flex items-center justify-between border-b border-border/40 pb-4">
                <div className="flex items-center gap-3">
                    <SidebarTrigger className="cursor-pointer" />
                    <div className="flex items-center gap-2">
                        <span className="size-2 rounded-full bg-emerald-500" />
                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            Vault Protection
                        </span>
                    </div>
                </div>
            </div>

            {/* Hero Header */}
            <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-br from-card/80 via-card/40 to-muted/20 p-6 shadow-xs">
                <div className="flex items-center gap-4">
                    <div className="size-12 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center justify-center shrink-0">
                        <ShieldCheck className="size-6" />
                    </div>
                    <div className="flex flex-col gap-1">
                        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                            Security Settings
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Configure vault locking behavior, inactivity timeouts, and encryption preferences.
                        </p>
                    </div>
                </div>
            </div>

            {/* Encryption Status Banner Card */}
            <div className="rounded-2xl border border-emerald-500/25 bg-emerald-500/5 p-5 sm:p-6 flex items-start gap-4">
                <div className="size-10 rounded-xl bg-emerald-500/15 text-emerald-500 border border-emerald-500/25 flex items-center justify-center shrink-0">
                    <LockKeyholeIcon className="size-5" />
                </div>
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                        <h2 className="text-base font-bold text-foreground">End-to-End Encryption Enabled</h2>
                        <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                            AES-256-GCM
                        </span>
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                        Your strongroom is secured using your master login password and Argon2id key derivation.
                        WardPass cannot access or recover your decrypted data.
                    </p>
                </div>
            </div>

            {/* Timeout Configuration Card */}
            <div className="rounded-2xl border border-border/50 bg-card/50 p-5 sm:p-6 shadow-2xs flex flex-col gap-6">
                {/* Auto Lock */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-3.5">
                        <div className="size-9 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                            <Clock className="size-4" />
                        </div>
                        <div className="flex flex-col gap-0.5">
                            <span className="text-sm font-semibold text-foreground">Auto Lock Timer</span>
                            <span className="text-xs text-muted-foreground">
                                Automatically lock unlocked vaults after a period of inactivity.
                            </span>
                        </div>
                    </div>

                    <Select onValueChange={(e) => setSelectedAutoLock(e as string)} value={displayAutoLock}>
                        <SelectTrigger className="h-10 w-full sm:w-48 rounded-xl">
                            <SelectValue placeholder="Select lock time" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                            {autoLockOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value} className="cursor-pointer rounded-lg">
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="border-t border-border/40" />

                {/* Hide Vault Timeout */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-3.5">
                        <div className="size-9 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center justify-center shrink-0 mt-0.5">
                            <EyeOff className="size-4" />
                        </div>
                        <div className="flex flex-col gap-0.5">
                            <span className="text-sm font-semibold text-foreground">Hidden Tab Timeout</span>
                            <span className="text-xs text-muted-foreground">
                                Lock vaults when the browser tab stays hidden in the background.
                            </span>
                        </div>
                    </div>

                    <Select onValueChange={(e) => setSelectedHiddenTabTimeout(e as string)} value={displayHiddenTab}>
                        <SelectTrigger className="h-10 w-full sm:w-48 rounded-xl">
                            <SelectValue placeholder="Select timeout" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                            {hiddenTabTimeoutOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value} className="cursor-pointer rounded-lg">
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="border-t border-border/40 pt-2 flex justify-end">
                    <Button
                        onClick={handleSave}
                        className="h-10 px-6 rounded-xl font-semibold cursor-pointer w-full sm:w-auto"
                        disabled={!hasChanges}
                    >
                        Save Changes
                    </Button>
                </div>
            </div>
        </div>
    );
}
