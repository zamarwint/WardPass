"use client";

import { motion } from "motion/react"

import {
    Field,
    FieldDescription,
    FieldLegend,
    FieldSeparator,
    FieldTitle,
} from "@/components/ui/field"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button";

import { LockKeyholeIcon } from "lucide-react";

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

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="lg">
                                10 minutes
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                                1 minute
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                5 minutes
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                10 minutes
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                20 minutes
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                1 hour
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </Field>
            </Field>
        </motion.div>
    )
}