import { Button } from "@/components/ui/button";
import { ArrowUpRight, Mail } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Contact | WardPass" };

export default function ContactPage() {
  return <main className="landing-shell min-h-[70vh] pb-24 pt-36 md:pt-44">
    <div className="flex items-center justify-between pb-4">
      <p className="eyebrow"><Mail size={14} /> WardPass / Contact</p>
      <span className="font-mono text-[10px] tracking-widest text-muted-foreground">SUPPORT / 01</span>
    </div>
    <div className="grid border-y border-border md:grid-cols-[1.2fr_.8fr] md:divide-x md:divide-border">
      <section className="py-10 md:py-14 md:pr-12">
        <p className="eyebrow mb-6">Questions, feedback, support</p>
        <h1 className="landing-display max-w-3xl text-5xl leading-[1.02] tracking-tight lg:text-7xl">Let’s talk about<br /><span className="landing-serif border-b-2 border-primary pb-1">WardPass.</span></h1>
        <p className="mt-7 max-w-xl text-base leading-7 text-muted-foreground">Reach the WardPass team through the contact page on our website. We welcome questions about using the app and feedback that helps us improve it.</p>
      </section>
      <aside className="flex flex-col justify-between border-t border-border py-8 md:border-l-0 md:border-t-0 md:pl-10 md:py-10">
        <div><p className="font-mono text-xs tracking-widest text-muted-foreground">/ 01 &nbsp; CONTACT CHANNEL</p><h2 className="mt-4 text-xl font-medium">WardPass support</h2><p className="mt-3 max-w-sm text-sm leading-6 text-muted-foreground">The current support link opens the maintainer’s contact page in a new tab.</p></div>
        <a className="mt-8 w-fit" rel="noopener noreferrer" href="https://zamarwint.xyz/#contact" target="_blank"><Button size="lg" className="rounded-none">Visit the contact page <ArrowUpRight /></Button></a>
      </aside>
    </div>
  </main>;
}
