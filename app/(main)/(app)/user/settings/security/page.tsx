"use client";

import { motion } from "motion/react"

import {
    Field,
    FieldDescription,
    FieldLegend,
    FieldSeparator,
    FieldTitle,
} from "@/components/ui/field"

import { Loader2Icon, LockKeyholeIcon } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery } from "@tanstack/react-query";
import updateSettings from "@/app/actions/settings/updateSettings";
import { toast } from "sonner";
import getSettings from "@/app/actions/settings/getSettings";

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
    const { data: autoLockData } = useQuery({
        queryKey: ["settings", "autoLock"],
        queryFn: () => getSettings()
    })

    const { data: hiddenTabTimeoutData } = useQuery({
        queryKey: ["settings", "hiddenTabTimeout"],
        queryFn: () => getSettings()
    })

    const [selectedAutoLock, setSelectedAutoLock] = useState(autoLockData?.autoLockTimeInMinutes.toString());
    const [selectedHiddenTabTimeout, setSelectedHiddenTabTimeout] = useState(hiddenTabTimeoutData?.hiddenTabTimeoutInMinutes.toString());

    const { mutate, isPending } = useMutation({
        mutationFn: () => updateSettings(parseInt(selectedAutoLock!), parseInt(selectedHiddenTabTimeout!)),
        onMutate: () => {
            toast.loading("Saving settings...");
        },
        onSuccess: () => {
            toast.dismiss();
            toast.success("Settings updated successfully!");
        },
        onError: (error) => {
            toast.dismiss();
            toast.error("Failed to update settings." + error.message);
        }
    })

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
                    <Select defaultValue={autoLockData?.autoLockTimeInMinutes?.toString()} onValueChange={(e) => setSelectedAutoLock(e)} value={selectedAutoLock}>
                        <SelectTrigger disabled>
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
                    <Select defaultValue={hiddenTabTimeoutData?.hiddenTabTimeoutInMinutes?.toString()} onValueChange={(e) => setSelectedHiddenTabTimeout(e)} value={selectedHiddenTabTimeout}>
                        <SelectTrigger disabled>
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
                        onClick={() => mutate()}
                        disabled
                    // disabled={isPending || !autoLockData || !hiddenTabTimeoutData || (autoLockData.autoLockTimeInMinutes.toString() === selectedAutoLock && hiddenTabTimeoutData.hiddenTabTimeoutInMinutes.toString() === selectedHiddenTabTimeout)}
                    >
                        {isPending ? (
                            <>
                                <Loader2Icon className="size-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            "Save changes (Coming soon)"
                        )}
                    </Button>
                </Field>
            </Field>
        </motion.div>
    )
}