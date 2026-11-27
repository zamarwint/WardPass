"use client";

import { useEffect, useState, type ComponentProps } from "react";
import { Calendar, CheckCircle2, Loader, Mail, Search, ShieldAlert, Users, XCircle } from "lucide-react";

import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
    FieldTitle,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Badge } from "@/components/ui/badge";
import { useGetUser, useListUsers } from "@/lib/queries/AdminQueries";
import { UserActionsDropdown } from "@/components/app/admin/user-actions/UserActionsDropdown";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type UserAction = "list-users" | "get-user";

const USER_ACTIONS: { value: UserAction; label: string }[] = [
    { value: "list-users", label: "List All Users" },
    { value: "get-user", label: "Find Specific User" },
];

const DEFAULT_LIMIT = 10;

type UserCardData = {
    id: string;
    name: string;
    email: string;
    role?: string | null;
    createdAt: Date | string;
    updatedAt: Date | string;
    emailVerified: boolean;
    banned?: boolean | null;
    banReason?: string | null;
    banExpires?: Date | string | null;
};
type UserActionsUser = ComponentProps<typeof UserActionsDropdown>["user"];

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

function UserCard({ user }: { user: UserCardData & UserActionsUser }) {
    const initials = user.name
        ? user.name
              .trim()
              .split(/\s+/)
              .slice(0, 2)
              .map((p: string) => p[0])
              .join("")
              .toUpperCase()
        : "U";

    return (
        <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-border/50 rounded-2xl p-4 sm:p-5 bg-background/60 hover:bg-card hover:border-border/80 transition-all shadow-2xs">
            <div className="flex items-start gap-3.5 min-w-0">
                <div className="size-10 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center font-bold text-sm shrink-0">
                    {initials}
                </div>
                <div className="flex flex-col gap-1.5 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-base text-foreground truncate">{user.name}</span>
                        <Badge variant="outline" className="rounded-full text-[11px] font-mono capitalize">
                            {user.role ?? "user"}
                        </Badge>
                        {user.emailVerified ? (
                            <Badge variant="secondary" className="rounded-full text-[11px] gap-1 text-emerald-600 dark:text-emerald-400">
                                <CheckCircle2 className="size-3" />
                                Verified
                            </Badge>
                        ) : (
                            <Badge variant="secondary" className="rounded-full text-[11px] gap-1 text-amber-600 dark:text-amber-400">
                                <XCircle className="size-3" />
                                Unverified
                            </Badge>
                        )}
                        {user.banned && (
                            <Badge variant="destructive" className="rounded-full text-[11px] gap-1">
                                <ShieldAlert className="size-3" />
                                Banned
                            </Badge>
                        )}
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1.5">
                            <Mail className="size-3.5" />
                            {user.email}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                            <Calendar className="size-3.5" />
                            Joined {formatDate(user.createdAt)}
                        </span>
                    </div>

                    <span className="text-[11px] font-mono text-muted-foreground/80 truncate">
                        ID: {user.id}
                    </span>

                    {user.banned && (
                        <div className="mt-1 rounded-xl border border-destructive/25 bg-destructive/5 px-3 py-2 text-xs text-destructive flex flex-wrap gap-x-4 gap-y-1">
                            <span>
                                <strong>Reason:</strong> {user.banReason || "No reason provided"}
                            </span>
                            <span>
                                <strong>Expires:</strong> {user.banExpires ? formatDate(user.banExpires) : "Never"}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            <div className="self-end sm:self-center shrink-0">
                <UserActionsDropdown user={user} />
            </div>
        </div>
    );
}

function GetUser() {
    const [userId, setUserId] = useState<string>("");
    const trimmedUserId = userId.trim();
    const debouncedUserId = useDebouncedValue(trimmedUserId);
    const { data: user, isPending, error } = useGetUser({ userId: debouncedUserId });

    const isDebouncing = trimmedUserId !== debouncedUserId;

    return (
        <FieldGroup className="size-full gap-5">
            <Field>
                <FieldTitle className="text-base font-semibold">Search User by ID</FieldTitle>
                <FieldDescription>Enter a user&apos;s unique ID to inspect and manage their account.</FieldDescription>
                <FieldLabel htmlFor="user-search" className="mt-1">User ID</FieldLabel>
                <InputGroup className="max-w-full h-11 rounded-xl">
                    <InputGroupInput
                        id="user-search"
                        placeholder="Paste user ID..."
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
                    Enter a user ID above to look up an account.
                </div>
            ) : isDebouncing || isPending ? (
                <LoadingState label="Loading user..." />
            ) : error ? (
                <div className="rounded-xl border border-destructive/30 bg-destructive/5 py-6 text-center text-sm text-destructive">
                    Failed to load user. User not found or may not exist.
                </div>
            ) : !user ? (
                <div className="rounded-xl border border-dashed border-border/60 py-10 text-center text-sm text-muted-foreground">
                    User not found.
                </div>
            ) : (
                <UserCard user={user} />
            )}
        </FieldGroup>
    );
}

