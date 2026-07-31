import Sidebar from "./_components/Sidebar"
import TopBar from "./_components/topbar/TopBar"

export default function AppLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <div className="hidden lg:flex flex-col h-screen w-screen font-geist overflow-hidden">
            <TopBar />
            <div className="flex w-full h-full overflow-hidden">
                <Sidebar />
                <div className="flex-1 h-full overflow-y-auto">{children}</div>
            </div>
        </div>
    )
}
