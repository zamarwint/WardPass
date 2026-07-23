"use client";

import Link from "next/link"
import { Loader2Icon, Menu, X } from "lucide-react"
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import { motion, useScroll } from "motion/react";
import { ScrollToAnchor } from "@/lib/functions";
import { ModeToggleIcon } from "@/app/_components/ThemeChange";
import { toast } from "sonner";
import { getUserSession } from "@/app/actions/getSession";
import { useQuery } from "@tanstack/react-query";

const navigationLinks = [
    {
        label: "Features",
        path: "#features",
    },
    {
        label: "Security",
        path: "#security",
    },
    {
        label: "Password Generator",
        path: "/password-generator"
    },
    {
        label: "Chrome Extension",
        path: "/extension"
    },
];

export default function Navbar() {
    const { scrollYProgress } = useScroll();
    const [open, setOpen] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const pathName = usePathname();
    const { isPending, data, error } = useQuery({
        queryKey: ["get-session-nav"],
        queryFn: () => getUserSession(),
        refetchOnMount: true,
        refetchOnReconnect: true,
        refetchOnWindowFocus: true,
        staleTime: 1000 * 60 * 2,
        gcTime: 1000 * 60 * 5
    })

    if (error) toast.error("An error occured." + error.message);

    // PREVENT USER FROM SCROLLING WHEN MOBILE MENU IS ACTIVE
    useEffect(() => {
        if (open) {
            document.documentElement.style.overflow = "hidden";
        } else {
            document.documentElement.style.overflow = "auto";
        }
    }, [open]);

    // CHANGE THEME, FOR DEV PURPOSES, NOT FOR PRODUCTION
    useEffect(() => {
        if (typeof window === undefined) return;
        if (pathName !== '/') return;
        if (process.env.NEXT_PUBLIC_NODE_ENV === 'production') return;

        console.log(scrollYProgress)

        const handleKeyEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setIsOpen(true);
            }
        }

        window.addEventListener("keydown", handleKeyEscape);

        return () => {
            window.removeEventListener("keydown", handleKeyEscape);
        }
    })

    ScrollToAnchor();
    return (
        <motion.header
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{
                duration: 1,
            }}
            className="bg-transparent backdrop-blur-md w-full z-50 border-b border-foreground/10 fixed flex flex-col font-geist"
        >
            <motion.div className="flex justify-between items-center w-full px-4 md:px-10 py-4 mx-auto">
                {/* DESKTOP MENU */}
                <div className="hidden lg:flex items-center gap-8 w-full">
                    <Link className="font-bold text-3xl tracking-tighter text-primary uppercase" href="/">WardPass</Link>
                    <nav className="hidden md:flex items-center gap-6">
                        {navigationLinks.map((link, index) => (
                            <Link key={index} className={pathName === link.path ? "text-primary border-b-2 border-primary pb-1 opacity-80 transition-all " : "hover:text-primary hover:border-b-2 hover:border-primary hover:pb-1 hover:opacity-80 transition-all"} href={link.path}>{link.label}</Link>
                        ))}
                    </nav>
                </div>

                {/* MOBILE MENU (VISUAL ONLY) */}
                <div className="lg:hidden flex items-center justify-between gap-8 w-full">
                    <Link className="font-bold text-3xl tracking-tighter text-primary uppercase" href="/">WardPass</Link>
                    <div
                        onClick={() => setOpen(!open)}
                        className="cursor-pointer text-primary"
                    >
                        {open ? <X size={48} /> : <Menu size={48} />}
                    </div>
                </div>

                {/* MOBILE MENU DROPDOWN */}
                <div
                    className={
                        open
                            ? "flex flex-col lg:hidden w-screen h-screen items-left justify-left top-20 left-0 z-999 fixed"
                            : "hidden"
                    }
                >
                    {open &&
                        navigationLinks.map((link, index) => (
                            <Link
                                key={index}
                                href={link.path}
                                className={
                                    pathName === link.path
                                        ? `block transition w-full h-fit p-5 bg-primary text-primary-foreground`
                                        : "block transition w-full h-fit p-5 bg-background"
                                }
                            >
                                {link.label}
                            </Link>
                        ))}
                </div>

                {/* LOGIN AND SIGN-UP (DESKTOP ONLY) */}
                <div className="hidden lg:flex items-center justify-end gap-4 w-full">
                    {isPending ? (
                        <>
                            <Loader2Icon className="size-4 animate-spin" />
                            <span>Loading...</span>
                        </>
                    ) : data?.user ? (
                        <>
                            <ModeToggleIcon />
                            <Link className="hidden md:block btn-primary py-2 px-5 uppercase tracking-wider font-semibold" href="/user/vault">VAULT DASHBOARD</Link>
                        </>
                    ) : (
                        <>
                            <Link className="hidden md:block btn-ghost transition-colors" href="sign-in">Login</Link>
                            <Link className="hidden md:block btn-primary py-2 px-5 uppercase tracking-wider font-semibold" href="sign-up">Get Started</Link>
                        </>
                    )}
                </div>
            </motion.div>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="z-999 flex flex-col items-center justify-center">
                    <DialogHeader>
                        <DialogTitle>Change Theme</DialogTitle>
                    </DialogHeader>
                    <ModeToggleIcon />
                </DialogContent>
            </Dialog>
            <motion.div
                id="scroll-indicator"
                className="fixed top-0 left-0 right-0 h-0.5 w-screen bg-primary origin-left z-50"
                style={{
                    scaleX: scrollYProgress,
                    transformOrigin: "0%",
                }}
            />
        </motion.header>
    )
}