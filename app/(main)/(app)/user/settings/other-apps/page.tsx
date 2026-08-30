"use client";

import { motion } from "motion/react"

import {
    Field,
    FieldDescription,
    FieldTitle,
} from "@/components/ui/field"

import Link from "next/link"
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

const otherApps = [
    {
        title: "WardPass Chrome Extension",
        description: "Auto fill your passwords in your Chromium browser! (Coming soon)",
        url: "/extension",
        comingSoon: true
    },
    {
        title: "WardPass Firefox Extension",
        description: "Auto fill your passwords in your Firefox browser! (Coming soon)",
        url: "/extension",
        comingSoon: true
    },
    {
        title: "Rite",
        description: "A professional writing platform. Coming soon.",
        url: "https://rite.netlify.app/",
        comingSoon: true
    },
    {
        title: "Portfolio",
        description: "A professional portfolio.",
        url: "https://zamarwint.xyz/",
        comingSoon: false
    },
    {
        title: "Reckon",
        description: "Investment and arithmetic calculators.",
        url: "https://reckon-p.netlify.app/",
        comingSoon: false
    },
]

export default function OtherAppsPage() {
    return (
        <motion.div className="pt-60 px-10 py-5">
            <div className="pb-6 flex flex-col gap-2">
                <h1 className="text-2xl font-semibold">Other Apps by the ZWNT Company.</h1>
                <p className="text-sm text-muted-foreground">Check out our other apps!</p>
            </div>

            <motion.div className="grid grid-cols-2 gap-4">
                {otherApps.map((app, key) => (
                    <Field key={key} className="border border-border rounded-xl p-10 max-w-full break-keep">
                        <FieldTitle>{app.title}</FieldTitle>
                        <FieldDescription>{app.description}</FieldDescription>
                        <Link href={app.comingSoon ? '/' : app.url} target="_blank" rel="noopener noreferrer" className="text-sm text-center flex items-center justify-start gap-2">
                            <Button disabled={app.comingSoon} variant={app.comingSoon ? "ghost" : "default"} size="lg" className="w-full flex justify-center items-center p-6 mt-4">
                                <span>{app.comingSoon ? "Coming soon" : "Visit app"}</span> <ExternalLink size={16} />
                            </Button>
                        </Link>
                    </Field>
                ))}
            </motion.div>

        </motion.div>
    )
}