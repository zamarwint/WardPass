"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { DynamicIcon, IconName } from "lucide-react/dynamic";
import { ChevronsLeft, LockIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useVaultStore } from "@/stores/vault";
import VaultDropdown from "./vault/VaultDropdown";
import { Vault } from "@/lib/types/VaultType";
import { SvgCircle } from "../vault/_components/SVG";

export function VaultSideButton({ vault, collapsed }: { vault: Vault, collapsed: boolean }) {
    const pathName = usePathname();
    const vaultLink = `/user/vault/${vault.id}`;
    const [open, setOpen] = useState<boolean>(false);
    const router = useRouter();

    return (
        <div className={cn(`w-full flex items-center justify-between gap-2 px-2 py-4 cursor-pointer ${pathName.startsWith(vaultLink) ? "btn-primary" : "btn-ghost"}`, collapsed ? "justify-center" : "justify-start")}>
            <div onClick={() => router.push(vaultLink)} className="flex items-center flex-1 gap-2 px-1">
                <SvgCircle size="w-8 h-8">
                    <DynamicIcon name={vault.icon as IconName} size={16} color={vault.iconColor || 'white'} />
                </SvgCircle>
                {!collapsed && <span className="text-sm font-semibold">{vault.name}</span>}
            </div>
            {!collapsed && (
                <div className="flex items-center">
                    <VaultDropdown open={open} onOpenChange={setOpen} vault={vault} />
                </div>
            )}
        </div>
    )
}

export function LockSideButton({ disabled = false, collapsed }: { disabled?: boolean, collapsed: boolean }) {
    const router = useRouter();

    const handleLock = () => {
        router.push("/user/vault");
        useVaultStore.getState().lockAll(); // Shows the unlock modal
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
    const router = useRouter();

    return (
        <div onClick={() => router.push(href)} className={cn("w-full", className)}>
            <Button disabled={disabled} variant={hrefExact ? pathName === href ? "default" : "ghost" : pathName.startsWith(href) ? "default" : "ghost"} size="lg" className={cn("w-full flex items-center", collapsed ? "justify-center" : "justify-start")}>
                {Icon}
                {!collapsed && <span className="text-sm font-semibold">{text}</span>}
            </Button>
        </div>
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