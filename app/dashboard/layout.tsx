"use client";

import DesktopOnly from "../_components/DesktopOnly";
import Sidebar from "./_components/Sidebar"
import { useIsMobile } from "@/hooks/use-mobile";

export default function DashboardLayout({
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
                    {children}
                </>)
            }
        </div>
    )
}
