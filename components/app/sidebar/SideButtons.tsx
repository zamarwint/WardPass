"use client";

import { cn } from "@/lib/utils";
import { RenderIcon } from "@/components/IconMap";
import { LockIcon, PencilIcon, TrashIcon, Vault } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useVaultStore } from "@/stores/vault";
import { VaultSummary } from "@/lib/types/VaultType";
import { useGetVaults } from "@/lib/queries/VaultQueries";
import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import Notifications from "./Notifications";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu";
import { useState } from "react";
import UpdateVault from "../vault-crud/UpdateVault";
import DeleteVault from "../vault-crud/DeleteVault";

export function SideLogo() {
    const router = useRouter();

    return (
        <SidebarMenuItem className="flex items-center justify-between text-primary cursor-pointer">
            <SidebarMenuButton
                className="text-xl tracking-tighter font-bold w-fit"
                onClick={() => router.push('/')}
            >WARDPASS</SidebarMenuButton>
            <div>
                <Notifications />
                <Tooltip>
                    <TooltipTrigger render={
                        <Button size="icon-lg" variant="ghost" onClick={() => router.push('/strongroom')}>
                            <Vault />
                        </Button>
                    }>
                    </TooltipTrigger>
                    <TooltipContent>All Vaults</TooltipContent>
                </Tooltip>
            </div>
        </SidebarMenuItem>
    )
}

export function VaultSideButton() {
    const vaultData = useGetVaults();
    const pathName = usePathname();
    const vaultLink = `/strongroom/`;
    const router = useRouter();
    const [openUpdateVault, setOpenUpdateVault] = useState(false);
    const [openDeleteVault, setOpenDeleteVault] = useState(false);

    return (
        <SidebarMenu>
            <SidebarGroup>
                <SidebarGroupLabel>Vaults</SidebarGroupLabel>

                {vaultData.data?.length === 0 ? (
                    <SidebarMenuItem className="w-full flex items-center justify-center text-muted-foreground text-xs">
                        <div>No Vaults.</div>
                    </SidebarMenuItem>
                ) : vaultData && vaultData.data?.map((vault: VaultSummary) => (
                    <SidebarMenuItem key={vault.id} onClick={() => router.push(vaultLink + vault.id)} className="size-full cursor-pointer">
                        <ContextMenu>
                            <ContextMenuTrigger render={
                                <SidebarMenuButton variant={pathName === (vaultLink + vault.id) ? 'highlight' : 'default'} className='size-full flex items-center justify-start text-center gap-2 p-5'>
                                    <RenderIcon name={vault.icon} size={16} color={vault.iconColor ? vault.iconColor : 'white'} />
                                    <span className="text-sm font-semibold">{vault.name}</span>
                                </SidebarMenuButton>
                            }>
                            </ContextMenuTrigger>
                            <ContextMenuContent>
                                <ContextMenuItem onClick={() => setOpenUpdateVault(prev => !prev)}>
                                    <PencilIcon size={20} className="mr-2" />
                                    <span>Update</span>
                                </ContextMenuItem>
                                <ContextMenuItem onClick={() => setOpenDeleteVault(prev => !prev)}>
                                    <TrashIcon size={20} className="mr-2" />
                                    <span>Delete</span>
                                </ContextMenuItem>
                            </ContextMenuContent>
                            <UpdateVault open={openUpdateVault} onOpenChange={setOpenUpdateVault} vault={vault} />
                            <DeleteVault open={openDeleteVault} onOpenChange={setOpenDeleteVault} vault={vault} />
                        </ContextMenu>
                    </SidebarMenuItem>
                ))}
            </SidebarGroup>
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