import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Cryptographic Password Generator | WardPass",
    description: "Generate high-entropy, breach-resistant passwords using the browser Web Crypto API.",
};

export default function PasswordGeneratorPageLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <main className="relative grow bg-background text-foreground min-h-screen overflow-hidden">
            {/* Luminous gold glow */}
            <div
                className="absolute inset-0 pointer-events-none z-0 opacity-40"
                style={{
                    background: "radial-gradient(circle at 60% 15%, rgba(214, 165, 29, 0.15) 0%, transparent 65%)"
                }}
            />
            <div className="absolute inset-0 telemetry-grid pointer-events-none opacity-40 z-0" />

            <div className="landing-shell relative z-10 flex flex-col gap-10 pb-24 pt-32 sm:pt-40 max-w-4xl">
                {children}
            </div>
        </main>
    );
}
