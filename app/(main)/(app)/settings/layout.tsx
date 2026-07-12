import Navbar from "./_components/Navbar"

export default function PageLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <div className="flex flex-col gap-10 w-full mx-auto h-screen overflow-y-scroll">
            <Navbar />
            {children}
        </div>
    )
}
