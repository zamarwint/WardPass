"use client";

import React, { useState } from "react";
import { Copy, Check, Eye, EyeOff, ExternalLink, Calendar, Clock, LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function CopyButton({
    value,
    label,
    className,
}: {
    value?: string | number | null;
    label?: string;
    className?: string;
}) {
    const [copied, setCopied] = useState(false);

    if (value == null || value === "") return null;

    const handleCopy = (e: React.MouseEvent) => {
        e.stopPropagation();
        navigator.clipboard.writeText(String(value));
        setCopied(true);
        toast.success(label ? `Copied ${label} to clipboard` : "Copied to clipboard");
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Button
            type="button"
            variant="ghost"
            size="icon"
            className={cn(
                "size-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors cursor-pointer shrink-0",
                className
            )}
            onClick={handleCopy}
            title={copied ? "Copied!" : label ? `Copy ${label}` : "Copy"}
            aria-label={label ? `Copy ${label}` : "Copy"}
        >
            {copied ? <Check className="size-4 text-emerald-500" /> : <Copy className="size-4" />}
        </Button>
    );
}

export function DetailRow({
    label,
    value,
    icon: Icon,
    mono = false,
    isSecret = false,
    copyable = true,
    href,
    className,
}: {
    label: string;
    value?: string | number | null;
    icon?: LucideIcon;
    mono?: boolean;
    isSecret?: boolean;
    copyable?: boolean;
    href?: string;
    className?: string;
}) {
    const [revealed, setRevealed] = useState(false);

    if (value == null || value === "") return null;

    const stringValue = String(value);

    // Format display string for masked secrets
    const displayValue = isSecret
        ? revealed
            ? stringValue
            : "••••••••••••"
        : stringValue;

    return (
        <div
            className={cn(
                "group flex items-center justify-between p-3 rounded-xl border border-border/40 bg-card/40 hover:bg-muted/30 transition-all gap-3",
                className
            )}
        >
            <div className="flex items-center gap-3 min-w-0 flex-1">
                {Icon && (
                    <div className="size-8 rounded-lg bg-muted/60 flex items-center justify-center shrink-0 text-muted-foreground">
                        <Icon className="size-4" />
                    </div>
                )}
                <div className="flex flex-col min-w-0 flex-1">
                    <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                        {label}
                    </span>
                    {href ? (
                        <a
                            href={href.startsWith("http") ? href : `https://${href}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-medium text-primary hover:underline truncate inline-flex items-center gap-1.5 mt-0.5"
                        >
                            <span className="truncate">{stringValue}</span>
                            <ExternalLink className="size-3.5 shrink-0 opacity-70" />
                        </a>
                    ) : (
                        <span
                            className={cn(
                                "text-sm font-medium text-foreground truncate mt-0.5 select-text",
                                (mono || isSecret) && "font-mono"
                            )}
                        >
                            {displayValue}
                        </span>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
                {isSecret && (
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/80 cursor-pointer"
                        onClick={() => setRevealed((prev) => !prev)}
                        title={revealed ? "Hide" : "Reveal"}
                        aria-label={revealed ? "Hide" : "Reveal"}
                    >
                        {revealed ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </Button>
                )}
                {copyable && <CopyButton value={stringValue} label={label} />}
            </div>
        </div>
    );
}

export function SectionCard({
    title,
    icon: Icon,
    children,
    className,
}: {
    title: string;
    icon?: LucideIcon;
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <div className={cn("rounded-2xl border border-border/40 bg-card/20 p-5 flex flex-col gap-3.5 shadow-xs", className)}>
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground/90">
                {Icon && <Icon className="size-4 text-primary" />}
                <span>{title}</span>
            </div>
            <div className="flex flex-col gap-2">{children}</div>
        </div>
    );
}

export function ItemHeader({
    title,
    itemType,
    badgeColor = "text-primary border-primary/25 bg-primary/5",
    icon: Icon,
    iconBgColor = "bg-primary/10 text-primary border-primary/20",
    subtitle,
    actions,
}: {
    title: string;
    itemType: string;
    badgeColor?: string;
    icon: LucideIcon;
    iconBgColor?: string;
    subtitle?: string;
    actions?: React.ReactNode;
}) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/50">
            <div className="flex items-center gap-4 min-w-0">
                <div
                    className={cn(
                        "size-13 sm:size-14 rounded-2xl flex items-center justify-center shrink-0 border shadow-xs",
                        iconBgColor
                    )}
                >
                    <Icon className="size-7" />
                </div>
                <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-2.5 flex-wrap">
                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground truncate">
                            {title}
                        </h1>
                        <Badge variant="outline" className={cn("text-xs font-semibold px-2 py-0.5 rounded-full shrink-0", badgeColor)}>
                            {itemType}
                        </Badge>
                    </div>
                    {subtitle && (
                        <p className="text-xs sm:text-sm text-muted-foreground mt-1 truncate">
                            {subtitle}
                        </p>
                    )}
                </div>
            </div>

            {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
        </div>
    );
}

export function ItemMetadata({
    createdAt,
    updatedAt,
}: {
    createdAt?: Date | string | null;
    updatedAt?: Date | string | null;
}) {
    const formatDate = (d?: Date | string | null) => {
        if (!d) return "—";
        const date = new Date(d);
        if (Number.isNaN(date.getTime())) return "—";
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <div className="rounded-xl border border-border/30 bg-muted/20 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
                <Calendar className="size-3.5" />
                <span>Created: <strong className="text-foreground/80 font-medium">{formatDate(createdAt)}</strong></span>
            </div>
            <div className="flex items-center gap-2">
                <Clock className="size-3.5" />
                <span>Last Updated: <strong className="text-foreground/80 font-medium">{formatDate(updatedAt)}</strong></span>
            </div>
        </div>
    );
}
