"use client";

import { motion } from "motion/react"

import {
    Field,
    FieldDescription,
    FieldLegend,
    FieldSeparator,
    FieldTitle,
} from "@/components/ui/field"

export default function SecurityPage() {
    return (
        <motion.div className="pt-60 px-10 py-5">
            <Field className="border border-border rounded-xl p-10">
                <FieldLegend>Sessions</FieldLegend>
                <FieldDescription>Manage your active sessions.</FieldDescription>
            </Field>
        </motion.div>
    )
}