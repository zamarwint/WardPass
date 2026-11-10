"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Features() {
  return (
    <section id="features" className="relative w-full py-24 sm:py-32 bg-background text-foreground border-t border-border overflow-hidden">
      {/* Background ambient light */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40 z-0"
        style={{
          background: "radial-gradient(ellipse at 50% 0%, rgba(214, 165, 29, 0.15) 0%, transparent 70%)"
        }}
      />

      <div className="landing-shell relative z-10">
        {/* SECTION HEADER */}
        <div className="max-w-3xl">
          <h2 className="text-3xl sm:text-5xl font-medium tracking-tight leading-[1.1] text-foreground">
            Built for the credentials{" "}
            <span className="text-gradient-gold font-normal">that actually matter</span>
          </h2>
          <p className="mt-5 text-base sm:text-lg text-muted-foreground max-w-2xl leading-relaxed">
            WardPass clears the noise and eliminates plaintext leakage so engineering teams, businesses,
            and individuals can manage access with absolute cryptographic confidence.
          </p>
        </div>

        {/* 4-COLUMN ISOMETRIC SCHEMATIC CARDS */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* CARD 1 */}
          <article className="group relative rounded-xl border border-border bg-card text-card-foreground hover:border-primary/40 hover:shadow-md transition-all duration-300 p-6 flex flex-col justify-between shadow-xs">
            <div>
              {/* Isometric Line-art SVG Graphic */}
              <div className="w-full h-36 flex items-center justify-center mb-6">
                <svg viewBox="0 0 160 120" className="w-28 h-24 overflow-visible">
                  <g stroke="#D6A51D" strokeWidth="1" fill="none" opacity="0.9">
                    {/* Layered isometric stacked plates */}
                    <path d="M 80 20 L 130 45 L 80 70 L 30 45 Z" className="fill-primary/20 stroke-primary" />
                    <path d="M 80 35 L 130 60 L 80 85 L 30 60 Z" className="fill-primary/10 stroke-primary/70" />
                    <path d="M 80 50 L 130 75 L 80 100 L 30 75 Z" className="fill-primary/5 stroke-primary/50" />
                    <circle cx="80" cy="45" r="2.5" className="fill-primary" />
                  </g>
                </svg>
              </div>

              <span className="font-mono text-xs text-primary tracking-wider">01 / DERIVATION</span>
              <h3 className="text-lg font-medium text-foreground mt-2 mb-2.5">
                Every layer, client-side derived
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Argon2id key derivation executes exclusively in browser memory. Neither your master password
                nor derived keys ever touch any network interface.
              </p>
            </div>

            <Link
              href="/security-whitepaper"
              className="mt-6 inline-flex items-center gap-1.5 text-xs font-mono text-primary hover:text-primary/80 group-hover:translate-x-1 transition-transform"
            >
              <span>Learn more</span>
              <ArrowRight className="size-3" />
            </Link>
          </article>

          {/* CARD 2 */}
          <article className="group relative rounded-xl border border-border bg-card text-card-foreground hover:border-primary/40 hover:shadow-md transition-all duration-300 p-6 flex flex-col justify-between shadow-xs">
            <div>
              {/* Isometric Distributed Network Graphic */}
              <div className="w-full h-36 flex items-center justify-center mb-6">
                <svg viewBox="0 0 160 120" className="w-28 h-24 overflow-visible">
                  <g stroke="#D6A51D" strokeWidth="1" fill="none" opacity="0.9">
                    {/* Disconnected isolated isometric vault cubes */}
                    <path d="M 50 30 L 75 42 L 50 54 L 25 42 Z" className="fill-primary/20 stroke-primary" />
                    <path d="M 110 40 L 135 52 L 110 64 L 85 52 Z" className="fill-primary/10 stroke-primary/70" />
                    <path d="M 70 65 L 95 77 L 70 89 L 45 77 Z" className="fill-primary/10 stroke-primary/50" />
                    {/* Air-gap connection line */}
                    <line x1="50" y1="54" x2="70" y2="65" stroke="#D6A51D" strokeDasharray="2 3" strokeOpacity="0.6" />
                    <line x1="75" y1="42" x2="110" y2="40" stroke="#D6A51D" strokeDasharray="2 3" strokeOpacity="0.6" />
                  </g>
                </svg>
              </div>

              <span className="font-mono text-xs text-primary tracking-wider">02 / ENVELOPES</span>
              <h3 className="text-lg font-medium text-foreground mt-2 mb-2.5">
                Independent vault envelopes
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Each vault maintains its own unique cryptographic key and salt. Unlocking work or finance
                vaults leaves personal vaults mathematically isolated.
              </p>
            </div>

            <Link
              href="/security-whitepaper"
              className="mt-6 inline-flex items-center gap-1.5 text-xs font-mono text-primary hover:text-primary/80 group-hover:translate-x-1 transition-transform"
            >
              <span>Learn more</span>
              <ArrowRight className="size-3" />
            </Link>
          </article>

          {/* CARD 3 */}
          <article className="group relative rounded-xl border border-border bg-card text-card-foreground hover:border-primary/40 hover:shadow-md transition-all duration-300 p-6 flex flex-col justify-between shadow-xs">
            <div>
              {/* Isometric Funnel to Encrypted Block */}
              <div className="w-full h-36 flex items-center justify-center mb-6">
                <svg viewBox="0 0 160 120" className="w-28 h-24 overflow-visible">
                  <g stroke="#D6A51D" strokeWidth="1" fill="none" opacity="0.9">
                    {/* Top matrix nodes */}
                    <circle cx="55" cy="25" r="2" className="fill-primary" />
                    <circle cx="80" cy="20" r="2" className="fill-primary" />
                    <circle cx="105" cy="25" r="2" className="fill-primary" />
                    {/* Funnel into solid block */}
                    <line x1="55" y1="27" x2="80" y2="50" stroke="#D6A51D" strokeDasharray="2 2" />
                    <line x1="80" y1="22" x2="80" y2="50" stroke="#D6A51D" />
                    <line x1="105" y1="27" x2="80" y2="50" stroke="#D6A51D" strokeDasharray="2 2" />
                    {/* Base encrypted block */}
                    <path d="M 80 50 L 125 72 L 80 94 L 35 72 Z" className="fill-primary/20 stroke-primary" />
                    <path d="M 35 72 L 80 94 L 80 106 L 35 84 Z" className="fill-secondary stroke-primary/40" />
                    <path d="M 80 94 L 125 72 L 125 84 L 80 106 Z" className="fill-muted stroke-primary/40" />
                  </g>
                </svg>
              </div>

              <span className="font-mono text-xs text-primary tracking-wider">03 / CIPHERTEXT</span>
              <h3 className="text-lg font-medium text-foreground mt-2 mb-2.5">
                From plaintext to cipher in 0ms
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Client-side AES-256-GCM authenticated encryption seals your logins, API tokens, cards, and
                notes before a single byte leaves your workstation.
              </p>
            </div>

            <Link
              href="/security-whitepaper"
              className="mt-6 inline-flex items-center gap-1.5 text-xs font-mono text-primary hover:text-primary/80 group-hover:translate-x-1 transition-transform"
            >
              <span>Learn more</span>
              <ArrowRight className="size-3" />
            </Link>
          </article>

          {/* CARD 4 */}
          <article className="group relative rounded-xl border border-border bg-card text-card-foreground hover:border-primary/40 hover:shadow-md transition-all duration-300 p-6 flex flex-col justify-between shadow-xs">
            <div>
              {/* Isometric Diamond with Radial Concentric Rings */}
              <div className="w-full h-36 flex items-center justify-center mb-6">
                <svg viewBox="0 0 160 120" className="w-28 h-24 overflow-visible">
                  <g stroke="#D6A51D" strokeWidth="1" fill="none" opacity="0.9">
                    {/* Concentric orbital rings */}
                    <ellipse cx="80" cy="65" rx="50" ry="25" stroke="#D6A51D" strokeDasharray="3 4" strokeOpacity="0.4" />
                    {/* Diamond floating block */}
                    <path d="M 80 35 L 115 52 L 80 69 L 45 52 Z" className="fill-primary/20 stroke-primary" />
                    <path d="M 80 69 L 115 52 L 115 62 L 80 79 Z" className="fill-secondary stroke-primary/40" />
                    <path d="M 45 52 L 80 69 L 80 79 L 45 62 Z" className="fill-muted stroke-primary/40" />
                    <circle cx="80" cy="52" r="3" className="fill-primary" />
                  </g>
                </svg>
              </div>

              <span className="font-mono text-xs text-primary tracking-wider">04 / ZERO-KNOWLEDGE</span>
              <h3 className="text-lg font-medium text-foreground mt-2 mb-2.5">
                Zero-knowledge by design
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                The database only holds opaque ciphertext. Database admins, infrastructure providers, and
                WardPass operators are mathematically barred from reading your records.
              </p>
            </div>

            <Link
              href="/security-whitepaper"
              className="mt-6 inline-flex items-center gap-1.5 text-xs font-mono text-primary hover:text-primary/80 group-hover:translate-x-1 transition-transform"
            >
              <span>Learn more</span>
              <ArrowRight className="size-3" />
            </Link>
          </article>
        </div>
      </div>
    </section>
  );
}
