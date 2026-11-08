"use client"

import DesktopOnly from "@/hooks/use-desktop-only"
import { useIsMobile } from "@/hooks/use-mobile";

export default function AuthLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <div className="flex flex-col w-screen h-screen items-center justify-center gap-4">
            {useIsMobile() ? (
                <DesktopOnly />
            ) : (
                <div className="flex flex-col w-full h-full items-center justify-center">
                    {children}
                </div>
            )}
        </div>
    )
}
