"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
    ArrowLeft,
    CreditCard,
    ShieldCheck,
    Lock,
    KeyRound,
    Dices,
    Sparkles,
    Copy,
    Eye,
    EyeOff,
    RefreshCw,
    Sliders,
    AlertTriangle,
    CheckCircle2,
    XCircle,
    Flame,
    Zap,
    Cpu,
    Server,
    Laptop,
    Fingerprint,
    Shuffle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// ============================================================================
// TOOL 1: 3D FLIPPABLE BANK CARD STUDIO
// ============================================================================

const CARD_THEMES = [
    {
        id: "cyber-gold",
        name: "Cyber Neon",
        bg: "bg-gradient-to-br from-neutral-900 via-neutral-950 to-neutral-900",
        border: "border-amber-500/50 shadow-[0_0_20px_rgba(245,158,11,0.15)]",
        accent: "text-amber-400",
        chip: "bg-gradient-to-br from-amber-300 via-amber-400 to-amber-600",
    },
    {
        id: "obsidian",
        name: "Obsidian",
        bg: "bg-gradient-to-br from-zinc-900 via-zinc-950 to-neutral-950",
        border: "border-zinc-700/60 shadow-[0_0_20px_rgba(255,255,255,0.05)]",
        accent: "text-zinc-200",
        chip: "bg-gradient-to-br from-zinc-300 via-zinc-400 to-zinc-500",
    },
    {
        id: "emerald",
        name: "Emerald Titanium",
        bg: "bg-gradient-to-br from-emerald-950 via-teal-950 to-neutral-950",
        border: "border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.15)]",
        accent: "text-emerald-400",
        chip: "bg-gradient-to-br from-emerald-300 via-emerald-400 to-teal-500",
    },
    {
        id: "deep-violet",
        name: "Deep Amethyst",
        bg: "bg-gradient-to-br from-purple-950 via-indigo-950 to-neutral-950",
        border: "border-purple-500/50 shadow-[0_0_20px_rgba(168,85,247,0.15)]",
        accent: "text-purple-400",
        chip: "bg-gradient-to-br from-purple-300 via-fuchsia-400 to-indigo-500",
    },
    {
        id: "arctic-frost",
        name: "Arctic Blue",
        bg: "bg-gradient-to-br from-blue-950 via-cyan-950 to-neutral-950",
        border: "border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.15)]",
        accent: "text-cyan-400",
        chip: "bg-gradient-to-br from-cyan-300 via-sky-400 to-blue-500",
    },
];

