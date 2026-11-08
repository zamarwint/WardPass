import TopBar from "@/components/app/settings/TopBar"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
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
        <div className="flex flex-col gap-10 w-full mx-auto size-full overflow-y-auto">
            <ResizablePanelGroup orientation="vertical" className="size-full overflow-hidden">
                <ResizablePanel defaultSize={25} className="size-full">
                    <TopBar />
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={75} className="size-full h-screen">
                    {children}
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    )
}
