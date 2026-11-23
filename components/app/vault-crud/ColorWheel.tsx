"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { Check, Pipette } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

// Preset modern palette for instant one-click selection
export const PRESET_VAULT_COLORS = [
    { label: "Sapphire Blue", hex: "#3b82f6" },
    { label: "Emerald Green", hex: "#10b981" },
    { label: "Violet Purple", hex: "#8b5cf6" },
    { label: "Amber Gold", hex: "#f59e0b" },
    { label: "Crimson Red", hex: "#ef4444" },
    { label: "Cyan Sky", hex: "#06b6d4" },
    { label: "Fuchsia Pink", hex: "#d946ef" },
    { label: "Coral Orange", hex: "#f97316" },
    { label: "Indigo Dusk", hex: "#6366f1" },
    { label: "Teal Mint", hex: "#14b8a6" },
    { label: "Rose Petal", hex: "#f43f5e" },
    { label: "Slate Silver", hex: "#64748b" },
];

/**
 * Converts HSL to 6-character Hex string (#rrggbb)
 */
function hslToHex(h: number, s: number, l: number): string {
    s /= 100;
    l /= 100;
    const a = s * Math.min(l, 1 - l);
    const f = (n: number) => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color)
            .toString(16)
            .padStart(2, "0");
    };
    return `#${f(0)}${f(8)}${f(4)}`.toLowerCase();
}

/**
 * Converts Hex string to Hue (0 - 360)
 */
function hexToHue(hex: string): number {
    const clean = hex.replace("#", "");
    if (clean.length !== 6 && clean.length !== 3) return 210;
    const full =
        clean.length === 3
            ? clean
                  .split("")
                  .map((c) => c + c)
                  .join("")
            : clean;
    const r = parseInt(full.slice(0, 2), 16) / 255;
    const g = parseInt(full.slice(2, 4), 16) / 255;
    const b = parseInt(full.slice(4, 6), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;

    if (max === min) return 0;
    const d = max - min;
    switch (max) {
        case r:
            h = (g - b) / d + (g < b ? 6 : 0);
            break;
        case g:
            h = (b - r) / d + 2;
            break;
        case b:
            h = (r - g) / d + 4;
            break;
    }
    return Math.round(h * 60);
}

interface ColorWheelProps {
    value?: string;
    onChange: (color: string) => void;
    className?: string;
}

export function ColorWheel({ value = "#3b82f6", onChange, className }: ColorWheelProps) {
    const [hue, setHue] = useState<number>(() => hexToHue(value || "#3b82f6"));
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const [hexInput, setHexInput] = useState<string>(value || "#3b82f6");
    const wheelRef = useRef<HTMLDivElement>(null);

    // Sync input when value prop changes from outside
    useEffect(() => {
        if (value && value !== hexInput) {
            setHexInput(value);
            setHue(hexToHue(value));
        }
    }, [value]);

    const updateColorFromPoint = useCallback(
        (clientX: number, clientY: number) => {
            if (!wheelRef.current) return;
            const rect = wheelRef.current.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            const dx = clientX - centerX;
            const dy = clientY - centerY;

            // Calculate angle in degrees (0 - 360)
            let angle = Math.atan2(dy, dx) * (180 / Math.PI);
            if (angle < 0) angle += 360;

            const newHue = Math.round(angle);
            setHue(newHue);

            const hex = hslToHex(newHue, 85, 52);
            setHexInput(hex);
            onChange(hex);
        },
        [onChange]
    );

    const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
        setIsDragging(true);
        (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
        updateColorFromPoint(e.clientX, e.clientY);
    };

    const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
        if (!isDragging) return;
        updateColorFromPoint(e.clientX, e.clientY);
    };

    const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
        setIsDragging(false);
        try {
            (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
        } catch {
            // ignore
        }
    };

    const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setHexInput(val);
        if (/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(val)) {
            setHue(hexToHue(val));
            onChange(val);
        }
    };

    const handlePresetSelect = (hex: string) => {
        setHexInput(hex);
        setHue(hexToHue(hex));
        onChange(hex);
    };

    // Calculate pointer position on the color wheel ring
    // Wheel radius = 70px (140px total size), ring center at radius 55px
    const ringRadius = 54;
    const rad = (hue * Math.PI) / 180;
    const handleX = 70 + ringRadius * Math.cos(rad);
    const handleY = 70 + ringRadius * Math.sin(rad);

    const currentColor = value || hexInput || "#3b82f6";

    return (
        <div className={cn("flex flex-col gap-4 w-full", className)}>
            {/* Color Wheel Interactive Canvas & Swatch Preview */}
            <div className="flex items-center justify-center gap-6">
                {/* Circular Color Wheel */}
                <div
                    ref={wheelRef}
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    className="relative size-[140px] rounded-full cursor-crosshair touch-none select-none shadow-md shrink-0 border border-border/40"
                    style={{
                        background:
                            "conic-gradient(from 0deg, #ff0000, #ff8000, #ffff00, #00ff00, #00ffff, #0080ff, #0000ff, #8000ff, #ff00ff, #ff0080, #ff0000)",
                    }}
                >
                    {/* Inner Cutout Hole */}
                    <div className="absolute inset-5 rounded-full bg-background flex flex-col items-center justify-center shadow-inner pointer-events-none">
                        {/* Center Live Swatch Preview */}
                        <div
                            className="size-9 rounded-full shadow-md border-2 border-background ring-1 ring-border/50 transition-colors duration-100 flex items-center justify-center"
                            style={{ backgroundColor: currentColor }}
                        >
                            <Pipette className="size-4 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]" />
                        </div>
                    </div>

                    {/* Draggable Hue Selector Handle */}
                    <div
                        className="absolute size-5 -ml-2.5 -mt-2.5 rounded-full border-2 border-white shadow-[0_0_6px_rgba(0,0,0,0.6)] pointer-events-none transition-transform"
                        style={{
                            left: `${handleX}px`,
                            top: `${handleY}px`,
                            backgroundColor: currentColor,
                        }}
                    />
                </div>

                {/* Hex Code Input & Live Preview Card */}
                <div className="flex flex-col gap-2 flex-1 min-w-0">
                    <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Selected Vault Color
                    </div>
                    <div className="flex items-center gap-2">
                        <div
                            className="size-8 rounded-lg border border-border/60 shrink-0 shadow-xs"
                            style={{ backgroundColor: currentColor }}
                        />
                        <Input
                            type="text"
                            value={hexInput}
                            onChange={handleHexChange}
                            placeholder="#3b82f6"
                            className="font-mono text-sm uppercase h-9 flex-1"
                            maxLength={7}
                        />
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                        Drag the wheel or pick a preset below to style your vault icon.
                    </p>
                </div>
            </div>

            {/* Quick Modern Palette Swatches */}
            <div className="flex flex-wrap gap-2 pt-1">
                {PRESET_VAULT_COLORS.map((preset) => {
                    const isSelected = currentColor.toLowerCase() === preset.hex.toLowerCase();
                    return (
                        <button
                            key={preset.hex}
                            type="button"
                            title={preset.label}
                            aria-label={preset.label}
                            onClick={() => handlePresetSelect(preset.hex)}
                            className={cn(
                                "size-6.5 rounded-lg border transition-all duration-150 flex items-center justify-center cursor-pointer shadow-2xs hover:scale-110",
                                isSelected
                                    ? "border-primary ring-2 ring-primary/40 scale-105"
                                    : "border-border/60 hover:border-border"
                            )}
                            style={{ backgroundColor: preset.hex }}
                        >
                            {isSelected && <Check className="size-3.5 text-white drop-shadow-md" />}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
