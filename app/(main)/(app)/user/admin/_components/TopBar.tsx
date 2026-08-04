"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ExternalLink } from "lucide-react";
import { motion } from "motion/react"
import Link from "next/link";
import { usePathname } from "next/navigation";

const navigationLinks = [
    {
        label: "General",
        path: "/user/admin",
    },
    {
        label: "Users",
        path: "/user/admin/users",
    },
    {
        label: "Sessions",
        path: "/user/admin/sessions"
    },
    {
        label: "Impersonation",
        path: "/user/admin/impersonation"
    },
    {
        label: "Contact Super Admin / Owner",
        path: "https://zamarwint.xyz/#contact",
        isExternal: true
    }
];

export default function TopBar() {
    const pathName = usePathname();
    return (
        <motion.div className="flex flex-col bg-background fixed w-full h-fit px-10 pt-10 z-50">
            <div className="flex flex-col gap-5">
                <h1 className="text-2xl md:text-6xl font-bold font-geist text-primary">Admin Dashboard</h1>
                <p className="text-xl text-muted-foreground">Manage users and sessions.</p>
            </div>
            <motion.div className="flex items-center justify-start gap-4 pt-6">
                {navigationLinks.map((link, key) => (
                    <Link key={key} href={link.path} target={link.isExternal ? "_blank" : "_self"} rel={link.isExternal ? "noopener noreferrer" : undefined}>
                        <Button variant="link" size="lg" className={pathName === link.path ?
                            "text-primary underline underline-offset-13" : "text-muted-foreground hover:text-primary underline-offset-13 transition-underline duration-300"}>
                            <p>{link.label}</p>
                            {link.isExternal && <ExternalLink className="size-4" />}
                        </Button>
                    </Link>
                ))}
            </motion.div>
            <Separator />
        </motion.div>
    )
}