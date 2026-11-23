"use client";

import React, { useState } from "react";
import {
    Bell,
    BookOpen,
    Layers,
    Keyboard,
    ShieldCheck,
    ChevronRight,
    Sparkles,
    Lightbulb,
    Trash2,
    Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogClose,
} from "@/components/ui/dialog";

// ============================================================================
// STANDALONE MODAL COMPONENTS (EXPORTED FOR BACKWARDS COMPATIBILITY)
// ============================================================================

export function Manual({ open, onOpenChange }: { open?: boolean; onOpenChange?: (open: boolean) => void }) {
    const [internalOpen, setInternalOpen] = useState(false);
    const isOpen = open !== undefined ? open : internalOpen;
    const setIsOpen = onOpenChange || setInternalOpen;

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="max-w-lg p-6 sm:p-7 rounded-2xl border border-border/60 bg-card/95 backdrop-blur-md shadow-2xl">
                <DialogHeader className="gap-2">
                    <div className="flex items-center gap-2.5">
                        <div className="size-10 rounded-xl bg-blue-500/10 text-blue-500 border border-blue-500/20 flex items-center justify-center shrink-0">
                            <BookOpen className="size-5" />
                        </div>
                        <div>
                            <DialogTitle className="text-lg font-bold text-foreground">WardPass Manual</DialogTitle>
                            <DialogDescription className="text-xs text-muted-foreground">
                                Essential operations & zero-knowledge security best practices.
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="flex flex-col gap-3.5 my-2">
                    <div className="p-3.5 rounded-xl border border-border/40 bg-muted/20 flex items-start gap-3">
                        <div className="size-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                            <Lock className="size-4" />
                        </div>
                        <div className="flex flex-col gap-0.5">
                            <span className="text-xs font-semibold text-foreground">Vault Management</span>
                            <span className="text-xs text-muted-foreground leading-relaxed">
                                Use the 3-dot menu on any vault card or right-click to edit its custom color theme, name, or icon.
                            </span>
                        </div>
                    </div>

                    <div className="p-3.5 rounded-xl border border-border/40 bg-muted/20 flex items-start gap-3">
                        <div className="size-7 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0 mt-0.5">
                            <Lightbulb className="size-4" />
                        </div>
                        <div className="flex flex-col gap-0.5">
                            <span className="text-xs font-semibold text-foreground">Vault Item Actions</span>
                            <span className="text-xs text-muted-foreground leading-relaxed">
                                Double-click anywhere outside an item row to clear selections. Click the item actions to reveal secrets, copy credentials, or edit.
                            </span>
                        </div>
                    </div>

                    <div className="p-3.5 rounded-xl border border-border/40 bg-muted/20 flex items-start gap-3">
                        <div className="size-7 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0 mt-0.5">
                            <Trash2 className="size-4" />
                        </div>
                        <div className="flex flex-col gap-0.5">
                            <span className="text-xs font-semibold text-foreground">Trash & Recovery</span>
                            <span className="text-xs text-muted-foreground leading-relaxed">
                                Trashed items are preserved in encrypted soft-delete state. Navigate to the Trash Bin from the sidebar or dashboard to restore items.
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-2 border-t border-border/40">
                    <DialogClose className="px-4 py-2 text-xs font-semibold rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer">
                        Got it
                    </DialogClose>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export function NumberOfVaultandVaultItems({ open, onOpenChange }: { open?: boolean; onOpenChange?: (open: boolean) => void }) {
    const [internalOpen, setInternalOpen] = useState(false);
    const isOpen = open !== undefined ? open : internalOpen;
    const setIsOpen = onOpenChange || setInternalOpen;

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="max-w-lg p-6 sm:p-7 rounded-2xl border border-border/60 bg-card/95 backdrop-blur-md shadow-2xl">
                <DialogHeader className="gap-2">
                    <div className="flex items-center gap-2.5">
                        <div className="size-10 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center justify-center shrink-0">
                            <Layers className="size-5" />
                        </div>
                        <div>
                            <DialogTitle className="text-lg font-bold text-foreground">Capacity & Supporter Tiers</DialogTitle>
                            <DialogDescription className="text-xs text-muted-foreground">
                                Vault allocation limits and project support.
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="flex flex-col gap-4 my-2">
                    <div className="p-4 rounded-xl border border-border/50 bg-gradient-to-br from-card/80 to-muted/20 flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-foreground">Standard Free Tier</span>
                            <Badge variant="secondary" className="text-[10px] font-mono">Included</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            Every member starts with an allocation of <strong>5 vaults</strong> with up to <strong>5 encrypted vault items</strong> each.
                            This provides zero-knowledge security for everyday essentials completely free of charge.
                        </p>
                    </div>

                    <div className="p-4 rounded-xl border border-primary/30 bg-primary/5 flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-primary flex items-center gap-1.5">
                                <Sparkles className="size-3.5" /> Supporter & Donator Upgrades
                            </span>
                            <Badge variant="outline" className="text-[10px] font-mono border-primary/40 text-primary">Custom</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            Supporting the project allows us to dynamically increase your vault and vault item limits in the database with strict row-level security.
                        </p>
                    </div>
                </div>

                <div className="flex justify-end pt-2 border-t border-border/40">
                    <DialogClose className="px-4 py-2 text-xs font-semibold rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer">
                        Understood
                    </DialogClose>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export function KeyboardShortcuts({ open, onOpenChange }: { open?: boolean; onOpenChange?: (open: boolean) => void }) {
    const [internalOpen, setInternalOpen] = useState(false);
    const isOpen = open !== undefined ? open : internalOpen;
    const setIsOpen = onOpenChange || setInternalOpen;

    const shortcuts = [
        { keys: ["Ctrl", "B"], label: "Toggle Sidebar Panel", category: "Navigation" },
        { keys: ["Alt", "V"], label: "Go to Vaults Overview", category: "Navigation" },
        { keys: ["Alt", "T"], label: "Toggle Dark / Light Theme", category: "Appearance" },
        { keys: ["Alt", "U"], label: "Open User Account Settings", category: "Account" },
        { keys: ["Alt", "P"], label: "Open Promotional Message", category: "General" },
        { keys: ["Esc"], label: "Return to Landing Page", category: "Navigation" },
    ];

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="max-w-md p-6 sm:p-7 rounded-2xl border border-border/60 bg-card/95 backdrop-blur-md shadow-2xl">
                <DialogHeader className="gap-2">
                    <div className="flex items-center gap-2.5">
                        <div className="size-10 rounded-xl bg-purple-500/10 text-purple-500 border border-purple-500/20 flex items-center justify-center shrink-0">
                            <Keyboard className="size-5" />
                        </div>
                        <div>
                            <DialogTitle className="text-lg font-bold text-foreground">Keyboard Shortcuts</DialogTitle>
                            <DialogDescription className="text-xs text-muted-foreground">
                                Quick navigation hotkeys for power users.
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="flex flex-col gap-2 my-2 divide-y divide-border/30">
                    {shortcuts.map((sc) => (
                        <div key={sc.label} className="flex items-center justify-between pt-2.5 first:pt-0">
                            <span className="text-xs text-foreground font-medium">{sc.label}</span>
                            <div className="flex items-center gap-1">
                                {sc.keys.map((k) => (
                                    <kbd
                                        key={k}
                                        className="px-2 py-0.5 rounded-md border border-border/70 bg-muted/60 text-foreground font-mono text-[11px] font-semibold shadow-2xs"
                                    >
                                        {k}
                                    </kbd>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex justify-end pt-3 border-t border-border/40">
                    <DialogClose className="px-4 py-2 text-xs font-semibold rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer">
                        Done
                    </DialogClose>
                </div>
            </DialogContent>
        </Dialog>
    );
}

// ============================================================================
// MAIN NOTIFICATIONS DROPDOWN COMPONENT
// ============================================================================

export default function Notifications() {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [activeModal, setActiveModal] = useState<"manual" | "capacity" | "shortcuts" | null>(null);

    const handleOpenModal = (modal: "manual" | "capacity" | "shortcuts") => {
        setDropdownOpen(false);
        // Small delay so dropdown unmounts cleanly before dialog mounts
        setTimeout(() => setActiveModal(modal), 80);
    };

    return (
        <>
            {/* Dedicated Modals */}
            <Manual open={activeModal === "manual"} onOpenChange={(open) => !open && setActiveModal(null)} />
            <NumberOfVaultandVaultItems open={activeModal === "capacity"} onOpenChange={(open) => !open && setActiveModal(null)} />
            <KeyboardShortcuts open={activeModal === "shortcuts"} onOpenChange={(open) => !open && setActiveModal(null)} />

            {/* Notification Dropdown Trigger */}
            <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
                <DropdownMenuTrigger
                    render={
                        <Button
                            variant="ghost"
                            size="icon"
                            className="relative size-9 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors cursor-pointer"
                            aria-label="View notifications and guides"
                            title="Notifications"
                        >
                            <Bell className="size-4.5" />
                            {/* Glowing notification unread indicator */}
                            <span className="absolute top-1.5 right-1.5 flex size-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                <span className="relative inline-flex rounded-full size-2 bg-primary"></span>
                            </span>
                        </Button>
                    }
                />

                <DropdownMenuContent
                    align="start"
                    sideOffset={8}
                    className="w-80 sm:w-92 p-0 rounded-2xl border border-border/60 bg-popover/95 backdrop-blur-md shadow-2xl overflow-hidden"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-border/40 bg-muted/20">
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-foreground tracking-wide">Notifications & Guides</span>
                        </div>
                        <Badge variant="outline" className="text-[10px] font-mono px-2 py-0 border-border/60 text-muted-foreground">
                            3 Guides
                        </Badge>
                    </div>

                    {/* Feed of notification items */}
                    <div className="flex flex-col p-1.5 gap-1">
                        {/* Notification 1: Security Manual */}
                        <button
                            type="button"
                            onClick={() => handleOpenModal("manual")}
                            className="group flex items-start gap-3 p-2.5 rounded-xl text-left hover:bg-muted/50 transition-colors cursor-pointer"
                        >
                            <div className="size-8 rounded-lg bg-blue-500/10 text-blue-500 border border-blue-500/20 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                                <BookOpen className="size-4" />
                            </div>
                            <div className="flex flex-col min-w-0 flex-1">
                                <div className="flex items-center justify-between gap-1">
                                    <span className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                                        WardPass User Manual
                                    </span>
                                    <span className="text-[10px] text-muted-foreground shrink-0 font-mono">Guide</span>
                                </div>
                                <span className="text-[11px] text-muted-foreground truncate">
                                    Vault shortcuts, item CRUD & trash rules
                                </span>
                            </div>
                            <ChevronRight className="size-4 text-muted-foreground/60 group-hover:text-foreground shrink-0 mt-2 group-hover:translate-x-0.5 transition-transform" />
                        </button>

                        {/* Notification 2: Capacity Allocation */}
                        <button
                            type="button"
                            onClick={() => handleOpenModal("capacity")}
                            className="group flex items-start gap-3 p-2.5 rounded-xl text-left hover:bg-muted/50 transition-colors cursor-pointer"
                        >
                            <div className="size-8 rounded-lg bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                                <Layers className="size-4" />
                            </div>
                            <div className="flex flex-col min-w-0 flex-1">
                                <div className="flex items-center justify-between gap-1">
                                    <span className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                                        Vault & Item Allocation
                                    </span>
                                    <span className="text-[10px] text-muted-foreground shrink-0 font-mono">Tiers</span>
                                </div>
                                <span className="text-[11px] text-muted-foreground truncate">
                                    5 vaults & 5 items allocation info
                                </span>
                            </div>
                            <ChevronRight className="size-4 text-muted-foreground/60 group-hover:text-foreground shrink-0 mt-2 group-hover:translate-x-0.5 transition-transform" />
                        </button>

                        {/* Notification 3: Keyboard Shortcuts */}
                        <button
                            type="button"
                            onClick={() => handleOpenModal("shortcuts")}
                            className="group flex items-start gap-3 p-2.5 rounded-xl text-left hover:bg-muted/50 transition-colors cursor-pointer"
                        >
                            <div className="size-8 rounded-lg bg-purple-500/10 text-purple-500 border border-purple-500/20 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                                <Keyboard className="size-4" />
                            </div>
                            <div className="flex flex-col min-w-0 flex-1">
                                <div className="flex items-center justify-between gap-1">
                                    <span className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                                        Navigation Shortcuts
                                    </span>
                                    <span className="text-[10px] text-muted-foreground shrink-0 font-mono">Hotkeys</span>
                                </div>
                                <span className="text-[11px] text-muted-foreground truncate">
                                    Speed keys: Ctrl+B, Alt+V, Alt+T, Esc
                                </span>
                            </div>
                            <ChevronRight className="size-4 text-muted-foreground/60 group-hover:text-foreground shrink-0 mt-2 group-hover:translate-x-0.5 transition-transform" />
                        </button>

                        {/* Notification 4: System Protection */}
                        <div className="flex items-start gap-3 p-2.5 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-left mt-1">
                            <div className="size-8 rounded-lg bg-emerald-500/15 text-emerald-500 flex items-center justify-center shrink-0 mt-0.5">
                                <ShieldCheck className="size-4" />
                            </div>
                            <div className="flex flex-col min-w-0 flex-1">
                                <div className="flex items-center justify-between gap-1">
                                    <span className="text-xs font-semibold text-emerald-500 truncate">
                                        Protection Active
                                    </span>
                                    <Badge variant="outline" className="text-[9px] font-mono px-1.5 py-0 border-emerald-500/40 text-emerald-500">
                                        Live
                                    </Badge>
                                </div>
                                <span className="text-[11px] text-muted-foreground truncate">
                                    Zero-knowledge AES-256-GCM verified
                                </span>
                            </div>
                        </div>
                    </div>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
}
