"use client";

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
import {
    Ban,
    EllipsisVertical,
    KeyRound,
    LogOut,
    Pencil,
    ShieldCheck,
    Trash2,
    UserCheck,
    UserCog,
    UserX,
} from "lucide-react";
import { useState } from "react";
import {
    BanUserAlert,
    ImpersonateUser,
    RemoveUser,
    RevokeAllUserSessions,
    SetUserPasswordAlert,
    SetUserRoleAlert,
    StopImpersonation,
    UnbanUserAlert,
    UpdateUserAlert,
} from "../user-actions/UserActions";

export function UserActionsDropdown({ user }: { user: any }) {
    const [openSetUserRole, setOpenSetUserRole] = useState(false);
    const [openSetUserPassword, setOpenSetUserPassword] = useState(false);
    const [openUpdateUser, setOpenUpdateUser] = useState(false);
    const [openBanUser, setOpenBanUser] = useState(false);
    const [openUnbanUser, setOpenUnbanUser] = useState(false);
    const [openRevokeAllUserSessions, setOpenRevokeAllUserSessions] = useState(false);
    const [openImpersonateUser, setOpenImpersonateUser] = useState(false);
    const [openStopImpersonation, setOpenStopImpersonation] = useState(false);
    const [openRemoveUser, setOpenRemoveUser] = useState(false);

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger
                    render={
                        <Button variant="ghost" size="icon" className="rounded-xl cursor-pointer" aria-label="User actions">
                            <EllipsisVertical className="size-4" />
                        </Button>
                    }
                />
                <DropdownMenuContent align="end" className="w-52 rounded-xl">
                    <DropdownMenuGroup>
                        <DropdownMenuLabel>User Actions</DropdownMenuLabel>
                        <DropdownMenuItem className="cursor-pointer rounded-lg gap-2" onClick={() => setOpenSetUserRole(true)}>
                            <ShieldCheck className="size-4" />
                            <span>Set Role</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer rounded-lg gap-2" onClick={() => setOpenSetUserPassword(true)}>
                            <KeyRound className="size-4" />
                            <span>Set Password</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer rounded-lg gap-2" onClick={() => setOpenUpdateUser(true)}>
                            <Pencil className="size-4" />
                            <span>Update User</span>
                        </DropdownMenuItem>
                        {!user.banned ? (
                            <DropdownMenuItem
                                className="cursor-pointer rounded-lg gap-2 text-amber-600 dark:text-amber-400"
                                onClick={() => setOpenBanUser(true)}
                            >
                                <Ban className="size-4" />
                                <span>Ban User</span>
                            </DropdownMenuItem>
                        ) : (
                            <DropdownMenuItem
                                className="cursor-pointer rounded-lg gap-2 text-emerald-600 dark:text-emerald-400"
                                onClick={() => setOpenUnbanUser(true)}
                            >
                                <UserCheck className="size-4" />
                                <span>Unban User</span>
                            </DropdownMenuItem>
                        )}
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                        <DropdownMenuLabel>Sessions</DropdownMenuLabel>
                        <DropdownMenuItem className="cursor-pointer rounded-lg gap-2" onClick={() => setOpenRevokeAllUserSessions(true)}>
                            <LogOut className="size-4" />
                            <span>Revoke All Sessions</span>
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                        <DropdownMenuLabel>Impersonation</DropdownMenuLabel>
                        <DropdownMenuItem className="cursor-pointer rounded-lg gap-2" onClick={() => setOpenImpersonateUser(true)}>
                            <UserCog className="size-4" />
                            <span>Impersonate User</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer rounded-lg gap-2" onClick={() => setOpenStopImpersonation(true)}>
                            <UserX className="size-4" />
                            <span>Stop Impersonation</span>
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                        <DropdownMenuLabel>Danger Zone</DropdownMenuLabel>
                        <DropdownMenuItem
                            className="cursor-pointer rounded-lg gap-2 text-destructive focus:text-destructive"
                            onClick={() => setOpenRemoveUser(true)}
                        >
                            <Trash2 className="size-4" />
                            <span>Remove User</span>
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* DIALOGS */}
            <SetUserRoleAlert
                open={openSetUserRole}
                onOpenChange={setOpenSetUserRole}
                userId={user.id}
                currentRole={user.role as "admin" | "user" | ("admin" | "user")[]}
            />
            <SetUserPasswordAlert
                open={openSetUserPassword}
                onOpenChange={setOpenSetUserPassword}
                userId={user.id}
            />
            <UpdateUserAlert
                open={openUpdateUser}
                onOpenChange={setOpenUpdateUser}
                user={user}
            />
            <BanUserAlert
                open={openBanUser}
                onOpenChange={setOpenBanUser}
                userId={user.id}
            />
            <UnbanUserAlert
                open={openUnbanUser}
                onOpenChange={setOpenUnbanUser}
                userId={user.id}
            />
            <RevokeAllUserSessions
                open={openRevokeAllUserSessions}
                onOpenChange={setOpenRevokeAllUserSessions}
                userId={user.id}
            />
            <ImpersonateUser
                open={openImpersonateUser}
                onOpenChange={setOpenImpersonateUser}
                userId={user.id}
            />
            <StopImpersonation
                open={openStopImpersonation}
                onOpenChange={setOpenStopImpersonation}
            />
            <RemoveUser
                open={openRemoveUser}
                onOpenChange={setOpenRemoveUser}
                userId={user.id}
            />
        </>
    );
}
