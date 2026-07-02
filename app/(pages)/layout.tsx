import Footer from "../_components/Footer"
import Navbar from "../_components/Navbar"

export default function PageLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <div className="flex flex-col min-h-screen min-w-screen">
            <Navbar />
            {children}
            <Footer />
        </div>
    )
}
