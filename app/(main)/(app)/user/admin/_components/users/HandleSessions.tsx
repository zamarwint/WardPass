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
import { Input } from "@/components/ui/input";
import { useRevokeUserSessionMutation } from "@/lib/mutations/AdminMutations";
import { useGetSession, useListUsers, useListUserSessions } from "@/lib/queries/SessionQueries";
import { EllipsisVertical, Loader, TriangleAlert } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

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
            <DropdownMenuContent>
                <DropdownMenuItem className="cursor-pointer" onClick={() => setOpen(true)}>Revoke</DropdownMenuItem>
            </DropdownMenuContent>
            <SessionActionsDialog open={open} setOpen={setOpen} sessionToken={sessionToken} />
        </DropdownMenu>
    )
}

export default function SessionsPage() {
    const { isPending: isUsersPending, data: users, error: usersError } = useListUsers({})
    // const { data: userSessions } = useListUserSessions({});

    return (
        <div className="pt-60 px-10 py-5">
            <FieldGroup className="border border-border rounded-xl p-10">
                <Field>
                    <FieldLegend>Sessions</FieldLegend>
                    <FieldDescription>Manage your active sessions.</FieldDescription>
                </Field>
                <FieldSeparator />
                <FieldGroup className="border border-border rounded-xl p-5">
                    {isUsersPending ? (
                        <div className="flex items-center gap-2">
                            <Loader className="size-4 animate-spin" />
                            <span className="text-sm">Loading users</span>
                        </div>
                    ) : usersError ? (
                        <div className="flex items-center gap-2">
                            <TriangleAlert className="size-4 text-red-500" />
                            <span className="text-sm text-red-500">Error loading users</span>
                        </div>
                    ) : (
                        users.users?.map((user) => (
                            <div key={user.id} className="flex justify-between items-center w-full">
                                {!user ? (
                                    <FieldDescription>User not found.</FieldDescription>
                                ) : (
                                    <Field>
                                        <FieldTitle>{user.id}</FieldTitle>
                                        <FieldDescription>{user.createdAt.toDateString()}</FieldDescription>
                                    </Field>
                                )}
                            </div>
                        )))}
                </FieldGroup>
            </FieldGroup>
        </div>
    )
}