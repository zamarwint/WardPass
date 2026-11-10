"use client";

import { useEffect, useState, type ComponentProps } from "react";
import { Loader, Search } from "lucide-react";

import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
    FieldLegend,
    FieldSeparator,
    FieldTitle,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useGetUser, useListUsers } from "@/lib/queries/AdminQueries";
import { UserActionsDropdown } from "@/components/app/admin/user-actions/UserActionsDropdown";

type UserAction = "list-users" | "get-user";

const USER_ACTIONS: { value: UserAction; label: string }[] = [
    { value: "list-users", label: "List All Users" },
    { value: "get-user", label: "Get a Specific User" },
];

const DEFAULT_LIMIT = 10;

// THE FIELDS THE CARD DISPLAYS, COMBINED WITH WHATEVER THE ACTIONS DROPDOWN NEEDS
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

function UserCard({ user }: { user: UserCardData & UserActionsUser }) {
    return (
        <div className="w-full flex justify-between items-center gap-4 border border-border rounded-xl p-5">
            <Field className="min-w-0">
                <FieldTitle>{user.name}</FieldTitle>
                <FieldDescription>ID: {user.id}</FieldDescription>
                <FieldDescription>Email: {user.email}</FieldDescription>
                <FieldDescription>Role: {user.role ?? "—"}</FieldDescription>
                <FieldDescription>Created At: {formatDate(user.createdAt)}</FieldDescription>
                <FieldDescription>Updated At: {formatDate(user.updatedAt)}</FieldDescription>
                <FieldDescription>Email Verified: {user.emailVerified ? "Yes" : "No"}</FieldDescription>
                <FieldDescription>Banned: {user.banned ? "Yes" : "No"}</FieldDescription>
                {user.banned && (
                    <>
                        <FieldDescription>Ban Reason: {user.banReason || "No reason provided"}</FieldDescription>
                        <FieldDescription>Ban Expires: {user.banExpires ? formatDate(user.banExpires) : "Never"}</FieldDescription>
                    </>
                )}
            </Field>
            <UserActionsDropdown user={user} />
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
        <FieldGroup className="size-full">
            <Field>
                <FieldTitle>Search User</FieldTitle>
                <FieldDescription>Search for a user by entering their ID.</FieldDescription>
                <FieldLabel htmlFor="user-search">Search</FieldLabel>
                <InputGroup className="max-w-full h-8.5">
                    <InputGroupInput
                        id="user-search"
                        placeholder="Search user..."
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
            {/* CHECK FOR AN EMPTY QUERY FIRST: A DISABLED/IDLE QUERY STAYS "PENDING" FOREVER AND USED TO SHOW A PERMANENT SPINNER */}
            {!trimmedUserId ? (
                <FieldDescription>No user ID entered.</FieldDescription>
            ) : isDebouncing || isPending ? (
                <LoadingState label="Loading user..." />
            ) : error ? (
                <FieldDescription>Failed to load user. User not found or may not exist.</FieldDescription>
            ) : !user ? (
                <FieldDescription>User not found.</FieldDescription>
            ) : (
                <FieldGroup className="overflow-y-auto max-h-[40vh]">
                    <UserCard user={user} />
                </FieldGroup>
            )}
        </FieldGroup>
    );
}

function ListUsers() {
    // KEEP THE RAW INPUT AS A STRING SO THE FIELD CAN BE EMPTIED WHILE TYPING, AND DERIVE A SAFE NUMBER FROM IT
    const [limitInput, setLimitInput] = useState<string>(String(DEFAULT_LIMIT));
    const parsedLimit = Number.parseInt(limitInput, 10);
    const limit = Number.isFinite(parsedLimit) && parsedLimit >= 1 ? parsedLimit : DEFAULT_LIMIT;
    const debouncedLimit = useDebouncedValue(limit);

    const { data: users, isPending, error } = useListUsers({ limit: debouncedLimit });
    const userList = users?.users ?? [];

    return (
        <FieldGroup className="size-full">
            <Field>
                <FieldTitle>Set Limit</FieldTitle>
                <FieldDescription>Set the limit of users to display.</FieldDescription>
                <FieldLabel htmlFor="user-limit">Limit</FieldLabel>
                <Input
                    id="user-limit"
                    type="number"
                    min={1}
                    inputMode="numeric"
                    onChange={(e) => setLimitInput(e.target.value)}
                    value={limitInput}
                    placeholder="Set Limit"
                />
            </Field>
            {isPending ? (
                <LoadingState label="Loading users..." />
            ) : error ? (
                <FieldDescription>Failed to load users.</FieldDescription>
            ) : userList.length === 0 ? (
                <FieldDescription>No users found.</FieldDescription>
            ) : (
                <FieldGroup className="overflow-y-auto max-h-[40vh]">
                    {userList.map((user) => (
                        <UserCard key={user.id} user={user} />
                    ))}
                </FieldGroup>
            )}
        </FieldGroup>
    );
}

export default function HandleListUsers() {
    const [selectedAction, setSelectedAction] = useState<UserAction>("list-users");

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
                        const next = value[0] as UserAction | undefined;
                        if (next) setSelectedAction(next);
                    }}
                >
                    {USER_ACTIONS.map((action) => (
                        <ToggleGroupItem key={action.value} size="sm" value={action.value} className="text-md p-6 rounded-xl">
                            {action.label}
                        </ToggleGroupItem>
                    ))}
                </ToggleGroup>

                {selectedAction === "list-users" && <ListUsers />}
                {selectedAction === "get-user" && <GetUser />}
            </FieldGroup>
        </div>
    );
}