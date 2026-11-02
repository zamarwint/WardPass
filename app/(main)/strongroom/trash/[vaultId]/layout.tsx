import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Trash | WardPass",
};

export default function PageLayout({
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
