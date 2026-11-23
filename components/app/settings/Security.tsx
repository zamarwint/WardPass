"use client";

import {
    Field,
    FieldContent,
    FieldDescription,
    FieldGroup,
    FieldLegend,
    FieldSeparator,
    FieldTitle,
} from "@/components/ui/field"

import { LockKeyholeIcon } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { Button } from "@/components/ui/button";
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
]

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
]

export default function Security() {
    const {
        autoLockTimeInMinutes,
        hiddenTabTimeoutInMinutes,
        setAutoLockTimeInMinutes,
        setHiddenTabTimeoutInMinutes
    } = useSettingsStore();

    const [selectedAutoLock, setSelectedAutoLock] = useState<string | undefined>();
    const [selectedHiddenTabTimeout, setSelectedHiddenTabTimeout] = useState<string | undefined>();

    const displayAutoLock = selectedAutoLock ?? autoLockTimeInMinutes.toString();
    const displayHiddenTab = selectedHiddenTabTimeout ?? hiddenTabTimeoutInMinutes.toString();

    const handleSave = () => {
        setAutoLockTimeInMinutes(parseInt(displayAutoLock));
        setHiddenTabTimeoutInMinutes(parseInt(displayHiddenTab));
        // Reset local selections so they track the store again
        setSelectedAutoLock(undefined);
        setSelectedHiddenTabTimeout(undefined);
        toast.success("Settings updated successfully!");
    };

    return (
        <FieldGroup className="rounded-none p-10">
            <Field>
                <FieldTitle className="text-2xl">Security</FieldTitle>
                <FieldDescription>Update your security settings.</FieldDescription>
            </Field>

            <FieldSeparator />

            <Field orientation="vertical" className="size-full">
                <FieldLegend>Preferred unlocking method</FieldLegend>
                <FieldDescription>Set your preferred unlocking method. Currently you can only unlock vaults using your login password.</FieldDescription>

                <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                    <LockKeyholeIcon className="size-5 text-primary" />
                    <div>
                        <p className="font-semibold">End-to-End Encryption Enabled</p>
                        <p className="text-sm text-muted-foreground">Your strongroom is secured using your login password. WardPass cannot access your data.</p>
                    </div>
                </div>
            </Field>

            <Field orientation="vertical" className="size-full">
                <FieldTitle>Auto Lock</FieldTitle>
                <FieldDescription>Set your preferred auto lock time.</FieldDescription>
                <FieldContent className="size-full">
                    <Select onValueChange={(e) => setSelectedAutoLock(e as string)} value={displayAutoLock}>
                        <SelectTrigger className="size-full py-5">
                            <SelectValue placeholder="Select preferred lock time." />
                        </SelectTrigger>
                        <SelectContent>
                            {autoLockOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value} className="cursor-pointer py-5">
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </FieldContent>
            </Field>

            <Field orientation="vertical" className="size-full">
                <FieldTitle>Hide vault after inactivity</FieldTitle>
                <FieldDescription>Set the time it takes for the vault to automatically hide.</FieldDescription>
                <FieldContent className="size-full">
                    <Select onValueChange={(e) => setSelectedHiddenTabTimeout(e as string)} value={displayHiddenTab}>
                        <SelectTrigger className="size-full py-5">
                            <SelectValue placeholder="Select preferred timeout period." />
                        </SelectTrigger>
                        <SelectContent>
                            {hiddenTabTimeoutOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value} className="cursor-pointer py-5">
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </FieldContent>
            </Field>

            <Field orientation="vertical">
                <Button
                    size="lg"
                    onClick={handleSave}
                    className="h-12 w-fit px-10"
                    disabled={
                        displayAutoLock === autoLockTimeInMinutes.toString() &&
                        displayHiddenTab === hiddenTabTimeoutInMinutes.toString()
                    }
                >
                    Save changes
                </Button>
            </Field>
        </FieldGroup>
    )
}