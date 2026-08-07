"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
    FieldLegend,
    FieldSeparator,
    FieldTitle,
} from "@/components/ui/field"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useRevokeUserSessionMutation } from "@/lib/mutations/AdminMutations";
import { useDBListUserSessions, useSearchUserSession } from "@/lib/queries/AdminQueries";
import { EllipsisVertical, Loader, Search, TriangleAlert } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { UserImpersonation } from "./UserImpersonation";

function SessionActionsDialog({ open, setOpen, sessionToken, }: { open: boolean, setOpen: (open: boolean) => void, sessionToken: string }) {
    const { mutate, data, error, isPending } = useRevokeUserSessionMutation({ sessionToken });

    const handleRevokeSession = () => {
        mutate();
        setOpen(false);
    }

    if (error) toast.error("Failed to revoke session");
    if (data) toast.success('Session revoked successfully');

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Revoke Session</DialogTitle>
                    <DialogDescription>
                        Revoke this session for the user. This will log them out of their account.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button variant="destructive" onClick={handleRevokeSession} disabled={isPending}>
                        {isPending ? (
                            <div className="flex items-center gap-2">
                                <Loader className="size-4 animate-spin" />
                                <span className="text-sm">Revoking...</span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <span className="text-sm">Revoke</span>
                            </div>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

function SessionButtonDropdown({ sessionToken }: { sessionToken: string }) {
    const [open, setOpen] = useState(false);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost">
                    <EllipsisVertical className="size-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
                <DropdownMenuItem className="cursor-pointer" onClick={() => setOpen(true)}>Revoke Session</DropdownMenuItem>
            </DropdownMenuContent>
            <SessionActionsDialog open={open} setOpen={setOpen} sessionToken={sessionToken} />
        </DropdownMenu>
    )
}

function ListAllUserSessions() {
    const { data: allSessions, isPending, error } = useDBListUserSessions();
    return (
        <FieldGroup>
            <Field>
                <FieldLegend>Sessions</FieldLegend>
                <FieldDescription>Manage all active sessions.</FieldDescription>
            </Field>
            <FieldSeparator />
            {isPending ? (
                <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader className="size-4 animate-spin" />
                    <span className="text-sm">Loading sessions...</span>
                </div>
            ) : error ? (
                <div className="flex items-center gap-2">
                    <TriangleAlert className="size-4 text-red-500" />
                    <span>Failed to load sessions. Session(s) may not exist.</span>
                </div>
            ) : (!allSessions) ? (
                <FieldDescription>No sessions found.</FieldDescription>
            ) : (
                <FieldGroup className="overflow-y-scroll max-h-[40vh]">
                    {allSessions?.map((session) => (
                        <div key={session.id} className="w-full flex justify-between items-center border border-border rounded-xl p-5">
                            <Field>
                                <FieldTitle>Agent: {session.userAgent}</FieldTitle>
                                <FieldDescription>Created At: {session.createdAt.toDateString()}</FieldDescription>
                                <FieldDescription>IP Address: {session.ipAddress}</FieldDescription>
                                <FieldDescription>Created At: {session.createdAt.toDateString()}</FieldDescription>
                                <FieldDescription>Updated At: {session.updatedAt.toDateString()}</FieldDescription>
                                <FieldDescription>Expires At: {session.expiresAt.toDateString()}</FieldDescription>
                                <FieldDescription>Impersonated By: {session.impersonatedBy || 'User not yet impersonated.'}</FieldDescription>
                            </Field>
                            <SessionButtonDropdown sessionToken={session.token} />
                        </div>
                    ))}
                </FieldGroup>
            )
            }
        </FieldGroup>
    )
}

function SearchUserSessions() {
    const [userId, setUserId] = useState<string>('');
    const { data: userSessions, isPending, error } = useSearchUserSession({ userId });

    return (
        <FieldGroup>
            <Field>
                <FieldLegend>Sessions</FieldLegend>
                <FieldDescription>Manage a specific user sessions.</FieldDescription>
            </Field>
            <FieldSeparator />
            <Field>
                <FieldTitle>Search for a User</FieldTitle>
                <FieldDescription>Enter the user ID to view their sessions.</FieldDescription>
                <FieldLabel>User ID</FieldLabel>
                <InputGroup className="max-w-full h-8.5">
                    <InputGroupInput placeholder="Search session(s)..." onChange={(e) => setUserId(e.target.value)} value={userId} />
                    <InputGroupAddon>
                        <Search />
                    </InputGroupAddon>
                    <InputGroupAddon align="inline-end"></InputGroupAddon>
                </InputGroup>
            </Field>
            <FieldSeparator />
            {isPending ? (
                <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader className="size-4 animate-spin" />
                    <span className="text-sm">Loading sessions...</span>
                </div>
            ) : error ? (
                <div className="flex items-center gap-2">
                    <TriangleAlert className="size-4 text-red-500" />
                    <span>Failed to load sessions. Session(s) may not exist.</span>
                </div>
            ) : (!userSessions || !userId) ? (
                <FieldDescription>No sessions found.</FieldDescription>
            ) : (
                <FieldGroup className="overflow-y-scroll max-h-[40vh]">
                    {userSessions?.sessions?.map((session) => (
                        <div key={session.id} className="w-full flex justify-between items-center border border-border rounded-xl p-5">
                            <Field>
                                <FieldTitle>Agent: {session.userAgent}</FieldTitle>
                                <FieldDescription>Created At: {session.createdAt.toDateString()}</FieldDescription>
                                <FieldDescription>IP Address: {session.ipAddress}</FieldDescription>
                                <FieldDescription>Created At: {session.createdAt.toDateString()}</FieldDescription>
                                <FieldDescription>Updated At: {session.updatedAt.toDateString()}</FieldDescription>
                                <FieldDescription>Expires At: {session.expiresAt.toDateString()}</FieldDescription>
                                <FieldDescription>Impersonated By: {session.impersonatedBy || 'User not yet impersonated.'}</FieldDescription>
                            </Field>
                            <SessionButtonDropdown sessionToken={session.token} />
                        </div>
                    ))}
                </FieldGroup>
            )
            }
        </FieldGroup>
    )
}

export default function UserSessions() {
    const [selectedAction, setSelectedAction] = useState<string>('list-all-sessions');
    return (
        <div className="size-full">
            <FieldGroup className="border border-border rounded-xl p-10">
                <Field>
                    <FieldLegend>Select an Action</FieldLegend>
                    <FieldDescription>Select an action to perform.</FieldDescription>
                </Field>
                <FieldSeparator />
                <ToggleGroup type="single" value={selectedAction} onValueChange={(value) => setSelectedAction(value)}>
                    <ToggleGroupItem size="sm" value="list-all-sessions" className="text-md p-6 rounded-xl">
                        List All Sessions
                    </ToggleGroupItem>
                    <ToggleGroupItem size="sm" value="user-sessions" className="text-md p-6 rounded-xl">
                        Get a Specific Session
                    </ToggleGroupItem>
                    <ToggleGroupItem size="sm" value="impersonation" className="text-md p-6 rounded-xl">
                        Impersonated User Sessions
                    </ToggleGroupItem>
                </ToggleGroup>
                {selectedAction === 'list-all-sessions' && <ListAllUserSessions />}
                {selectedAction === 'user-sessions' && <SearchUserSessions />}
                {selectedAction === 'impersonation' && <UserImpersonation />}
            </FieldGroup>
        </div>
    )
}