import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Import Passwords | WardPass",
};

export default function ImportLayout({
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
