"use client";

import Link from "next/link";
import { ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { useGetSession } from "@/lib/queries/SessionQueries";
import { CustomLoadingState } from "../LoadingStates";
import { cn } from "@/lib/utils";

export default function CallToAction() {
  const { isPending, data } = useGetSession();

  return (
    <section className="relative w-full py-24 sm:py-32 bg-secondary/30 text-foreground border-t border-border overflow-hidden">
      {/* Intense luminous radial gold bloom */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40 z-0"
        style={{
          background: "radial-gradient(circle at 50% 50%, rgba(214, 165, 29, 0.15) 0%, transparent 70%)"
        }}
      />

      <div className="landing-shell relative z-10">
        <div className="relative rounded-3xl border border-border bg-card text-card-foreground p-8 sm:p-14 lg:p-16 shadow-md overflow-hidden flex flex-col items-center text-center">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono tracking-wider uppercase bg-primary/10 border border-primary/20 text-primary mb-6">
            <Sparkles className="size-3.5 text-primary" />
            ZERO-KNOWLEDGE SECURITY FOR EVERYONE
          </div>

          {/* Headline */}
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-foreground max-w-3xl leading-[1.08]">
            Your credentials deserve{" "}
            <span className="text-gradient-gold font-normal">mathematical protection</span>
          </h2>

          {/* Subhead */}
          <p className="mt-6 text-base sm:text-lg text-muted-foreground max-w-2xl leading-relaxed font-normal">
            Join engineering teams, businesses, and privacy-conscious individuals using WardPass to
            protect logins, notes, cards, and identities without ever leaking plaintext to a server.
          </p>

          {/* CTAs */}
          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <>
              {isPending ? (
                <span className="flex items-center gap-2">
                  <CustomLoadingState loaderChoice={2}>Loading...</CustomLoadingState>
                </span>
              ) : (
                <Link href={data?.user ? "/strongroom" : "/sign-up"} className={cn("flex items-center gap-2", buttonVariants({ size: "lg" }))}>
                  <span>{data?.user ? "Open Your Strongroom" : "Get Started with WardPass"}</span>
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              )
              }
            </>

            <Link href="/security-whitepaper" className={cn("flex items-center gap-2", buttonVariants({ variant: "outline", size: "lg" }))}>
              <ShieldCheck className="size-4 text-primary" />
              <span>Security Whitepaper</span>
            </Link>
          </div>

          {/* Reassurance points */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-mono text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="size-1 rounded-full bg-primary" /> Free & Open Source
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-1 rounded-full bg-primary" /> Zero Plaintext Storage
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-1 rounded-full bg-primary" /> Independent Vault Keys
            </span>
          </div>
        </div>
      </div>
    </section >
  );
}
