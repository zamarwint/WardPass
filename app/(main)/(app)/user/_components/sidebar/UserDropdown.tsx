"use client";

import { Button } from "@/components/ui/button"
import { motion } from "motion/react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown, EllipsisVertical, ExternalLink, Loader2Icon } from "lucide-react";
import ProfileAvatar from "./ProfileAvatar";
import { cn } from "@/lib/utils";
import Profile from "./Profile";
import { useState } from "react";
import SignOutAlert from "../signout/SignOutDropdown";
import { useRouter } from "next/navigation";

interface UserDropdownProps {
    collapsed: boolean;
    onSidebar: boolean;
    sessionData?: {
        isPending: boolean;
        data: any;
        error: Error | null;
    };
}

export default function UserDropdown({ collapsed, onSidebar, sessionData }: UserDropdownProps) {
    const isPending = sessionData?.isPending ?? false;
    const data = sessionData?.data;
    const error = sessionData?.error ?? null;

    const [openProfile, setOpenProfile] = useState(false);
    const [openSignOut, setOpenSignOut] = useState(false);

    const router = useRouter();

    return (
        <>
            <Profile open={openProfile} onOpenChange={setOpenProfile} data={data} />
            <SignOutAlert open={openSignOut} onOpenChange={setOpenSignOut} />
            <DropdownMenu>
                {!onSidebar && (
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="lg" className="w-fit">
                            {isPending ? (
                                <>
                                    <Loader2Icon className="size-4 animate-spin" />
                                </>
                            ) : error ? (
                                <span>Error! Unable to load user information.</span>
                            ) : (
                                <>
                                    <ProfileAvatar size="size-8" image={data?.user.image as string} alt={data?.user.name || "Profile picture"} fallback={`${data?.user.name.split(" ")[0][0]}${data?.user.name.split(" ")[1][0]}`} />
                                    <ChevronDown />
                                </>
                            )}
                        </Button>
                    </DropdownMenuTrigger>
                )}
                {onSidebar && (
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="lg" className="w-full flex justify-start py-7">
                            {isPending ? (
                                <>
                                    <Loader2Icon className="size-4 animate-spin" />
                                    <span className={cn("font-semibold", collapsed ? "hidden" : "block")}>Loading...</span>
                                </>
                            ) : error ? (
                                <span>Error! Unable to load user information.</span>
                            ) : (
                                <motion.div className="w-full flex items-center justify-between gap-2">
                                    <div className="flex items-center justify-center gap-2">
                                        <ProfileAvatar size="size-8" image={data?.user.image as string} alt={data?.user.name || "Profile picture"} fallback={`${data?.user.name.split(" ")[0][0]}${data?.user.name.split(" ")[1][0]}`} />
                                        {!collapsed && (
                                            <div className="flex flex-col items-start justify-start">
                                                <div className="font-semibold line-clamp-1">{data ? data.user.name : "Name"}</div>
                                                <div className="font-normal text-muted-foreground line-clamp-1">{data ? data.user.email : "Email"}</div>
                                            </div>
                                        )}
                                    </div>
                                    {!collapsed ? (
                                        <div>
                                            <EllipsisVertical />
                                        </div>
                                    ) : null}
                                </motion.div>
                            )}
                        </Button>
                    </DropdownMenuTrigger>
                )}
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer" onClick={() => setOpenProfile(!openProfile)}>Profile</DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer" onClick={() => router.push('/contact')}>Get Help <ExternalLink size={16} /></DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer" onClick={() => setOpenSignOut(!openSignOut)}>Log Out</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    )
}