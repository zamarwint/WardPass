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
        description: "WardPass Chrome Extension - Auto fill your passwords in your browser! (Coming soon)",
        url: "/extension"
    },
    {
        title: "WardPass Firefox Extension",
        description: "WardPass Firefox Extension - Auto fill your passwords in your browser! (Coming soon)",
        url: "/extension"
    },
    {
        title: "Reckon",
        description: "Investment and arithmetic calculators.",
        url: "https://reckon-p.netlify.app/"
    },
    {
        title: "Portfolio",
        description: "A professional portfolio.",
        url: "https://zamarwint.xyz/"
    }
]

export default function OtherAppsPage() {
    return (
        <motion.div className="pt-60 px-10 py-5">
            <div className="pb-6 flex flex-col gap-2">
                <h1 className="text-4xl font-semibold">Other Apps by the ZWNT Company.</h1>
                <p className="text-md text-muted-foreground">Check out our other apps!</p>
            </div>

            <motion.div className="flex flex-col gap-4">
                {otherApps.map((app, key) => (
                    <Field key={key} className="border border-border rounded-xl p-10 w-xl">
                        <FieldTitle>{app.title}</FieldTitle>
                        <FieldDescription>{app.description}</FieldDescription>
                        <Link href={app.url !== '/extension' ? app.url : '/'} target="_blank" rel="noopener noreferrer" className="text-sm text-center flex items-center justify-center gap-2">
                            <Button disabled={app.url === "/extension"} variant={app.url === "/extension" ? "ghost" : "default"} size="lg" className="w-full flex justify-start p-6 mt-4">
                                <span>{app.url === "/extension" ? "Coming soon" : "Visit app"}</span> <ExternalLink size={16} />
                            </Button>
                        </Link>
                    </Field>
                ))}
            </motion.div>

        </motion.div>
    )
}