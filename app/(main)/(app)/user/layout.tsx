import Sidebar from "./_components/Sidebar"

export default function AppLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <div className="hidden lg:flex h-screen w-screen font-geist overflow-hidden">
            <Sidebar />
            <div className="flex flex-1 flex-col w-full h-full overflow-hidden">{children}</div>
        </div>
    )
}
