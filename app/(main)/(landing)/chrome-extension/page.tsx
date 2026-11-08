import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Globe2, KeyRound } from "lucide-react";

export const metadata: Metadata = { title: "Chrome Extension | WardPass" };

const statusRows = [
  { number: "01", label: "Development", value: "Planned" },
  { number: "02", label: "Browser autofill", value: "Not available yet" },
  { number: "03", label: "Credential storage", value: "Use your WardPass vault" },
];

export default function ChromeExtensionPage() {
  return <main className="landing-shell min-h-[70vh] pb-24 pt-36 md:pt-44">
    <div className="flex items-center justify-between pb-4">
      <p className="eyebrow"><Globe2 size={14} /> WardPass / Browser companion</p>
      <span className="font-mono text-[10px] tracking-widest text-muted-foreground">STATUS / 01</span>
    </div>
    <div className="grid border-y border-border md:grid-cols-[1.1fr_.9fr] md:divide-x md:divide-border">
      <section className="py-10 md:py-14 md:pr-12">
        <p className="eyebrow mb-6">A closer connection to your vault</p>
        <h1 className="landing-display max-w-2xl text-5xl leading-[1.02] tracking-tight lg:text-7xl">Your vault,<br /><span className="landing-serif border-b-2 border-primary pb-1">closer at hand.</span></h1>
        <p className="mt-7 max-w-xl text-base leading-7 text-muted-foreground">A browser extension is planned to make saved credentials easier to reach while you browse. It isn’t available yet, so WardPass currently doesn’t autofill or retrieve passwords from an extension.</p>
        <Link href="/sign-up" className="mt-8 inline-flex items-center gap-2 border border-foreground bg-primary px-5 py-3 text-sm font-medium text-primary-foreground">Explore WardPass <ArrowRight size={16} /></Link>
      </section>
      <section aria-label="Extension availability" className="border-t border-border md:border-l-0 md:border-t-0">
        <div className="flex items-center gap-4 border-b border-border p-6 md:p-8"><span className="flex size-10 items-center justify-center border border-border bg-secondary/50 text-primary"><KeyRound size={18} /></span><div><p className="font-mono text-[10px] tracking-widest text-muted-foreground">WARDPASS / EXTENSION</p><h2 className="mt-1 text-lg font-medium">Availability</h2></div></div>
        <ol>{statusRows.map((row) => <li key={row.number} className="grid grid-cols-[48px_1fr] border-b border-border last:border-b-0"><span className="border-r border-border px-4 py-5 font-mono text-xs text-muted-foreground">/{row.number}</span><div className="px-5 py-4"><p className="text-sm font-medium">{row.label}</p><p className="mt-1 text-xs text-muted-foreground">{row.value}</p></div></li>)}</ol>
      </section>
    </div>
  </main>;
}
