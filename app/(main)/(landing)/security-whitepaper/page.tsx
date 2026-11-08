import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Code2, Fingerprint, LockKeyhole, Server } from "lucide-react";

export const metadata: Metadata = { title: "Security Overview | WardPass" };

const sections = [
  { icon: <Fingerprint/>, title: "Key derivation", text: "WardPass uses Argon2id to derive a 32-byte key from the vault password. That derived key protects a randomly generated vault key, which is used for vault item encryption." },
  { icon: <LockKeyhole/>, title: "Authenticated encryption", text: "Vault keys and vault items are encrypted with AES-256-GCM. Each encryption uses a fresh initialization vector, and GCM authentication detects altered ciphertext during decryption." },
  { icon: <Server/>, title: "What the server stores", text: "Encrypted vault keys, encrypted item contents, and their initialization vectors are stored by the service. Vault names, slugs, icons, item types, and some account or organizational metadata are stored as regular database fields and are not encrypted like item contents. Encryption and decryption happen in the client application; the server does not need the unlocked vault key to store ciphertext." },
  { icon: <Code2/>, title: "Review the implementation", text: "WardPass is open source. The security model depends on the code, configuration, and operation of the deployed service; this overview is not an independent audit or certification." },
];

export default function SecurityWhitepaperPage() {
  return <main className="landing-shell pb-24 pt-36 md:pt-44">
    <div className="max-w-3xl"><p className="eyebrow mb-6">Security / Overview</p><h1 className="landing-display text-5xl tracking-tight md:text-6xl">How WardPass protects<br/><span className="landing-serif text-primary">your vault data.</span></h1><p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground">A plain-language summary of the encryption approach visible in the WardPass codebase. We aim to describe the current implementation, not promise that any single measure removes every security risk.</p></div>
    <div className="mt-12 grid max-w-5xl border-y border-border md:grid-cols-2 md:divide-x md:divide-border">{sections.map((section, i) => <article key={section.title} className="landing-card border-x-0 border-y-0 border-b border-border p-6 last:border-b-0 md:p-8"><div className="flex items-center justify-between"><span className="flex size-10 items-center justify-center border border-border bg-secondary/50 text-primary">{section.icon}</span><span className="font-mono text-xs text-muted-foreground">/{String(i + 1).padStart(2, "0")}</span></div><h2 className="mt-7 text-xl font-medium">{section.title}</h2><p className="mt-3 text-sm leading-6 text-muted-foreground">{section.text}</p></article>)}</div>
    <div className="mt-8 max-w-5xl border border-border bg-secondary/30 p-6 md:p-8"><h2 className="text-lg font-medium">Further reading</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">Read the source and technical details directly. For general background, consult primary standards and regulator guidance.</p><div className="mt-5 flex flex-wrap gap-3"><Link className="inline-flex items-center gap-2 border border-border bg-background px-4 py-2 text-sm hover:border-primary/50" href="https://github.com/zamarwint/WardPass" target="_blank" rel="noopener noreferrer">WardPass source code <ArrowUpRight size={15}/></Link><Link className="inline-flex items-center gap-2 border border-border bg-background px-4 py-2 text-sm hover:border-primary/50" href="https://csrc.nist.gov/pubs/fips/197/final" target="_blank" rel="noopener noreferrer">NIST AES standard <ArrowUpRight size={15}/></Link></div></div>
    <Link href="/" className="mt-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft size={15}/> Back to WardPass</Link>
  </main>;
}
