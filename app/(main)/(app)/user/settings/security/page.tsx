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

const autoLockOptions = [
    { label: "Immediately", value: "1" },
    { label: "1 minute", value: "60" },
    { label: "5 minutes", value: "300" },
    { label: "10 minutes", value: "600" },
    { label: "20 minutes", value: "1200" },
    { label: "30 minutes", value: "1800" },
    { label: "1 hour", value: "3600" },
]

export default function SecurityPage() {
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
                <Field>
                    <FieldTitle>Auto Lock after:</FieldTitle>
                    <FieldDescription>Set your preferred auto lock time.</FieldDescription>
                    <Select defaultValue={autoLockOptions[0].value}>
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
            </Field>
        </motion.div>
    )
}