import Footer from "./_components/Footer"
import Navbar from "./_components/Navbar"

export default function LandingPageLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <div className="flex flex-col w-full h-full min-h-screen min-w-screen overflow-x-hidden">
            <Navbar />
            {children}
            <Footer />
        </div>
    )
}
