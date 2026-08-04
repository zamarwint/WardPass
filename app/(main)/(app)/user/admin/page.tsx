"use client";

import { motion } from "motion/react";
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldSeparator } from "@/components/ui/field";

export default function GeneralSettingsPage() {
    return (
        <motion.div className="flex flex-col gap-10 items-start justify-start py-60 px-10">
            <Field className="flex flex-col gap-10">
                <FieldGroup>
                    <Field>
                        <FieldLabel className="text-xl">Current Users</FieldLabel>
                        <FieldDescription>See logged in users.</FieldDescription>
                    </Field>
                </FieldGroup>
            </Field>
        </motion.div>
    )
}