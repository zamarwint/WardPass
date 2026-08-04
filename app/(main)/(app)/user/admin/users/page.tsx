"use client";

import { motion } from "motion/react"
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldSeparator, FieldTitle } from "@/components/ui/field";

export default function AccountPage() {
    return (
        <>
            <motion.div className="flex flex-col gap-10 items-start justify-start pt-60 px-10 py-5">
                <Field className="flex flex-col gap-10">
                    <FieldGroup>
                        <Field>
                            <FieldLabel className="text-xl">Users</FieldLabel>
                            <FieldDescription>Manage your users.</FieldDescription>
                        </Field>
                    </FieldGroup>
                </Field>
            </motion.div>
        </>
    )
}