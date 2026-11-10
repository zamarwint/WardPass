"use client";

import Link from "next/link";
import { ArrowRight, ShieldCheck, Terminal } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import IsometricVaultGraphic from "./IsometricVaultGraphic";
import { cn } from "@/lib/utils";

export default function Hero() {
  return (
    <section className="relative w-full overflow-hidden pt-28 pb-20 md:pt-36 md:pb-28 bg-background text-foreground">
      {/* Luminous Gold Yellow Glow Background */}
      <div
        className="absolute inset-0 pointer-events-none z-0 opacity-80"
        style={{
          background: `
            radial-gradient(circle at 75% 35%, rgba(214, 165, 29, 0.22) 0%, rgba(152, 106, 8, 0.10) 30%, transparent 65%),
            radial-gradient(circle at 25% 20%, rgba(247, 200, 115, 0.14) 0%, transparent 50%),
            radial-gradient(circle at 50% 90%, rgba(128, 91, 10, 0.08) 0%, transparent 60%)
          `
        }}
      />

      {/* Subtle telemetry isometric grid */}
      <div className="absolute inset-0 telemetry-grid pointer-events-none opacity-40 z-0" />

      <div className="landing-shell relative z-10">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8">
          {/* LEFT: VALUE PROPOSITION */}
          <div className="flex flex-col items-start max-w-2xl">
            {/* STATUS PILLS */}
            <div className="flex flex-wrap items-center gap-2.5 mb-7">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono tracking-wider uppercase bg-card border border-border text-foreground shadow-xs backdrop-blur-md">
                <ShieldCheck className="size-3 text-primary" />
                ARGON2ID + AES-256-GCM
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono tracking-wider uppercase bg-card border border-border text-foreground shadow-xs backdrop-blur-md">
                <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                STATUS: ZERO-KNOWLEDGE ACTIVE
              </span>
            </div>

            {/* HEADLINE */}
            <h1 className="text-4xl sm:text-6xl lg:text-[4.2rem] font-medium tracking-tight leading-[1.05] text-foreground">
              Encrypted before it touches the wire
            </h1>

            {/* SUBHEADLINE */}
            <p className="mt-6 text-base sm:text-lg leading-relaxed text-muted-foreground max-w-xl font-normal">
              A zero-knowledge secrets and credential vault engineered for modern teams and discerning individuals.
              Keys derived in browser memory, payload encrypted on your device, and zero plaintext exposure to any server.
            </p>

            {/* CALL TO ACTION BUTTONS */}
            <div className="mt-8 flex flex-wrap items-center gap-3.5 w-full sm:w-auto">
              <Link href="/sign-up" className={cn("flex items-center gap-2", buttonVariants({ size: "lg" }))}>
                <span>Get Early Access</span>
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </Link>

              <Link href="#interactive-demo" className={cn("flex items-center gap-2", buttonVariants({ variant: "outline", size: "lg" }))}>
                <Terminal className="size-4 text-primary" />
                <span>Interactive Crypto Demo</span>
              </Link>
            </div>

            {/* TRUST HIGHLIGHTS */}
            <div className="mt-8 flex flex-wrap items-center gap-y-2 gap-x-5 text-xs text-muted-foreground font-mono">
              <span className="flex items-center gap-1.5">
                <span className="size-1 rounded-full bg-primary" /> Independent Vault Keys
              </span>
              <span className="flex items-center gap-1.5">
                <span className="size-1 rounded-full bg-primary" /> 64MB Memory-Hard KDF
              </span>
              <span className="flex items-center gap-1.5">
                <span className="size-1 rounded-full bg-primary" /> MIT Open-Source
              </span>
            </div>
          </div>

          {/* RIGHT: FLOATING ISOMETRIC SCHEMATIC */}
          <div className="relative w-full flex items-center justify-center">
            <IsometricVaultGraphic />
          </div>
        </div>

        {/* ─── TRUSTED BY LOGO TICKER / SOCIAL PROOF ─────────────────────── */}
        <div className="mt-20 pt-8 border-t border-border flex flex-col gap-4">
          <p className="text-[11px] font-mono tracking-widest text-muted-foreground uppercase text-center sm:text-left">
            BUILT WITH STANDARDS TRUSTED BY HIGH-SECURITY ENGINEERING TEAMS
          </p>
          <div className="flex flex-wrap items-center justify-between gap-6 opacity-80 transition-all duration-300">
            <div className="flex items-center gap-2 text-sm font-semibold tracking-wider text-muted-foreground hover:text-foreground transition-colors">
              <span className="text-lg">▲</span> Vercel
            </div>
            <div className="flex items-center gap-2 text-sm font-semibold tracking-wider text-muted-foreground hover:text-foreground transition-colors">
              <span className="font-mono text-base font-bold">&gt;_</span> Cursor
            </div>
            <div className="flex items-center gap-2 text-sm font-semibold tracking-wider text-muted-foreground hover:text-foreground transition-colors">
              <span className="text-base font-bold">◈</span> Coinbase
            </div>
            <div className="flex items-center gap-2 text-sm font-semibold tracking-wider text-muted-foreground hover:text-foreground transition-colors">
              <span className="font-mono font-bold text-base">§</span> Linear
            </div>
            <div className="flex items-center gap-2 text-sm font-semibold tracking-wider text-muted-foreground hover:text-foreground transition-colors">
              <span className="text-base font-bold">⚡</span> Neon
            </div>
            <div className="flex items-center gap-2 text-sm font-semibold tracking-wider text-muted-foreground hover:text-foreground transition-colors">
              <span className="text-base font-bold">❇</span> Supabase
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
