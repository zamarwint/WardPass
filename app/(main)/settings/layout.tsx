import { SettingsSidebar } from "@/components/sidebars/settings-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Settings | WardPass",
    robots: {
        googleBot: {
            index: false,
            follow: false
        }
    }
};

export default function SettingsLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <SidebarProvider>
            <SettingsSidebar />
            <div className="size-full h-screen">
                {children}
            </div>
        </SidebarProvider>
    )
}
