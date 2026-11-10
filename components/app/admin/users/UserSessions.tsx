"use client";

import { useEffect, useState } from "react";
import { EllipsisVertical, Loader, Search, TriangleAlert } from "lucide-react";
import { toast } from "sonner";

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
} from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useRevokeUserSessionMutation } from "@/lib/mutations/AdminMutations";
import { useDBListUserSessions, useSearchUserSession } from "@/lib/queries/AdminQueries";
import { UserImpersonation } from "./UserImpersonation";

type SessionAction = "list-all-sessions" | "user-sessions" | "impersonation";

const SESSION_ACTIONS: { value: SessionAction; label: string }[] = [
    { value: "list-all-sessions", label: "List All Sessions" },
    { value: "user-sessions", label: "Get a Specific Session" },
    { value: "impersonation", label: "Impersonated User Sessions" },
];

// ONLY THE FIELDS THE CARD NEEDS, SO IT WORKS FOR BOTH THE "LIST ALL" AND THE "SEARCH" QUERY RESULTS
type SessionCardData = {
    id: string;
    userAgent?: string | null;
    ipAddress?: string | null;
    createdAt: Date | string;
    updatedAt: Date | string;
    expiresAt: Date | string;
    impersonatedBy?: string | null;
};

const formatDate = (date?: Date | string | null) => (date ? new Date(date).toDateString() : "—");

// DELAYS UPDATING A VALUE SO A QUERY ISN'T FIRED ON EVERY KEYSTROKE
function useDebouncedValue<T>(value: T, delay = 400) {
    const [debounced, setDebounced] = useState(value);

    useEffect(() => {
        const timeout = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(timeout);
    }, [value, delay]);

    return debounced;
}

function LoadingState({ label }: { label: string }) {
    return (
        <div className="flex items-center gap-2 text-muted-foreground">
            <Loader className="size-4 animate-spin" />
            <span className="text-sm">{label}</span>
        </div>
    );
}

function ErrorState({ message }: { message: string }) {
    return (
        <div className="flex items-center gap-2">
            <TriangleAlert className="size-4 text-red-500" />
            <span>{message}</span>
        </div>
    );
}

function SessionActionsDialog({ open, setOpen, sessionId }: { open: boolean; setOpen: (open: boolean) => void; sessionId: string }) {
    const { mutate, isPending } = useRevokeUserSessionMutation({ sessionId });

    // TOASTS BELONG IN THE MUTATION CALLBACKS, NOT IN THE RENDER BODY (THAT FIRED THEM ON EVERY RENDER).
    // THE DIALOG STAYS OPEN WHILE REVOKING SO THE PENDING STATE IS VISIBLE, AND CLOSES ONLY ON SUCCESS.
    const handleRevokeSession = () => {
        mutate(undefined, {
            onSuccess: () => {
                toast.success("Session revoked successfully");
                setOpen(false);
            },
            onError: () => {
                toast.error("Failed to revoke session");
            },
        });
    };

    return (
        <Dialog
            open={open}
            onOpenChange={(next) => {
                if (!isPending) setOpen(next);
            }}
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Revoke Session</DialogTitle>
                    <DialogDescription>
                        Revoke this session for the user. This will sign them out of this session.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <DialogClose render={<Button variant="outline" disabled={isPending}>Cancel</Button>} />
                    <Button variant="destructive" onClick={handleRevokeSession} disabled={isPending}>
                        {isPending ? (
                            <>
                                <Loader className="size-4 animate-spin" />
                                <span className="text-sm">Revoking...</span>
                            </>
                        ) : (
                            <span className="text-sm">Revoke</span>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

function SessionButtonDropdown({ sessionId }: { sessionId: string }) {
    const [open, setOpen] = useState(false);

    // THE DIALOG IS A SIBLING OF THE MENU (NOT NESTED INSIDE IT) SO IT KEEPS WORKING AFTER THE MENU CLOSES
    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger
                    render={
                        <Button variant="ghost" size="icon" aria-label="Session actions">
                            <EllipsisVertical className="size-4" />
                        </Button>
                    }
                />
                <DropdownMenuContent align="end">
                    <DropdownMenuItem className="cursor-pointer" onClick={() => setOpen(true)}>
                        Revoke Session
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <SessionActionsDialog open={open} setOpen={setOpen} sessionId={sessionId} />
        </>
    );
}

function SessionCard({ session }: { session: SessionCardData }) {
    return (
        <div className="w-full flex justify-between items-center gap-4 border border-border rounded-xl p-5">
            <Field className="min-w-0">
                <FieldTitle className="wrap-break-word">Agent: {session.userAgent ?? "Unknown"}</FieldTitle>
                <FieldDescription>IP Address: {session.ipAddress ?? "Unknown"}</FieldDescription>
                <FieldDescription>Created At: {formatDate(session.createdAt)}</FieldDescription>
                <FieldDescription>Updated At: {formatDate(session.updatedAt)}</FieldDescription>
                <FieldDescription>Expires At: {formatDate(session.expiresAt)}</FieldDescription>
                <FieldDescription>Impersonated By: {session.impersonatedBy || "Not impersonated"}</FieldDescription>
            </Field>
            <SessionButtonDropdown sessionId={session.id} />
        </div>
    );
}

function SessionList({ sessions }: { sessions: SessionCardData[] }) {
    return (
        <FieldGroup className="overflow-y-auto max-h-[40vh]">
            {sessions.map((session) => (
                <SessionCard key={session.id} session={session} />
            ))}
        </FieldGroup>
    );
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
                <LoadingState label="Loading sessions..." />
            ) : error ? (
                <ErrorState message="Failed to load sessions." />
            ) : !allSessions?.length ? (
                <FieldDescription>No sessions found.</FieldDescription>
            ) : (
                <SessionList sessions={allSessions} />
            )}
        </FieldGroup>
    );
}

