import { Eye, Fingerprint, ShieldCheck } from "lucide-react";

const features = [
  { icon: <Eye />, title: "Private item contents", description: "Login, card, identity, and note contents are encrypted in the browser before storage. Vault names and some organization metadata are stored separately and are not encrypted the same way." },
  { icon: <Fingerprint />, title: "A key derived from your password", description: "WardPass derives a key from your vault password with Argon2id and uses it to protect a randomly generated vault key." },
  { icon: <ShieldCheck />, title: "Authenticated encryption", description: "Vault keys and saved items use AES-256-GCM, which checks integrity as well as keeping the data confidential." },
];

export default function Features() {
  return <section id="features" className="landing-section bg-secondary/35">
    <div className="landing-shell">
      <div className="max-w-2xl"><p className="eyebrow mb-5">01 / Data protection</p><h2 className="landing-display text-4xl leading-tight md:text-5xl">Protection for the details<br/><span className="landing-serif text-primary">you store in your vault.</span></h2><p className="mt-5 max-w-xl leading-7 text-muted-foreground">See what WardPass encrypts, how the vault key is prepared, and what happens when encrypted items are checked.</p></div>
      <div className="mt-12 grid border-y border-border md:grid-cols-3 md:divide-x md:divide-border">
        {features.map((feature, index) => <article key={feature.title} className="border-b border-border p-7 last:border-b-0 md:border-b-0 md:p-8"><span className="flex size-10 items-center justify-center border border-border bg-background text-primary">{feature.icon}</span><p className="mt-8 font-mono text-[11px] tracking-widest text-muted-foreground">0{index + 1} / PROTECTION</p><h3 className="mt-3 text-lg font-medium">{feature.title}</h3><p className="mt-3 text-sm leading-6 text-muted-foreground">{feature.description}</p></article>)}
      </div>
    </div>
  </section>;
}
