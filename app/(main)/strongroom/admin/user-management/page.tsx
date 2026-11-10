"use client";

import { motion } from "motion/react"
import { Field, FieldContent, FieldDescription, FieldGroup, FieldTitle } from "@/components/ui/field";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useState } from "react";
import HandleUserSessions from "@/components/app/admin/users/UserSessions";
import HandleListUsers from "@/components/app/admin/users/Users";
import AdminCreateUser from "@/components/app/admin/users/CreateUser";

type ContentSection = "users" | "user-sessions" | "create-user";

const CONTENT_SECTIONS: { value: ContentSection; label: string }[] = [
    { value: "users", label: "All Users" },
    { value: "user-sessions", label: "All User Sessions" },
    { value: "create-user", label: "Create User" },
];

export default function UserManagementPage() {
    const [selectedContent, setSelectedContent] = useState<ContentSection>("users");

    return (
        <motion.div className="flex flex-col gap-10 items-start justify-start pt-5 px-10 py-5">
            <Field className="flex flex-col gap-10">
                <FieldGroup>
                    <Field>
                        <FieldTitle className="text-xl">Users</FieldTitle>
                        <FieldDescription>Manage your users.</FieldDescription>
                    </Field>
                    <Field>
                        <FieldContent className="space-y-5">
                            <ToggleGroup
                                value={[selectedContent]}
                                onValueChange={(value) => {
                                    // BASE UI ALWAYS PASSES AN ARRAY, AND IT IS EMPTY WHEN THE ACTIVE TOGGLE IS CLICKED AGAIN
                                    const next = value[0] as ContentSection | undefined;
                                    if (next) setSelectedContent(next);
                                }}
                            >
                                {CONTENT_SECTIONS.map((section) => (
                                    <ToggleGroupItem key={section.value} size="sm" value={section.value} className="text-md p-6 rounded-xl">
                                        {section.label}
                                    </ToggleGroupItem>
                                ))}
                            </ToggleGroup>

                            {selectedContent === "users" && <HandleListUsers />}
                            {selectedContent === "user-sessions" && <HandleUserSessions />}
                            {selectedContent === "create-user" && <AdminCreateUser />}
                        </FieldContent>
                    </Field>
                </FieldGroup>
            </Field>
        </motion.div>
    )
}