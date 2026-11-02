import Link from "next/link";

const footerLinks = [
    {
        label: "License",
        href: "/license"
    },
    {
        label: "Security Whitepaper",
        href: "/security-whitepaper"
    },
    {
        label: "Contact Support",
        href: "/contact"
    }
]

export default function Footer() {
    return (
        <footer className="w-full bottom-0 border-t border-foreground/5 font-geist">
            <div className="flex flex-col md:flex-row justify-between items-center w-full px-4 md:px-10 py-12 mx-auto">
                <div className="flex flex-col items-center md:items-start gap-4 mb-8 md:mb-0">
                    <Link href="/" className="font-bold text-primary tracking-tighter uppercase text-xl">WardPass</Link>
                    <p className="text-xs uppercase tracking-widest text-muted-foreground">© 2026 WardPass. Security Protocols Engaged.</p>
                </div>
                <nav className="text-xs flex flex-wrap justify-center md:justify-end gap-x-8 gap-y-4">
                    {footerLinks.map((link, key) => (
                        <Link key={key} className="text-muted-foreground hover:underline hover:underline-offset-6 transition-colors" href={link.href}>{link.label}</Link>
                    ))}
                </nav>
            </div>
        </footer>
    )
}