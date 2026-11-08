import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Playground | WardPass",
    robots: {
        googleBot: {
            index: false,
            follow: false
        }
    }
};

export default function PlaygroundLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <div className="size-full flex flex-col items-center justify-center overflow-hidden">
            {children}
        </div>
    )
}
