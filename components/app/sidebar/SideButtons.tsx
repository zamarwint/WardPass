"use client";

import { useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ChevronLeft, ExternalLink, LayoutGrid, LockIcon, LucideIcon, Nfc, PencilIcon, Settings2, ShieldCheck, ShieldCog, ShieldUser, TrashIcon, Vault } from "lucide-react";

import { cn } from "@/lib/utils";
import { RenderIcon } from "@/components/IconMap";
import { useVaultStore } from "@/stores/vault";
import { VaultSummary } from "@/lib/types/VaultType";
import { useGetVaults } from "@/lib/queries/VaultQueries";
import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu";
import Notifications from "./Notifications";
import UpdateVault from "../vault-crud/UpdateVault";
import DeleteVault from "../vault-crud/DeleteVault";

const VAULT_BASE_PATH = "/strongroom/";

// MAIN SIDEBAR COMPONENTS
export function MainTopArea() {
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
                    <TooltipTrigger
                        render={
                            <Button size="icon-lg" variant="ghost" aria-label="All Vaults" onClick={() => router.push('/strongroom')}>
                                <Vault />
                            </Button>
                        }
                    />
                    <TooltipContent>All Vaults</TooltipContent>
                </Tooltip>
            </div>
        </SidebarMenuItem>
    )
}

