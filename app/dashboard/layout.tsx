"use client";

import { getWindowWidth } from "@/lib/handyFunctions";
import DesktopOnly from "../_components/DesktopOnly";
import Sidebar from "./_components/Sidebar"

const windowWidth = getWindowWidth();

export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <div className="flex min-h-screen min-w-screen font-geist">
            {windowWidth < 1024 ? (
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
