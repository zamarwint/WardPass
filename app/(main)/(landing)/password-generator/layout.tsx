import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "WardPass - Password Generator",
};

export default function PasswordGeneratorPageLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <div className="py-30 mx-auto flex flex-col gap-10">
            {children}
        </div>
    )
}
