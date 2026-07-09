"use client";

import { motion } from "motion/react"

import {
    Field,
    FieldContent,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
    FieldLegend,
    FieldSeparator,
    FieldSet,
    FieldTitle,
} from "@/components/ui/field"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button";

import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useState } from "react";

export default function SecurityPage() {
    const [selectedValue, setSelectedValue] = useState<string>("option-two");

    return (
        <motion.div className="pt-60 px-10 py-5">
            <Field className="border border-border rounded-xl p-10">
                <FieldLegend>Unlock WardPass with:</FieldLegend>
                <FieldDescription>Set your preferred unlocking method.</FieldDescription>

                <FieldSeparator />

                <FieldSet>
                    <FieldGroup>
                        <RadioGroup defaultValue={selectedValue} onValueChange={setSelectedValue}>
                            <div className="flex items-center gap-3">
                                <RadioGroupItem value="option-one" id="option-one" />
                                <Label htmlFor="option-one">None</Label>
                            </div>
                            <div className="flex items-center gap-3">
                                <RadioGroupItem value="option-two" id="option-two" />
                                <Label htmlFor="option-two">Unlock with Master Password</Label>
                            </div>
                        </RadioGroup>
                        <FieldSeparator />
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
                    </FieldGroup>
                </FieldSet>
            </Field>
        </motion.div>
    )
}