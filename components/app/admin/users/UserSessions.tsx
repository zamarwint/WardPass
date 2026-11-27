"use client";

import { useEffect, useState } from "react";
import { Calendar, Clock, EllipsisVertical, Globe, KeyRound, Loader, Monitor, Search, ShieldAlert, TriangleAlert } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldTitle } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { useRevokeUserSessionMutation } from "@/lib/mutations/AdminMutations";
import { useDBListUserSessions, useSearchUserSession } from "@/lib/queries/AdminQueries";
import { UserImpersonation } from "./UserImpersonation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type SessionAction = "list-all-sessions" | "user-sessions" | "impersonation";

const SESSION_ACTIONS: { value: SessionAction; label: string }[] = [
    { value: "list-all-sessions", label: "All Sessions" },
    { value: "user-sessions", label: "Find by User ID" },
    { value: "impersonation", label: "Impersonated Sessions" },
];

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
        <div className="flex items-center justify-center gap-2 py-8 text-muted-foreground">
            <Loader className="size-4 animate-spin" />
            <span className="text-sm">{label}</span>
        </div>
    );
}

function ErrorState({ message }: { message: string }) {
    return (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 flex items-center gap-2.5 text-destructive text-sm">
            <TriangleAlert className="size-4 shrink-0" />
            <span>{message}</span>
        </div>
    );
}

function SessionActionsDialog({ open, setOpen, sessionId }: { open: boolean; setOpen: (open: boolean) => void; sessionId: string }) {
    const { mutate, isPending } = useRevokeUserSessionMutation({ sessionId });

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
            <DialogContent className="rounded-2xl">
                <DialogHeader>
                    <DialogTitle>Revoke Session</DialogTitle>
                    <DialogDescription>
                        Revoke this session for the user. This will immediately sign them out of this device.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <DialogClose render={<Button variant="outline" className="rounded-xl" disabled={isPending}>Cancel</Button>} />
                    <Button variant="destructive" className="rounded-xl" onClick={handleRevokeSession} disabled={isPending}>
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

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger
                    render={
                        <Button variant="ghost" size="icon" aria-label="Session actions" className="rounded-xl cursor-pointer">
                            <EllipsisVertical className="size-4" />
                        </Button>
                    }
                />
                <DropdownMenuContent align="end" className="rounded-xl">
                    <DropdownMenuItem
                        className="cursor-pointer rounded-lg text-destructive focus:text-destructive"
                        onClick={() => setOpen(true)}
                    >
                        Revoke Session
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <SessionActionsDialog open={open} setOpen={setOpen} sessionId={sessionId} />
        </>
    );
}

function SessionCard({ session }: { session: SessionCardData }) {
    const isExpired = new Date(session.expiresAt) <= new Date();

    return (
        <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-border/50 rounded-2xl p-4 sm:p-5 bg-background/60 hover:bg-card hover:border-border/80 transition-all shadow-2xs">
            <div className="flex items-start gap-3.5 min-w-0">
                <div className="size-10 rounded-xl bg-blue-500/10 text-blue-500 border border-blue-500/20 flex items-center justify-center shrink-0">
                    <Monitor className="size-5" />
                </div>
                <div className="flex flex-col gap-1.5 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-sm text-foreground break-all">
                            {session.userAgent ?? "Unknown User Agent"}
                        </span>
                        <Badge variant={isExpired ? "secondary" : "outline"} className="rounded-full text-[11px]">
                            {isExpired ? "Expired" : "Active"}
                        </Badge>
                        {session.impersonatedBy && (
                            <Badge variant="secondary" className="rounded-full text-[11px] gap-1 text-amber-600 dark:text-amber-400">
                                <ShieldAlert className="size-3" />
                                Impersonated by {session.impersonatedBy}
                            </Badge>
                        )}
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1.5 font-mono">
                            <Globe className="size-3.5" />
                            {session.ipAddress ?? "Unknown IP"}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                            <Calendar className="size-3.5" />
                            Created {formatDate(session.createdAt)}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                            <Clock className="size-3.5" />
                            Expires {formatDate(session.expiresAt)}
                        </span>
                    </div>
                </div>
            </div>

            <div className="self-end sm:self-center shrink-0">
                <SessionButtonDropdown sessionId={session.id} />
            </div>
        </div>
    );
}

