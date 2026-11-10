"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Globe, NotebookPen, CreditCard, IdCard, FolderLock, Plus, KeyRound } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function About() {
  const [activeTab, setActiveTab] = useState<"logins" | "notes" | "cards" | "identities">("logins");

  const tabContent = {
    logins: {
      title: "Logins & Credentials",
      badge: "CREDENTIAL PROTECTION",
      desc: "Store employee, developer, or consumer logins with email, username, website URL, and encrypted notes. Integrated password generation ensures every service uses distinct, unguessable entropy.",
      preview: [
        { label: "Service", val: "GitHub Enterprise" },
        { label: "Account", val: "devops-lead@company.internal" },
        { label: "Password", val: "••••••••••••••••••••••••" },
        { label: "Encryption", val: "AES-256-GCM / Encrypted" }
      ]
    },
    notes: {
      title: "Secure Developer & Ops Notes",
      badge: "INFRASTRUCTURE SECRETS",
      desc: "Safeguard cloud API keys, SSH private keys, recovery seeds, and internal architecture credentials. Multi-line markdown and text blocks encrypted with client-side isolation.",
      preview: [
        { label: "Title", val: "Production AWS Root Credentials" },
        { label: "Key ID", val: "AKIAIOSFODNN7EXAMPLE" },
        { label: "Secret", val: "••••••••••••••••••••••••••••••••••••••••" },
        { label: "Integrity", val: "Verified GCM Tag" }
      ]
    },
    cards: {
      title: "Payment & Corporate Cards",
      badge: "FINANCIAL DATA",
      desc: "Store corporate expense cards and personal payment methods securely. Cardholder name, card number, CVV, expiry dates, and billing addresses protected against unauthorized eyes.",
      preview: [
        { label: "Cardholder", val: "Engineering OpEx" },
        { label: "Card Number", val: "•••• •••• •••• 4242" },
        { label: "Expires / CVV", val: "12/28 · •••" },
        { label: "Status", val: "Zero-Knowledge Protected" }
      ]
    },
    identities: {
      title: "Identity & Compliance Profiles",
      badge: "ORGANIZATIONAL PROFILES",
      desc: "Organize employee profiles, passport numbers, tax IDs, emergency contacts, and social accounts in dedicated vaults for effortless compliance and onboarding.",
      preview: [
        { label: "Full Name", val: "Sarah Chen (Director of Security)" },
        { label: "Passport ID", val: "•••••••••" },
        { label: "Work Phone", val: "+1 (555) 019-2834" },
        { label: "Enclave", val: "Restricted Vault Enclave" }
      ]
    }
  };

  const steps = [
    {
      step: "01",
      icon: <FolderLock className="size-5 text-primary" />,
      title: "Create Dedicated Vaults",
      text: "Isolate your passwords by context: Personal, Work, Client Projects, or Finance. Each vault maintains its own password and independent cryptographic envelope."
    },
    {
      step: "02",
      icon: <Plus className="size-5 text-primary" />,
      title: "Add Sensitive Records",
      text: "Save logins, developer notes, payment cards, or identity records. Client-side Argon2id and AES-256-GCM encrypt items in memory before network transfer."
    },
    {
      step: "03",
      icon: <KeyRound className="size-5 text-primary" />,
      title: "Seamless Access Anywhere",
      text: "Unlock vaults on demand. Auto-unlock speeds up workflow when vaults share master passwords, while multi-vault controls safeguard isolated secrets."
    }
  ];

  const current = tabContent[activeTab];

  return (
    <section id="how-it-works" className="relative w-full py-24 sm:py-32 bg-background text-foreground border-t border-border overflow-hidden">
      <div className="landing-shell relative z-10">
        {/* SECTION HEADER */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="max-w-2xl">
            <span className="font-mono text-xs text-primary tracking-wider uppercase">
              COMPREHENSIVE CREDENTIAL MANAGEMENT
            </span>
            <h2 className="text-3xl sm:text-5xl font-medium tracking-tight leading-[1.1] mt-3 text-foreground">
              Designed for businesses,{" "}
              <span className="text-gradient-gold font-normal">loved by individuals</span>
            </h2>
          </div>
          <p className="max-w-md text-muted-foreground text-sm sm:text-base leading-relaxed">
            Eliminate credential spreadsheets, plaintext sticky notes, and shared chat tokens with
            structured, zero-knowledge storage built for scale.
          </p>
        </div>

        {/* ─── 3 STEP ONBOARDING GUIDE ─────────────────────────────────── */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6 border-y border-border py-10">
          {steps.map((item) => (
            <div key={item.step} className="flex flex-col justify-between p-6 rounded-xl bg-card text-card-foreground border border-border shadow-xs">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="size-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                    {item.icon}
                  </div>
                  <span className="font-mono text-xs text-primary tracking-wider">STEP / {item.step}</span>
                </div>
                <h3 className="text-lg font-medium text-foreground mb-2">{item.title}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{item.text}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ─── INTERACTIVE RECORD TYPES SHOWCASE ───────────────────────── */}
        <div className="mt-20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h3 className="text-2xl font-medium text-foreground">What can you store in WardPass?</h3>
              <p className="text-sm text-muted-foreground mt-1">Four specialized zero-knowledge item types tailored for modern workflows.</p>
            </div>

            {/* TAB SELECTOR PILLS */}
            <div className="flex items-center gap-1.5 p-1 bg-muted rounded-xl border border-border overflow-x-auto no-scrollbar">
              <button
                onClick={() => setActiveTab("logins")}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${activeTab === "logins" ? "bg-card text-card-foreground shadow-xs font-semibold" : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                <Globe className="size-3.5" /> Logins
              </button>
              <button
                onClick={() => setActiveTab("notes")}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${activeTab === "notes" ? "bg-card text-card-foreground shadow-xs font-semibold" : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                <NotebookPen className="size-3.5" /> Secure Notes
              </button>
              <button
                onClick={() => setActiveTab("cards")}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${activeTab === "cards" ? "bg-card text-card-foreground shadow-xs font-semibold" : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                <CreditCard className="size-3.5" /> Payment Cards
              </button>
              <button
                onClick={() => setActiveTab("identities")}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${activeTab === "identities" ? "bg-card text-card-foreground shadow-xs font-semibold" : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                <IdCard className="size-3.5" /> Identities
              </button>
            </div>
          </div>

          {/* TAB CONTENT CARD */}
          <div className="rounded-2xl border border-border bg-card text-card-foreground p-6 sm:p-10 shadow-xs grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <span className="font-mono text-xs text-primary tracking-wider uppercase font-semibold">
                {current.badge}
              </span>
              <h4 className="text-2xl sm:text-3xl font-medium text-foreground mt-2 mb-4">
                {current.title}
              </h4>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-6">
                {current.desc}
              </p>
              <Link href="/sign-up" className={cn("flex items-center gap-1.5", buttonVariants({ size: "sm" }))}>
                <span>Start Storing {current.title}</span>
                <ArrowRight className="size-3.5" />
              </Link>
            </div>

            {/* PREVIEW CONTAINER */}
            <div className="rounded-xl border border-border bg-secondary/50 p-5 font-mono text-xs shadow-xs text-foreground">
              <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-primary" /> WARDPASS ITEM RECORD
                </span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold text-[11px]">ENCRYPTED / READY</span>
              </div>
              <div className="space-y-3">
                {current.preview.map((row) => (
                  <div key={row.label} className="flex items-center justify-between p-2 rounded bg-card border border-border/50">
                    <span className="text-muted-foreground">{row.label}:</span>
                    <span className="text-foreground font-semibold">{row.val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
