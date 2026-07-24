"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { DynamicIcon, IconName } from "lucide-react/dynamic";
import { ChevronsLeft, LockIcon } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useVaultStore } from "@/stores/vault";
import VaultDropdown from "./vault/VaultDropdown";
import { Vault } from "@/lib/types/VaultType";

export function VaultSideButton({ vault, collapsed }: { vault: Vault, collapsed: boolean }) {
    const pathName = usePathname();
    const vaultLink = `/user/vault/${vault.id}`;
    const [open, setOpen] = useState<boolean>(false);

    return (
        <div key={vault.id} className={cn("flex items-center justify-between w-full p-1", pathName.startsWith(vaultLink) ? "btn-primary" : "btn-ghost")}>
            <Link href={vaultLink} className={cn("w-full p-2 flex items-center gap-2", collapsed ? "justify-center" : "justify-start")}>
                <DynamicIcon name={vault.icon as IconName} size={16} color={vault.iconColor || 'white'} />
                {!collapsed && <span className="text-sm font-semibold">{vault.name}</span>}
            </Link>
            {!collapsed && (
                <div className="flex items-center justify-end gap-2">
                    <VaultDropdown open={open} onOpenChange={setOpen} vault={vault} />
                </div>
            )}
        </div>
    )
}

export function LockSideButton({ disabled = false, collapsed }: { disabled?: boolean, collapsed: boolean }) {
    const router = useRouter();

    const handleLock = () => {
        useVaultStore.getState().lockAll();
        router.push("/user/vault"); // Show the unlock modal
    };

    return (
        <Button disabled={disabled} variant={"ghost"} size="lg" className={cn("w-full flex mb-2", collapsed ? "justify-center" : "justify-start")} onClick={handleLock}>
            <LockIcon size={16} />
            {!collapsed && <span className="text-sm font-semibold">Lock WardPass</span>}
        </Button>
    )
}

export function LinkSideButton({ Icon, href, hrefExact = false, text, disabled = false, className, collapsed }: { Icon: React.ReactNode, href: string, hrefExact: boolean, text: string, disabled?: boolean, className?: string, collapsed: boolean }) {
    const pathName = usePathname();

    return (
        <Link href={href} className={cn("w-full", className)}>
            <Button disabled={disabled} variant={hrefExact ? pathName === href ? "default" : "ghost" : pathName.startsWith(href) ? "default" : "ghost"} size="lg" className={cn("w-full flex items-center", collapsed ? "justify-center" : "justify-start")}>
                {Icon}
                {!collapsed && <span className="text-sm font-semibold">{text}</span>}
            </Button>
        </Link>
    )
}

export function CollapseSideButton({ collapsed, setIsCollapsed }: { collapsed: boolean, setIsCollapsed: (value: boolean) => void }) {
    return (
        <Button variant={"ghost"} size="lg" className={cn("w-full flex mb-2", collapsed ? "justify-center" : "justify-start")} onClick={() => setIsCollapsed(!collapsed)}>
            <ChevronsLeft className={cn("size-4", collapsed ? "rotate-180" : "")} />
            {!collapsed && <span>Collapse Sidebar</span>}
        </Button>
    )
}