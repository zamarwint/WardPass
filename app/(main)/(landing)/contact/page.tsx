import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight, Mail, MessageSquare, ShieldAlert, GitBranch } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Contact & Support | WardPass",
  description: "Get in touch with the WardPass engineering team for inquiries, enterprise questions, or security vulnerability disclosures.",
};

export default function ContactPage() {
  return (
    <main className="relative w-full min-h-screen bg-background text-foreground pt-28 pb-24 overflow-hidden">
      {/* Luminous glow */}
      <div
        className="absolute inset-0 pointer-events-none z-0 opacity-40"
        style={{
          background: "radial-gradient(circle at 75% 25%, rgba(214, 165, 29, 0.15) 0%, transparent 65%)"
        }}
      />
      <div className="absolute inset-0 telemetry-grid pointer-events-none opacity-40 z-0" />

      <div className="landing-shell relative z-10">
        <div className="max-w-3xl pt-8 pb-12 border-b border-border">
          <div className="flex items-center gap-2 mb-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono tracking-wider uppercase bg-card border border-border text-foreground shadow-xs">
              <Mail className="size-3.5 text-primary" />
              COMMUNICATION CHANNELS
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-medium tracking-tight text-foreground leading-[1.08]">
            Let’s talk about <span className="text-gradient-gold font-normal">WardPass.</span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl">
            Have questions about enterprise deployment, features, or security architecture?
            Reach our engineering team directly through any of our official channels.
          </p>
        </div>

        {/* CONTACT CARDS GRID */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-3 gap-6 border-b border-border">
          {/* CARD 1: GENERAL INQUIRIES */}
          <div className="p-8 rounded-2xl border border-border bg-card text-card-foreground hover:border-primary/40 hover:shadow-md transition-all shadow-xs flex flex-col justify-between">
            <div>
              <div className="size-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-6">
                <MessageSquare className="size-5" />
              </div>
              <span className="font-mono text-xs text-primary tracking-wider">CHANNEL / 01</span>
              <h2 className="text-xl font-medium text-foreground mt-2 mb-3">General Support</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Questions about setting up vaults, importing credentials, or troubleshooting client-side issues.
              </p>
            </div>
            <a
              href="https://zamarwint.xyz/#contact"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-2 text-xs font-mono text-primary hover:text-primary/80"
            >
              <span>Maintainer Contact Form</span>
              <ArrowUpRight className="size-3.5" />
            </a>
          </div>

          {/* CARD 2: GITHUB ISSUES */}
          <div className="p-8 rounded-2xl border border-border bg-card text-card-foreground hover:border-primary/40 hover:shadow-md transition-all shadow-xs flex flex-col justify-between">
            <div>
              <div className="size-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-6">
                <GitBranch className="size-5" />
              </div>
              <span className="font-mono text-xs text-primary tracking-wider">CHANNEL / 02</span>
              <h2 className="text-xl font-medium text-foreground mt-2 mb-3">Bug Reports & Features</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Track roadmap progress, report bugs, or submit pull requests directly to the open-source repository.
              </p>
            </div>
            <a
              href="https://github.com/zamarwint/WardPass/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-2 text-xs font-mono text-primary hover:text-primary/80"
            >
              <span>GitHub Issue Tracker</span>
              <ArrowUpRight className="size-3.5" />
            </a>
          </div>

          {/* CARD 3: SECURITY DISCLOSURE */}
          <div className="p-8 rounded-2xl border border-border bg-card text-card-foreground hover:border-primary/40 hover:shadow-md transition-all shadow-xs flex flex-col justify-between">
            <div>
              <div className="size-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-6">
                <ShieldAlert className="size-5" />
              </div>
              <span className="font-mono text-xs text-primary tracking-wider">CHANNEL / 03</span>
              <h2 className="text-xl font-medium text-foreground mt-2 mb-3">Security Disclosures</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We take responsible security disclosures seriously. Review our cryptographic whitepaper and report vulnerabilities.
              </p>
            </div>
            <Link
              href="/security-whitepaper"
              className="mt-8 inline-flex items-center gap-2 text-xs font-mono text-primary hover:text-primary/80"
            >
              <span>Review Security Policy</span>
              <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </div>

        <div className="py-12">
          <Link href="/" className={cn(buttonVariants({ size: "sm", variant: "outline" }))}>
            <ArrowLeft className="size-3.5 mr-1" />
            <span>Return to Home</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
