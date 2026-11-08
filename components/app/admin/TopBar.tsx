"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ExternalLink } from "lucide-react";
import { motion } from "motion/react"
import Link from "next/link";
import { usePathname } from "next/navigation";

const navigationLinks = [
    {
        label: "General",
        path: "/strongroom/admin",
    },
    {
        label: "User Management",
        path: "/strongroom/admin/user-management",
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
        <motion.div className="flex flex-col bg-background fixed w-full h-fit px-10 pt-10">
            <div className="flex flex-col gap-5">
                <h1 className="text-2xl md:text-6xl font-bold text-primary">Admin Dashboard</h1>
                <p className="text-xl text-muted-foreground">Manage users and sessions.</p>
            </div>
            <motion.div className="flex items-center justify-start gap-4 pt-6">
                {navigationLinks.map((link, key) => (
                    <Link key={key} href={link.path} target={link.isExternal ? "_blank" : "_self"} rel={link.isExternal ? "noopener noreferrer" : undefined}>
                        <Button variant="link" size="lg" className={cn("text-muted-foreground hover:text-primary underline-offset-10 transition-underline duration-300", pathName === link.path && "text-primary underline")}>
                            <p>{link.label}</p>
                            {link.isExternal && <ExternalLink className="size-4" />}
                        </Button>
                    </Link>
                ))}
            </motion.div>
        </motion.div>
    )
}