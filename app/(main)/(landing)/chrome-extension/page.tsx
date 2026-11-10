import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Globe, ShieldCheck } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Chrome Extension | WardPass",
  description: "Secure, zero-knowledge browser autofill companion for Chrome, Edge, and Brave.",
};

const extensionFeatures = [
  {
    title: "Instant In-Page Autofill",
    desc: "Detects login inputs automatically. Decrypts credentials in browser memory and fills inputs without copy-pasting.",
    status: "In Development",
  },
  {
    title: "One-Click Credential Capture",
    desc: "Creating an account on a new site prompts WardPass to generate a high-entropy password and save it directly to your designated vault.",
    status: "Planned",
  },
  {
    title: "Multi-Vault Switching",
    desc: "Switch seamlessly between Personal and Work vaults right from the toolbar without leaving your active tab.",
    status: "Planned",
  },
  {
    title: "Biometric & Auto-Lock",
    desc: "Unlocks via Touch ID / Windows Hello or master password. Locks automatically after browser inactivity or when tabs close.",
    status: "Specification Ready",
  },
];

export default function ChromeExtensionPage() {
  return (
    <main className="relative w-full min-h-screen bg-background text-foreground pt-28 pb-24 overflow-hidden">
      {/* Luminous glow */}
      <div
        className="absolute inset-0 pointer-events-none z-0 opacity-40"
        style={{
          background: "radial-gradient(circle at 65% 20%, rgba(214, 165, 29, 0.15) 0%, transparent 60%)"
        }}
      />
      <div className="absolute inset-0 telemetry-grid pointer-events-none opacity-40 z-0" />

      <div className="landing-shell relative z-10">
        {/* HERO SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center pt-8 pb-16 border-b border-border">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono tracking-wider uppercase bg-card border border-border text-foreground shadow-xs">
                <Globe className="size-3.5 text-primary" />
                BROWSER COMPANION
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono tracking-wider uppercase bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                V2 ROADMAP
              </span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-medium tracking-tight text-foreground leading-[1.08]">
              Your vault, native in your <span className="text-gradient-gold font-normal">browser.</span>
            </h1>

            <p className="mt-6 text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl">
              The official WardPass extension brings client-side zero-knowledge decryption directly to Chrome, Brave, and Edge.
              Autofill logins without ever exposing plaintext to browser extension storage.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3.5">
              <Link href="/sign-up" className={cn("flex items-center gap-2", buttonVariants({ size: "lg" }))}>
                <span>Get Early Access</span>
                <ArrowRight className="size-4" />
              </Link>

              <Link href="/security-whitepaper" className={cn(buttonVariants({ variant: "outline", size: "lg" }))}>Review Extension Security</Link>

            </div>
          </div>

          {/* RIGHT: MOCKUP SIMULATOR */}
          <div className="relative">
            <div className="rounded-2xl border border-border bg-card text-card-foreground p-6 shadow-md relative overflow-hidden backdrop-blur-xl">
              {/* Browser window chrome header */}
              <div className="flex items-center justify-between border-b border-border pb-4 mb-5">
                <div className="flex items-center gap-2">
                  <div className="size-3 rounded-full bg-red-500/80" />
                  <div className="size-3 rounded-full bg-yellow-500/80" />
                  <div className="size-3 rounded-full bg-emerald-500/80" />
                  <div className="ml-2 h-6 px-3 rounded bg-muted border border-border text-[11px] font-mono text-muted-foreground flex items-center">
                    https://console.cloud.google.com
                  </div>
                </div>
                <span className="size-6 rounded bg-primary/10 border border-primary/30 flex items-center justify-center text-[10px] font-bold text-primary">
                  WP
                </span>
              </div>

              {/* Simulated Extension Popup Overlay */}
              <div className="rounded-xl border border-primary/30 bg-secondary/40 p-5 shadow-xs">
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-border">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="size-4 text-primary" />
                    <span className="font-mono text-xs font-semibold text-foreground">WARDPASS VAULT</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    MATCH FOUND (1)
                  </span>
                </div>

                <div className="space-y-2.5">
                  <div className="p-3 rounded-lg bg-card border border-border hover:border-primary/50 transition-colors flex items-center justify-between shadow-2xs">
                    <div>
                      <h4 className="text-xs font-semibold text-foreground">Google Cloud Enterprise</h4>
                      <p className="text-[11px] font-mono text-muted-foreground">devops@company.internal</p>
                    </div>
                    <Button size="sm" className="h-7 text-xs bg-primary hover:bg-primary/90 text-primary-foreground rounded">
                      Autofill
                    </Button>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-[11px] font-mono text-muted-foreground">
                  <span>ACTIVE VAULT: <strong className="text-foreground">WORK</strong></span>
                  <span className="text-primary font-semibold">AES-256-GCM</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* EXTENSION ARCHITECTURE & CAPABILITIES */}
        <div className="py-16">
          <div className="max-w-2xl mb-12">
            <span className="font-mono text-xs text-primary tracking-wider uppercase">CAPABILITIES</span>
            <h2 className="text-3xl font-medium tracking-tight text-foreground mt-2">
              Engineered with zero-leak isolation
            </h2>
            <p className="text-muted-foreground text-sm mt-3 leading-relaxed">
              Standard extensions store decrypted passwords in persistent chrome storage. WardPass maintains keys
              only in ephemeral memory during the active session.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {extensionFeatures.map((feat) => (
              <div key={feat.title} className="p-6 rounded-xl border border-border bg-card text-card-foreground shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-medium text-foreground">{feat.title}</h3>
                    <span className="text-[11px] font-mono px-2.5 py-0.5 rounded bg-primary/10 border border-primary/20 text-primary font-medium">
                      {feat.status}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{feat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
