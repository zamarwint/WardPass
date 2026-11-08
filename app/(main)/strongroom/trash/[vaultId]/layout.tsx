import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Trashed Vault Items | WardPass",
    robots: {
        googleBot: {
            index: false,
            follow: false
        }
    }
};

export default function TrashedVaultItemsPageLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <div className="flex flex-col size-full overflow-y-auto">
            {children}
        </div>
    )
}
