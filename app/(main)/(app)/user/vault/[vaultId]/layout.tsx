import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Vaults | WardPass",
};

export default function VaultIdLayout({
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
