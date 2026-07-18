"use client";

import { motion } from "motion/react"
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldSeparator, FieldTitle } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/app/(main)/(auth)/_components/PasswordInput";
import { useState, useTransition } from "react";
import { authClient } from "@/utils/auth-client";
import { toast } from "sonner";
import { Loader2Icon } from "lucide-react";

import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogCancel
} from "@/components/ui/alert-dialog"
import { GetAuthSession } from "@/lib/queries/GetSessionQuery";

export default function AccountPage() {
    const { isPending, data, error } = GetAuthSession();

    const [newEmail, setNewEmail] = useState(data?.user.email as string)
    const [emailPending, startEmailChangeTransition] = useTransition();
    const [currentPassword, setCurrentPassword] = useState("")
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("")
    const [passwordPending, startPasswordChangeTransition] = useTransition();

    const [passwordForDeletion, setPasswordForDeletion] = useState("");
    const [deleteConfirm, setDeleteConfirm] = useState("");
    const [deletePending, startDeleteTransition] = useTransition();

    const [editing, setEditing] = useState<boolean>(false);

    const changeEmail = () => {
        startEmailChangeTransition(async () => {
            await authClient.changeEmail({
                newEmail: newEmail,
                callbackURL: "/user/vault", // to redirect after verification
                fetchOptions: {
                    onRequest: () => {
                        toast.loading("Changing your email...");
                    },
                    onSuccess: () => {
                        toast.dismiss();
                        toast.success("Check your email to confirm your change.")
                    },
                    onError: (error) => {
                        toast.dismiss();
                        toast.error("Internal server error. Please try again.")
                        console.log(error);
                    }
                }
            });
        })
    }

    const changePassword = () => {
        startPasswordChangeTransition(async () => {
            await authClient.changePassword({
                newPassword, // required
                currentPassword, // required
                revokeOtherSessions: true,
                fetchOptions: {
                    onRequest: () => {
                        toast.loading("Changing your password...");
                    },
                    onSuccess: () => {
                        toast.dismiss();
                        toast.success("Password changed successfully...")
                    },
                    onError: (error) => {
                        toast.dismiss();
                        toast.error("Internal server error. Please try again.")
                        console.log(error);
                    }
                }
            });
        })
    }

    const deleteAccount = () => {
        startDeleteTransition(async () => {
            await authClient.deleteUser({
                password: passwordForDeletion,
                fetchOptions: {
                    onRequest: () => {
                        toast.loading("Deleting your account...");
                    },
                    onSuccess: () => {
                        toast.dismiss();
                        toast.success("Check your email to confirm your deletion request.")
                    },
                    onError: (error) => {
                        toast.dismiss();
                        toast.error("Internal server error. Please try again.")
                        console.log(error);
                    }
                }
            })
        })
    }

    return (
        <motion.div className="flex flex-col gap-10 items-start justify-start pt-60 px-10 py-5">
            <Field className="flex flex-col gap-10">
                <FieldGroup>
                    <Field>
                        <FieldLabel className="text-xl">Account Settings</FieldLabel>
                        <FieldDescription>Update your account information and preferences.</FieldDescription>
                    </Field>

                    {error && toast.error("Internal Server Error. Please try again." + error.message)}

                    {isPending ? (
                        <Field>
                            <FieldTitle>Loading...</FieldTitle>
                        </Field>
                    ) : (
                        <FieldGroup>
                            <Field className="w-xl">
                                <FieldLabel htmlFor="email" className="text-muted-foreground">Email</FieldLabel>
                                <Input disabled={!editing} type="email" id="email" autoComplete="off" placeholder="e.g. johndoe@gmail.com" className="h-12" onChange={(e) => setNewEmail(e.target.value)} value={newEmail} />
                            </Field>

                            <Field className="w-xl">
                                <FieldLabel htmlFor="password" className="text-muted-foreground">Current Password</FieldLabel>
                                <PasswordInput disabled={!editing} id="password" autoComplete="off" placeholder="************" className="h-12" onChange={(e) => setCurrentPassword(e.target.value)} value={currentPassword} />
                            </Field>

                            <Field className="w-xl">
                                <FieldLabel htmlFor="password" className="text-muted-foreground">Set New Password</FieldLabel>
                                <PasswordInput disabled={!editing} id="password" autoComplete="off" placeholder="************" className="h-12" onChange={(e) => setNewPassword(e.target.value)} value={newPassword} />
                            </Field>

                            <Field className="w-xl">
                                <FieldLabel htmlFor="password" className="text-muted-foreground">Confirm New Password</FieldLabel>
                                <PasswordInput disabled={!editing} id="password" autoComplete="off" placeholder="************" className="h-12" onChange={(e) => setConfirmNewPassword(e.target.value)} value={confirmNewPassword} />
                            </Field>
                        </FieldGroup>
                    )}

                    <FieldGroup className="flex flex-row">
                        <Button variant="secondary" className="h-12 w-fit px-10" size="lg" onClick={() => setEditing(!editing)}>{editing ? "Cancel" : "Edit"}</Button>
                        <Button disabled={!editing || !newEmail || !currentPassword || !newPassword || !confirmNewPassword} className="h-12 w-fit px-10" size="lg" onClick={() => {
                            // CHECKS
                            if (newEmail === data?.user.email) {
                                toast.error("Error: New email is same as current email.");
                                return;
                            }

                            if (newPassword === currentPassword) {
                                toast.error("Error: New password is same as current password.");
                                return;
                            }

                            if (confirmNewPassword !== newPassword) {
                                toast.error("Error: Confirm Password field must be the same as the password field.");
                                return;
                            }

                            if (newEmail && newPassword) {
                                changeEmail();
                                changePassword();
                                return;
                            }

                            if (newEmail) changeEmail();
                            if (newPassword) changePassword();
                        }}>{emailPending || passwordPending ? (
                            <>
                                <Loader2Icon className="size-4 animate-spin" />
                                <span>Updating...</span>
                            </>
                        ) : (
                            <>
                                <span>Update</span>
                            </>
                        )}</Button>
                    </FieldGroup>
                </FieldGroup>

                <FieldGroup>
                    <FieldSeparator />
                    <Field>
                        <FieldLabel className="text-xl text-destructive">Danger Zone</FieldLabel>
                        <FieldDescription>This section contains actions that are irreversible.</FieldDescription>
                    </Field>
                    <Field className="w-fit">
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive" className="cursor-pointer h-12 w-fit px-10">Delete Account</Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Account</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Are you sure you want to delete account? This action <span className="underline underline-offset-4 font-semibold text-destructive">cannot be undone</span>.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>

                                <div className="flex flex-col gap-4">
                                    <h1 className="font-semibold">Type <span className="underline underline-offset-4">delete wardpass</span> to confirm.</h1>
                                    <Input type="text" className="h-12" placeholder="delete wardpass" onChange={(e) => setDeleteConfirm(e.target.value)} />

                                    <h1 className="font-semibold">Type in your master password.</h1>
                                    <PasswordInput className="h-12" placeholder="•••••••••••••" onChange={(e) => setPasswordForDeletion(e.target.value)} />
                                </div>

                                <AlertDialogFooter>
                                    <AlertDialogCancel asChild>
                                        <Button className="w-fit px-8" size="lg" variant="secondary">Cancel</Button>
                                    </AlertDialogCancel>
                                    <Button disabled={deleteConfirm !== "delete wardpass" || passwordForDeletion === "" || deletePending} className="w-fit px-8" size='lg' variant="destructive" onClick={deleteAccount}>
                                        {deletePending ? (
                                            <>
                                                <Loader2Icon className="size-4 animate-spin" />
                                                <span>Loading...</span>
                                            </>
                                        ) : (
                                            <>
                                                <span>Delete Account</span>
                                            </>
                                        )}
                                    </Button>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </Field>
                </FieldGroup>
            </Field>
        </motion.div>
    )
}