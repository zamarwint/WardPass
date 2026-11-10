import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Fingerprint, LockKeyhole, Server, ShieldCheck, Cpu } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Security Overview & Cryptographic Whitepaper | WardPass",
  description: "Technical specification of WardPass zero-knowledge architecture, Argon2id KDF, and AES-256-GCM authenticated encryption.",
};

const cryptoSpecs = [
  { param: "Key Derivation Algorithm", val: "Argon2id (RFC 9106 / PHC 2015 Winner)" },
  { param: "Argon2id Memory Cost", val: "65,536 KiB (64 MiB RAM per guess attempt)" },
  { param: "Argon2id Iterations (Time)", val: "3 passes over memory" },
  { param: "Salt Length", val: "16 bytes (128 bits) cryptographically random per vault" },
  { param: "Encryption Cipher", val: "AES-256-GCM (NIST SP 800-38D)" },
  { param: "Initialization Vector (IV)", val: "12 bytes (96 bits) unique per item" },
  { param: "Authentication Tag", val: "16 bytes (128 bits) Poly1305 / GHASH verification" },
  { param: "Key Storage Policy", val: "In-memory ephemeral RAM only; zero disk/cookie persistence" },
];

const pillars = [
  {
    icon: <Fingerprint className="size-5 text-primary" />,
    step: "01",
    title: "Client-Side Argon2id Key Derivation",
    text: "When you enter your vault password, WardPass runs Argon2id inside an isolated Web Worker. The 64MB memory cost ensures ASIC and GPU brute-force attacks are computationally and economically infeasible. The resulting 32-byte Key Encryption Key (KEK) is used strictly in memory to decrypt the inner vault key.",
  },
  {
    icon: <LockKeyhole className="size-5 text-primary" />,
    step: "02",
    title: "AES-256-GCM Authenticated Envelopes",
    text: "All credentials, notes, payment cards, and identities are encrypted with AES-256 in Galois/Counter Mode. Every item receives a fresh, non-repeating 12-byte IV. GCM's cryptographic tag guarantees both confidentiality and ciphertext integrity—any tampering is detected instantly prior to decryption.",
  },
  {
    icon: <Server className="size-5 text-primary" />,
    step: "03",
    title: "Server Blindness & Zero-Knowledge Storage",
    text: "The WardPass database stores only opaque base64-encoded ciphertext blobs, salts, and IVs. The server never receives your master password, your derived keys, or your decrypted records. A complete database compromise reveals zero readable data to attackers.",
  },
  {
    icon: <Cpu className="size-5 text-primary" />,
    step: "04",
    title: "Ephemeral Memory Lifecycle & Auto-Lock",
    text: "Decrypted vault keys exist only in JavaScript memory. On tab hide, user logout, or inactivity timeout, all keys in the keyring are overwritten with zeros (Uint8Array.fill(0)) before garbage collection drops the references.",
  },
];

export default function SecurityWhitepaperPage() {
  return (
    <main className="relative w-full min-h-screen bg-background text-foreground pt-28 pb-24 overflow-hidden">
      {/* Luminous glow */}
      <div
        className="absolute inset-0 pointer-events-none z-0 opacity-40"
        style={{
          background: "radial-gradient(circle at 60% 15%, rgba(214, 165, 29, 0.15) 0%, transparent 65%)"
        }}
      />
      <div className="absolute inset-0 telemetry-grid pointer-events-none opacity-40 z-0" />

      <div className="landing-shell relative z-10">
        {/* HEADER */}
        <div className="max-w-3xl pt-8 pb-12 border-b border-border">
          <div className="flex items-center gap-2 mb-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono tracking-wider uppercase bg-card border border-border text-foreground shadow-xs">
              <ShieldCheck className="size-3.5 text-primary" />
              CRYPTOGRAPHIC SPECIFICATION
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono tracking-wider uppercase bg-primary/10 border border-primary/20 text-primary font-semibold">
              AUDIT READY
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-medium tracking-tight text-foreground leading-[1.08]">
            Zero-Knowledge Cryptographic <span className="text-gradient-gold font-normal">Architecture</span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl">
            A comprehensive overview of the cryptographic guarantees, mathematical models, and client-side
            mechanisms protecting vault data in WardPass.
          </p>
        </div>

        {/* 4 PILLARS OF WARDPASS SECURITY */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 gap-8 border-b border-border">
          {pillars.map((item) => (
            <article key={item.title} className="p-8 rounded-2xl border border-border bg-card text-card-foreground hover:border-primary/40 hover:shadow-md transition-all shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="size-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                    {item.icon}
                  </div>
                  <span className="font-mono text-xs text-primary tracking-wider">LAYER / {item.step}</span>
                </div>
                <h2 className="text-xl font-medium text-foreground mb-3">{item.title}</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.text}</p>
              </div>
            </article>
          ))}
        </div>

        {/* TECHNICAL PARAMETERS TABLE */}
        <div className="py-16 border-b border-border">
          <div className="max-w-2xl mb-8">
            <span className="font-mono text-xs text-primary tracking-wider uppercase font-semibold">CRYPTOGRAPHIC PARAMETERS</span>
            <h3 className="text-2xl sm:text-3xl font-medium text-foreground mt-2">
              Implementation Specifications
            </h3>
            <p className="text-muted-foreground text-sm mt-2">
              Exact parameter values implemented in the WardPass client-side crypto engine (@noble/hashes & @noble/ciphers).
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card text-card-foreground shadow-xs overflow-hidden font-mono text-xs sm:text-sm">
            {cryptoSpecs.map((row, i) => (
              <div
                key={row.param}
                className={`grid grid-cols-1 md:grid-cols-[1fr_1.5fr] p-4 gap-2 border-b border-border last:border-b-0 ${i % 2 === 0 ? "bg-muted/30" : "bg-card"
                  }`}
              >
                <span className="text-muted-foreground font-medium">{row.param}:</span>
                <span className="text-foreground font-semibold break-all">{row.val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* REPRODUCIBILITY & AUDITABILITY */}
        <div className="py-16 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
          <div>
            <h3 className="text-xl font-medium text-foreground">Transparent & Open Source</h3>
            <p className="text-muted-foreground text-sm mt-1 max-w-xl">
              Inspect our cryptography directly. The complete codebase is published under the MIT license on GitHub.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">

            <Link href="https://github.com/zamarwint/WardPass" target="_blank" rel="noopener noreferrer" className={cn(buttonVariants({ size: "sm" }))}>
              <span>View Source Code</span>
              <ArrowUpRight className="size-3.5 ml-1" />
            </Link>
            <Link href="/" className={cn(buttonVariants({ size: "sm", variant: "outline" }))}>
              <ArrowLeft className="size-3.5 mr-1" />
              <span>Return to Home</span>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
