import TopBar from "./_components/TopBar"

export default function PageLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <div className="flex flex-col gap-10 w-full mx-auto h-screen overflow-y-scroll">
            <TopBar />
            {children}
        </div>
    )
}
