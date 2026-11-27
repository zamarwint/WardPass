import Link from "next/link";
import { Bot, Calculator, ExternalLink, Globe, LayoutGrid, Puzzle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SidebarTrigger } from "@/components/ui/sidebar";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Other Apps | Settings | WardPass",
    robots: {
        googleBot: {
            index: false,
            follow: false,
        },
    },
};

const otherApps = [
    {
        title: "WardPass Chrome Extension",
        description: "Auto-fill your passwords seamlessly right in your Chromium browser.",
        url: "/extension",
        comingSoon: true,
        icon: Puzzle,
        accent: "text-blue-500 bg-blue-500/10 border-blue-500/20",
    },
    {
        title: "Utilities Agent",
        description: "Get AI-powered assistance with your daily tasks and workflows on Telegram.",
        url: "https://t.me/zutils_agent_bot",
        comingSoon: true,
        icon: Bot,
        accent: "text-violet-500 bg-violet-500/10 border-violet-500/20",
    },
    {
        title: "Portfolio",
        description: "Explore the developer's portfolio, projects, and engineering work.",
        url: "https://zamarwint.xyz/",
        comingSoon: false,
        icon: Globe,
        accent: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
    },
    {
        title: "Reckon",
        description: "Modern investment, compound interest, and arithmetic calculator application.",
        url: "https://reckon-p.vercel.app/",
        comingSoon: false,
        icon: Calculator,
        accent: "text-amber-500 bg-amber-500/10 border-amber-500/20",
    },
];

export default function OtherApps() {
    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-8 py-6 sm:py-8 flex flex-col gap-6">
            {/* Top Bar */}
            <div className="flex items-center justify-between border-b border-border/40 pb-4">
                <div className="flex items-center gap-3">
                    <SidebarTrigger className="cursor-pointer" />
                    <div className="flex items-center gap-2">
                        <span className="size-2 rounded-full bg-primary" />
                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            ZWNT Ecosystem
                        </span>
                    </div>
                </div>
            </div>

            {/* Hero Header */}
            <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-br from-card/80 via-card/40 to-muted/20 p-6 shadow-xs">
                <div className="flex items-center gap-4">
                    <div className="size-12 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center shrink-0">
                        <LayoutGrid className="size-6" />
                    </div>
                    <div className="flex flex-col gap-1">
                        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                            Other Apps by ZWNT
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Discover companion tools and applications crafted by the WardPass developer.
                        </p>
                    </div>
                </div>
            </div>

            {/* Apps Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {otherApps.map((app) => {
                    const Icon = app.icon;
                    return (
                        <div
                            key={app.title}
                            className="group flex flex-col justify-between gap-5 rounded-2xl border border-border/50 bg-card/50 hover:bg-card hover:border-border/80 hover:shadow-md transition-all duration-200 p-6"
                        >
                            <div className="flex flex-col gap-3">
                                <div className="flex items-start justify-between gap-3">
                                    <div className={`size-11 rounded-xl border flex items-center justify-center shrink-0 ${app.accent}`}>
                                        <Icon className="size-5" />
                                    </div>
                                    <Badge
                                        variant={app.comingSoon ? "secondary" : "outline"}
                                        className="rounded-full text-[11px] font-medium px-2.5 py-0.5"
                                    >
                                        {app.comingSoon ? "Coming Soon" : "Live"}
                                    </Badge>
                                </div>

                                <div className="flex flex-col gap-1">
                                    <h2 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                                        {app.title}
                                    </h2>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        {app.description}
                                    </p>
                                </div>
                            </div>

                            {app.comingSoon ? (
                                <Button
                                    disabled
                                    variant="secondary"
                                    className="w-full h-10 rounded-xl font-semibold gap-2"
                                >
                                    <span>Coming Soon</span>
                                </Button>
                            ) : (
                                <Link
                                    href={app.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full"
                                >
                                    <Button
                                        variant="default"
                                        className="w-full h-10 rounded-xl font-semibold gap-2 cursor-pointer"
                                    >
                                        <span>Visit App</span>
                                        <ExternalLink className="size-4" />
                                    </Button>
                                </Link>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
