import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Settings | WardPass",
    robots: {
        googleBot: {
            index: false,
            follow: false,
        },
    },
};

export default function SettingsLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="size-full overflow-y-auto">
            {children}
        </div>
    );
}
