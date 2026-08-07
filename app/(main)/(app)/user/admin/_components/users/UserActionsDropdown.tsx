import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { EllipsisVertical } from "lucide-react";
import { useState } from "react";
import { BanUserAlert, ImpersonateUser, RemoveUser, RevokeAllUserSessions, SetUserPasswordAlert, SetUserRoleAlert, StopImpersonation, UnbanUserAlert, UpdateUserAlert } from "./user-actions/UserActions";

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
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost">
                    <EllipsisVertical className="size-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
                <DropdownMenuLabel>
                    User Actions
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem className="cursor-pointer" onClick={() => setOpenSetUserRole(true)}>Set Role</DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer" onClick={() => setOpenSetUserPassword(true)}>Set User Password</DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer" onClick={() => setOpenUpdateUser(true)}>Update User</DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer" onClick={() => setOpenBanUser(true)} disabled={user.banned}>Ban User</DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer" onClick={() => setOpenUnbanUser(true)} disabled={!user.banned}>Unban User</DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>
                    Sessions Actions
                </DropdownMenuLabel>
                <DropdownMenuGroup>
                    <DropdownMenuItem className="cursor-pointer" onClick={() => setOpenRevokeAllUserSessions(true)}>Revoke all User Sessions</DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>
                    Impersonation
                </DropdownMenuLabel>
                <DropdownMenuGroup>
                    <DropdownMenuItem className="cursor-pointer" onClick={() => setOpenImpersonateUser(true)}>Impersonate User</DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer" onClick={() => setOpenStopImpersonation(true)}>Stop Impersonation</DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>
                    Delete User
                </DropdownMenuLabel>
                <DropdownMenuGroup>
                    <DropdownMenuItem className="cursor-pointer" onClick={() => setOpenRemoveUser(true)}>Remove User</DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
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
            {/* REVOKE ALL USER SESSIONS */}
            <RevokeAllUserSessions
                open={openRevokeAllUserSessions}
                onOpenChange={setOpenRevokeAllUserSessions}
                userId={user.id}
            />
            {/* IMPERSONATION */}
            <ImpersonateUser
                open={openImpersonateUser}
                onOpenChange={setOpenImpersonateUser}
                userId={user.id}
            />
            <StopImpersonation
                open={openStopImpersonation}
                onOpenChange={setOpenStopImpersonation}
            />
            {/* REMOVE USER */}
            <RemoveUser
                open={openRemoveUser}
                onOpenChange={setOpenRemoveUser}
                userId={user.id}
            />
        </DropdownMenu>
    )
}