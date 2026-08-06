"use client";

import { motion } from "motion/react"
import { Field, FieldContent, FieldDescription, FieldGroup, FieldLabel, FieldSeparator, FieldTitle } from "@/components/ui/field";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useState } from "react";
import HandleUserSessions from "../_components/users/HandleSessions";
import HandleListUsers from "../_components/users/HandleListUsers";

export default function UsersManagementPage() {
    const [selectedContent, setSelectedContent] = useState<string>("users");

    return (
        <>
            <motion.div className="flex flex-col gap-10 items-start justify-start pt-60 px-10 py-5">
                <Field className="flex flex-col gap-10">
                    <FieldGroup>
                        <Field>
                            <FieldLabel className="text-xl">Users</FieldLabel>
                            <FieldDescription>Manage your users.</FieldDescription>
                        </Field>
                        <Field>
                            <FieldContent className="space-y-5">
                                <ToggleGroup type="single" value={selectedContent} onValueChange={(value) => setSelectedContent(value)}>
                                    <ToggleGroupItem size="sm" value="users" className="text-md p-6 rounded-xl">
                                        All Users
                                    </ToggleGroupItem>
                                    <ToggleGroupItem size="sm" value="user-sessions" className="text-md p-6 rounded-xl">
                                        All User Sessions
                                    </ToggleGroupItem>
                                </ToggleGroup>
                                {selectedContent === 'users' && <HandleListUsers />}
                                {selectedContent === 'user-sessions' && <HandleUserSessions />}
                            </FieldContent>
                        </Field>
                    </FieldGroup>
                </Field>
            </motion.div>
        </>
    )
}