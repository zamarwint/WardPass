"use client";

import { Field, FieldContent, FieldDescription, FieldGroup, FieldTitle } from "@/components/ui/field";
import HandleUserSessions from "@/components/app/admin/users/UserSessions";
import HandleListUsers from "@/components/app/admin/users/Users";
import AdminCreateUser from "@/components/app/admin/users/CreateUser";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type ContentSection = "users" | "user-sessions" | "create-user";

const ContentSectionValues = ["users", "user-sessions", "create-user"];

const CONTENT_SECTIONS: { value: ContentSection; label: string }[] = [
    { value: "users", label: "All Users" },
    { value: "user-sessions", label: "All User Sessions" },
    { value: "create-user", label: "Create User" },
];

export default function UserManagementPage() {
    return (
        <Field className="flex flex-col gap-10 p-10">
            <FieldGroup>
                <Field>
                    <FieldTitle className="text-xl">Users</FieldTitle>
                    <FieldDescription>Manage your users.</FieldDescription>
                </Field>
                <Field>
                    <FieldContent className="space-y-5">
                        <Tabs>
                            <TabsList className="mb-2 py-5">
                                {CONTENT_SECTIONS.map((section) => (
                                    <TabsTrigger key={section.value} value={section.value} className="p-4">
                                        {section.label}
                                    </TabsTrigger>
                                ))}
                            </TabsList>

                            <TabsContent value={ContentSectionValues[0]}><HandleListUsers /></TabsContent>
                            <TabsContent value={ContentSectionValues[1]}><HandleUserSessions /></TabsContent>
                            <TabsContent value={ContentSectionValues[2]}><AdminCreateUser /></TabsContent>
                        </Tabs>
                    </FieldContent>
                </Field>
            </FieldGroup>
        </Field>
    )
}