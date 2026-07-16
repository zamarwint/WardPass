import VaultTopBar from "../_components/VaultTopBar"
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "WardPass - Vault",
};

export default function VaultIdLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <div className="size-full flex flex-col items-center justify-center overflow-hidden">
            <VaultTopBar />
            <div className="flex-1 w-full overflow-hidden">
                {children}
            </div>
        </div>
    )
}
