import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { LogoSwitch } from "./ThemeChange";

const productLinks = [
  { label: "Features", href: "/#features" },
  { label: "Interactive Demo", href: "/#interactive-demo" },
  { label: "Password Generator", href: "/password-generator" },
  { label: "Chrome Extension", href: "/chrome-extension" },
];

const securityLinks = [
  { label: "Security Whitepaper", href: "/security-whitepaper" },
  { label: "Argon2id KDF Model", href: "/security-whitepaper#argon2" },
  { label: "AES-256-GCM Envelope", href: "/security-whitepaper#aes" },
  { label: "GitHub Repository", href: "https://github.com/zamarwint/WardPass", external: true },
];

const resourceLinks = [
  { label: "Support & Contact", href: "/contact" },
  { label: "MIT License", href: "/license" },
  { label: "NIST Guidelines", href: "https://csrc.nist.gov/pubs/fips/197/final", external: true },
];

export default function Footer() {
  return (
    <footer className="w-full bg-secondary/30 text-foreground border-t border-border relative overflow-hidden">
      <div className="landing-shell py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b border-border">
          {/* BRAND COLUMN */}
          <div className="lg:col-span-2 flex flex-col justify-between">
            <div className="flex flex-col gap-3">
              <Link href="/" className="flex items-center gap-2.5" aria-label="WardPass home">
                <LogoSwitch />
                <span className="text-base font-semibold tracking-tight text-foreground uppercase">
                  WardPass<span className="text-primary">.</span>
                </span>
              </Link>
              <p className="mt-2 text-xs sm:text-sm text-muted-foreground max-w-sm leading-relaxed">
                Zero-knowledge secrets and credential vault. Client-side Argon2id key derivation and
                AES-256-GCM authenticated encryption engineered for privacy and scale.
              </p>
            </div>

            {/* LIVE SYSTEM STATUS PILL */}
            <div className="mt-6 flex items-center gap-2">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono bg-card border border-border text-foreground shadow-xs">
                <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                STATUS: ENCRYPTION PROTOCOLS ONLINE
              </span>
            </div>
          </div>

          {/* COLUMN 1: PRODUCT */}
          <div className="flex flex-col gap-3">
            <span className="font-mono text-xs text-primary tracking-wider uppercase font-semibold">
              Product
            </span>
            <ul className="flex flex-col gap-2.5 text-xs text-muted-foreground font-mono">
              {productLinks.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="hover:text-foreground transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* COLUMN 2: SECURITY */}
          <div className="flex flex-col gap-3">
            <span className="font-mono text-xs text-primary tracking-wider uppercase font-semibold">
              Security
            </span>
            <ul className="flex flex-col gap-2.5 text-xs text-muted-foreground font-mono">
              {securityLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    target={item.external ? "_blank" : undefined}
                    rel={item.external ? "noopener noreferrer" : undefined}
                    className="hover:text-foreground transition-colors inline-flex items-center gap-1"
                  >
                    <span>{item.label}</span>
                    {item.external && <ArrowUpRight className="size-3 opacity-70" />}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* COLUMN 3: RESOURCES & LEGAL */}
          <div className="flex flex-col gap-3">
            <span className="font-mono text-xs text-primary tracking-wider uppercase font-semibold">
              Resources
            </span>
            <ul className="flex flex-col gap-2.5 text-xs text-muted-foreground font-mono">
              {resourceLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    target={item.external ? "_blank" : undefined}
                    rel={item.external ? "noopener noreferrer" : undefined}
                    className="hover:text-foreground transition-colors inline-flex items-center gap-1"
                  >
                    <span>{item.label}</span>
                    {item.external && <ArrowUpRight className="size-3 opacity-70" />}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* BOTTOM ROW */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-muted-foreground">
          <p>© {new Date().getFullYear()} WARDPASS · OPEN SOURCE UNDER MIT LICENSE</p>
          <div className="flex items-center gap-4">
            <Link
              href="https://github.com/zamarwint/WardPass"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors inline-flex items-center gap-1.5"
            >
              <svg className="size-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              <span>GitHub</span>
            </Link>
            <span>·</span>
            <span>NO COOKIE TRACKING</span>
            <span>·</span>
            <span>NO TELEMETRY SALE</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
