"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
    ShieldCheck,
    Lock,
    FolderSync,
    Trash2,
    MoreVertical,
    Pencil,
    Plus,
    Search,
    ArrowRight,
    Gamepad2,
    Database,
    X,
} from "lucide-react";
import { RenderIcon } from "@/components/IconMap";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { CustomLoadingState } from "@/components/LoadingStates";
import CreateVault from "@/components/app/vault-crud/CreateVault";
import UpdateVault from "@/components/app/vault-crud/UpdateVault";
import DeleteVault from "@/components/app/vault-crud/DeleteVault";
import { useGetVaults } from "@/lib/queries/VaultQueries";
import { useGetSession } from "@/lib/queries/SessionQueries";
import { VaultSummary } from "@/lib/types/VaultType";
import { cn } from "@/lib/utils";

export default function VaultSelectionClient() {
    const { data: vaults, isPending, error } = useGetVaults();
    const user = useGetSession();
    const vaultList = vaults ?? [];
    const vaultLimit = (user.data?.user as any)?.vaultLimit ?? 5;
    const canCreateVault = vaultList.length < vaultLimit;

    // Search filter state for vaults
    const [searchQuery, setSearchQuery] = useState("");

    // Modal state for editing and deleting vaults directly from cards
    const [vaultToUpdate, setVaultToUpdate] = useState<VaultSummary | null>(null);
    const [vaultToDelete, setVaultToDelete] = useState<{ id: string; name: string; slug: string; icon: string; iconColor: string | null } | null>(null);

    const filteredVaults = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();
        if (!query) return vaultList;
        return vaultList.filter((v) => v.name.toLowerCase().includes(query));
    }, [vaultList, searchQuery]);

    const userName = user.data?.user?.name || "Member";

    return (
        <div className="size-full overflow-y-auto bg-background selection:bg-primary/20">
            {/* Direct Vault Modals */}
            {vaultToUpdate && (
                <UpdateVault
                    open={Boolean(vaultToUpdate)}
                    onOpenChange={(open) => !open && setVaultToUpdate(null)}
                    vault={vaultToUpdate}
                />
            )}
            {vaultToDelete && (
                <DeleteVault
                    open={Boolean(vaultToDelete)}
                    onOpenChange={(open) => !open && setVaultToDelete(null)}
                    vault={vaultToDelete}
                />
            )}

            {/* Dashboard Container */}
            <div className="max-w-6xl mx-auto px-4 sm:px-8 py-6 sm:py-8 flex flex-col gap-7">
                {/* Top Action & Navigation Header */}
                <div className="flex items-center justify-between border-b border-border/40 pb-4">
                    <div className="flex items-center gap-3">
                        <SidebarTrigger className="cursor-pointer" />
                        <div className="flex items-center gap-2">
                            <span className="relative flex size-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full size-2.5 bg-emerald-500"></span>
                            </span>
                            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden sm:inline-block">
                                Zero-Knowledge Strongroom
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Badge variant="outline" className="px-2.5 py-1 text-xs font-mono font-medium border-border/60 bg-muted/30">
                            {vaultList.length} / {vaultLimit} Vaults
                        </Badge>
                        <CreateVault
                            disabled={!canCreateVault || Boolean(error)}
                            variant="default"
                            size="sm"
                            className="h-9 px-3.5 text-xs font-semibold rounded-xl shadow-2xs"
                        />
                    </div>
                </div>

                {/* Hero Greeting & Overview Banner */}
                <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-br from-card/80 via-card/40 to-muted/20 p-6 sm:p-8 shadow-xs">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
                        <div className="flex flex-col gap-2 max-w-2xl">
                            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                                Welcome to your <span className="text-primary">Strongroom,</span> {userName}
                            </h1>
                            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                                Your zero-knowledge encrypted vault repository. All passwords, financial cards, confidential notes,
                                and identity items remain cryptographically shielded with client-side AES-256-GCM.
                            </p>
                        </div>

                        {/* Quick Stats Pill Group */}
                        <div className="flex flex-wrap items-center gap-3 shrink-0">
                            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-background/80 border border-border/60 shadow-2xs">
                                <ShieldCheck className="size-4 text-emerald-500" />
                                <span className="text-xs font-medium text-foreground">AES-256-GCM</span>
                            </div>
                            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-background/80 border border-border/60 shadow-2xs">
                                <Lock className="size-4 text-primary" />
                                <span className="text-xs font-medium text-foreground">Argon2id Key Derivation</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Utilities Bar */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Link
                        href="/strongroom/playground"
                        className="group flex items-center justify-between p-4 rounded-xl border border-border/50 bg-card/40 hover:bg-muted/40 hover:border-primary/40 transition-all shadow-2xs"
                    >
                        <div className="flex items-center gap-3.5 min-w-0">
                            <div className="size-10 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                                <Gamepad2 className="size-5" />
                            </div>
                            <div className="flex flex-col min-w-0">
                                <span className="text-sm font-semibold text-foreground truncate">Security Playground</span>
                                <span className="text-xs text-muted-foreground truncate">Test password entropy & tools</span>
                            </div>
                        </div>
                        <ArrowRight className="size-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" />
                    </Link>

                    <Link
                        href="/strongroom/transfer-credentials"
                        className="group flex items-center justify-between p-4 rounded-xl border border-border/50 bg-card/40 hover:bg-muted/40 hover:border-primary/40 transition-all shadow-2xs"
                    >
                        <div className="flex items-center gap-3.5 min-w-0">
                            <div className="size-10 rounded-xl bg-blue-500/10 text-blue-500 dark:text-blue-400 border border-blue-500/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                                <FolderSync className="size-5" />
                            </div>
                            <div className="flex flex-col min-w-0">
                                <span className="text-sm font-semibold text-foreground truncate">Transfer Credentials</span>
                                <span className="text-xs text-muted-foreground truncate">Import passwords from CSV</span>
                            </div>
                        </div>
                        <ArrowRight className="size-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" />
                    </Link>

                    <Link
                        href="/strongroom/trash"
                        className="group flex items-center justify-between p-4 rounded-xl border border-border/50 bg-card/40 hover:bg-muted/40 hover:border-primary/40 transition-all shadow-2xs"
                    >
                        <div className="flex items-center gap-3.5 min-w-0">
                            <div className="size-10 rounded-xl bg-amber-500/10 text-amber-500 dark:text-amber-400 border border-amber-500/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                                <Trash2 className="size-5" />
                            </div>
                            <div className="flex flex-col min-w-0">
                                <span className="text-sm font-semibold text-foreground truncate">Trash Recovery</span>
                                <span className="text-xs text-muted-foreground truncate">Restore deleted credentials</span>
                            </div>
                        </div>
                        <ArrowRight className="size-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" />
                    </Link>
                </div>

                {/* Vaults Section Header with Search Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                    <div className="flex items-center gap-3">
                        <Database className="size-5 text-primary" />
                        <h2 className="text-xl font-bold tracking-tight text-foreground">Your Vaults</h2>
                        <Badge variant="secondary" className="text-xs font-semibold px-2 py-0.5">
                            {vaultList.length}
                        </Badge>
                    </div>

                    {vaultList.length > 0 && (
                        <div className="relative w-full sm:w-72">
                            <Search className="size-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                            <Input
                                placeholder="Search vaults..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9 pr-8 h-9 text-sm rounded-xl"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery("")}
                                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                                >
                                    <X className="size-3.5" />
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {/* Vaults Grid Display */}
                {isPending ? (
                    <CustomLoadingState loaderChoice={1} className="py-20 flex items-center justify-center gap-2">
                        <span className="shimmer shimmer-duration-1000">Loading your vaults...</span>
                    </CustomLoadingState>
                ) : error ? (
                    <div className="rounded-2xl border border-destructive/40 bg-destructive/5 p-8 text-center flex flex-col items-center justify-center gap-3">
                        <p className="text-destructive font-medium">Failed to load vaults: {error.message}</p>
                        <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
                            Refresh Page
                        </Button>
                    </div>
                ) : vaultList.length === 0 ? (
                    /* Zero Vaults Empty State */
                    <div className="rounded-2xl border border-dashed border-border/70 p-12 text-center flex flex-col items-center justify-center gap-4 bg-card/20">
                        <div className="size-16 rounded-2xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center">
                            <Lock className="size-8" />
                        </div>
                        <div className="flex flex-col gap-1 max-w-md">
                            <h3 className="text-lg font-bold text-foreground">You have no vaults yet</h3>
                            <p className="text-sm text-muted-foreground">
                                Create your first vault to begin storing passwords, secure notes, payment cards, and personal identities.
                            </p>
                        </div>
                        <div className="mt-2">
                            <CreateVault
                                disabled={!canCreateVault}
                                variant="default"
                                size="default"
                                className="h-10 px-6 rounded-xl font-semibold shadow-xs"
                                label="Create Your First Vault"
                            />
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {filteredVaults.map((vault) => {
                            const iconColor = vault.iconColor || "#3b82f6";
                            return (
                                <div
                                    key={vault.id}
                                    className="group relative flex flex-col justify-between p-5 rounded-2xl border border-border/50 bg-card/40 hover:bg-card hover:border-border/80 hover:shadow-md transition-all duration-200"
                                    style={{
                                        borderLeft: `4px solid ${iconColor}`,
                                    }}
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <Link
                                            href={`/strongroom/${vault.id}`}
                                            className="flex items-center gap-3.5 min-w-0 flex-1 cursor-pointer"
                                        >
                                            <div
                                                className="size-12 rounded-xl flex items-center justify-center shrink-0 border transition-transform duration-200 group-hover:scale-105"
                                                style={{
                                                    backgroundColor: `${iconColor}18`,
                                                    borderColor: `${iconColor}35`,
                                                }}
                                            >
                                                <RenderIcon name={vault.icon} size={28} color={iconColor} />
                                            </div>
                                            <div className="flex flex-col min-w-0 flex-1">
                                                <span className="font-bold text-base text-foreground group-hover:text-primary transition-colors truncate">
                                                    {vault.name}
                                                </span>
                                                <span className="text-xs text-muted-foreground font-mono truncate">
                                                    {vault.slug || "Encrypted Vault"}
                                                </span>
                                            </div>
                                        </Link>

                                        {/* Vault Action Dropdown */}
                                        <DropdownMenu>
                                            <DropdownMenuTrigger
                                                render={
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="size-8 rounded-lg text-muted-foreground hover:text-foreground cursor-pointer shrink-0"
                                                    >
                                                        <MoreVertical className="size-4" />
                                                    </Button>
                                                }
                                            />
                                            <DropdownMenuContent align="end" className="w-44">
                                                <DropdownMenuItem
                                                    render={
                                                        <Link href={`/strongroom/${vault.id}`} className="flex items-center gap-2 cursor-pointer w-full">
                                                            <ArrowRight className="size-4" />
                                                            <span>Open Vault</span>
                                                        </Link>
                                                    }
                                                />
                                                <DropdownMenuItem
                                                    onClick={() => setVaultToUpdate(vault)}
                                                    className="flex items-center gap-2 cursor-pointer"
                                                >
                                                    <Pencil className="size-4" />
                                                    <span>Edit & Theme</span>
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    onClick={() => setVaultToDelete(vault)}
                                                    className="flex items-center gap-2 text-destructive focus:text-destructive cursor-pointer"
                                                >
                                                    <Trash2 className="size-4" />
                                                    <span>Delete Vault</span>
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>

                                    {/* Bottom Card Footer */}
                                    <div className="flex items-center justify-between pt-4 mt-4 border-t border-border/30">
                                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                            <span
                                                className="size-2 rounded-full"
                                                style={{ backgroundColor: iconColor }}
                                            />
                                            <span className="font-mono text-[11px] uppercase tracking-wider">{iconColor}</span>
                                        </div>

                                        <Link
                                            href={`/strongroom/${vault.id}`}
                                            className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline cursor-pointer"
                                        >
                                            <span>Enter</span>
                                            <ArrowRight className="size-3.5 group-hover:translate-x-0.5 transition-transform" />
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}

                        {/* Direct "+ Add New Vault" Action Card in Grid if capacity allows */}
                        {canCreateVault && (
                            <div className="flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-dashed border-border/60 hover:border-primary/50 bg-card/20 hover:bg-muted/20 transition-all duration-200 text-center gap-3 min-h-[170px]">
                                <div className="size-10 rounded-full bg-muted/60 text-muted-foreground flex items-center justify-center">
                                    <Plus className="size-5" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-semibold text-foreground">Create Another Vault</span>
                                    <span className="text-xs text-muted-foreground font-mono">
                                        {vaultLimit - vaultList.length} slots remaining
                                    </span>
                                </div>
                                <CreateVault
                                    disabled={!canCreateVault}
                                    variant="outline"
                                    size="sm"
                                    className="h-8 px-4 text-xs font-semibold rounded-xl mt-1"
                                    label="Add Vault"
                                />
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
