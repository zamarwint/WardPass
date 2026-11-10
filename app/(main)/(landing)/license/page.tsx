import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Scale } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "License | WardPass",
  description: "WardPass is free, open-source software distributed under the permissive MIT License.",
};

export default function LicensePage() {
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
              <Scale className="size-3.5 text-primary" />
              OPEN-SOURCE TRANSPARENCY
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-medium tracking-tight text-foreground leading-[1.08]">
            Built in the open. <span className="text-gradient-gold font-normal">Shared with care.</span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl">
            WardPass is open-source software under the permissive{" "}
            <Link
              href="https://opensource.org/license/mit/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 underline underline-offset-4"
            >
              MIT License
            </Link>
            . We believe security software must be auditable, verifiable, and free from proprietary black boxes.
          </p>
        </div>

        {/* MIT LICENSE TEXT BOX */}
        <div className="py-12 border-b border-border max-w-4xl">
          <div className="rounded-2xl border border-border bg-card text-card-foreground p-8 sm:p-10 font-mono text-xs sm:text-sm leading-relaxed shadow-xs">
            <div className="flex items-center justify-between border-b border-border pb-4 mb-6">
              <span className="text-muted-foreground">COPYRIGHT (C) 2026 WARDPASS · ZWINT CO.</span>
              <span className="text-primary font-semibold">MIT LICENSE</span>
            </div>

            <p className="mb-4">
              Permission is hereby granted, free of charge, to any person obtaining a copy
              of this software and associated documentation files (the &quot;Software&quot;), to deal
              in the Software without restriction, including without limitation the rights
              to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
              copies of the Software, and to permit persons to whom the Software is
              furnished to do so, subject to the following conditions:
            </p>

            <p className="mb-4">
              The above copyright notice and this permission notice shall be included in all
              copies or substantial portions of the Software.
            </p>

            <p className="text-muted-foreground text-xs">
              THE SOFTWARE IS PROVIDED &quot;AS IS&quot;, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
              IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
              FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
              AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
              LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
              OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
              SOFTWARE.
            </p>
          </div>
        </div>

        <div className="py-8 flex items-center justify-between">
          <Link href="/" className={cn(buttonVariants({ size: "sm", variant: "outline" }))}>
            <ArrowLeft className="size-3.5 mr-1" />
            <span>Back to WardPass</span>
          </Link>

          <Link href="https://github.com/zamarwint/WardPass" target="_blank" rel="noopener noreferrer" className={cn(buttonVariants({ size: "sm" }))}>
            <span>View GitHub Repository</span>
            <ArrowUpRight className="size-3.5 ml-1" />
          </Link>
        </div>
      </div>
    </main>
  );
}
