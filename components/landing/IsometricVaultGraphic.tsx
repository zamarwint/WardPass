"use client";

import { useId } from "react";

export default function IsometricVaultGraphic() {
    const uniqueId = useId().replace(/:/g, "-");

    return (
        <div className="relative w-full aspect-4/3 max-w-155 mx-auto select-none">
            {/* Ambient background glow beneath the 3D isometric plane */}
            <div className="absolute inset-0 bg-primary/15 blur-[90px] rounded-full -z-10 pointer-events-none" />

            <svg
                viewBox="0 0 640 480"
                className="w-full h-full overflow-visible"
                xmlns="http://www.w3.org/2000/svg"
            >
                <defs>
                    {/* Glowing linear gradients */}
                    <linearGradient id={`iso-gold-amber-${uniqueId}`} x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#F7C873" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#D6A51D" stopOpacity="0.7" />
                    </linearGradient>

                    <linearGradient id={`iso-top-plane-${uniqueId}`} x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#D6A51D" stopOpacity="0.3" />
                        <stop offset="50%" stopColor="#D6A51D" stopOpacity="0.15" />
                        <stop offset="100%" stopColor="#D6A51D" stopOpacity="0.05" />
                    </linearGradient>

                    <linearGradient id={`iso-floating-box-${uniqueId}`} x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#D6A51D" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#D6A51D" stopOpacity="0.05" />
                    </linearGradient>

                    {/* Filter for glowing drop shadow */}
                    <filter id={`neon-glow-${uniqueId}`} x="-30%" y="-30%" width="160%" height="160%">
                        <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor="#D6A51D" floodOpacity="0.45" />
                    </filter>
                    <filter id={`box-shadow-${uniqueId}`} x="-40%" y="-40%" width="180%" height="180%">
                        <feDropShadow dx="0" dy="16" stdDeviation="16" floodColor="#000000" floodOpacity="0.25" />
                    </filter>
                </defs>

                {/* ─── ISOMETRIC GRID BASE ──────────────────────────────────── */}
                <g className="opacity-25 stroke-border">
                    <line x1="80" y1="360" x2="560" y2="120" stroke="currentColor" strokeDasharray="3 4" strokeWidth="0.8" />
                    <line x1="80" y1="200" x2="560" y2="440" stroke="currentColor" strokeDasharray="3 4" strokeWidth="0.8" />
                    <line x1="160" y1="160" x2="480" y2="400" stroke="currentColor" strokeDasharray="3 4" strokeWidth="0.8" />
                    <line x1="160" y1="400" x2="480" y2="160" stroke="currentColor" strokeDasharray="3 4" strokeWidth="0.8" />
                </g>

                {/* ─── TELEMETRY EXTENSION LINES & BADGES ─────────────────── */}
                {/* Right callout: COVERAGE */}
                <g>
                    <line x1="470" y1="230" x2="560" y2="190" stroke="#D6A51D" strokeWidth="1" strokeDasharray="2 3" />
                    <circle cx="470" cy="230" r="3" fill="#D6A51D" />
                    <rect x="540" y="176" width="76" height="20" rx="3" className="fill-card stroke-primary/50" strokeWidth="1" />
                    <text x="578" y="190" className="fill-primary font-mono text-[9px] font-semibold" textAnchor="middle" letterSpacing="0.8">
                        COVERAGE: 100%
                    </text>
                </g>

                {/* Left bottom callout: ZERO LEAK */}
                <g>
                    <line x1="220" y1="340" x2="140" y2="380" stroke="#D6A51D" strokeWidth="1" strokeDasharray="2 3" />
                    <circle cx="220" cy="340" r="3" fill="#D6A51D" />
                    <rect x="90" y="370" width="80" height="20" rx="3" className="fill-card stroke-primary/50" strokeWidth="1" />
                    <text x="130" y="384" className="fill-primary font-mono text-[9px] font-semibold" textAnchor="middle" letterSpacing="0.8">
                        PLAINTEXT: 0B
                    </text>
                </g>

                {/* Top callout: ENVELOPE VERIFIED */}
                <g>
                    <line x1="320" y1="90" x2="320" y2="45" stroke="#D6A51D" strokeWidth="1" strokeDasharray="2 3" />
                    <circle cx="320" cy="90" r="3" fill="#D6A51D" />
                    <rect x="245" y="28" width="150" height="22" rx="3" className="fill-card stroke-primary/60" strokeWidth="1" />
                    <text x="320" y="42" className="fill-foreground font-mono text-[9px] font-semibold" textAnchor="middle" letterSpacing="0.8">
                        AES-256-GCM / INTEGRITY VERIFIED
                    </text>
                </g>

                {/* ─── BASE ISOMETRIC SLAB (VAULT STORAGE LEVEL) ─────────────── */}
                <g filter={`url(#box-shadow-${uniqueId})`}>
                    {/* Left vertical side of slab */}
                    <path
                        d="M 120 280 L 320 380 L 320 420 L 120 320 Z"
                        className="fill-secondary stroke-primary/40"
                        strokeWidth="1.2"
                    />
                    {/* Right vertical side of slab */}
                    <path
                        d="M 320 380 L 520 280 L 520 320 L 320 420 Z"
                        className="fill-muted stroke-primary/40"
                        strokeWidth="1.2"
                    />
                    {/* Top isometric diamond surface */}
                    <path
                        d="M 320 180 L 520 280 L 320 380 L 120 280 Z"
                        fill={`url(#iso-top-plane-${uniqueId})`}
                        stroke="#D6A51D"
                        strokeWidth="1.5"
                    />

                    {/* Sub-grid on base platform */}
                    <path
                        d="M 220 230 L 420 330 M 170 255 L 370 355 M 270 205 L 470 305"
                        stroke="#D6A51D"
                        strokeOpacity="0.25"
                        strokeWidth="0.8"
                    />
                    <path
                        d="M 420 230 L 220 330 M 470 255 L 270 355 M 370 205 L 170 305"
                        stroke="#D6A51D"
                        strokeOpacity="0.25"
                        strokeWidth="0.8"
                    />

                    {/* Glowing perimeter points on the slab corners */}
                    <circle cx="120" cy="280" r="3.5" fill="#D6A51D" filter={`url(#neon-glow-${uniqueId})`} />
                    <circle cx="320" cy="380" r="3.5" fill="#D6A51D" filter={`url(#neon-glow-${uniqueId})`} />
                    <circle cx="520" cy="280" r="3.5" fill="#D6A51D" filter={`url(#neon-glow-${uniqueId})`} />
                    <circle cx="320" cy="180" r="3.5" fill="#D6A51D" filter={`url(#neon-glow-${uniqueId})`} />
                </g>

                {/* ─── FLOATING ISOMETRIC INNER PLATE (KDF / ARGON2ID LAYER) ─── */}
                <g>
                    {/* Left side */}
                    <path
                        d="M 180 255 L 320 325 L 320 345 L 180 275 Z"
                        className="fill-secondary/90 stroke-primary/50"
                        strokeWidth="1"
                    />
                    {/* Right side */}
                    <path
                        d="M 320 325 L 460 255 L 460 275 L 320 345 Z"
                        className="fill-muted/90 stroke-primary/50"
                        strokeWidth="1"
                    />
                    {/* Top */}
                    <path
                        d="M 320 185 L 460 255 L 320 325 L 180 255 Z"
                        fill={`url(#iso-gold-amber-${uniqueId})`}
                        stroke="#D6A51D"
                        strokeWidth="1.2"
                    />

                    {/* Telemetry wave line on middle layer */}
                    <path
                        d="M 210 260 Q 250 290 280 270 T 340 310 T 390 270 T 430 255"
                        fill="none"
                        stroke="#D6A51D"
                        strokeWidth="1.6"
                        filter={`url(#neon-glow-${uniqueId})`}
                    />
                </g>

                {/* ─── TOP FLOATING WIREFRAME CUBE (ENCRYPTED RECORD) ───────── */}
                <g className="animate-pulse" style={{ animationDuration: "5s" }}>
                    {/* Vertical pillar alignment lines linking top cube to base */}
                    <line x1="260" y1="120" x2="260" y2="215" stroke="#D6A51D" strokeDasharray="3 4" strokeWidth="0.8" opacity="0.6" />
                    <line x1="380" y1="120" x2="380" y2="215" stroke="#D6A51D" strokeDasharray="3 4" strokeWidth="0.8" opacity="0.6" />
                    <line x1="320" y1="90" x2="320" y2="185" stroke="#D6A51D" strokeDasharray="3 4" strokeWidth="0.8" opacity="0.6" />
                    <line x1="320" y1="150" x2="320" y2="245" stroke="#D6A51D" strokeDasharray="3 4" strokeWidth="0.8" opacity="0.6" />

                    {/* Left wireframe face */}
                    <path
                        d="M 260 120 L 320 150 L 320 190 L 260 160 Z"
                        fill={`url(#iso-floating-box-${uniqueId})`}
                        stroke="#D6A51D"
                        strokeWidth="1.2"
                    />
                    {/* Right wireframe face */}
                    <path
                        d="M 320 150 L 380 120 L 380 160 L 320 190 Z"
                        fill={`url(#iso-floating-box-${uniqueId})`}
                        stroke="#D6A51D"
                        strokeWidth="1.2"
                    />
                    {/* Top wireframe face */}
                    <path
                        d="M 320 90 L 380 120 L 320 150 L 260 120 Z"
                        className="fill-primary/20"
                        stroke="#D6A51D"
                        strokeWidth="1.5"
                    />

                    {/* Inner glowing lock icon node */}
                    <circle cx="320" cy="135" r="14" className="fill-card stroke-primary" strokeWidth="1.5" />
                    <path
                        d="M 316 132 v -3 a 4 4 0 0 1 8 0 v 3 m -10 0 h 12 v 9 h -12 z"
                        fill="none"
                        className="stroke-primary"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                    />
                </g>

                {/* ─── FLOATING LABELS ON PLATFORMS ──────────────────────────── */}
                <g>
                    <rect x="235" y="278" width="170" height="22" rx="3" className="fill-card stroke-primary/50 shadow-sm" strokeWidth="0.8" />
                    <text x="320" y="292" className="fill-foreground font-mono text-[8px] font-bold" textAnchor="middle" letterSpacing="1">
                        ARGON2ID / 64MB MEMORY-HARD
                    </text>
                </g>

                <g>
                    <text x="320" y="375" className="fill-muted-foreground font-mono text-[8px] font-medium" textAnchor="middle" letterSpacing="0.8">
                        CLIENT STORAGE LAYER
                    </text>
                </g>
            </svg>
        </div>
    );
}
