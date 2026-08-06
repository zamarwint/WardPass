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
import { useListUsers } from "@/lib/queries/SessionQueries";
import { Loader } from "lucide-react";
import { useState } from "react";
import { UserActionsDropdown } from "./UserActionsDropdown";

export default function HandleListUsers() {
    const [limit, setLimit] = useState<number>(100);
    const { data: users, isPending, error } = useListUsers({ limit });
    console.log(users);

    return (
        <div className="size-full">
            <FieldGroup className="border border-border rounded-xl p-10">
                <Field>
                    <FieldLegend>All Users</FieldLegend>
                    <FieldDescription>List of all users.</FieldDescription>
                </Field>
                <FieldSeparator />
                <Field>
                    <FieldTitle>Set Limit</FieldTitle>
                    <FieldDescription>Set the limit of users to display.</FieldDescription>
                    <FieldLabel>Limit</FieldLabel>
                    <Input type="number" onChange={(e) => setLimit(Number(e.target.value))} value={limit} placeholder="Set Limit" />
                </Field>
                {isPending ? (
                    <div className="flex items-center gap-2">
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
                                <UserActionsDropdown userId={user.id} />
                            </div>
                        ))}
                    </FieldGroup>
                )
                }
            </FieldGroup>
        </div>
    )
}