function SearchUserSessions() {
    const [userId, setUserId] = useState<string>("");
    const trimmedUserId = userId.trim();
    const debouncedUserId = useDebouncedValue(trimmedUserId);
    const { data: userSessions, isPending, error } = useSearchUserSession({ userId: debouncedUserId });

    const sessions = userSessions?.sessions ?? [];
    const isDebouncing = trimmedUserId !== debouncedUserId;

    return (
        <FieldGroup>
            <Field>
                <FieldLegend>Sessions</FieldLegend>
                <FieldDescription>Manage a specific user&apos;s sessions.</FieldDescription>
            </Field>
            <FieldSeparator />
            <Field>
                <FieldTitle>Search for a User</FieldTitle>
                <FieldDescription>Enter the user ID to view their sessions.</FieldDescription>
                <FieldLabel htmlFor="user-session-search">User ID</FieldLabel>
                <InputGroup className="max-w-full h-8.5">
                    <InputGroupInput
                        id="user-session-search"
                        placeholder="Enter a user ID..."
                        autoComplete="off"
                        spellCheck={false}
                        onChange={(e) => setUserId(e.target.value)}
                        value={userId}
                    />
                    <InputGroupAddon>
                        <Search />
                    </InputGroupAddon>
                </InputGroup>
            </Field>
            <FieldSeparator />
            {/* CHECK FOR AN EMPTY QUERY FIRST: A DISABLED/IDLE QUERY STAYS "PENDING" FOREVER AND USED TO SHOW A PERMANENT SPINNER */}
            {!trimmedUserId ? (
                <FieldDescription>Enter a user ID to view their sessions.</FieldDescription>
            ) : isDebouncing || isPending ? (
                <LoadingState label="Loading sessions..." />
            ) : error ? (
                <ErrorState message="Failed to load sessions. Session(s) may not exist." />
            ) : sessions.length === 0 ? (
                <FieldDescription>No sessions found for this user.</FieldDescription>
            ) : (
                <SessionList sessions={sessions} />
            )}
        </FieldGroup>
    );
}

export default function UserSessions() {
    const [selectedAction, setSelectedAction] = useState<SessionAction>("list-all-sessions");

    return (
        <div className="size-full">
            <FieldGroup className="border border-border rounded-xl p-10">
                <Field>
                    <FieldLegend>Select an Action</FieldLegend>
                    <FieldDescription>Select an action to perform.</FieldDescription>
                </Field>
                <FieldSeparator />
                <ToggleGroup
                    value={[selectedAction]}
                    onValueChange={(value) => {
                        // BASE UI ALWAYS PASSES AN ARRAY, AND IT IS EMPTY WHEN THE ACTIVE TOGGLE IS CLICKED AGAIN
                        const next = value[0] as SessionAction | undefined;
                        if (next) setSelectedAction(next);
                    }}
                >
                    {SESSION_ACTIONS.map((action) => (
                        <ToggleGroupItem key={action.value} size="sm" value={action.value} className="text-md p-6 rounded-xl">
                            {action.label}
                        </ToggleGroupItem>
                    ))}
                </ToggleGroup>

                {selectedAction === "list-all-sessions" && <ListAllUserSessions />}
                {selectedAction === "user-sessions" && <SearchUserSessions />}
                {selectedAction === "impersonation" && <UserImpersonation />}
            </FieldGroup>
        </div>
    );
}