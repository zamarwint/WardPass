"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { motion } from "motion/react"
import Link from "next/link";
import { usePathname } from "next/navigation";

const navigationLinks = [
    {
        label: "General",
        path: "/settings",
    },
    {
        label: "Account",
        path: "/settings/account",
    },
    {
        label: "Security",
        path: "/settings/security"
    },
    {
        label: "Import",
        path: "/settings/import"
    },
    {
        label: "Export",
        path: "/settings/export"
    },
    {
        label: "Support",
        path: "/contact"
    },
    {
        label: "Donate",
        path: "https://paypal.me/zamarwint"
    },
    {
        label: "Other Apps",
        path: "/settings/other-apps"
    },
];

export default function Navbar() {
    const pathName = usePathname();
    return (
        <motion.div className="flex flex-col bg-transparent backdrop-blur-xl fixed w-full h-fit px-10 pt-10">
            <div className="flex flex-col gap-5">
                <h1 className="text-2xl md:text-6xl font-bold font-geist text-primary">Settings</h1>
                <p className="text-xl text-muted-foreground">Manage your account settings.</p>
            </div>
            <motion.div className="flex items-center justify-start gap-4 pt-6">
                {navigationLinks.map((link, key) => (
                    <Link key={key} href={link.path}>
                        <Button variant="link" size="lg" className={pathName === link.path ?
                            "text-primary underline underline-offset-13" : "text-muted-foreground hover:text-primary underline-offset-13 transition-underline duration-300"}>
                            <p>{link.label}</p>
                        </Button>
                    </Link>
                ))}
            </motion.div>
            <Separator />
        </motion.div>
    )
}