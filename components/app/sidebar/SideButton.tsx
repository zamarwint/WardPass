"use client";

import { cn } from "@/lib/utils";
import { RenderIcon } from "@/components/IconMap";
import { LockIcon, ShieldUser, Vault } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useVaultStore } from "@/stores/vault";
import VaultDropdown from "../vault/VaultDropdown";
import { VaultSummary } from "@/lib/types/VaultType";
import { SvgCircle } from "@/components/app/vault/SVG";
import { useGetVaults } from "@/lib/queries/VaultQueries";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import Image from 'next/image'
import { useCheckAdminSession } from "@/lib/queries/SessionQueries";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import Notifications from "./Notifications";

export function SideLogo() {
    const router = useRouter();

    return (
        <SidebarMenuItem className="flex items-center justify-between text-primary font-geist cursor-pointer my-2">
            <div className="flex items-center justify-start gap-0.5" onClick={() => router.push('/')}>
                <Image src="/../../../icon.png" alt="logo" width={0} height={0} className="size-8" loading="eager" />
                <span className="text-xl tracking-tighter font-bold">WARDPASS</span>
            </div>
            <div>
                <Notifications />
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button size="icon-lg" variant="ghost" onClick={() => router.push('/strongroom')}>
                            <Vault />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>All Vaults</TooltipContent>
                </Tooltip>
            </div>
        </SidebarMenuItem>
    )
}

export function VaultSideButton() {
    const { data: vaults, isLoading: vaultsLoading, error: vaultsLoadingError } = useGetVaults();
    const pathName = usePathname();
    const vaultLink = `/strongroom/`;
    const router = useRouter();

    return (
        <SidebarMenu className="size-full px-3">
            {vaults?.map((vault: VaultSummary) => (
                <SidebarMenuItem key={vault.id} className={`w-full flex items-center justify-between gap-2 px-2 py-4 cursor-pointer ${pathName === (vaultLink + vault.id) ? "btn-primary justify-start" : "btn-ghost"}`}>
                    <div onClick={() => router.push(vaultLink + vault.id)} className="flex items-center flex-1 gap-2 px-1">
                        <SvgCircle size="w-8 h-8">
                            <RenderIcon name={vault.icon} size={16} color={vault.iconColor ? vault.iconColor : 'white'} />
                        </SvgCircle>
                        <span className="text-sm font-semibold">{vault.name}</span>
                    </div>
                    <div className="flex items-center">
                        <VaultDropdown vault={vault} />
                    </div>
                </SidebarMenuItem>
            ))}
        </SidebarMenu>
    )
}

export function LockSideButton({ disabled = false }: { disabled?: boolean }) {
    const router = useRouter();

    const handleLock = () => {
        router.push("/strongroom");
        useVaultStore.getState().lockAll(); // Shows the unlock modal
    };

    return (
        <SidebarMenuButton disabled={disabled} size="lg" className="w-full flex justify-start" onClick={handleLock}>
            <LockIcon size={16} />
            <span className="text-sm">Lock WardPass</span>
        </SidebarMenuButton>
    )
}

export function LinkSideButton({ Icon, href, hrefExact = false, text, disabled = false, className }: { Icon: React.ReactNode, href: string, hrefExact: boolean, text: string, disabled?: boolean, className?: string }) {
    const pathName = usePathname();
    const router = useRouter();

    return (
        <SidebarMenuButton onClick={() => router.push(href)} disabled={disabled} variant={hrefExact ? pathName === href ? "outline" : null : pathName.startsWith(href) ? "outline" : null} size="lg" className={cn("w-full flex items-center justify-start", className)}>
            {Icon}
            <span className="text-sm">{text}</span>
        </SidebarMenuButton>
    )
}

export function AdminButton({ disabled = false, className }: { disabled?: boolean, className?: string }) {
    const pathName = usePathname();
    const router = useRouter();
    const checkAdmin = useCheckAdminSession();

    return (
        <SidebarMenuButton onClick={() => router.push('/strongroom/admin')} disabled={disabled} size="lg" variant={pathName.includes('strongroom/admin') ? "outline" : null} className={cn("w-full", !checkAdmin ? "hidden" : "flex items-center justify-start", className)}>
            <ShieldUser />
            <span className="text-sm">Admin Panel</span>
        </SidebarMenuButton>
    )
}