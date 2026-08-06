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
import { useListUserSessions } from "@/lib/queries/SessionQueries";
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
                <DropdownMenuItem className="cursor-pointer" onClick={() => setOpen(true)}>Revoke Session</DropdownMenuItem>
            </DropdownMenuContent>
            <SessionActionsDialog open={open} setOpen={setOpen} sessionToken={sessionToken} />
        </DropdownMenu>
    )
}

export default function HandleUserSessions() {
    const [userId, setUserId] = useState<string>('');
    const { data: userSessions, isPending, error } = useListUserSessions({ userId });
    console.log(userSessions);

    return (
        <div className="size-full">
            <FieldGroup className="border border-border rounded-xl p-10">
                <Field>
                    <FieldLegend>Sessions</FieldLegend>
                    <FieldDescription>Manage your active sessions.</FieldDescription>
                </Field>
                <FieldSeparator />
                <Field>
                    <FieldTitle>Search for a User</FieldTitle>
                    <FieldDescription>Enter the user ID to view their sessions.</FieldDescription>
                    <FieldLabel>User ID</FieldLabel>
                    <Input value={userId} onChange={(e) => setUserId(e.target.value)} placeholder="User ID" />
                </Field>
                <FieldSeparator />
                {isPending ? (
                    <div className="flex items-center gap-2">
                        <Loader className="size-4 animate-spin" />
                        <span className="text-sm">Loading sessions...</span>
                    </div>
                ) : error ? (
                    <div className="flex items-center gap-2">
                        <TriangleAlert className="size-4 text-red-500" />
                        <span>Failed to load sessions.</span>
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
        </div>
    )
}