"use client"

import { getWindowWidth } from "@/lib/handyFunctions";
import DesktopOnly from "../_components/DesktopOnly"

const windowWidth = getWindowWidth();
export default function AuthLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <div className="flex flex-col w-screen h-screen items-center justify-center gap-4 font-geist">
            {windowWidth < 1024 ? <DesktopOnly /> : children}
        </div>
    )
}
