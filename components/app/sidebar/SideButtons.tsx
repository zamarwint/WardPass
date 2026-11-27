"use client";

import { useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
    ChartNoAxesColumnIncreasing,
    ChevronLeft,
    ExternalLink,
    Heart,
    LayoutGrid,
    LockIcon,
    LucideIcon,
    MessageSquare,
    Nfc,
    PencilIcon,
    Settings2,
    Shield,
    ShieldCog,
    ShieldUser,
    TrashIcon,
    Vault,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { RenderIcon } from "@/components/IconMap";
import { useVaultStore } from "@/stores/vault";
import { VaultSummary } from "@/lib/types/VaultType";
import { useGetVaults } from "@/lib/queries/VaultQueries";
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from "@/components/ui/context-menu";
import Notifications from "./Notifications";
import UpdateVault from "../vault-crud/UpdateVault";
import DeleteVault from "../vault-crud/DeleteVault";

const VAULT_BASE_PATH = "/strongroom/";

// MAIN SIDEBAR COMPONENTS
export function MainTopArea() {
    const router = useRouter();

    return (
        <SidebarMenuItem className="flex items-center justify-between gap-2 px-1 py-0.5">
            <button
                type="button"
                onClick={() => router.push("/")}
                className="group flex items-center gap-2.5 rounded-xl px-1.5 py-1 text-left transition-colors hover:bg-sidebar-accent/60 cursor-pointer"
            >
                <div className="size-8 rounded-xl bg-primary/15 border border-primary/25 text-primary flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                    <Shield className="size-4" />
                </div>
                <div className="flex flex-col leading-none">
                    <span className="text-sm font-extrabold tracking-tight text-foreground">
                        WARDPASS
                    </span>
                    <span className="text-[10px] font-medium text-muted-foreground tracking-wider uppercase mt-0.5">
                        Strongroom
                    </span>
                </div>
            </button>

            <div className="flex items-center">
                <Notifications />
            </div>
        </SidebarMenuItem>
    );
}

export function HomeSideButton() {
    const router = useRouter();

    return (
        <SidebarGroup>
            <SidebarGroupLabel className="px-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                Home
            </SidebarGroupLabel>
            <Tooltip>
                <TooltipTrigger
                    render={
                        <SidebarMenuButton
                            aria-label="All Vaults"
                            onClick={() => router.push("/strongroom")}
                            className="group/lock h-9.5 w-full rounded-xl px-2.5 flex items-center justify-start gap-2.5 text-muted-foreground hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-500/10 transition-all duration-150 cursor-pointer"
                        >
                            <span className="size-6 rounded-lg bg-primary/10 text-primary border border-primary/20 flex items-center justify-center shrink-0 group-hover/lock:scale-105 transition-transform">
                                <Vault className="size-3.5" />
                            </span>
                            <span className="text-sm font-medium">Strongroom Home</span>
                        </SidebarMenuButton>
                    }
                />
                <TooltipContent>Visit Strongroom Home</TooltipContent>
            </Tooltip>
        </SidebarGroup>
    )
}

export function VaultSideButton() {
    const { data: vaults, isPending, error } = useGetVaults();
    const pathName = usePathname();
    const router = useRouter();

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
            <SidebarGroup className="px-2 py-2">
                <div className="flex items-center justify-between px-2 mb-1">
                    <SidebarGroupLabel className="px-0 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                        Vaults
                    </SidebarGroupLabel>
                    {vaults && vaults.length > 0 && (
                        <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded-md bg-muted/60 text-muted-foreground">
                            {vaults.length}
                        </span>
                    )}
                </div>

                <SidebarMenu className="gap-1">
                    {isPending ? (
                        <SidebarMenuItem className="w-full flex items-center justify-center py-4 text-muted-foreground text-xs">
                            <span>Loading vaults...</span>
                        </SidebarMenuItem>
                    ) : error ? (
                        <SidebarMenuItem className="w-full flex items-center justify-center py-4 text-destructive text-xs">
                            <span>Failed to load vaults.</span>
                        </SidebarMenuItem>
                    ) : !vaults || vaults.length === 0 ? (
                        <SidebarMenuItem className="w-full flex items-center justify-center py-4 text-muted-foreground text-xs">
                            <span>No Vaults yet.</span>
                        </SidebarMenuItem>
                    ) : (
                        vaults.map((vault: VaultSummary) => {
                            const href = VAULT_BASE_PATH + vault.id;
                            const isActive = pathName === href || pathName.startsWith(`${href}/`);
                            const accentColor = vault.iconColor || "#d4a843";

                            return (
                                <SidebarMenuItem key={vault.id} className="cursor-pointer">
                                    <ContextMenu>
                                        <ContextMenuTrigger
                                            render={
                                                <SidebarMenuButton
                                                    onClick={() => router.push(href)}
                                                    className={cn(
                                                        "relative h-10 w-full rounded-xl px-2.5 flex items-center justify-start gap-2.5 transition-all duration-150 cursor-pointer",
                                                        isActive
                                                            ? "bg-sidebar-accent/90 text-foreground font-semibold shadow-2xs ring-1 ring-border/50"
                                                            : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/50 font-medium"
                                                    )}
                                                >
                                                    {isActive && (
                                                        <span
                                                            className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 rounded-r-full"
                                                            style={{ backgroundColor: accentColor }}
                                                        />
                                                    )}
                                                    <span
                                                        className="size-6 rounded-lg flex items-center justify-center shrink-0 border transition-transform duration-150 group-hover/menu-button:scale-105"
                                                        style={{
                                                            backgroundColor: `${accentColor}1A`,
                                                            borderColor: `${accentColor}35`,
                                                        }}
                                                    >
                                                        <RenderIcon
                                                            name={vault.icon}
                                                            size={14}
                                                            color={accentColor}
                                                        />
                                                    </span>
                                                    <span className="text-sm truncate">{vault.name}</span>
                                                </SidebarMenuButton>
                                            }
                                        />
                                        <ContextMenuContent className="w-40 rounded-xl">
                                            <ContextMenuItem
                                                onClick={() => openUpdate(vault)}
                                                className="cursor-pointer rounded-lg"
                                            >
                                                <PencilIcon size={16} className="mr-2" />
                                                <span>Update</span>
                                            </ContextMenuItem>
                                            <ContextMenuItem
                                                onClick={() => openDelete(vault)}
                                                className="cursor-pointer rounded-lg text-destructive focus:text-destructive"
                                            >
                                                <TrashIcon size={16} className="mr-2" />
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

            {vaultToUpdate && (
                <UpdateVault open={updateOpen} onOpenChange={setUpdateOpen} vault={vaultToUpdate} />
            )}
            {vaultToDelete && (
                <DeleteVault open={deleteOpen} onOpenChange={setDeleteOpen} vault={vaultToDelete} />
            )}
        </>
    );
}

export function LockSideButton({ disabled = false }: { disabled?: boolean }) {
    const router = useRouter();

    const handleLock = () => {
        router.push("/strongroom");
        useVaultStore.getState().lockAll();
    };

    return (
        <SidebarMenuItem>
            <SidebarMenuButton
                disabled={disabled}
                onClick={handleLock}
                className="group/lock h-9.5 w-full rounded-xl px-2.5 flex items-center justify-start gap-2.5 text-muted-foreground hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-500/10 transition-all duration-150 cursor-pointer"
            >
                <span className="size-6 rounded-lg bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center justify-center shrink-0 group-hover/lock:scale-105 transition-transform">
                    <LockIcon className="size-3.5" />
                </span>
                <span className="text-sm font-medium">Lock WardPass</span>
            </SidebarMenuButton>
        </SidebarMenuItem>
    );
}

// NAVLINKS TYPE
type NavLinks = {
    label: string;
    icon: LucideIcon;
    path: string;
    external?: boolean;
};

// ADMIN SIDEBAR COMPONENTS
export function AdminSideButton() {
    const pathName = usePathname();
    const router = useRouter();

    const navigationLinks: NavLinks[] = [
        {
            label: "Analytics",
            icon: ChartNoAxesColumnIncreasing,
            path: "/admin",
        },
        {
            label: "User Management",
            icon: ShieldUser,
            path: "/admin/user-management",
        },
        {
            label: "Contact Super Admin",
            icon: Nfc,
            path: "https://zamarwint.xyz/#contact",
            external: true,
        },
    ];

    return (
        <SidebarMenu className="gap-1">
            {navigationLinks.map((link) => {
                const isActive = pathName === link.path;
                return (
                    <SidebarMenuItem key={link.path}>
                        <SidebarMenuButton
                            onClick={() => {
                                if (link.external) {
                                    window.open(link.path, "_blank", "noopener,noreferrer");
                                } else {
                                    router.push(link.path);
                                }
                            }}
                            className={cn(
                                "relative h-9.5 w-full rounded-xl px-2.5 flex items-center justify-between gap-2.5 transition-all duration-150 cursor-pointer",
                                isActive
                                    ? "bg-sidebar-accent/90 text-foreground font-semibold shadow-2xs ring-1 ring-border/50"
                                    : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/50 font-medium"
                            )}
                        >
                            {isActive && (
                                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 rounded-r-full bg-primary" />
                            )}
                            <div className="flex items-center gap-2.5 min-w-0">
                                <link.icon
                                    className={cn(
                                        "size-4 shrink-0 transition-colors",
                                        isActive ? "text-primary" : "text-muted-foreground"
                                    )}
                                />
                                <span className="text-sm truncate">{link.label}</span>
                            </div>
                            {link.external && (
                                <ExternalLink className="size-3.5 text-muted-foreground/60 shrink-0" />
                            )}
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                );
            })}
        </SidebarMenu>
    );
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
            path: "/settings/security",
        },
        {
            label: "Other Apps",
            icon: LayoutGrid,
            path: "/settings/other-apps",
        },
        {
            label: "Donate",
            icon: Heart,
            path: "#",
        },
        {
            label: "Contact Us",
            icon: MessageSquare,
            path: "/contact",
        },
    ];

    return (
        <SidebarMenu className="gap-1">
            {navigationLinks.map((link) => {
                const isActive = pathName === link.path;
                return (
                    <SidebarMenuItem key={link.label}>
                        <SidebarMenuButton
                            onClick={() => {
                                if (link.path !== "#") {
                                    router.push(link.path);
                                }
                            }}
                            className={cn(
                                "relative h-9.5 w-full rounded-xl px-2.5 flex items-center justify-between gap-2.5 transition-all duration-150 cursor-pointer",
                                isActive
                                    ? "bg-sidebar-accent/90 text-foreground font-semibold shadow-2xs ring-1 ring-border/50"
                                    : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/50 font-medium"
                            )}
                        >
                            {isActive && (
                                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 rounded-r-full bg-primary" />
                            )}
                            <div className="flex items-center gap-2.5 min-w-0">
                                <link.icon
                                    className={cn(
                                        "size-4 shrink-0 transition-colors",
                                        isActive ? "text-primary" : "text-muted-foreground"
                                    )}
                                />
                                <span className="text-sm truncate">{link.label}</span>
                            </div>
                            {(link.path === "/contact" || link.path === "#") && (
                                <ExternalLink className="size-3.5 text-muted-foreground/60 shrink-0" />
                            )}
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                );
            })}
        </SidebarMenu>
    );
}

// OTHER COMPONENTS
export function BackButtonTopArea({ title }: { title?: string }) {
    const router = useRouter();

    return (
        <SidebarMenuItem className="flex flex-col gap-2 px-1 py-0.5">
            <button
                type="button"
                onClick={() => router.push("/strongroom")}
                className="group flex items-center gap-2 h-9 w-full rounded-xl px-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/60 transition-all cursor-pointer"
            >
                <ChevronLeft className="size-4 shrink-0 transition-transform duration-150 group-hover:-translate-x-0.5" />
                <span>Back to Strongroom</span>
            </button>
            {title && (
                <div className="px-2.5 pb-1">
                    <span className="text-base font-bold tracking-tight text-foreground">
                        {title}
                    </span>
                </div>
            )}
        </SidebarMenuItem>
    );
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

    const isActive = hrefExact
        ? pathName === href
        : pathName === href || pathName.startsWith(href.endsWith("/") ? href : `${href}/`);

    return (
        <SidebarMenuItem>
            <SidebarMenuButton
                onClick={() => router.push(href)}
                disabled={disabled}
                className={cn(
                    "relative h-9.5 w-full rounded-xl px-2.5 flex items-center justify-start gap-2.5 transition-all duration-150 cursor-pointer",
                    isActive
                        ? "bg-sidebar-accent/90 text-foreground font-semibold shadow-2xs ring-1 ring-border/50"
                        : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/50 font-medium",
                    className
                )}
            >
                {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 rounded-r-full bg-primary" />
                )}
                <span className={cn("shrink-0 [&>svg]:size-4", isActive ? "text-primary" : "text-muted-foreground")}>
                    {Icon}
                </span>
                <span className="text-sm truncate">{text}</span>
            </SidebarMenuButton>
        </SidebarMenuItem>
    );
}