function SessionList({ sessions }: { sessions: SessionCardData[] }) {
    return (
        <div className="flex flex-col gap-3 max-h-[55vh] overflow-y-auto pr-1">
            {sessions.map((session) => (
                <SessionCard key={session.id} session={session} />
            ))}
        </div>
    );
}

function ListAllUserSessions() {
    const { data: allSessions, isPending, error } = useDBListUserSessions();

    return (
        <FieldGroup className="gap-4">
            <div className="flex flex-col gap-0.5">
                <span className="text-base font-semibold text-foreground">All Sessions</span>
                <span className="text-xs text-muted-foreground">Inspect and revoke sessions across all users.</span>
            </div>

            {isPending ? (
                <LoadingState label="Loading sessions..." />
            ) : error ? (
                <ErrorState message="Failed to load sessions." />
            ) : !allSessions?.length ? (
                <div className="rounded-xl border border-dashed border-border/60 py-10 text-center text-sm text-muted-foreground">
                    No sessions found.
                </div>
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
        <FieldGroup className="gap-5">
            <Field>
                <FieldTitle className="text-base font-semibold">Search User Sessions</FieldTitle>
                <FieldDescription>Enter a user ID to view and revoke their active sessions.</FieldDescription>
                <FieldLabel htmlFor="user-session-search" className="mt-1">User ID</FieldLabel>
                <InputGroup className="max-w-full h-11 rounded-xl">
                    <InputGroupInput
                        id="user-session-search"
                        placeholder="Enter a user ID..."
                        autoComplete="off"
                        spellCheck={false}
                        onChange={(e) => setUserId(e.target.value)}
                        value={userId}
                    />
                    <InputGroupAddon>
                        <Search className="size-4" />
                    </InputGroupAddon>
                </InputGroup>
            </Field>

            {!trimmedUserId ? (
                <div className="rounded-xl border border-dashed border-border/60 py-10 text-center text-sm text-muted-foreground">
                    Enter a user ID above to view their sessions.
                </div>
            ) : isDebouncing || isPending ? (
                <LoadingState label="Loading sessions..." />
            ) : error ? (
                <ErrorState message="Failed to load sessions. Session(s) may not exist." />
            ) : sessions.length === 0 ? (
                <div className="rounded-xl border border-dashed border-border/60 py-10 text-center text-sm text-muted-foreground">
                    No sessions found for this user.
                </div>
            ) : (
                <SessionList sessions={sessions} />
            )}
        </FieldGroup>
    );
}

export default function UserSessions() {
    return (
        <div className="rounded-2xl border border-border/50 bg-card/50 p-5 sm:p-6 shadow-2xs flex flex-col gap-5">
            <div className="flex items-center gap-3">
                <div className="size-9 rounded-xl bg-blue-500/10 text-blue-500 border border-blue-500/20 flex items-center justify-center shrink-0">
                    <KeyRound className="size-4" />
                </div>
                <div className="flex flex-col">
                    <h2 className="text-base font-bold text-foreground">Session Control</h2>
                    <p className="text-xs text-muted-foreground">
                        Monitor active sessions, inspect user logins, and track impersonation history.
                    </p>
                </div>
            </div>

            <Tabs defaultValue="list-all-sessions" className="flex flex-col gap-5">
                <TabsList className="h-auto w-fit p-1 rounded-xl bg-muted/50 border border-border/40 flex-wrap">
                    {SESSION_ACTIONS.map((action) => (
                        <TabsTrigger
                            key={action.value}
                            value={action.value}
                            className="rounded-lg px-3.5 py-1.5 text-xs sm:text-sm font-medium cursor-pointer"
                        >
                            {action.label}
                        </TabsTrigger>
                    ))}
                </TabsList>

                <TabsContent value="list-all-sessions" className="mt-0">
                    <ListAllUserSessions />
                </TabsContent>
                <TabsContent value="user-sessions" className="mt-0">
                    <SearchUserSessions />
                </TabsContent>
                <TabsContent value="impersonation" className="mt-0">
                    <UserImpersonation />
                </TabsContent>
            </Tabs>
        </div>
    );
}