function CardStudio() {
    const [isFlipped, setIsFlipped] = useState(false);
    const [cardholder, setCardholder] = useState("JANE DOE");
    const [cardNumber, setCardNumber] = useState("4532 8912 3456 7890");
    const [expiry, setExpiry] = useState("08/29");
    const [cvv, setCvv] = useState("842");
    const [showDetails, setShowDetails] = useState(true);
    const [selectedTheme, setSelectedTheme] = useState(CARD_THEMES[0]);

    // Detect brand based on first digit
    const cardBrand = useMemo(() => {
        const clean = cardNumber.replace(/\s+/g, "");
        if (clean.startsWith("4")) return "VISA";
        if (clean.startsWith("5")) return "MASTERCARD";
        if (clean.startsWith("3")) return "AMEX";
        if (clean.startsWith("6")) return "DISCOVER";
        return "CARD";
    }, [cardNumber]);

    const generateRandomCard = () => {
        const prefixes = ["4532", "5412", "3782", "6011"];
        const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
        const r1 = Math.floor(1000 + Math.random() * 9000);
        const r2 = Math.floor(1000 + Math.random() * 9000);
        const r3 = Math.floor(1000 + Math.random() * 9000);
        setCardNumber(`${prefix} ${r1} ${r2} ${r3}`);
        setCvv(String(Math.floor(100 + Math.random() * 900)));
        const mm = String(Math.floor(1 + Math.random() * 12)).padStart(2, "0");
        const yy = String(26 + Math.floor(Math.random() * 6));
        setExpiry(`${mm}/${yy}`);
        toast.success("Generated random card parameters");
    };

    const copyCardNumber = () => {
        navigator.clipboard.writeText(cardNumber);
        toast.success("Card number copied to clipboard");
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Interactive 3D Card Stage */}
            <div className="lg:col-span-7 flex flex-col items-center gap-6">
                <div
                    className="w-full max-w-md h-[240px] sm:h-[260px] cursor-pointer select-none group"
                    style={{ perspective: 1000 }}
                    onClick={() => setIsFlipped((prev) => !prev)}
                >
                    <div
                        className="relative w-full h-full rounded-2xl shadow-xl"
                        style={{
                            transformStyle: "preserve-3d",
                            transition: "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
                            transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                        }}
                    >
                        {/* FRONT FACE */}
                        <div
                            className={cn(
                                "absolute inset-0 rounded-2xl p-6 sm:p-7 flex flex-col justify-between border text-white overflow-hidden",
                                selectedTheme.bg,
                                selectedTheme.border
                            )}
                            style={{
                                backfaceVisibility: "hidden",
                                WebkitBackfaceVisibility: "hidden",
                            }}
                        >
                            {/* Subtle holographic foil shine */}
                            <div className="absolute -inset-full bg-gradient-to-r from-transparent via-white/5 to-transparent rotate-45 pointer-events-none group-hover:translate-x-full duration-1000 transition-transform" />

                            {/* Top Row: Chip & Brand */}
                            <div className="flex items-center justify-between relative z-10">
                                <div className="flex items-center gap-3">
                                    {/* Metallic Chip */}
                                    <div
                                        className={cn(
                                            "w-11 h-8 rounded-md border border-amber-200/40 relative overflow-hidden shadow-inner",
                                            selectedTheme.chip
                                        )}
                                    >
                                        <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 border-amber-900/30">
                                            <div className="border-r border-b border-black/20" />
                                            <div className="border-b border-black/20" />
                                            <div className="border-r border-black/20" />
                                            <div />
                                        </div>
                                    </div>
                                    {/* Contactless waves */}
                                    <svg className="size-5 text-white/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M8.5 16.5a5 5 0 0 1 0-7" />
                                        <path d="M12 19a8.5 8.5 0 0 0 0-14" />
                                        <path d="M15.5 21.5a12 12 0 0 0 0-19" />
                                    </svg>
                                </div>

                                <div className="flex flex-col items-end">
                                    <span className="font-mono font-black text-lg tracking-widest text-white/90">
                                        {cardBrand}
                                    </span>
                                    <span className="text-[9px] uppercase tracking-wider text-white/50 font-mono">
                                        WardPass Vault
                                    </span>
                                </div>
                            </div>

                            {/* Center: Card Number */}
                            <div className="my-auto relative z-10">
                                <span className="font-mono text-xl sm:text-2xl font-bold tracking-[0.2em] text-white drop-shadow-md tabular-nums">
                                    {showDetails ? cardNumber : `•••• •••• •••• ${cardNumber.slice(-4)}`}
                                </span>
                            </div>

                            {/* Bottom Row: Cardholder & Expiry */}
                            <div className="flex items-end justify-between relative z-10 text-xs font-mono">
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-white/50 uppercase tracking-widest">Cardholder</span>
                                    <span className="font-semibold text-white/95 uppercase tracking-wider truncate max-w-[200px]">
                                        {cardholder || "JANE DOE"}
                                    </span>
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="text-[10px] text-white/50 uppercase tracking-widest">Expires</span>
                                    <span className="font-semibold text-white/95 tracking-wider">{expiry || "MM/YY"}</span>
                                </div>
                            </div>
                        </div>

                        {/* BACK FACE */}
                        <div
                            className={cn(
                                "absolute inset-0 rounded-2xl flex flex-col justify-between border text-white overflow-hidden py-6",
                                selectedTheme.bg,
                                selectedTheme.border
                            )}
                            style={{
                                backfaceVisibility: "hidden",
                                WebkitBackfaceVisibility: "hidden",
                                transform: "rotateY(180deg)",
                            }}
                        >
                            {/* Magnetic Stripe */}
                            <div className="w-full h-11 bg-neutral-950 border-y border-white/10" />

                            {/* Signature Strip & CVV */}
                            <div className="px-6 flex items-center justify-between gap-4">
                                <div className="flex-1 h-9 bg-neutral-200 rounded flex items-center px-3 text-neutral-800 font-mono text-xs italic tracking-widest">
                                    {cardholder}
                                </div>
                                <div className="flex flex-col items-center">
                                    <span className="text-[9px] font-mono text-white/50 uppercase">CVV</span>
                                    <div className="bg-white text-neutral-900 font-mono font-bold px-2 py-0.5 rounded text-xs border border-white/20">
                                        {showDetails ? cvv : "•••"}
                                    </div>
                                </div>
                            </div>

                            {/* Security Notice */}
                            <div className="px-6 flex justify-between items-center text-[9px] text-white/40 font-mono">
                                <span>24/7 WardPass Guard • Zero-Knowledge</span>
                                <span className="uppercase">Click anywhere to flip</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Card Stage Controls */}
                <div className="flex flex-wrap items-center justify-center gap-3">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsFlipped((prev) => !prev)}
                        className="gap-2 cursor-pointer rounded-xl"
                    >
                        <RefreshCw className={cn("size-3.5 transition-transform", isFlipped && "rotate-180")} />
                        <span>Flip Card ({isFlipped ? "Viewing Back" : "Viewing Front"})</span>
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowDetails((prev) => !prev)}
                        className="gap-2 cursor-pointer rounded-xl"
                    >
                        {showDetails ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                        <span>{showDetails ? "Mask Numbers" : "Reveal Numbers"}</span>
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={copyCardNumber}
                        className="gap-2 cursor-pointer rounded-xl"
                    >
                        <Copy className="size-3.5" />
                        <span>Copy Number</span>
                    </Button>
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={generateRandomCard}
                        className="gap-2 cursor-pointer rounded-xl"
                    >
                        <Shuffle className="size-3.5" />
                        <span>Randomize</span>
                    </Button>
                </div>
            </div>

            {/* Right: Customization Controls Card */}
            <div className="lg:col-span-5 flex flex-col gap-5 p-6 rounded-2xl border border-border/50 bg-card/40">
                <div className="flex items-center gap-2 pb-2 border-b border-border/40">
                    <Sliders className="size-4 text-primary" />
                    <h3 className="font-bold text-sm text-foreground">Card Studio Customizer</h3>
                </div>

                <div className="flex flex-col gap-1.5">
                    <Label className="text-xs">Cardholder Name</Label>
                    <Input
                        value={cardholder}
                        onChange={(e) => setCardholder(e.target.value.toUpperCase())}
                        maxLength={26}
                        className="font-mono text-sm uppercase h-9"
                    />
                </div>

                <div className="flex flex-col gap-1.5">
                    <Label className="text-xs">Card Number</Label>
                    <Input
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        maxLength={24}
                        className="font-mono text-sm h-9"
                    />
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1.5">
                        <Label className="text-xs">Expiry Date</Label>
                        <Input
                            value={expiry}
                            onChange={(e) => setExpiry(e.target.value)}
                            maxLength={5}
                            placeholder="MM/YY"
                            className="font-mono text-sm h-9"
                        />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <Label className="text-xs">CVV</Label>
                        <Input
                            value={cvv}
                            onChange={(e) => setCvv(e.target.value)}
                            maxLength={4}
                            className="font-mono text-sm h-9"
                        />
                    </div>
                </div>

                {/* Theme Selector */}
                <div className="flex flex-col gap-2 pt-2 border-t border-border/40">
                    <Label className="text-xs">Card Finishes & Materials</Label>
                    <div className="grid grid-cols-2 gap-2">
                        {CARD_THEMES.map((theme) => {
                            const isSelected = selectedTheme.id === theme.id;
                            return (
                                <button
                                    key={theme.id}
                                    type="button"
                                    onClick={() => setSelectedTheme(theme)}
                                    className={cn(
                                        "p-2.5 rounded-xl border text-left text-xs font-medium transition-all flex items-center gap-2 cursor-pointer",
                                        isSelected
                                            ? "border-primary bg-primary/10 text-foreground ring-1 ring-primary/30"
                                            : "border-border/60 bg-muted/20 hover:bg-muted/40 text-muted-foreground"
                                    )}
                                >
                                    <span className={cn("size-3 rounded-full border border-white/20", theme.chip)} />
                                    <span className="truncate">{theme.name}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}

// ============================================================================
// TOOL 2: PASSWORD ENTROPY & CRACK-TIME SIMULATOR
// ============================================================================

function calculatePasswordEntropy(pw: string) {
    if (!pw) return { entropy: 0, poolSize: 0 };
    let poolSize = 0;
    if (/[a-z]/.test(pw)) poolSize += 26;
    if (/[A-Z]/.test(pw)) poolSize += 26;
    if (/[0-9]/.test(pw)) poolSize += 10;
    if (/[^a-zA-Z0-9]/.test(pw)) poolSize += 33;
    const entropy = Math.round(pw.length * Math.log2(Math.max(poolSize, 1)));
    return { entropy, poolSize };
}

function formatCrackTime(seconds: number): string {
    if (!Number.isFinite(seconds) || seconds > 1e18) return "Centuries (10+ billion years)";
    if (seconds < 0.001) return "Instant (< 1 millisecond)";
    if (seconds < 1) return `${Math.round(seconds * 1000)} milliseconds`;
    if (seconds < 60) return `${Math.round(seconds)} seconds`;
    if (seconds < 3600) return `${Math.round(seconds / 60)} minutes`;
    if (seconds < 86400) return `${Math.round(seconds / 3600)} hours`;
    if (seconds < 86400 * 365) return `${Math.round(seconds / 86400)} days`;
    if (seconds < 86400 * 365 * 1000) return `${Math.round(seconds / (86400 * 365))} years`;
    if (seconds < 86400 * 365 * 1000000) return `${Math.round(seconds / (86400 * 365 * 1000))} thousand years`;
    return `${Math.round(seconds / (86400 * 365 * 1000000))} million years`;
}

function PasswordLab() {
    const [password, setPassword] = useState("WardPass#Security2026!");
    const [reveal, setReveal] = useState(true);

    // Generator settings
    const [genLength, setGenLength] = useState(16);
    const [includeUpper, setIncludeUpper] = useState(true);
    const [includeLower, setIncludeLower] = useState(true);
    const [includeNumbers, setIncludeNumbers] = useState(true);
    const [includeSymbols, setIncludeSymbols] = useState(true);

    const { entropy, poolSize } = useMemo(() => calculatePasswordEntropy(password), [password]);

    // Combinations = poolSize ^ length
    const combinations = useMemo(() => {
        return Math.pow(Math.max(poolSize, 1), password.length);
    }, [poolSize, password.length]);

    // Crack times: combinations / (2 * speed)
    const crackLaptop = useMemo(() => combinations / (2 * 1e8), [combinations]); // 100M / sec
    const crackGpuRig = useMemo(() => combinations / (2 * 1e11), [combinations]); // 100B / sec
    const crackSupercomputer = useMemo(() => combinations / (2 * 1e14), [combinations]); // 100T / sec

    const generatePassword = () => {
        let chars = "";
        if (includeLower) chars += "abcdefghijklmnopqrstuvwxyz";
        if (includeUpper) chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        if (includeNumbers) chars += "0123456789";
        if (includeSymbols) chars += "!@#$%^&*()_+-=[]{}|;:,.<>?";
        if (!chars) chars = "abcdefghijklmnopqrstuvwxyz";

        let result = "";
        const array = new Uint32Array(genLength);
        window.crypto.getRandomValues(array);
        for (let i = 0; i < genLength; i++) {
            result += chars[array[i] % chars.length];
        }
        setPassword(result);
        toast.success(`Generated strong ${genLength}-character password`);
    };

    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSymbol = /[^a-zA-Z0-9]/.test(password);
    const isLongEnough = password.length >= 14;

    const strengthTier =
        entropy < 30
            ? { label: "Very Weak", color: "text-destructive", badge: "bg-destructive/10 text-destructive border-destructive/30" }
            : entropy < 50
                ? { label: "Moderate", color: "text-amber-500", badge: "bg-amber-500/10 text-amber-500 border-amber-500/30" }
                : entropy < 80
                    ? { label: "Strong", color: "text-emerald-500", badge: "bg-emerald-500/10 text-emerald-500 border-emerald-500/30" }
                    : { label: "Cryptographically Unbreakable", color: "text-purple-500", badge: "bg-purple-500/10 text-purple-500 border-purple-500/30" };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Interactive Tester & Crack Simulator */}
            <div className="lg:col-span-7 flex flex-col gap-6">
                <div className="p-6 rounded-2xl border border-border/50 bg-card/40 flex flex-col gap-5">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <KeyRound className="size-4 text-primary" />
                            <h3 className="font-bold text-sm text-foreground">Password Strength Analyzer</h3>
                        </div>
                        <Badge variant="outline" className={cn("text-xs font-semibold px-2.5 py-0.5", strengthTier.badge)}>
                            {strengthTier.label}
                        </Badge>
                    </div>

                    {/* Input Bar */}
                    <div className="relative">
                        <Input
                            type={reveal ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Type a password to test..."
                            className="font-mono text-base pr-20 h-11 rounded-xl"
                        />
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                            <button
                                type="button"
                                onClick={() => setReveal(!reveal)}
                                className="p-1.5 text-muted-foreground hover:text-foreground cursor-pointer rounded-lg"
                                title={reveal ? "Hide" : "Reveal"}
                            >
                                {reveal ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    navigator.clipboard.writeText(password);
                                    toast.success("Password copied to clipboard");
                                }}
                                className="p-1.5 text-muted-foreground hover:text-foreground cursor-pointer rounded-lg"
                                title="Copy"
                            >
                                <Copy className="size-4" />
                            </button>
                        </div>
                    </div>

                    {/* Entropy Score Meter */}
                    <div className="flex flex-col gap-2 p-4 rounded-xl bg-background/60 border border-border/40">
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground font-medium">Cryptographic Entropy</span>
                            <span className="font-mono font-bold text-foreground">
                                {entropy} bits <span className="text-muted-foreground font-normal">({poolSize} char pool)</span>
                            </span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-muted/60 overflow-hidden">
                            <div
                                className={cn(
                                    "h-full rounded-full transition-all duration-300",
                                    entropy < 30 ? "bg-destructive" : entropy < 50 ? "bg-amber-500" : entropy < 80 ? "bg-emerald-500" : "bg-purple-500"
                                )}
                                style={{ width: `${Math.min(100, (entropy / 100) * 100)}%` }}
                            />
                        </div>
                    </div>

                    {/* Character Variety Checks */}
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
                        <div className={cn("p-2 rounded-lg border flex items-center gap-1.5", hasLower ? "border-emerald-500/40 bg-emerald-500/5 text-emerald-500" : "border-border/40 text-muted-foreground")}>
                            {hasLower ? <CheckCircle2 className="size-3.5" /> : <XCircle className="size-3.5" />}
                            <span>Lowercase</span>
                        </div>
                        <div className={cn("p-2 rounded-lg border flex items-center gap-1.5", hasUpper ? "border-emerald-500/40 bg-emerald-500/5 text-emerald-500" : "border-border/40 text-muted-foreground")}>
                            {hasUpper ? <CheckCircle2 className="size-3.5" /> : <XCircle className="size-3.5" />}
                            <span>Uppercase</span>
                        </div>
                        <div className={cn("p-2 rounded-lg border flex items-center gap-1.5", hasNumber ? "border-emerald-500/40 bg-emerald-500/5 text-emerald-500" : "border-border/40 text-muted-foreground")}>
                            {hasNumber ? <CheckCircle2 className="size-3.5" /> : <XCircle className="size-3.5" />}
                            <span>Numbers</span>
                        </div>
                        <div className={cn("p-2 rounded-lg border flex items-center gap-1.5", hasSymbol ? "border-emerald-500/40 bg-emerald-500/5 text-emerald-500" : "border-border/40 text-muted-foreground")}>
                            {hasSymbol ? <CheckCircle2 className="size-3.5" /> : <XCircle className="size-3.5" />}
                            <span>Symbols</span>
                        </div>
                        <div className={cn("p-2 rounded-lg border flex items-center gap-1.5", isLongEnough ? "border-emerald-500/40 bg-emerald-500/5 text-emerald-500" : "border-border/40 text-muted-foreground")}>
                            {isLongEnough ? <CheckCircle2 className="size-3.5" /> : <XCircle className="size-3.5" />}
                            <span>14+ Chars</span>
                        </div>
                    </div>
                </div>

                {/* Brute-Force Attacker Simulator Card */}
                <div className="p-6 rounded-2xl border border-border/50 bg-card/40 flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                        <Flame className="size-4 text-amber-500" />
                        <h3 className="font-bold text-sm text-foreground">Estimated Brute-Force Time</h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="p-3.5 rounded-xl border border-border/40 bg-background/60 flex flex-col gap-1.5">
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                <Laptop className="size-3.5 text-primary" />
                                <span>Fast PC (100M/s)</span>
                            </div>
                            <span className="font-bold text-sm text-foreground truncate">{formatCrackTime(crackLaptop)}</span>
                        </div>

                        <div className="p-3.5 rounded-xl border border-border/40 bg-background/60 flex flex-col gap-1.5">
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                <Cpu className="size-3.5 text-amber-500" />
                                <span>8x GPU Rig (100B/s)</span>
                            </div>
                            <span className="font-bold text-sm text-foreground truncate">{formatCrackTime(crackGpuRig)}</span>
                        </div>

                        <div className="p-3.5 rounded-xl border border-border/40 bg-background/60 flex flex-col gap-1.5">
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                <Server className="size-3.5 text-purple-500" />
                                <span>Supercomputer (100T/s)</span>
                            </div>
                            <span className="font-bold text-sm text-foreground truncate">{formatCrackTime(crackSupercomputer)}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right: Password Generator Controls */}
            <div className="lg:col-span-5 flex flex-col gap-5 p-6 rounded-2xl border border-border/50 bg-card/40">
                <div className="flex items-center justify-between pb-2 border-b border-border/40">
                    <div className="flex items-center gap-2">
                        <Zap className="size-4 text-primary" />
                        <h3 className="font-bold text-sm text-foreground">Cryptographic Generator</h3>
                    </div>
                    <Button variant="ghost" size="sm" onClick={generatePassword} className="h-7 text-xs gap-1 cursor-pointer">
                        <RefreshCw className="size-3" />
                        <span>Regenerate</span>
                    </Button>
                </div>

                <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between text-xs">
                        <Label>Password Length</Label>
                        <span className="font-mono font-bold text-foreground">{genLength} chars</span>
                    </div>
                    <Slider
                        value={[genLength]}
                        onValueChange={(val) => {
                            if (Array.isArray(val) && val[0]) setGenLength(val[0]);
                        }}
                        min={8}
                        max={36}
                        step={1}
                        className="cursor-pointer"
                    />
                </div>

                <div className="flex flex-col gap-2 pt-2 border-t border-border/40">
                    <Label className="text-xs">Include Character Sets</Label>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                        <label className="flex items-center gap-2 p-2.5 rounded-xl border border-border/50 bg-background/40 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={includeUpper}
                                onChange={(e) => setIncludeUpper(e.target.checked)}
                                className="accent-primary size-4"
                            />
                            <span>Uppercase (A-Z)</span>
                        </label>
                        <label className="flex items-center gap-2 p-2.5 rounded-xl border border-border/50 bg-background/40 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={includeLower}
                                onChange={(e) => setIncludeLower(e.target.checked)}
                                className="accent-primary size-4"
                            />
                            <span>Lowercase (a-z)</span>
                        </label>
                        <label className="flex items-center gap-2 p-2.5 rounded-xl border border-border/50 bg-background/40 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={includeNumbers}
                                onChange={(e) => setIncludeNumbers(e.target.checked)}
                                className="accent-primary size-4"
                            />
                            <span>Numbers (0-9)</span>
                        </label>
                        <label className="flex items-center gap-2 p-2.5 rounded-xl border border-border/50 bg-background/40 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={includeSymbols}
                                onChange={(e) => setIncludeSymbols(e.target.checked)}
                                className="accent-primary size-4"
                            />
                            <span>Symbols (!@#$)</span>
                        </label>
                    </div>
                </div>

                <Button onClick={generatePassword} size="lg" className="w-full gap-2 font-bold cursor-pointer rounded-xl">
                    <Sparkles className="size-4" />
                    <span>Generate New Secure Password</span>
                </Button>
            </div>
        </div>
    );
}

// ============================================================================
// TOOL 3: ZERO-KNOWLEDGE AES-256-GCM CIPHER FORGE
// ============================================================================

function arrayBufferToHex(buffer: ArrayBuffer): string {
    return Array.from(new Uint8Array(buffer))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
}

function hexToArrayBuffer(hex: string): ArrayBuffer {
    const bytes = new Uint8Array(Math.ceil(hex.length / 2));
    for (let i = 0; i < bytes.length; i++) {
        bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
    }
    return bytes.buffer;
}

function CipherForge() {
    const [secretMessage, setSecretMessage] = useState("Confidential Vault Note: PIN is 7492. Never share!");
    const [passphrase, setPassphrase] = useState("WardPassMasterKey2026");

    const [ciphertextHex, setCiphertextHex] = useState("");
    const [ivHex, setIvHex] = useState("");
    const [saltHex, setSaltHex] = useState("");
    const [authTagHex, setAuthTagHex] = useState("");
    const [isEncrypted, setIsEncrypted] = useState(false);

    // Decryption test state
    const [testCiphertext, setTestCiphertext] = useState("");
    const [decryptedResult, setDecryptedResult] = useState<string | null>(null);
    const [decryptionError, setDecryptionError] = useState<string | null>(null);

    const performEncryption = async () => {
        try {
            if (!secretMessage || !passphrase) return;
            const enc = new TextEncoder();

            // 1. Generate random salt (16 bytes) and IV (12 bytes)
            const salt = window.crypto.getRandomValues(new Uint8Array(16));
            const iv = window.crypto.getRandomValues(new Uint8Array(12));

            // 2. Derive 256-bit AES-GCM Key using PBKDF2
            const keyMaterial = await window.crypto.subtle.importKey(
                "raw",
                enc.encode(passphrase),
                { name: "PBKDF2" },
                false,
                ["deriveKey"]
            );

            const aesKey = await window.crypto.subtle.deriveKey(
                {
                    name: "PBKDF2",
                    salt: salt,
                    iterations: 100000,
                    hash: "SHA-256",
                },
                keyMaterial,
                { name: "AES-GCM", length: 256 },
                false,
                ["encrypt", "decrypt"]
            );

            // 3. Encrypt data with AES-GCM (produces ciphertext + 16-byte auth tag at the end)
            const encryptedBuffer = await window.crypto.subtle.encrypt(
                { name: "AES-GCM", iv: iv },
                aesKey,
                enc.encode(secretMessage)
            );

            const encryptedBytes = new Uint8Array(encryptedBuffer);
            // In Web Crypto AES-GCM, the last 16 bytes are the auth tag
            const tagLength = 16;
            const ciphertextBytes = encryptedBytes.slice(0, encryptedBytes.length - tagLength);
            const tagBytes = encryptedBytes.slice(encryptedBytes.length - tagLength);

            const cHex = arrayBufferToHex(ciphertextBytes.buffer);
            const ivH = arrayBufferToHex(iv.buffer);
            const sHex = arrayBufferToHex(salt.buffer);
            const tHex = arrayBufferToHex(tagBytes.buffer);

            setCiphertextHex(cHex);
            setIvHex(ivH);
            setSaltHex(sHex);
            setAuthTagHex(tHex);
            setTestCiphertext(cHex);
            setIsEncrypted(true);
            setDecryptedResult(null);
            setDecryptionError(null);
            toast.success("Message encrypted with AES-256-GCM!");
        } catch (e: any) {
            toast.error(`Encryption failed: ${e.message}`);
        }
    };

    const performDecryption = async () => {
        setDecryptedResult(null);
        setDecryptionError(null);

        try {
            const enc = new TextEncoder();
            const salt = new Uint8Array(hexToArrayBuffer(saltHex));
            const iv = new Uint8Array(hexToArrayBuffer(ivHex));
            const tagBytes = new Uint8Array(hexToArrayBuffer(authTagHex));
            const cipherBytes = new Uint8Array(hexToArrayBuffer(testCiphertext));

            // Combine ciphertext + tag back into single buffer for WebCrypto
            const combined = new Uint8Array(cipherBytes.length + tagBytes.length);
            combined.set(cipherBytes);
            combined.set(tagBytes, cipherBytes.length);

            // Derive key
            const keyMaterial = await window.crypto.subtle.importKey(
                "raw",
                enc.encode(passphrase),
                { name: "PBKDF2" },
                false,
                ["deriveKey"]
            );

            const aesKey = await window.crypto.subtle.deriveKey(
                {
                    name: "PBKDF2",
                    salt: salt,
                    iterations: 100000,
                    hash: "SHA-256",
                },
                keyMaterial,
                { name: "AES-GCM", length: 256 },
                false,
                ["encrypt", "decrypt"]
            );

            const decryptedBuffer = await window.crypto.subtle.decrypt(
                { name: "AES-GCM", iv: iv },
                aesKey,
                combined.buffer
            );

            const dec = new TextDecoder();
            const result = dec.decode(decryptedBuffer);
            setDecryptedResult(result);
            toast.success("Decryption & integrity verified!");
        } catch (err: any) {
            setDecryptionError(
                "Authentication Tag Verification Failed! Data was tampered with or corrupted in transit."
            );
            toast.error("Integrity check failed: Tampered ciphertext!");
        }
    };

    const corruptCiphertext = () => {
        if (!testCiphertext) return;
        const chars = "0123456789abcdef";
        const idx = Math.floor(Math.random() * (testCiphertext.length - 2));
        const randomChar = chars[Math.floor(Math.random() * chars.length)];
        const corrupted =
            testCiphertext.substring(0, idx) + randomChar + testCiphertext.substring(idx + 1);
        setTestCiphertext(corrupted);
        toast.warning("Flipped 1 byte in ciphertext. Try decrypting now!");
    };

    const restoreCiphertext = () => {
        setTestCiphertext(ciphertextHex);
        setDecryptedResult(null);
        setDecryptionError(null);
        toast.info("Restored original uncorrupted ciphertext");
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Input & Encryption Form */}
            <div className="lg:col-span-6 flex flex-col gap-6">
                <div className="p-6 rounded-2xl border border-border/50 bg-card/40 flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                        <Lock className="size-4 text-primary" />
                        <h3 className="font-bold text-sm text-foreground">Zero-Knowledge Encryptor</h3>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <Label className="text-xs">Plaintext Message / Secret Note</Label>
                        <Input
                            value={secretMessage}
                            onChange={(e) => setSecretMessage(e.target.value)}
                            className="font-mono text-sm h-10"
                            placeholder="Enter confidential message..."
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <Label className="text-xs">Account Passphrase (Key Material)</Label>
                        <Input
                            type="password"
                            value={passphrase}
                            onChange={(e) => setPassphrase(e.target.value)}
                            className="font-mono text-sm h-10"
                            placeholder="Passphrase used to derive AES key..."
                        />
                    </div>

                    <Button onClick={performEncryption} className="w-full font-bold gap-2 cursor-pointer rounded-xl">
                        <ShieldCheck className="size-4" />
                        <span>Encrypt with AES-256-GCM</span>
                    </Button>
                </div>

                {/* Cryptographic breakdown */}
                {isEncrypted && (
                    <div className="p-6 rounded-2xl border border-border/50 bg-card/40 flex flex-col gap-3.5">
                        <div className="flex items-center gap-2 pb-2 border-b border-border/40">
                            <Fingerprint className="size-4 text-emerald-500" />
                            <h4 className="font-bold text-xs uppercase tracking-wider text-muted-foreground">
                                Cryptographic Artifacts
                            </h4>
                        </div>

                        <div className="flex flex-col gap-1">
                            <span className="text-[11px] font-semibold text-muted-foreground">Initialization Vector (IV - 12 bytes / 96 bits)</span>
                            <div className="p-2 rounded-lg bg-background/60 font-mono text-xs text-primary truncate select-all">
                                {ivHex}
                            </div>
                        </div>

                        <div className="flex flex-col gap-1">
                            <span className="text-[11px] font-semibold text-muted-foreground">Argon2/PBKDF2 Salt (16 bytes)</span>
                            <div className="p-2 rounded-lg bg-background/60 font-mono text-xs text-foreground truncate select-all">
                                {saltHex}
                            </div>
                        </div>

                        <div className="flex flex-col gap-1">
                            <span className="text-[11px] font-semibold text-muted-foreground">AES-GCM Authentication Tag (16 bytes)</span>
                            <div className="p-2 rounded-lg bg-background/60 font-mono text-xs text-amber-500 truncate select-all">
                                {authTagHex}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Right: Ciphertext & Tamper Sandbox */}
            <div className="lg:col-span-6 flex flex-col gap-6">
                <div className="p-6 rounded-2xl border border-border/50 bg-card/40 flex flex-col gap-4">
                    <div className="flex items-center justify-between pb-2 border-b border-border/40">
                        <div className="flex items-center gap-2">
                            <Cpu className="size-4 text-primary" />
                            <h3 className="font-bold text-sm text-foreground">Tamper & Decryption Sandbox</h3>
                        </div>
                        {isEncrypted && (
                            <Badge variant="outline" className="text-xs font-mono text-emerald-500 border-emerald-500/30">
                                Authenticated
                            </Badge>
                        )}
                    </div>

                    {!isEncrypted ? (
                        <div className="py-12 text-center text-muted-foreground text-xs">
                            Encrypt a message on the left to inspect and test tampering on the ciphertext.
                        </div>
                    ) : (
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col gap-1.5">
                                <div className="flex items-center justify-between">
                                    <Label className="text-xs">Ciphertext Payload (Hex)</Label>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={corruptCiphertext}
                                            className="text-[11px] font-semibold text-amber-500 hover:underline cursor-pointer"
                                        >
                                            Corrupt 1 Byte
                                        </button>
                                        <span className="text-border">•</span>
                                        <button
                                            onClick={restoreCiphertext}
                                            className="text-[11px] font-semibold text-primary hover:underline cursor-pointer"
                                        >
                                            Restore Original
                                        </button>
                                    </div>
                                </div>
                                <textarea
                                    value={testCiphertext}
                                    onChange={(e) => setTestCiphertext(e.target.value)}
                                    rows={4}
                                    className="w-full p-3 rounded-xl border border-border/60 bg-background/60 font-mono text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                                />
                            </div>

                            <Button onClick={performDecryption} variant="secondary" className="w-full font-bold gap-2 cursor-pointer rounded-xl">
                                <KeyRound className="size-4" />
                                <span>Attempt Decryption & Integrity Check</span>
                            </Button>

                            {/* Result feedback */}
                            {decryptedResult && (
                                <div className="p-4 rounded-xl border border-emerald-500/40 bg-emerald-500/10 flex items-start gap-3">
                                    <CheckCircle2 className="size-5 text-emerald-500 shrink-0 mt-0.5" />
                                    <div className="flex flex-col gap-1">
                                        <span className="text-xs font-bold text-emerald-500 uppercase tracking-wider">
                                            Decryption Succeeded
                                        </span>
                                        <p className="text-sm font-mono text-foreground">{decryptedResult}</p>
                                    </div>
                                </div>
                            )}

                            {decryptionError && (
                                <div className="p-4 rounded-xl border border-destructive/40 bg-destructive/10 flex items-start gap-3">
                                    <AlertTriangle className="size-5 text-destructive shrink-0 mt-0.5" />
                                    <div className="flex flex-col gap-1">
                                        <span className="text-xs font-bold text-destructive uppercase tracking-wider">
                                            Tampering Detected!
                                        </span>
                                        <p className="text-xs text-muted-foreground">{decryptionError}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// ============================================================================
// TOOL 4: DICEWARE MEMORABLE PASSPHRASE FORGE
// ============================================================================

const DICEWARE_WORDLIST = [
    "galaxy", "rocket", "battery", "staple", "cipher", "matrix", "shield", "silver",
    "timber", "falcon", "orbit", "velvet", "quantum", "crystal", "phoenix", "anchor",
    "breeze", "canyon", "desert", "echo", "flame", "glacier", "harbor", "island",
    "jungle", "karma", "lagoon", "meadow", "nebula", "oasis", "planet", "quarry",
    "radiant", "summit", "thunder", "uranium", "vortex", "whisper", "zenith", "aurora",
    "beacon", "cascade", "dragon", "eclipse", "forest", "gravity", "horizon", "impact",
    "jaguar", "knight", "lunar", "meteor", "nexus", "omega", "pulsar", "quartz"
];

function DicewareForge() {
    const [wordCount, setWordCount] = useState(4);
    const [separator, setSeparator] = useState("-");
    const [casing, setCasing] = useState<"title" | "lower" | "upper">("title");
    const [includeNumber, setIncludeNumber] = useState(true);
    const [passphrase, setPassphrase] = useState("Galaxy-Rocket-Battery-Staple42");
    const [diceHistory, setDiceHistory] = useState<number[][]>([]);
    const [isRolling, setIsRolling] = useState(false);

    const rollDice = () => {
        setIsRolling(true);
        const rolls: number[][] = [];
        const chosenWords: string[] = [];

        for (let i = 0; i < wordCount; i++) {
            const singleRoll: number[] = [];
            for (let d = 0; d < 5; d++) {
                singleRoll.push(Math.floor(1 + Math.random() * 6));
            }
            rolls.push(singleRoll);
            const word = DICEWARE_WORDLIST[Math.floor(Math.random() * DICEWARE_WORDLIST.length)];
            chosenWords.push(word);
        }

        setTimeout(() => {
            const formatted = chosenWords.map((w) => {
                if (casing === "title") return w.charAt(0).toUpperCase() + w.slice(1);
                if (casing === "upper") return w.toUpperCase();
                return w.toLowerCase();
            });

            let result = formatted.join(separator);
            if (includeNumber) {
                result += String(Math.floor(10 + Math.random() * 90));
            }

            setDiceHistory(rolls);
            setPassphrase(result);
            setIsRolling(false);
            toast.success("Rolled virtual dice and forged new passphrase!");
        }, 300);
    };

    const copyPassphrase = () => {
        navigator.clipboard.writeText(passphrase);
        toast.success("Passphrase copied to clipboard");
    };

    // Entropy calculation for diceware: log2(7776^words) ~ 12.9 bits per word
    const estimatedBits = Math.round(wordCount * 12.9 + (includeNumber ? 6.6 : 0));

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Interactive Forge Display */}
            <div className="lg:col-span-7 flex flex-col gap-6">
                <div className="p-6 sm:p-8 rounded-2xl border border-border/50 bg-card/40 flex flex-col items-center text-center gap-6">
                    <div className="size-14 rounded-2xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center">
                        <Dices className={cn("size-7", isRolling && "animate-spin")} />
                    </div>

                    <div className="flex flex-col gap-2 max-w-lg">
                        <h3 className="text-xl font-bold text-foreground">Diceware Passphrase Forge</h3>
                        <p className="text-xs text-muted-foreground">
                            Diceware uses true entropy from rolling dice to select words from a cryptographic dictionary.
                            These passphrases are virtually immune to brute-force attacks yet memorable for human brains.
                        </p>
                    </div>

                    {/* Result Card */}
                    <div className="w-full p-5 rounded-2xl border border-primary/40 bg-background/80 shadow-inner flex flex-col items-center gap-3">
                        <span className="text-xl sm:text-2xl font-mono font-black text-foreground tracking-wide break-all select-all">
                            {passphrase}
                        </span>

                        <div className="flex items-center gap-3">
                            <Badge variant="outline" className="text-xs font-mono border-emerald-500/40 text-emerald-500 bg-emerald-500/5">
                                ~{estimatedBits} Bits of Entropy
                            </Badge>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={copyPassphrase}
                                className="h-7 text-xs gap-1.5 cursor-pointer rounded-lg"
                            >
                                <Copy className="size-3" />
                                <span>Copy</span>
                            </Button>
                        </div>
                    </div>

                    {/* Roll Dice Action Button */}
                    <Button
                        onClick={rollDice}
                        disabled={isRolling}
                        size="lg"
                        className="w-full sm:w-auto px-8 font-bold gap-2 cursor-pointer rounded-xl"
                    >
                        <Dices className="size-4" />
                        <span>Roll Virtual Dice</span>
                    </Button>

                    {/* Simulated Dice History */}
                    {diceHistory.length > 0 && (
                        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                            {diceHistory.map((roll, idx) => (
                                <div
                                    key={idx}
                                    className="px-2.5 py-1 rounded-lg border border-border/60 bg-muted/30 font-mono text-[11px] text-muted-foreground"
                                >
                                    [{roll.join("")}]
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Right: Forge Configuration Controls */}
            <div className="lg:col-span-5 flex flex-col gap-5 p-6 rounded-2xl border border-border/50 bg-card/40">
                <div className="flex items-center gap-2 pb-2 border-b border-border/40">
                    <Sliders className="size-4 text-primary" />
                    <h3 className="font-bold text-sm text-foreground">Passphrase Parameters</h3>
                </div>

                <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between text-xs">
                        <Label>Word Count</Label>
                        <span className="font-mono font-bold text-foreground">{wordCount} words</span>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                        {[3, 4, 5, 6].map((count) => (
                            <Button
                                key={count}
                                type="button"
                                variant={wordCount === count ? "default" : "outline"}
                                size="sm"
                                onClick={() => setWordCount(count)}
                                className="cursor-pointer rounded-xl"
                            >
                                {count}
                            </Button>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <Label className="text-xs">Word Separator</Label>
                    <div className="grid grid-cols-5 gap-2">
                        {[
                            { label: "Hyphen (-)", value: "-" },
                            { label: "Dot (.)", value: "." },
                            { label: "Under (_)", value: "_" },
                            { label: "Space", value: " " },
                            { label: "Hash (#)", value: "#" },
                        ].map((sep) => (
                            <Button
                                key={sep.value}
                                type="button"
                                variant={separator === sep.value ? "default" : "outline"}
                                size="sm"
                                onClick={() => setSeparator(sep.value)}
                                className="font-mono cursor-pointer rounded-xl"
                            >
                                {sep.value === " " ? "space" : sep.value}
                            </Button>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <Label className="text-xs">Letter Casing</Label>
                    <div className="grid grid-cols-3 gap-2">
                        {[
                            { label: "TitleCase", value: "title" },
                            { label: "lowercase", value: "lower" },
                            { label: "UPPERCASE", value: "upper" },
                        ].map((c) => (
                            <Button
                                key={c.value}
                                type="button"
                                variant={casing === c.value ? "default" : "outline"}
                                size="sm"
                                onClick={() => setCasing(c.value as any)}
                                className="cursor-pointer rounded-xl text-xs"
                            >
                                {c.label}
                            </Button>
                        ))}
                    </div>
                </div>

                <div className="pt-2 border-t border-border/40">
                    <label className="flex items-center gap-2 p-3 rounded-xl border border-border/50 bg-background/40 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={includeNumber}
                            onChange={(e) => setIncludeNumber(e.target.checked)}
                            className="accent-primary size-4"
                        />
                        <span className="text-xs font-medium text-foreground">
                            Append random digits at the end
                        </span>
                    </label>
                </div>
            </div>
        </div>
    );
}

// ============================================================================
// MAIN PLAYGROUND PAGE COMPONENT
// ============================================================================

export default function PlaygroundPage() {
    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-6 sm:py-8 flex flex-col gap-7">
            {/* Header & Breadcrumb */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-4">
                <div className="flex items-center gap-3">
                    <Link
                        href="/strongroom"
                        className="p-2 rounded-xl border border-border/60 hover:bg-muted/60 transition-colors text-muted-foreground hover:text-foreground cursor-pointer shrink-0"
                        title="Back to Strongroom"
                    >
                        <ArrowLeft className="size-4" />
                    </Link>
                    <div>
                        <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
                            <span>WardPass Security Lab & Playground</span>
                            <Sparkles className="size-5 text-primary" />
                        </h1>
                        <p className="text-xs text-muted-foreground">
                            Interactive sandboxed cryptographic tools, payment card laboratory, and password security forge.
                        </p>
                    </div>
                </div>

                <Badge variant="outline" className="text-xs font-mono font-medium border-primary/30 text-primary bg-primary/5 px-3 py-1 shrink-0 self-start sm:self-auto">
                    Sandboxed Simulation
                </Badge>
            </div>

            {/* Interactive Tabbed Security Activities */}
            <Tabs defaultValue="card-studio" className="w-full flex flex-col gap-6">
                <TabsList className="w-full flex flex-wrap sm:flex-nowrap items-center justify-between gap-1.5 p-1.5 rounded-2xl bg-muted/30 border border-border/50 group-data-horizontal/tabs:h-auto h-auto">
                    <TabsTrigger value="card-studio" className="flex-1 min-w-[130px] flex items-center justify-center gap-2 py-2 px-3 rounded-xl cursor-pointer text-xs font-semibold data-active:bg-background data-active:text-foreground data-active:shadow-xs transition-all h-auto">
                        <CreditCard className="size-4" />
                        <span>Card Studio</span>
                    </TabsTrigger>
                    <TabsTrigger value="password-lab" className="flex-1 min-w-[130px] flex items-center justify-center gap-2 py-2 px-3 rounded-xl cursor-pointer text-xs font-semibold data-active:bg-background data-active:text-foreground data-active:shadow-xs transition-all h-auto">
                        <KeyRound className="size-4" />
                        <span>Crack-Time Lab</span>
                    </TabsTrigger>
                    <TabsTrigger value="cipher-forge" className="flex-1 min-w-[130px] flex items-center justify-center gap-2 py-2 px-3 rounded-xl cursor-pointer text-xs font-semibold data-active:bg-background data-active:text-foreground data-active:shadow-xs transition-all h-auto">
                        <ShieldCheck className="size-4" />
                        <span>AES-256 Cipher</span>
                    </TabsTrigger>
                    <TabsTrigger value="diceware-forge" className="flex-1 min-w-[130px] flex items-center justify-center gap-2 py-2 px-3 rounded-xl cursor-pointer text-xs font-semibold data-active:bg-background data-active:text-foreground data-active:shadow-xs transition-all h-auto">
                        <Dices className="size-4" />
                        <span>Diceware Forge</span>
                    </TabsTrigger>
                </TabsList>

                {/* Tab 1: Card Studio */}
                <TabsContent value="card-studio">
                    <CardStudio />
                </TabsContent>

                {/* Tab 2: Password Entropy Lab */}
                <TabsContent value="password-lab">
                    <PasswordLab />
                </TabsContent>

                {/* Tab 3: Cipher Forge */}
                <TabsContent value="cipher-forge">
                    <CipherForge />
                </TabsContent>

                {/* Tab 4: Diceware Forge */}
                <TabsContent value="diceware-forge">
                    <DicewareForge />
                </TabsContent>
            </Tabs>
        </div>
    );
}