function ListUsers() {
    const [limitInput, setLimitInput] = useState<string>(String(DEFAULT_LIMIT));
    const parsedLimit = Number.parseInt(limitInput, 10);
    const limit = Number.isFinite(parsedLimit) && parsedLimit >= 1 ? parsedLimit : DEFAULT_LIMIT;
    const debouncedLimit = useDebouncedValue(limit);

    const { data: users, isPending, error } = useListUsers({ limit: debouncedLimit });
    const userList = users?.users ?? [];

    return (
        <FieldGroup className="size-full gap-5">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div className="flex flex-col gap-0.5">
                    <span className="text-base font-semibold text-foreground">Directory</span>
                    <span className="text-xs text-muted-foreground">
                        Showing up to {limit} registered users.
                    </span>
                </div>
                <div className="flex items-center gap-2.5">
                    <FieldLabel htmlFor="user-limit" className="text-xs text-muted-foreground whitespace-nowrap">
                        Max results
                    </FieldLabel>
                    <Input
                        id="user-limit"
                        type="number"
                        min={1}
                        inputMode="numeric"
                        onChange={(e) => setLimitInput(e.target.value)}
                        value={limitInput}
                        placeholder="10"
                        className="h-9 w-24 rounded-xl text-center font-mono"
                    />
                </div>
            </div>

            {isPending ? (
                <LoadingState label="Loading users..." />
            ) : error ? (
                <div className="rounded-xl border border-destructive/30 bg-destructive/5 py-6 text-center text-sm text-destructive">
                    Failed to load users.
                </div>
            ) : userList.length === 0 ? (
                <div className="rounded-xl border border-dashed border-border/60 py-10 text-center text-sm text-muted-foreground">
                    No users found.
                </div>
            ) : (
                <div className="flex flex-col gap-3 max-h-[55vh] overflow-y-auto pr-1">
                    {userList.map((user) => (
                        <UserCard key={user.id} user={user} />
                    ))}
                </div>
            )}
        </FieldGroup>
    );
}

export default function HandleListUsers() {
    return (
        <div className="rounded-2xl border border-border/50 bg-card/50 p-5 sm:p-6 shadow-2xs flex flex-col gap-5">
            <div className="flex items-center gap-3">
                <div className="size-9 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center shrink-0">
                    <Users className="size-4" />
                </div>
                <div className="flex flex-col">
                    <h2 className="text-base font-bold text-foreground">User Directory</h2>
                    <p className="text-xs text-muted-foreground">
                        Browse all accounts or look up a specific user by ID.
                    </p>
                </div>
            </div>

            <Tabs defaultValue="list-users" className="flex flex-col gap-5">
                <TabsList className="h-auto w-fit p-1 rounded-xl bg-muted/50 border border-border/40">
                    {USER_ACTIONS.map((action) => (
                        <TabsTrigger
                            key={action.value}
                            value={action.value}
                            className="rounded-lg px-3.5 py-1.5 text-xs sm:text-sm font-medium cursor-pointer"
                        >
                            {action.label}
                        </TabsTrigger>
                    ))}
                </TabsList>

                <TabsContent value="list-users" className="mt-0">
                    <ListUsers />
                </TabsContent>
                <TabsContent value="get-user" className="mt-0">
                    <GetUser />
                </TabsContent>
            </Tabs>
        </div>
    );
}
