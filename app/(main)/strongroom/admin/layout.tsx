import TopBar from "@/components/app/admin/TopBar"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import type { Metadata } from "next";
import { requireAdminSession } from "@/lib/server/auth";
import { redirect } from "next/navigation";

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
        <div className="flex flex-col gap-10 w-full mx-auto size-full overflow-y-auto">
            <ResizablePanelGroup orientation="vertical" className="size-full overflow-hidden">
                <ResizablePanel defaultSize={25} className="size-full">
                    <TopBar />
                </ResizablePanel>

                <ResizableHandle withHandle />

                <ResizablePanel defaultSize={75} className="size-full">
                    {children}
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    )
}
