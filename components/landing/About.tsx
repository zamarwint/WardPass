import { ArrowRight, FolderLock, KeyRound, Plus } from "lucide-react";
import Link from "next/link";

const steps = [
  { number: "01", icon: <FolderLock />, title: "Make a vault", text: "Create a named space for the logins you want to keep together—personal, work, or anything that suits you." },
  { number: "02", icon: <Plus />, title: "Add what you need", text: "Save logins, payment cards, identity details, or secure notes in the vault that fits." },
  { number: "03", icon: <KeyRound />, title: "Unlock when needed", text: "Unlock your vault to view and manage the credentials you saved." },
];

export default function About() {
  return (
    <section id="how-it-works" className="landing-section">
      <div className="landing-shell">
        <div className="grid gap-8 md:grid-cols-[0.8fr_1.2fr] md:items-end">
          <div><p className="eyebrow mb-5">A little more order, every day</p><h2 className="landing-display text-4xl leading-tight md:text-5xl">A home for the<br/><span className="landing-serif text-primary">things you sign into.</span></h2></div>
          <p className="max-w-xl text-base leading-7 text-muted-foreground md:justify-self-end">WardPass is a personal credential manager. Group logins into vaults, then keep the details you need in one place that’s simple to return to.</p>
        </div>
        <div className="mt-14 grid border-y border-border md:grid-cols-3 md:divide-x md:divide-border">
          {steps.map((step) => <article key={step.number} className="flex min-h-64 flex-col border-b border-border p-6 last:border-b-0 md:border-b-0 md:p-7"><div className="flex items-center justify-between"><span className="flex size-10 items-center justify-center border border-border bg-secondary/50 text-foreground">{step.icon}</span><span className="font-mono text-xs tracking-widest text-muted-foreground">/{step.number}</span></div><h3 className="mt-9 text-xl font-medium tracking-tight">{step.title}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{step.text}</p></article>)}
        </div>
        <Link className="mt-8 inline-flex items-center gap-2 text-sm font-medium hover:text-primary" href="/sign-up">Start your first vault <ArrowRight size={16}/></Link>
      </div>
    </section>
  );
}
