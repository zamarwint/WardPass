"use client"

import DesktopOnly from "../_components/DesktopOnly"
import { useIsMobile } from "@/hooks/use-mobile";

export default function AuthLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <div className="flex flex-col w-screen h-screen items-center justify-center gap-4 font-geist">
            {useIsMobile() ? <DesktopOnly /> : children}
        </div>
    )
}
