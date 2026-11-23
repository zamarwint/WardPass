"use client";

import React, { useState } from "react";
import {
    Check,
    Copy,
    Eye,
    EyeOff,
    Globe,
    ShieldCheck,
    Lock,
    KeyRound,
    User,
    Sparkles,
    Wifi,
    CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// ============================================================================
// 1. PAYMENT CARD SHOWCASE
// ============================================================================

export function PaymentCard({ withoutHeader = false }: { withoutHeader?: boolean }) {
    const [isCopied, setIsCopied] = useState(false);
    const [showNumber, setShowNumber] = useState(false);

    const fullCardNumber = "4242 4242 4242 4242";

    const copyCardNumber = async (e: React.MouseEvent) => {
        e.stopPropagation();
        await navigator.clipboard.writeText(fullCardNumber);
        setIsCopied(true);
        toast.success("Card number copied to clipboard");
        setTimeout(() => setIsCopied(false), 2000);
    };

    const cardElement = (
        <div className="group/card relative w-full max-w-[390px] aspect-[1.586/1] rounded-2xl p-6 sm:p-7 flex flex-col justify-between overflow-hidden border border-amber-500/30 bg-gradient-to-br from-neutral-900 via-neutral-950 to-neutral-900 text-white shadow-[0_12px_40px_rgba(0,0,0,0.45),0_0_20px_rgba(245,158,11,0.12)] transition-all duration-300 hover:border-amber-500/60 hover:shadow-[0_16px_50px_rgba(0,0,0,0.55),0_0_28px_rgba(245,158,11,0.22)] select-none">
            {/* Iridescent Angled Sheen Overlay */}
            <div className="absolute -inset-full bg-gradient-to-r from-transparent via-white/[0.07] to-transparent rotate-45 pointer-events-none group-hover/card:translate-x-full duration-1000 transition-transform" />

            {/* Subtle Ambient Radial Lighting */}
            <div className="absolute -right-16 -top-16 size-48 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
            <div className="absolute -left-16 -bottom-16 size-48 rounded-full bg-primary/10 blur-3xl pointer-events-none" />

            {/* Top Row: Metallic Smart Chip & Crest */}
            <div className="flex items-start justify-between relative z-10">
                <div className="flex items-center gap-3">
                    {/* Metallic Smart Chip */}
                    <div className="w-11 h-8 rounded-md bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 border border-amber-200/60 relative overflow-hidden shadow-inner shrink-0">
                        <div className="absolute inset-0 grid grid-cols-2 grid-rows-2">
                            <div className="border-r border-b border-black/25" />
                            <div className="border-b border-black/25" />
                            <div className="border-r border-black/25" />
                            <div />
                        </div>
                    </div>

                    {/* Contactless Waves */}
                    <div className="rotate-90 text-amber-300/80 shrink-0">
                        <Wifi className="size-4.5" />
                    </div>
                </div>

                {/* Card Crest & Quick Copy Button */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={copyCardNumber}
                        aria-label="Copy Card Number"
                        className="p-1.5 rounded-lg border border-white/10 bg-white/5 text-amber-400 hover:bg-white/10 hover:border-amber-500/40 transition-all opacity-0 group-hover/card:opacity-100 cursor-pointer shadow-xs"
                        title={isCopied ? "Copied!" : "Copy Card Number"}
                    >
                        {isCopied ? <Check className="size-3.5 text-emerald-400" /> : <Copy className="size-3.5" />}
                    </button>

                    <div className="flex flex-col items-end">
                        <span className="font-mono text-[11px] font-black tracking-widest text-amber-400/90 drop-shadow-sm uppercase">
                            WARDPASS
                        </span>
                        <span className="text-[8px] font-mono tracking-widest text-white/50 uppercase">
                            TITANIUM VAULT
                        </span>
                    </div>
                </div>
            </div>

            {/* Middle Row: Card Number */}
            <div className="my-auto relative z-10 flex items-center justify-between">
                <div className="font-mono text-lg sm:text-[22px] font-bold tracking-[0.22em] text-white/95 tabular-nums drop-shadow-md">
                    {showNumber ? (
                        fullCardNumber
                    ) : (
                        <div className="flex items-center gap-3">
                            <span className="tracking-widest">••••</span>
                            <span className="tracking-widest">••••</span>
                            <span className="tracking-widest">••••</span>
                            <span className="text-amber-400 font-extrabold tracking-widest">4242</span>
                        </div>
                    )}
                </div>

                <button
                    onClick={() => setShowNumber(!showNumber)}
                    aria-label={showNumber ? "Mask Card Number" : "Reveal Card Number"}
                    className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-colors opacity-0 group-hover/card:opacity-100 cursor-pointer"
                    title={showNumber ? "Mask Number" : "Reveal Full Number"}
                >
                    {showNumber ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
            </div>

            {/* Bottom Row: Details & Brand Logo */}
            <div className="flex items-end justify-between relative z-10 text-xs font-mono">
                <div className="flex flex-col gap-0.5">
                    <span className="text-[9px] text-white/45 uppercase tracking-widest">Cardholder</span>
                    <span className="font-bold text-white/90 uppercase tracking-wider text-[11px] sm:text-xs">
                        ALEX THORNE
                    </span>
                </div>

                <div className="flex flex-col items-center gap-0.5">
                    <span className="text-[9px] text-white/45 uppercase tracking-widest">Expires</span>
                    <span className="font-bold text-white/90 tracking-wider text-[11px] sm:text-xs">
                        10/28
                    </span>
                </div>

                {/* Holographic Dual Interlocking Circles (Mastercard / Luxe Brand) */}
                <div className="flex items-center -space-x-2.5 shrink-0 opacity-90">
                    <div className="size-7 rounded-full bg-red-500/80 shadow-md" />
                    <div className="size-7 rounded-full bg-amber-400/80 shadow-md" />
                </div>
            </div>
        </div>
    );

    if (withoutHeader) {
        return cardElement;
    }

    return (
        <div className="group flex flex-col items-center gap-3 p-3 sm:p-5 rounded-2xl bg-card/40 border border-border/50 backdrop-blur-md shadow-lg w-fit">
            <div className="flex items-center justify-between w-full px-2">
                <div className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-amber-500" />
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                        Payment Card Preview
                    </span>
                </div>
                <Badge variant="outline" className="text-[10px] font-mono border-amber-500/30 text-amber-500 bg-amber-500/5">
                    Zero-Knowledge
                </Badge>
            </div>
            {cardElement}
        </div>
    );
}

// ============================================================================
// 2. WEBSITE CREDENTIAL CARD SHOWCASE
// ============================================================================

export function WebsiteCredentialCard({ withoutHeader = false }: { withoutHeader?: boolean }) {
    const [isCopiedEmail, setIsCopiedEmail] = useState(false);
    const [isCopiedPassword, setIsCopiedPassword] = useState(false);
    const [seePassword, setSeePassword] = useState(false);

    const emailValue = "alex.thorne@gmail.com";
    const passwordValue = "wP$Secure!2026#Vault";

    const copyEmail = async (e: React.MouseEvent) => {
        e.stopPropagation();
        await navigator.clipboard.writeText(emailValue);
        setIsCopiedEmail(true);
        toast.success("Email copied to clipboard");
        setTimeout(() => setIsCopiedEmail(false), 2000);
    };

    const copyPassword = async (e: React.MouseEvent) => {
        e.stopPropagation();
        await navigator.clipboard.writeText(passwordValue);
        setIsCopiedPassword(true);
        toast.success("Password copied to clipboard");
        setTimeout(() => setIsCopiedPassword(false), 2000);
    };

    const togglePassword = (e: React.MouseEvent) => {
        e.stopPropagation();
        setSeePassword(!seePassword);
    };

    const cardElement = (
        <div className="group/card relative w-full max-w-[390px] rounded-2xl p-6 sm:p-7 border border-border/60 bg-gradient-to-br from-card via-card/95 to-muted/20 backdrop-blur-md shadow-xl transition-all duration-300 hover:border-blue-500/50 hover:shadow-2xl overflow-hidden flex flex-col gap-5 select-none">
            {/* Ambient Corner Radial Glow */}
            <div className="absolute -top-16 -right-16 size-44 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-16 -left-16 size-44 rounded-full bg-primary/10 blur-3xl pointer-events-none" />

            {/* Header: Service Avatar & Status */}
            <div className="flex items-center justify-between relative z-10 pb-1">
                <div className="flex items-center gap-3.5 min-w-0">
                    <div className="size-11 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-500 dark:text-blue-400 flex items-center justify-center shrink-0 shadow-xs group-hover/card:scale-105 transition-transform duration-200">
                        <Globe className="size-5.5" />
                    </div>
                    <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-2">
                            <span className="font-bold text-sm sm:text-base text-foreground truncate">Google</span>
                            <Badge variant="outline" className="text-[10px] font-medium px-1.5 py-0 h-4 border-blue-500/25 bg-blue-500/5 text-blue-500 dark:text-blue-400 shrink-0">
                                Login
                            </Badge>
                        </div>
                        <span className="text-xs text-muted-foreground font-mono truncate">
                            accounts.google.com
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-semibold shrink-0">
                    <ShieldCheck className="size-3" />
                    <span>2FA Protected</span>
                </div>
            </div>

            {/* Credential Fields */}
            <div className="flex flex-col gap-3 relative z-10">
                {/* Email / Username Field */}
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-1">
                        <User className="size-3" />
                        <span>Username / Email</span>
                    </div>
                    <div className="group/field flex items-center justify-between p-3 rounded-xl border border-border/50 bg-background/70 hover:border-border/80 transition-colors gap-2 shadow-2xs">
                        <span className="font-mono text-xs sm:text-sm text-foreground truncate font-medium">
                            {emailValue}
                        </span>
                        <button
                            type="button"
                            onClick={copyEmail}
                            aria-label="Copy Email"
                            className="size-7 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-all flex items-center justify-center shrink-0 cursor-pointer"
                            title={isCopiedEmail ? "Copied!" : "Copy Email"}
                        >
                            {isCopiedEmail ? <Check className="size-3.5 text-emerald-500" /> : <Copy className="size-3.5" />}
                        </button>
                    </div>
                </div>

                {/* Password Field with Reveal & Copy */}
                <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-1">
                        <div className="flex items-center gap-1.5">
                            <KeyRound className="size-3" />
                            <span>Password</span>
                        </div>
                        <span className="text-emerald-500 text-[10px] font-normal lowercase">128-bit aes</span>
                    </div>
                    <div className="group/field flex items-center justify-between p-3 rounded-xl border border-border/50 bg-background/70 hover:border-border/80 transition-colors gap-2 shadow-2xs">
                        <span className="font-mono text-xs sm:text-sm text-foreground truncate font-medium tracking-wider">
                            {seePassword ? passwordValue : "••••••••••••••••"}
                        </span>
                        <div className="flex items-center gap-1 shrink-0">
                            <button
                                type="button"
                                onClick={togglePassword}
                                aria-label={seePassword ? "Hide Password" : "Reveal Password"}
                                className="size-7 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-all flex items-center justify-center cursor-pointer"
                                title={seePassword ? "Hide" : "Reveal"}
                            >
                                {seePassword ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                            </button>
                            <button
                                type="button"
                                onClick={copyPassword}
                                aria-label="Copy Password"
                                className="size-7 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-all flex items-center justify-center cursor-pointer"
                                title={isCopiedPassword ? "Copied!" : "Copy Password"}
                            >
                                {isCopiedPassword ? <Check className="size-3.5 text-emerald-500" /> : <Copy className="size-3.5" />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Security Meter & Timestamp */}
            <div className="pt-2 border-t border-border/30 flex items-center justify-between text-[11px] text-muted-foreground relative z-10">
                <div className="flex items-center gap-1.5">
                    <div className="flex items-center gap-1">
                        <div className="size-1.5 rounded-full bg-emerald-500" />
                        <div className="size-1.5 rounded-full bg-emerald-500" />
                        <div className="size-1.5 rounded-full bg-emerald-500" />
                        <div className="size-1.5 rounded-full bg-emerald-500" />
                    </div>
                    <span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400">High Security</span>
                </div>
                <span className="font-mono text-[10px]">Updated 2d ago</span>
            </div>
        </div>
    );

    if (withoutHeader) {
        return cardElement;
    }

    return (
        <div className="group flex flex-col items-center gap-3 p-3 sm:p-5 rounded-2xl bg-card/40 border border-border/50 backdrop-blur-md shadow-lg w-fit">
            <div className="flex items-center justify-between w-full px-2">
                <div className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-blue-500" />
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                        Website Login Preview
                    </span>
                </div>
                <Badge variant="outline" className="text-[10px] font-mono border-blue-500/30 text-blue-500 bg-blue-500/5">
                    Encrypted
                </Badge>
            </div>
            {cardElement}
        </div>
    );
}
