"use client";

import { Field, FieldContent, FieldDescription, FieldGroup, FieldLabel, FieldLegend, FieldSeparator, FieldTitle } from "@/components/ui/field";
import { SwitchDualIconLabelDemo } from "@/components/ThemeChange";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button";

import { Loader2Icon, SquarePen } from "lucide-react";

import { authClient } from "@/utils/auth-client";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { useGetSession } from "@/lib/queries/SessionQueries";
import ProfileAvatar from "@/components/app/settings/ProfileAvatar";
import { useTheme } from "next-themes";

function ProfileName({ data }: { data: any }) {
    const [newName, setNewName] = useState<string>(data?.user?.name as string);
    const [nameChangePending, startNameChangeTransition] = useTransition();

    const updateUserName = async () => {
        startNameChangeTransition(async () => {
            await authClient.updateUser({
                name: newName,
                fetchOptions: {
                    onRequest: () => {
                        toast.loading("Updating...");
                    },
                    onSuccess: (ctx) => {
                        // Success message
                        toast.dismiss();
                        toast.success("Success!" + ctx.data);
                    },
                    onError: (ctx) => {
                        // display the error message
                        toast.dismiss();
                        toast.error(ctx.error.message);
                    },
                }
            });
        })
    }

    return (
        <div className="size-full flex flex-row items-center justify-between">
            <FieldLegend className="size-full">Change name</FieldLegend>
            <div className="size-full flex items-center justify-center gap-2">
                <Input type="text" className="size-sm" placeholder="e.g. John Doe" value={newName} onChange={(e) => setNewName(e.target.value)} />
                <Button disabled={!newName || nameChangePending || (newName === data?.user.name)}>
                    {nameChangePending ? (
                        <>
                            <Loader2Icon className="size-4 animate-spin" />
                            <span>Updating...</span>
                        </>
                    ) : (
                        <>
                            <SquarePen />
                            <span>Update</span>
                        </>
                    )}
                </Button>
            </div>
        </div>
    )
}

function ProfileImage({ data }: { data: any }) {
    const [newImage, setNewImage] = useState(data?.user.image);
    const [imageChangePending, startImageChangeTransition] = useTransition();

    const updateUserImage = async () => {
        startImageChangeTransition(async () => {
            await authClient.updateUser({
                image: newImage,
                fetchOptions: {
                    onRequest: () => {
                        toast.loading("Updating...");
                    },
                    onSuccess: (ctx) => {
                        // Success message
                        toast.dismiss();
                        toast.success("Success!" + ctx.data);
                    },
                    onError: (ctx) => {
                        // display the error message
                        toast.dismiss();
                        toast.error(ctx.error.message);
                    },
                }
            });
        })
    }

    return (
        <Field className="size-full flex flex-row items-center justify-between">
            <FieldLegend className="text-muted-foreground">Change profile picture (Coming soon)</FieldLegend>
            <FieldContent>
                <div className="size-full flex items-center justify-center gap-2">
                    <Button disabled>Add new profile picture</Button>
                    <Button variant="destructive" disabled>Remove profile picture</Button>
                    <ProfileAvatar size="size-12" image={data?.user.image as string} alt={data?.user.name || "Profile picture"} fallback={`${data?.user.name.split(" ")[0][0]}${data?.user.name.split(" ")[1][0]}`} />
                </div>
            </FieldContent>
        </Field>
    )
}

// GENERAL SETTINGS
export default function GeneralSettings() {
    const { data } = useGetSession();

    return (
        <div className="flex flex-col gap-10 items-start justify-start px-10 py-5">
            <Field className="flex flex-col gap-5">
                <Field>
                    <FieldTitle className='text-2xl'>General Settings</FieldTitle>
                    <FieldDescription>Update your general settings.</FieldDescription>
                </Field>
                <FieldSeparator />
                <FieldGroup className="flex flex-row items-center gap-2">
                    <Field>
                        <FieldLabel className="text-xl">Language</FieldLabel>
                        <FieldDescription>Choose your preferred language.</FieldDescription>
                    </Field>

                    <Field className="w-2xs text-left">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button disabled variant="outline" size="lg">
                                    English (Coming soon)
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                    English
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    Spanish
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    French
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    Dutch
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </Field>
                </FieldGroup>
                <FieldSeparator />
                <FieldGroup className="size-full flex flex-row gap-4 items-center justify-between">
                    <Field>
                        <FieldLabel className="text-xl">Theme</FieldLabel>
                        <FieldDescription>Switch between light, dark, and system themes.</FieldDescription>
                    </Field>
                    <FieldContent className="w-full">
                        <SwitchDualIconLabelDemo />
                    </FieldContent>
                </FieldGroup>
                <FieldSeparator />
                <FieldGroup>
                    <Field>
                        <FieldLabel className="text-xl">Profile</FieldLabel>
                        <FieldDescription>
                            Change profile picture and name.
                        </FieldDescription>
                    </Field>
                    <FieldSeparator />
                    <ProfileName data={data} />
                    <FieldSeparator />
                    <ProfileImage data={data} />
                </FieldGroup>
            </Field>
        </div>
    )
}