import TopBar from "./_components/TopBar"
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Settings | WardPass",
};

export default function PageLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <div className="flex flex-col gap-10 w-full mx-auto size-full overflow-y-auto">
            <TopBar />
            {children}
        </div>
    )
}
