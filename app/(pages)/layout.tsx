import Footer from "../_components/Footer"
import Navbar from "../_components/Navbar"

export default function PageLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <div className="w-screen h-screen flex flex-col min-h-screen">
            <Navbar />
            {children}
            <Footer />
        </div>
    )
}
