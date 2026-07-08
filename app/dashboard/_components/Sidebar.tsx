"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AppWindow, ChevronDown, CircleQuestionMark, CreditCard, ExternalLink, FileLock, House, IdCard, Loader2Icon, LockKeyhole, LogOut, LucideIcon, NotebookText, PlusIcon, Settings } from "lucide-react";
import { authClient } from "@/utils/auth-client";
import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import Profile from "./Profile";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import Image from "next/image";
import { Separator } from "@/components/ui/separator";

type SidebarItem = {
    label: string,
    icon: LucideIcon,
    path: string
}
const sidebarItems: SidebarItem[] = [
    {
        label: "Home",
        icon: House,
        path: "/dashboard"
    },
    {
        label: "Your Logins",
        icon: LockKeyhole,
        path: "/dashboard/logins"
    },
    {
        label: "Notes",
        icon: NotebookText,
        path: "/dashboard/notes"
    },
    {
        label: "Payment Cards",
        icon: CreditCard,
        path: "/dashboard/cards"
    },
    {
        label: "Identities",
        icon: IdCard,
        path: "/dashboard/ids"
    },
]

export default function Sidebar() {
    const pathName = usePathname();
    const router = useRouter();
    const [signOutPending, startSignOutTransition] = useTransition();

    const signOut = async () => {
        startSignOutTransition(async () => {
            await authClient.signOut({
                fetchOptions: {
                    onRequest: (ctx) => {
                        toast.loading("Signing you out...");
                    },
                    onSuccess: (ctx) => {
                        toast.dismiss();
                        router.push("/sign-in"); // redirect to login page
                        toast.success("Signed out successfully.");
                    },
                    onError: (ctx) => {
                        toast.error("Sign out failed. Internal server error. " + ctx.error.message);
                    }
                },
            });
        })
    }

    return (
        <motion.div
            initial={{ x: -200 }}
            animate={{ x: 0 }}
            transition={{ duration: 0.5 }}
            className="h-screen px-4 py-8 bg-card/40 backdrop:blur-sm w-fit flex flex-col justify-between"
        >
            <motion.div className="flex flex-col items-center justify-center">
                <Link className="font-bold text-3xl tracking-tighter text-primary px-5 flex items-center justify-center" href="/dashboard">
                    <Image src="/favicon.svg" alt="logo" width={0} height={0} className="w-[48px] h-[48px]" loading="eager" />
                    WardPass
                </Link>
                <motion.p className="font-semibold text-sm">ACTIVE SECURITY</motion.p>
                <Button disabled={signOutPending} variant="secondary" size="lg" className="w-full flex justify-start mt-10" onClick={signOut}>
                    {signOutPending ? (
                        <>
                            <Loader2Icon className="size-4 animate-spin" />
                            <span>Loading...</span>
                        </>
                    ) : (
                        <>
                            <LockKeyhole size="lg" />
                            <span>Lock WardPass <span className="text-muted-foreground">(Log Out)</span></span>
                        </>
                    )}
                </Button>
                <Separator className="my-2" />
            </motion.div>
            <motion.div className="w-full flex flex-col gap-2 h-full py-2">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="lg" className="w-full flex justify-between text-lg font-bold">Vaults <ChevronDown size="lg" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="font-geist">
                        <DropdownMenuGroup>
                            <DropdownMenuLabel>Vaults</DropdownMenuLabel>
                            <DropdownMenuItem disabled>No vaults.</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <Dialog>
                                <DialogTrigger className="w-full cursor-pointer hover:bg-primary hover:text-muted flex items-center justify-center gap-1 font-medium"><span>Create Vault</span> <PlusIcon /></DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Create New Vault</DialogTitle>
                                        <DialogDescription>
                                            Create a new vault.
                                        </DialogDescription>
                                    </DialogHeader>
                                </DialogContent>
                            </Dialog>
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
                {sidebarItems.map((item, index) => (
                    <Link key={index} href={item.path}>
                        <Button variant={pathName === item.path ? "default" : "ghost"} size="lg" className="w-full flex justify-start">
                            <item.icon />
                            {item.label}
                        </Button>
                    </Link>
                ))}
            </motion.div>
            <motion.div className="flex flex-col items-start justify-start gap-1">
                <Link href="/chrome-extension" className="w-full">
                    <Button disabled variant="ghost" size="lg" className="w-full flex justify-start">
                        <ExternalLink size="lg" />
                        Get Chrome Extension (Coming soon)
                    </Button>
                </Link>
                <Link href="/security-whitepaper" className="w-full">
                    <Button variant="ghost" size="lg" className="w-full flex justify-start">
                        <FileLock size="lg" />
                        Security Whitepaper
                    </Button>
                </Link>
                <Link href="/contact" className="w-full">
                    <Button variant="ghost" size="lg" className="w-full flex justify-start">
                        <CircleQuestionMark size="lg" />
                        Support
                    </Button>
                </Link>
                <Separator className="mb-2" />
                <Profile />
                <Link href="/dashboard/settings" className="w-full">
                    <Button variant={pathName === '/dashboard/settings' ? "default" : "ghost"} size="lg" className="w-full flex justify-start">
                        <Settings size="lg" />
                        Settings
                    </Button>
                </Link>
            </motion.div>
        </motion.div>
    )
}