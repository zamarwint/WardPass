import Sidebar from "./_components/Sidebar"

export default function AppLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <div className="hidden lg:flex min-h-screen min-w-screen font-geist">
            <Sidebar />
            <div className="flex flex-1 flex-col w-full min-h-screen">{children}</div>
        </div>
    )
}
