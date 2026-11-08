import Link from "next/link";

const footerLinks = [
  { label: "Password generator", href: "/password-generator" },
  { label: "Security overview", href: "/security-whitepaper" },
  { label: "Chrome extension", href: "/chrome-extension" },
  { label: "Contact", href: "/contact" },
  { label: "License", href: "/license" },
];

export default function Footer() {
  return <footer className="border-t border-border/70"><div className="landing-shell grid gap-8 py-10 md:grid-cols-[1fr_auto] md:items-end"><div><Link href="/" className="text-lg font-semibold tracking-tight uppercase">wardpass<span className="text-primary">.</span></Link><p className="mt-2 max-w-sm text-xs leading-5 text-muted-foreground">A thoughtful place to organize and protect the credentials you use every day.</p><p className="mt-5 font-mono text-[10px] tracking-wide text-muted-foreground">© 2026 WARDPASS · OPEN SOURCE UNDER MIT</p></div><nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-3 text-xs text-muted-foreground">{footerLinks.map(link => <Link key={link.href} className="transition hover:text-foreground" href={link.href}>{link.label}</Link>)}</nav></div></footer>;
}
