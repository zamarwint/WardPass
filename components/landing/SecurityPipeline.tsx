"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle2, Lock, Terminal, Key, Database } from "lucide-react";
import Link from "next/link";

export default function SecurityPipeline() {
  const [sampleInput, setSampleInput] = useState("api_live_k94vM_secretKey2026");
  const [selectedPreset, setSelectedPreset] = useState("API Key");

  const presets = [
    { label: "API Key", value: "api_live_k94vM_secretKey2026" },
    { label: "Database Password", value: "db_prod_pg$98#ultraSecret!pass" },
    { label: "Master Login", value: "admin@enterprise.internal" },
  ];

  return (
    <section id="interactive-demo" className="relative w-full py-24 sm:py-32 bg-secondary/30 text-foreground border-t border-border overflow-hidden">
      {/* Ambient background light */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40 z-0"
        style={{
          background: "radial-gradient(circle at 70% 50%, rgba(214, 165, 29, 0.12) 0%, transparent 60%)"
        }}
      />

      <div className="landing-shell relative z-10">
        {/* SECTION HEADER */}
        <div className="max-w-3xl">
          <span className="font-mono text-xs text-primary tracking-wider uppercase">
            LIVE PROTOCOL VERIFICATION
          </span>
          <h2 className="text-3xl sm:text-5xl font-medium tracking-tight leading-[1.1] mt-3 text-foreground">
            Your team already knows{" "}
            <span className="text-gradient-gold font-normal">plaintext is a liability</span>
          </h2>
          <p className="mt-5 text-base sm:text-lg text-muted-foreground max-w-2xl leading-relaxed">
            WardPass turns zero-knowledge cryptography into an automated instinct — verifiable the instant
            you store any secret. Inspect the client-side pipeline in real time.
          </p>
        </div>

        {/* TWO-COLUMN DASHBOARD */}
        <div className="mt-14 grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-8 items-start">
          {/* LEFT: LIVE CLIENT-SIDE CRYPTOGRAPHIC SIMULATOR */}
          <div className="rounded-2xl border border-border bg-card text-card-foreground p-6 sm:p-8 backdrop-blur-md relative overflow-hidden shadow-xs">
            <div className="flex items-center justify-between border-b border-border pb-4 mb-6">
              <div className="flex items-center gap-2.5">
                <Terminal className="size-4 text-primary" />
                <span className="font-mono text-xs text-foreground font-semibold tracking-wide">
                  CLIENT MEMORY ENCLAVE (BROWSER WORKER)
                </span>
              </div>
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">
                <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                ISOLATED
              </span>
            </div>

            {/* Presets */}
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs text-muted-foreground font-mono">Test Sample:</span>
              <div className="flex flex-wrap gap-1.5">
                {presets.map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() => {
                      setSelectedPreset(preset.label);
                      setSampleInput(preset.value);
                    }}
                    className={`px-2.5 py-1 rounded text-xs font-mono transition-all cursor-pointer ${selectedPreset === preset.label
                        ? "bg-primary text-primary-foreground font-medium shadow-xs"
                        : "bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80 border border-border"
                      }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Plaintext input */}
            <div className="space-y-1.5 mb-6">
              <label className="text-xs text-muted-foreground font-mono">Plaintext Credential on your device:</label>
              <input
                type="text"
                value={sampleInput}
                onChange={(e) => setSampleInput(e.target.value)}
                className="w-full h-11 px-3.5 rounded-lg bg-background border border-input font-mono text-sm text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              />
            </div>

            {/* Step-by-step Transformation Pipeline */}
            <div className="space-y-4">
              {/* STEP 1: SALT & ARGON2ID */}
              <div className="p-3.5 rounded-lg bg-muted/40 border border-border flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-primary flex items-center gap-1.5 font-semibold">
                    <Key className="size-3.5" /> 1. Ephemeral 16B Salt + Argon2id KDF
                  </span>
                  <span className="text-muted-foreground text-[11px]">t=3, m=64MB, p=1</span>
                </div>
                <div className="font-mono text-xs text-foreground break-all bg-card/60 border border-border/50 p-2 rounded">
                  Salt: <span className="text-muted-foreground">7fA9b2...8K4q</span> → Derived Key: <span className="text-primary font-semibold">a3f9e18c72...49e8</span> (32 bytes in RAM)
                </div>
              </div>

              {/* STEP 2: AES-256-GCM ENVELOPE */}
              <div className="p-3.5 rounded-lg bg-muted/40 border border-border flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-primary flex items-center gap-1.5 font-semibold">
                    <Lock className="size-3.5" /> 2. AES-256-GCM Authenticated Encryption
                  </span>
                  <span className="text-muted-foreground text-[11px]">12B IV + 16B Tag</span>
                </div>
                <div className="font-mono text-xs text-foreground break-all bg-card/60 border border-border/50 p-2 rounded">
                  IV: <span className="text-muted-foreground">c98a12e4f0...</span> | Poly1305 Tag: <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Verified</span>
                </div>
              </div>

              {/* STEP 3: OPAQUE CIPHERTEXT SENT TO SERVER */}
              <div className="p-3.5 rounded-lg bg-primary/10 border border-primary/30 flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-primary flex items-center gap-1.5 font-semibold">
                    <Database className="size-3.5" /> 3. Payload Stored in WardPass DB (Zero Plaintext)
                  </span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold text-[11px]">CIPHERTEXT ONLY</span>
                </div>
                <div className="font-mono text-xs text-foreground/90 break-all bg-card/80 border border-primary/20 p-2 rounded max-h-16 overflow-hidden">
                  eJzV1b1u4kAYB/D78xQ5wRk8O2Nj44M5O5wREhInJCSUaZ...09qZaX148k8w==
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: REAL-TIME SECURITY & COMPLIANCE DIGEST */}
          <div className="rounded-2xl border border-border bg-card text-card-foreground p-6 sm:p-8 backdrop-blur-md shadow-xs">
            <div className="flex items-center justify-between border-b border-border pb-4 mb-6">
              <div>
                <h3 className="font-medium text-base text-foreground">Cryptographic Defense Digest</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Continuous verification profile</p>
              </div>
              <span className="font-mono text-xs text-primary font-semibold">ACTIVE</span>
            </div>

            {/* Metric checklist items */}
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 border border-border/60">
                <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-foreground">Zero Server Plaintext</h4>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                    Database compromises reveal zero credentials, notes, or identities.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 border border-border/60">
                <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-foreground">Isolated Vault Envelopes</h4>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                    Each vault uses independent passwords, salts, and encryption keys.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 border border-border/60">
                <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-foreground">Brute-Force Infeasible</h4>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                    Argon2id parameters demand 64MB of dedicated RAM per guess attempt.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 border border-border/60">
                <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-foreground">30-Day Trash Bin Recovery</h4>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                    Accidental deletions can be restored with intact cryptographic integrity.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-7 pt-5 border-t border-border flex items-center justify-between">
              <span className="text-xs text-muted-foreground font-mono">SPECIFICATION 2026</span>
              <Link
                href="/security-whitepaper"
                className="inline-flex items-center gap-1.5 text-xs font-mono text-primary hover:text-primary/80"
              >
                <span>Read Full Security Whitepaper</span>
                <ArrowRight className="size-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
