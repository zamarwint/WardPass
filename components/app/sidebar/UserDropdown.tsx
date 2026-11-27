"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    ChevronDown,
    ChevronsUpDown,
    Loader2Icon,
    LogOut,
    Settings,
    Shield,
    Trash,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ProfileAvatar } from "@/components/app/settings/Profile";
import SignOutAlert from "@/components/app/auth/SignOutAlert";
import { CustomLoadingState } from "@/components/LoadingStates";
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { useCheckAdminSession, useGetSession } from "@/lib/queries/SessionQueries";

interface UserDropdownProps {
    onSidebar: boolean;
}

function getInitials(name?: string | null): string {
    if (!name) return "U";
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return "U";
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

export default function UserDropdown({ onSidebar }: UserDropdownProps) {
    const session = useGetSession();
    const checkAdmin = useCheckAdminSession();
    const [openSignOut, setOpenSignOut] = useState(false);
    const router = useRouter();

    const userName = session.data?.user.name || "Member";
    const userEmail = session.data?.user.email || "";
    const userImage = (session.data?.user.image as string) || "";
    const initials = getInitials(session.data?.user.name);

    return (
        <SidebarMenuItem className="my-0.5">
            <SignOutAlert open={openSignOut} onOpenChange={setOpenSignOut} />
            <DropdownMenu>
                {!onSidebar && (
                    <DropdownMenuTrigger
                        render={
                            <Button variant="ghost" size="icon-lg" className="w-fit gap-1.5 rounded-xl px-2 cursor-pointer">
                                {session.isPending ? (
                                    <Loader2Icon className="size-4 animate-spin" />
                                ) : session.error ? (
                                    <span className="text-xs text-destructive">Error</span>
                                ) : (
                                    <>
                                        <ProfileAvatar
                                            size="size-8"
                                            image={userImage}
                                            alt={userName}
                                            fallback={initials}
                                        />
                                        <ChevronDown className="size-4 text-muted-foreground" />
                                    </>
                                )}
                            </Button>
                        }
                    />
                )}

                {onSidebar && (
                    <DropdownMenuTrigger
                        render={
                            <SidebarMenuButton
                                size="lg"
                                className="h-auto w-full rounded-xl p-2 border border-border/40 bg-background/50 hover:bg-sidebar-accent/70 hover:border-border/70 transition-all duration-150 cursor-pointer"
                            >
                                {session.isPending ? (
                                    <CustomLoadingState
                                        loaderChoice={1}
                                        className="flex items-center justify-center gap-2 font-semibold size-full py-1.5"
                                    >
                                        <span className="shimmer shimmer-duration-1000 text-xs">Loading...</span>
                                    </CustomLoadingState>
                                ) : session.error ? (
                                    <span className="text-xs text-destructive">Unable to load user</span>
                                ) : (
                                    <div className="w-full flex items-center justify-between gap-2.5 min-w-0">
                                        <div className="flex items-center gap-2.5 min-w-0">
                                            <ProfileAvatar
                                                size="size-8 ring-1 ring-border/60 shrink-0"
                                                image={userImage}
                                                alt={userName}
                                                fallback={initials}
                                            />
                                            <div className="flex flex-col items-start justify-center min-w-0 leading-tight">
                                                <span className="text-xs font-semibold text-foreground truncate max-w-full">
                                                    {userName}
                                                </span>
                                                <span className="text-[11px] font-normal text-muted-foreground truncate max-w-full">
                                                    {userEmail}
                                                </span>
                                            </div>
                                        </div>
                                        <ChevronsUpDown className="size-4 text-muted-foreground shrink-0" />
                                    </div>
                                )}
                            </SidebarMenuButton>
                        }
                    />
                )}

                <DropdownMenuContent
                    align="end"
                    sideOffset={8}
                    className="w-56 rounded-2xl border border-border/60 bg-popover/95 backdrop-blur-md p-1.5 shadow-xl"
                >
                    {checkAdmin.data && (
                        <DropdownMenuGroup>
                            <DropdownMenuLabel className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70 px-2 py-1">
                                Admin Controls
                            </DropdownMenuLabel>
                            <DropdownMenuItem
                                className="cursor-pointer rounded-xl px-2.5 py-2 text-xs font-medium"
                                onClick={() => router.push("/admin")}
                            >
                                <Shield className="size-4 mr-2 text-primary" />
                                <span>Admin Panel</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="my-1 bg-border/40" />
                        </DropdownMenuGroup>
                    )}

                    <DropdownMenuGroup>
                        <DropdownMenuLabel className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70 px-2 py-1">
                            My Account
                        </DropdownMenuLabel>
                        <DropdownMenuItem
                            className="cursor-pointer rounded-xl px-2.5 py-2 text-xs font-medium"
                            onClick={() => router.push("/settings")}
                        >
                            <Settings className="size-4 mr-2 text-muted-foreground" />
                            <span>Settings</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            className="cursor-pointer rounded-xl px-2.5 py-2 text-xs font-medium"
                            onClick={() => router.push("/strongroom/trash")}
                        >
                            <Trash className="size-4 mr-2 text-muted-foreground" />
                            <span>Trash</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="my-1 bg-border/40" />
                        <DropdownMenuItem
                            className="cursor-pointer rounded-xl px-2.5 py-2 text-xs font-medium text-destructive focus:text-destructive"
                            onClick={() => setOpenSignOut(!openSignOut)}
                        >
                            <LogOut className="size-4 mr-2" />
                            <span>Log Out</span>
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        </SidebarMenuItem>
    );
}
