"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { DynamicIcon, IconName } from "lucide-react/dynamic";
import { LockIcon } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useVaultStore } from "@/stores/vault";
import VaultDropdown from "./vault/VaultDropdown";
import { Vault } from "@/lib/types/VaultType";

export function VaultSideButton({ vault }: { vault: Vault }) {
    const pathName = usePathname();
    const vaultLink = `/user/vault/${vault.id}`;
    const [open, setOpen] = useState<boolean>(false);

    return (
        <div key={vault.id} className={cn("flex items-center justify-between w-full p-1", pathName.startsWith(vaultLink) ? "btn-primary" : "btn-ghost")}>
            <Link href={vaultLink} className="p-2 flex items-center justify-start gap-2 w-full">
                <DynamicIcon name={vault.icon as IconName} size={16} color={vault.iconColor || 'white'} />
                <span className="text-sm font-semibold">{vault.name}</span>
            </Link>
            <div className="flex items-center justify-end gap-2">
                <VaultDropdown open={open} onOpenChange={setOpen} vault={vault} />
            </div>
        </div>
    )
}

export function LockSideButton({ disabled = false }: { disabled?: boolean }) {
    const router = useRouter();

    const handleLock = () => {
        useVaultStore.getState().lockAll();
        router.push("/user/vault"); // Show the unlock modal
    };

    return (
        <Button disabled={disabled} variant={"ghost"} size="lg" className="w-full flex justify-start mb-2" onClick={handleLock}>
            <LockIcon className="w-4 h-4" />
            <span>Lock WardPass</span>
        </Button>
    )
}

export function LinkSideButton({ Icon, href, hrefExact = false, text, disabled = false, className }: { Icon: React.ReactNode, href: string, hrefExact: boolean, text: string, disabled?: boolean, className?: string }) {
    const pathName = usePathname();

    return (
        <Link href={href} className={cn("w-full", className)}>
            <Button disabled={disabled} variant={hrefExact ? pathName === href ? "default" : "ghost" : pathName.startsWith(href) ? "default" : "ghost"} size="lg" className="w-full flex justify-start">
                {Icon}
                {text}
            </Button>
        </Link>
    )
}