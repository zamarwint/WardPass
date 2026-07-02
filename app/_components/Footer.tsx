import Link from "next/link";

export default function Footer() {
    return (
        <footer className="w-full bottom-0 border-t border-white/5">
            <div className="flex flex-col md:flex-row justify-between items-center w-full px-4 md:px-10 py-12 mx-auto">
                <div className="flex flex-col items-center md:items-start gap-4 mb-8 md:mb-0">
                    <div className="font-bold text-primary tracking-tighter uppercase text-xl">WardPass</div>
                    <p className="text-xs uppercase tracking-widest text-muted-foreground">© 2024 WardPass. Active Security Protocols Engaged.</p>
                </div>
                <nav className="text-xs flex flex-wrap justify-center md:justify-end gap-x-8 gap-y-4">
                    <Link className="text-muted-foreground hover:underline hover:underline-offset-6 transition-colors" href="#">Privacy Policy</Link>
                    <Link className="text-muted-foreground hover:underline hover:underline-offset-6 transition-colors" href="#">Terms of Service</Link>
                    <Link className="text-muted-foreground hover:underline hover:underline-offset-6 transition-colors" href="#">Security Whitepaper</Link>
                    <Link className="text-muted-foreground hover:underline hover:underline-offset-6 transition-colors" href="#">Status</Link>
                    <Link className="text-muted-foreground hover:underline hover:underline-offset-6 transition-colors" href="#">Contact Support</Link>
                </nav>
            </div>
        </footer>
    )
}