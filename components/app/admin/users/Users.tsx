"use client";

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
import { useGetUser, useListUsers } from "@/lib/queries/AdminQueries";
import { Loader, Search } from "lucide-react";
import { useState } from "react";
import { UserActionsDropdown } from "./UserActionsDropdown";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";

function GetUser() {
    const [userId, setUserId] = useState<string>('');
    const { data: user, isPending, error } = useGetUser({ userId });

    return (
        <FieldGroup className="size-full">
            <Field>
                <FieldTitle>Search User</FieldTitle>
                <FieldDescription>Search for a user by entering their ID.</FieldDescription>
                <FieldLabel>Search</FieldLabel>
                <InputGroup className="max-w-full h-8.5">
                    <InputGroupInput placeholder="Search user..." onChange={(e) => setUserId(e.target.value)} value={userId} />
                    <InputGroupAddon>
                        <Search />
                    </InputGroupAddon>
                    <InputGroupAddon align="inline-end"></InputGroupAddon>
                </InputGroup>
            </Field>
            {isPending ? (
                <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader className="size-4 animate-spin" />
                    <span className="text-sm">Loading user...</span>
                </div>
            ) : error ? (
                <FieldDescription>Failed to load user. User not found or may not exist.</FieldDescription>
            ) : (!user) ? (
                <FieldDescription>No user ID entered.</FieldDescription>
            ) : (
                <FieldGroup className="overflow-y-scroll max-h-[40vh]">
                    <div key={user.id} className="w-full flex justify-between items-center border border-border rounded-xl p-5">
                        <Field>
                            <FieldTitle>{user.name}</FieldTitle>
                            <FieldDescription>ID: {user.id}</FieldDescription>
                            <FieldDescription>Email: {user.email}</FieldDescription>
                            <FieldDescription>Role: {user.role}</FieldDescription>
                            <FieldDescription>Created At: {user.createdAt.toDateString()}</FieldDescription>
                            <FieldDescription>Updated At: {user.updatedAt.toDateString()}</FieldDescription>
                            <FieldDescription>Email Verified: {user.emailVerified ? 'Yes' : 'No'}</FieldDescription>
                            <FieldDescription>Banned: {user.banned ? 'Yes' : 'No'}</FieldDescription>
                            {user.banned && <FieldDescription>Ban Reason: {user.banReason}</FieldDescription>}
                            {user.banned && <FieldDescription>Ban Expires: {user.banExpires?.toDateString()}</FieldDescription>}
                        </Field>
                        <UserActionsDropdown user={user} />
                    </div>
                </FieldGroup>
            )}
        </FieldGroup>
    )
}

function ListUsers() {
    const [limit, setLimit] = useState<number>(100);
    const { data: users, isPending, error } = useListUsers({ limit });

    return (
        <FieldGroup className="size-full">
            <Field>
                <FieldTitle>Set Limit</FieldTitle>
                <FieldDescription>Set the limit of users to display.</FieldDescription>
                <FieldLabel>Limit</FieldLabel>
                <Input type="number" onChange={(e) => setLimit(Number(e.target.value))} value={limit} placeholder="Set Limit" />
            </Field>
            {isPending ? (
                <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader className="size-4 animate-spin" />
                    <span className="text-sm">Loading users...</span>
                </div>
            ) : error ? (
                <FieldDescription>Failed to load users.</FieldDescription>
            ) : (!users || users.users?.length === 0) ? (
                <FieldDescription>No users found.</FieldDescription>
            ) : (
                <FieldGroup className="overflow-y-scroll max-h-[40vh]">
                    {users?.users?.map((user) => (
                        <div key={user.id} className="w-full flex justify-between items-center border border-border rounded-xl p-5">
                            <Field>
                                <FieldTitle>{user.name}</FieldTitle>
                                <FieldDescription>ID: {user.id}</FieldDescription>
                                <FieldDescription>Email: {user.email}</FieldDescription>
                                <FieldDescription>Role: {user.role}</FieldDescription>
                                <FieldDescription>Created At: {user.createdAt.toDateString()}</FieldDescription>
                                <FieldDescription>Updated At: {user.updatedAt.toDateString()}</FieldDescription>
                                <FieldDescription>Email Verified: {user.emailVerified ? 'Yes' : 'No'}</FieldDescription>
                                <FieldDescription>Banned: {user.banned ? 'Yes' : 'No'}</FieldDescription>
                                {user.banned && <FieldDescription>Ban Reason: {user.banReason}</FieldDescription>}
                                {user.banned && <FieldDescription>Ban Expires: {user.banExpires?.toDateString()}</FieldDescription>}
                            </Field>
                            <UserActionsDropdown user={user} />
                        </div>
                    ))}
                </FieldGroup>
            )}
        </FieldGroup>
    )
}

export default function HandleListUsers() {
    const [selectedAction, setSelectedAction] = useState<string>('list-users');

    return (
        <div className="size-full">
            <FieldGroup className="border border-border rounded-xl p-10">
                <Field>
                    <FieldLegend>Select an Action</FieldLegend>
                    <FieldDescription>Select an action to perform.</FieldDescription>
                </Field>
                <FieldSeparator />
                <ToggleGroup type="single" value={selectedAction} onValueChange={(value) => setSelectedAction(value)}>
                    <ToggleGroupItem size="sm" value="list-users" className="text-md p-6 rounded-xl">
                        List All Users
                    </ToggleGroupItem>
                    <ToggleGroupItem size="sm" value="get-user" className="text-md p-6 rounded-xl">
                        Get a Specific User
                    </ToggleGroupItem>
                </ToggleGroup>
                {selectedAction === 'list-users' && <ListUsers />}
                {selectedAction === 'get-user' && <GetUser />}
            </FieldGroup>
        </div>
    )
}