export function VaultSideButton() {
    const { data: vaults, isPending, error } = useGetVaults();
    const pathName = usePathname();
    const router = useRouter();

    // ONE UPDATE DIALOG AND ONE DELETE DIALOG FOR THE WHOLE LIST (NOT ONE PER VAULT), PLUS THE VAULT EACH WAS OPENED FOR.
    // A SHARED `open` BOOLEAN WITH ONE DIALOG PER VAULT OPENED EVERY VAULT'S DIALOG AT ONCE, AND THE LAST ONE RENDERED WAS ON TOP.
    // THE VAULT IS KEPT AFTER THE DIALOG CLOSES SO IT CAN PLAY ITS EXIT ANIMATION.
    const [vaultToUpdate, setVaultToUpdate] = useState<VaultSummary | null>(null);
    const [updateOpen, setUpdateOpen] = useState(false);
    const [vaultToDelete, setVaultToDelete] = useState<VaultSummary | null>(null);
    const [deleteOpen, setDeleteOpen] = useState(false);

    const openUpdate = (vault: VaultSummary) => {
        setVaultToUpdate(vault);
        setUpdateOpen(true);
    };

    const openDelete = (vault: VaultSummary) => {
        setVaultToDelete(vault);
        setDeleteOpen(true);
    };

    return (
        <>
            <SidebarGroup>
                <SidebarGroupLabel>Vaults</SidebarGroupLabel>
                <SidebarMenu>
                    {isPending ? (
                        <SidebarMenuItem className="w-full flex items-center justify-center text-muted-foreground text-xs">
                            <div>Loading vaults...</div>
                        </SidebarMenuItem>
                    ) : error ? (
                        <SidebarMenuItem className="w-full flex items-center justify-center text-muted-foreground text-xs">
                            <div>Failed to load vaults.</div>
                        </SidebarMenuItem>
                    ) : !vaults || vaults.length === 0 ? (
                        <SidebarMenuItem className="w-full flex items-center justify-center text-muted-foreground text-xs">
                            <div>No Vaults.</div>
                        </SidebarMenuItem>
                    ) : (
                        vaults.map((vault: VaultSummary) => {
                            const href = VAULT_BASE_PATH + vault.id;
                            const isActive = pathName === href || pathName.startsWith(`${href}/`);

                            // THE CLICK HANDLER IS ON THE BUTTON, NOT THE <li>: THE MENU IS PORTALED BUT STILL BUBBLES REACT EVENTS
                            // TO ITS PARENTS, SO AN onClick ON THE <li> ALSO NAVIGATED WHEN YOU PICKED "Update" OR "Delete"
                            return (
                                <SidebarMenuItem key={vault.id} className="size-full cursor-pointer">
                                    <ContextMenu>
                                        <ContextMenuTrigger
                                            render={
                                                <SidebarMenuButton
                                                    variant={isActive ? 'highlight' : 'default'}
                                                    onClick={() => router.push(href)}
                                                    className='size-full flex items-center justify-start text-center gap-2 p-5'
                                                >
                                                    <RenderIcon name={vault.icon} size={16} color={vault.iconColor ? vault.iconColor : 'white'} />
                                                    <span className="text-sm font-semibold">{vault.name}</span>
                                                </SidebarMenuButton>
                                            }
                                        />
                                        <ContextMenuContent>
                                            <ContextMenuItem onClick={() => openUpdate(vault)}>
                                                <PencilIcon size={20} className="mr-2" />
                                                <span>Update</span>
                                            </ContextMenuItem>
                                            <ContextMenuItem onClick={() => openDelete(vault)}>
                                                <TrashIcon size={20} className="mr-2" />
                                                <span>Delete</span>
                                            </ContextMenuItem>
                                        </ContextMenuContent>
                                    </ContextMenu>
                                </SidebarMenuItem>
                            );
                        })
                    )}
                </SidebarMenu>
            </SidebarGroup>

            {/* THE DIALOGS LIVE OUTSIDE THE LIST, SO CLICKS INSIDE THEM CAN'T BUBBLE INTO A VAULT BUTTON */}
            {vaultToUpdate && (
                <UpdateVault open={updateOpen} onOpenChange={setUpdateOpen} vault={vaultToUpdate} />
            )}
            {vaultToDelete && (
                <DeleteVault open={deleteOpen} onOpenChange={setDeleteOpen} vault={vaultToDelete} />
            )}
        </>
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

// NAVLINKS TYPE
type NavLinks = {
    label: string,
    icon: LucideIcon,
    path: string
}

// ADMIN SIDEBAR COMPONENTS
export function AdminSideButton() {
    const pathName = usePathname();
    const router = useRouter();

    const navigationLinks: NavLinks[] = [
        {
            label: "Preferences",
            icon: ShieldCheck,
            path: "/admin",
        },
        {
            label: "User Management",
            icon: ShieldUser,
            path: "/admin/user-management",
        },
        {
            label: "Contact Super Admin / Owner",
            icon: Nfc,
            path: "https://zamarwint.xyz/#contact",
        }
    ];

    return (
        <SidebarMenuItem className="flex flex-col items-center gap-1">
            {navigationLinks.map((link, key) => (
                <SidebarMenuButton key={key}
                    variant={pathName === link.path ? 'highlight' : 'default'}
                    onClick={() => router.push(link.path)}
                    className='h-12 p-5'
                >
                    <link.icon className={cn("", pathName === link.path && "text-primary")} />
                    <span className={cn("font-bold", pathName === link.path && "text-primary")}>{link.label}</span>
                </SidebarMenuButton>
            ))}
        </SidebarMenuItem>
    )
}

// SETTINGS SIDEBAR COMPONENTS
export function SettingsSideButton() {
    const pathName = usePathname();
    const router = useRouter();

    const navigationLinks: NavLinks[] = [
        {
            label: "Preferences",
            icon: Settings2,
            path: "/settings",
        },
        {
            label: "Security",
            icon: ShieldCog,
            path: "/settings/security"
        },
        {
            label: "Other Apps",
            icon: LayoutGrid,
            path: "/settings/other-apps"
        },
        {
            label: "Donate",
            icon: ExternalLink,
            path: "#",
        },
        {
            label: "Contact Us",
            icon: ExternalLink,
            path: "/contact",
        },
    ];

    return (
        <SidebarMenuItem className="flex flex-col items-center gap-1">
            {navigationLinks.map((link, key) => (
                <SidebarMenuButton key={key}
                    variant={pathName === link.path ? 'highlight' : 'default'}
                    onClick={() => router.push(link.path)}
                    className='h-12 p-5'
                >
                    <link.icon className={cn("", pathName === link.path && "text-primary")} />
                    <span className={cn("font-bold", pathName === link.path && "text-primary")}>{link.label}</span>
                </SidebarMenuButton>
            ))}
        </SidebarMenuItem>
    )
}

// OTHER COMPONENTS
export function BackButtonTopArea() {
    const router = useRouter();

    return (
        <SidebarMenuItem className="flex items-center justify-center cursor-pointer">
            <SidebarMenuButton
                className="text-md tracking-tighter flex items-center justify-center font-semibold w-full h-12"
                onClick={() => router.push('/strongroom')}
            >
                <ChevronLeft />
                <span>Back to Strongroom</span>
            </SidebarMenuButton>
        </SidebarMenuItem>
    )
}

export function LinkSideButton({
    Icon,
    href,
    hrefExact = false,
    text,
    disabled = false,
    className,
}: {
    Icon: ReactNode;
    href: string;
    hrefExact?: boolean;
    text: string;
    disabled?: boolean;
    className?: string;
}) {
    const pathName = usePathname();
    const router = useRouter();

    // MATCH WHOLE PATH SEGMENTS: "/strongroom" SHOULD NOT ALSO HIGHLIGHT "/strongroom-settings"
    const isActive = hrefExact
        ? pathName === href
        : pathName === href || pathName.startsWith(href.endsWith("/") ? href : `${href}/`);

    return (
        <SidebarMenuButton onClick={() => router.push(href)} disabled={disabled} variant={isActive ? "outline" : null} size="lg" className={cn("w-full flex items-center justify-start", className)}>
            {Icon}
            <span className="text-sm">{text}</span>
        </SidebarMenuButton>
    )
}