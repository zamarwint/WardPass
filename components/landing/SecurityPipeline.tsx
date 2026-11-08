import { ArrowRight, Laptop, LockKeyhole, Server } from "lucide-react";
import Link from "next/link";

const stages = [
  { icon: <Laptop />, title: "On your device", text: "Your vault password is used to derive a key, and vault items are encrypted in the browser." },
  { icon: <LockKeyhole />, title: "Across the connection", text: "Encrypted data is sent over HTTPS/TLS to WardPass services." },
  { icon: <Server />, title: "Encrypted data stored", text: "Vault keys and item contents are stored as ciphertext. Vault names and some organization metadata are stored separately." },
];

export default function SecurityPipeline() {
  return <section id="security" className="landing-section">
    <div className="landing-shell">
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between"><div><p className="eyebrow mb-5">Clear by design</p><h2 className="landing-display text-4xl leading-tight md:text-5xl">From your device<br/><span className="landing-serif text-primary">to your vault.</span></h2></div><Link className="inline-flex items-center gap-2 text-sm font-medium hover:text-primary" href="/security-whitepaper">Read the security overview <ArrowRight size={16}/></Link></div>
      <div className="relative mt-14 grid gap-8 md:grid-cols-3 md:gap-6">
        <div aria-hidden="true" className="absolute left-6 right-[16.6667%] top-6 z-0 hidden h-px bg-primary/60 md:block" />
        {stages.map((stage, i) => <article key={stage.title} className="relative z-10"><div className="flex size-12 items-center justify-center border border-primary/50 bg-background text-primary">{stage.icon}</div><p className="mt-6 font-mono text-[11px] tracking-widest text-muted-foreground">STEP / 0{i + 1}</p><h3 className="mt-2 text-lg font-medium">{stage.title}</h3><p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">{stage.text}</p></article>)}
      </div>
      <p className="mt-10 max-w-3xl border-l-2 border-primary px-4 py-1 text-xs leading-5 text-muted-foreground">Encryption helps protect stored data, but it does not remove every risk. Keep your vault password private and use a unique, strong password for your account.</p>
    </div>
  </section>;
}
