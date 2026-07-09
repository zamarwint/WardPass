"use client";

import { motion } from "motion/react";
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldSeparator, FieldSet, FieldTitle } from "@/components/ui/field";
import { SwitchDualIconLabelDemo } from "@/app/_components/themeChange";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button";

export default function GeneralSettingsPage() {
    return (
        <motion.div className="flex flex-col gap-10 items-start justify-start py-60 px-10">
            <Field className="flex flex-col gap-10 overflow-y-scroll">
                <FieldGroup>
                    <Field>
                        <FieldLabel className="text-xl">Language</FieldLabel>
                        <FieldDescription>Choose your preferred language.</FieldDescription>
                    </Field>

                    <Field className="w-2xs text-left">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button disabled variant="outline" size="lg">
                                    English (Coming soon)
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                    English
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    Spanish
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    French
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    Dutch
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </Field>
                </FieldGroup>
                <FieldSeparator />
                <FieldGroup>
                    <Field>
                        <FieldLabel className="text-xl">Change Theme</FieldLabel>
                        <FieldDescription>Switch between light, dark, and system themes.</FieldDescription>
                    </Field>

                    <Field className="w-fit">
                        <SwitchDualIconLabelDemo />
                    </Field>
                </FieldGroup>
            </Field>
        </motion.div>
    )
}