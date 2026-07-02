"use client";

import Link from "next/link"
import { Menu, X } from "lucide-react"
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { scrollToAnchor } from "@/lib/handyFunctions";

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
    }
];

export function ModeToggle() {
    const { setTheme } = useTheme()

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                    <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                    <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme("light")}>
                    Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                    Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                    System
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default function Navbar() {
    const [open, setOpen] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const pathName = usePathname();

    useEffect(() => {
        if (typeof window === undefined) return;
        if (pathName !== '/') return;

        const handleKeyEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setIsOpen(true);
            }
        }

        window.addEventListener("keydown", handleKeyEscape);

        return () => {
            window.removeEventListener("keydown", handleKeyEscape);
        }
    }, [])

    scrollToAnchor();
    return (
        <header className="bg-surface/80 dark:bg-surface/80 backdrop-blur-md docked w-full top-0 z-50 border-b border-white/10 flat no shadows fixed" >
            <div className="flex justify-between items-center w-full px-4 md:px-10 py-4 max-w-container-max mx-auto">
                {/* Desktop menu */}
                <div className="flex items-center gap-8">
                    <Link className="font-bold text-3xl tracking-tighter text-primary uppercase" href="/">WardPass</Link>
                    <nav className="hidden md:flex items-center gap-6">
                        {navigationLinks.map((link, index) => (
                            <Link key={index} className="hover:text-primary hover:border-b-2 hover:border-primary hover:pb-1 hover:opacity-80 transition-all" href={link.path}>{link.label}</Link>
                        ))}
                    </nav>
                </div>

                {/* Mobile Menu Toggle (Visual Only) */}
                <div className="lg:hidden">
                    <div
                        onClick={() => setOpen(!open)}
                        className="cursor-pointer text-primary"
                    >
                        {open ? <X size={48} /> : <Menu size={48} />}
                    </div>
                </div>

                {/* MOBILE MENU */}
                <div
                    className={
                        open
                            ? "flex flex-col lg:hidden bg-white/90 dark:bg-neutral-900/90 text-black dark:text-white w-screen h-screen items-left justify-left fixed top-20 left-0 z-999"
                            : "hidden"
                    }
                >
                    {open &&
                        navigationLinks.map((link, index): any => (
                            <Link
                                key={index}
                                href={link.path}
                                className={
                                    pathName === link.path
                                        ? `block transition w-full p-5 bg-primary text-primary-foreground`
                                        : "block transition w-full p-5"
                                }
                            >
                                {link.label}
                            </Link>
                        ))}
                </div>
                <div className="flex items-center gap-4">
                    <Link className="hidden md:block text-on-surface-variant hover:text-primary transition-colors" href="#">Login</Link>
                    <Link className="hidden md:block bg-primary text-primary-foreground px-6 py-2 font-label-sm text-label-sm uppercase tracking-wider hover:bg-primary/80" href="#">Get Started</Link>
                </div>
            </div>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="z-999 flex flex-col items-center justify-center">
                    <DialogHeader>
                        <DialogTitle>Change Theme</DialogTitle>
                    </DialogHeader>
                    <ModeToggle />
                </DialogContent>
            </Dialog>
        </header>
    )
}