export default function Footer() {
    return (
        <footer className="bg-surface-container-lowest dark:bg-surface-container-lowest full-width bottom-0 border-t border-white/5 flat no shadows">
            <div className="flex flex-col md:flex-row justify-between items-center w-full px-margin-mobile md:px-margin-desktop py-12 gap-gutter max-w-container-max mx-auto">
                <div className="flex flex-col items-center md:items-start gap-4 mb-8 md:mb-0">
                    <div className="font-display-lg text-headline-md text-primary-fixed tracking-tighter uppercase">WardPass</div>
                    <p className="font-label-sm text-label-sm text-on-tertiary-container uppercase tracking-widest">© 2024 WardPass. Active Security Protocols Engaged.</p>
                </div>
                <nav className="flex flex-wrap justify-center md:justify-end gap-x-8 gap-y-4">
                    <a className="font-label-sm text-label-sm text-on-tertiary-container hover:text-primary-fixed transition-colors" href="#">Privacy Policy</a>
                    <a className="font-label-sm text-label-sm text-on-tertiary-container hover:text-primary-fixed transition-colors" href="#">Terms of Service</a>
                    <a className="font-label-sm text-label-sm text-on-tertiary-container hover:text-primary-fixed transition-colors" href="#">Security Whitepaper</a>
                    <a className="font-label-sm text-label-sm text-on-tertiary-container hover:text-primary-fixed transition-colors" href="#">Status</a>
                    <a className="font-label-sm text-label-sm text-on-tertiary-container hover:text-primary-fixed transition-colors" href="#">Contact Support</a>
                </nav>
            </div>
        </footer>
    )
}