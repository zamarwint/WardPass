"use client";

import { motion } from "motion/react"

import {
    Field,
    FieldDescription,
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

export default function SecurityPage() {
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
        <motion.div className="pt-60 px-10 py-5">
            <Field className="border border-border rounded-xl p-10">
                <FieldLegend>Unlock WardPass with:</FieldLegend>
                <FieldDescription>Set your preferred unlocking method.</FieldDescription>

                <FieldSeparator />

                <div className="flex items-center gap-3 mb-6 p-4 bg-muted/50 rounded-lg">
                    <LockKeyholeIcon className="w-5 h-5 text-primary" />
                    <div>
                        <p className="font-semibold">End-to-End Encryption Enabled</p>
                        <p className="text-sm text-muted-foreground">Your vault is secured using your login password. WardPass cannot access your data.</p>
                    </div>
                </div>

                <Field className="mb-6">
                    <FieldTitle>Auto Lock after:</FieldTitle>
                    <FieldDescription>Set your preferred auto lock time.</FieldDescription>
                    <Select onValueChange={(e) => setSelectedAutoLock(e)} value={displayAutoLock}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select preferred lock time." />
                        </SelectTrigger>
                        <SelectContent>
                            {autoLockOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value} className="cursor-pointer">
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </Field>

                <Field className="mb-4">
                    <FieldTitle>Hide vault after inactivity of:</FieldTitle>
                    <FieldDescription>Set the time it takes for the vault to automatically hide.</FieldDescription>
                    <Select onValueChange={(e) => setSelectedHiddenTabTimeout(e)} value={displayHiddenTab}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select preferred timeout period." />
                        </SelectTrigger>
                        <SelectContent>
                            {hiddenTabTimeoutOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value} className="cursor-pointer">
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </Field>

                <Field orientation="horizontal">
                    <Button
                        size="lg"
                        onClick={handleSave}
                        disabled={
                            displayAutoLock === autoLockTimeInMinutes.toString() &&
                            displayHiddenTab === hiddenTabTimeoutInMinutes.toString()
                        }
                    >
                        Save changes
                    </Button>
                </Field>
            </Field>
        </motion.div>
    )
}