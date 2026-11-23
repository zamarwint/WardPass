import type { Metadata } from "next";
import { requireAdminSession } from "@/lib/server/auth";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/sidebars/admin-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export const metadata: Metadata = {
    title: "Admin Dashboard | WardPass",
    robots: {
        googleBot: {
            index: false,
            follow: false
        }
    }
};

export default async function AdminPageLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    try {
        await requireAdminSession();
    } catch {
        redirect("/strongroom");
    }

    return (
        <SidebarProvider>
            <AdminSidebar />
            <main className="size-full h-screen">
                {children}
            </main>
        </SidebarProvider>
    )
}
