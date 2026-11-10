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
import { ChevronDown, EllipsisVertical, Loader2Icon, LogOut, Settings, Shield, Trash } from "lucide-react";
import ProfileAvatar from "../settings/ProfileAvatar";
import { useState } from "react";
import SignOutAlert from "@/components/app/auth/SignOutAlert";
import { useRouter } from "next/navigation";
import { CustomLoadingState } from "@/components/LoadingStates";
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { useCheckAdminSession, useGetSession } from "@/lib/queries/SessionQueries";

interface UserDropdownProps {
    onSidebar: boolean;
}

export default function UserDropdown({ onSidebar }: UserDropdownProps) {
    const session = useGetSession();
    const checkAdmin = useCheckAdminSession();

    const [openSignOut, setOpenSignOut] = useState(false);

    const router = useRouter();

    return (
        <SidebarMenuItem className="my-1">
            <SignOutAlert open={openSignOut} onOpenChange={setOpenSignOut} />
            <DropdownMenu>
                {!onSidebar && (
                    <DropdownMenuTrigger render={
                        <Button variant="ghost" size="icon-lg" className="w-fit">
                            {session.isPending ? (
                                <Loader2Icon className="size-4 animate-spin" />
                            ) : session.error ? (
                                <span>Error! Unable to load user information.</span>
                            ) : (
                                <>
                                    <ProfileAvatar size="size-8" image={session.data?.user.image as string} alt={session.data?.user.name || "Profile picture"} fallback={`${session.data?.user.name.split(" ")[0][0]}${session.data?.user.name.split(" ")[1][0]}`} />
                                    <ChevronDown />
                                </>
                            )}
                        </Button>
                    }>
                    </DropdownMenuTrigger>
                )}
                {onSidebar && (
                    <DropdownMenuTrigger render={
                        <SidebarMenuButton size="lg" className="w-full flex justify-start py-7">
                            {session.isPending ? (
                                <CustomLoadingState loaderChoice={1} className="flex items-center justify-center gap-2 font-semibold size-full">
                                    <span className="shimmer shimmer-duration-1000"> Loading... </span>
                                </CustomLoadingState>
                            ) : session.error ? (
                                <span>Error! Unable to load user information.</span>
                            ) : (
                                <motion.div className="w-full flex items-center justify-between gap-2">
                                    <div className="flex items-center justify-center gap-2">
                                        <ProfileAvatar size="size-8" image={session.data?.user.image as string} alt={session.data?.user.name || "Profile picture"} fallback={`${session.data?.user.name.split(" ")[0][0]}${session.data?.user.name.split(" ")[1][0]}`} />
                                        <div className="flex flex-col items-start justify-start">
                                            <div className="font-semibold line-clamp-1">{session.data ? session.data.user.name : "Name"}</div>
                                            <div className="font-normal text-muted-foreground line-clamp-1">{session.data ? session.data.user.email : "Email"}</div>
                                        </div>

                                    </div>
                                    <div>
                                        <EllipsisVertical />
                                    </div>

                                </motion.div>
                            )}
                        </SidebarMenuButton>
                    }>
                    </DropdownMenuTrigger>
                )}
                <DropdownMenuContent align="end">
                    {checkAdmin && <DropdownMenuGroup>
                        {checkAdmin && <DropdownMenuLabel>Admin Controls</DropdownMenuLabel>}
                        {checkAdmin && <DropdownMenuItem className="cursor-pointer" onClick={() => router.push('/strongroom/admin')}><Shield className="mr-0.5" /> Admin Panel</DropdownMenuItem>}
                        {checkAdmin && <DropdownMenuSeparator />}
                    </DropdownMenuGroup>}

                    <DropdownMenuGroup>
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuItem className="cursor-pointer" onClick={() => router.push('/strongroom/settings')}><Settings size={16} className="mr-0.5" /> Settings</DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer" onClick={() => router.push('/strongroom/trash')}><Trash size={16} className="mr-0.5" /> Trash</DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer" onClick={() => setOpenSignOut(!openSignOut)}><LogOut size={16} className="mr-0.5" /> Log Out</DropdownMenuItem>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        </SidebarMenuItem>
    )
}
