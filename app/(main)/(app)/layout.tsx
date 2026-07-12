"use client";

import DesktopOnly from "../../../app/_components/DesktopOnly";
import Sidebar from "./dashboard/_components/Sidebar"
import { useIsMobile } from "@/hooks/use-mobile";

export default function AppLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <div className="flex min-h-screen min-w-screen font-geist">
            {useIsMobile() ? (
                <DesktopOnly />
            ) : (
                <>
                    <Sidebar />
                    <div className="flex flex-1 flex-col w-full min-h-screen">{children}</div>
                </>
            )}
        </div>
    )
}
