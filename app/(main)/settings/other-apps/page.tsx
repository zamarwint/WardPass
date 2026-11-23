import {
    Field,
    FieldDescription,
    FieldTitle,
} from "@/components/ui/field"

import Link from "next/link"
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Other Apps | Settings | WardPass",
    robots: {
        googleBot: {
            index: false,
            follow: false
        }
    }
};

const otherApps = [
    {
        title: "WardPass Chrome Extension",
        description: "Auto fill your passwords in your Chromium browser! (Coming soon)",
        url: "/extension",
        comingSoon: true
    },
    {
        title: "Utilities Agent",
        description: "Get assistance with your daily tasks! (Coming soon)",
        url: "https://t.me/zutils_agent_bot",
        comingSoon: true
    },
    {
        title: "Portfolio",
        description: "The developer's portfolio. You can find out about me and my work here!",
        url: "https://zamarwint.xyz/",
        comingSoon: false
    },
    {
        title: "Reckon",
        description: "Investment and arithmetic calculator application.",
        url: "https://reckon-p.vercel.app/",
        comingSoon: false
    },
]

export default function OtherAppsPage() {
    return (
        <div className="p-10">
            <div className="pb-6 flex flex-col gap-2">
                <h1 className="text-2xl font-semibold">Other Apps by the ZWNT Company.</h1>
                <p className="text-sm text-muted-foreground">Check out our other apps!</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
                {otherApps.map((app, key) => (
                    <Field key={key} className="border border-border rounded-none p-10 max-w-full break-keep">
                        <FieldTitle>{app.title}</FieldTitle>
                        <FieldDescription>{app.description}</FieldDescription>
                        <Link href={app.comingSoon ? '/' : app.url} target="_blank" rel="noopener noreferrer" className="text-sm text-center flex items-center justify-start gap-2">
                            <Button disabled={app.comingSoon} variant={app.comingSoon ? "ghost" : "default"} size="lg" className="w-full flex justify-center items-center p-6 mt-4 rounded-none">
                                <span>{app.comingSoon ? "Coming soon" : "Visit app"}</span> <ExternalLink size={16} />
                            </Button>
                        </Link>
                    </Field>
                ))}
            </div>

        </div>
    )
}