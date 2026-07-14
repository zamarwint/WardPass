"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { EllipsisVertical } from "lucide-react";
import { DynamicIcon, IconName } from "lucide-react/dynamic";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function VaultSideButton({ vault }: { vault: { id: string, name: string, slug: string, icon: string, iconColor: string | null } }) {
    const pathName = usePathname();
    const vaultLink = `/user/vault/${vault.id}`;

    return (
        <div key={vault.id} className="w-full flex items-center justify-between gap-2">
            <Button size="lg" variant={pathName.startsWith(vaultLink) ? "default" : "ghost"} className="flex items-center justify-between p-5 w-full">
                <Link href={vaultLink} className="w-full">
                    <span className="flex items-center justify-start gap-2">
                        <DynamicIcon name={vault.icon as IconName} size={32} color={vault.iconColor || 'white'} />
                        <span className="ml-2 text-md font-semibold">{vault.name}</span>
                    </span>
                </Link>
                <EllipsisVertical size={32} className="justify-end" />
            </Button>
        </div>
    )
}

export function SideButton({ Icon, href, text, disabled = false, className }: { Icon: React.ReactNode, href: string, text: string, disabled?: boolean, className?: string }) {
    const pathName = usePathname();

    return (
        <Link href={href} className={cn("w-full", className)}>
            <Button disabled={disabled} variant={pathName.startsWith(href) ? "default" : "ghost"} size="lg" className="w-full flex justify-start">
                {Icon}
                {text}
            </Button>
        </Link>
    )
}