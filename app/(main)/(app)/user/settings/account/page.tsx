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
import SignOut from "../../_components/SignOut";
import ResetPasswordComponent from "@/app/(main)/(auth)/_components/ResetPassword";
import { useGetSession } from "@/lib/queries/SessionQueries";

export default function AccountPage() {
    const { isPending, data, error } = useGetSession();

    const [newEmail, setNewEmail] = useState(data?.user.email as string)
    const [emailPending, startEmailChangeTransition] = useTransition();

    const [passwordForDeletion, setPasswordForDeletion] = useState("");
    const [deleteConfirm, setDeleteConfirm] = useState("");
    const [deletePending, startDeleteTransition] = useTransition();

    const [editing, setEditing] = useState<boolean>(false);
    const [showEmailToReset, setShowEmailToReset] = useState<boolean>(false);

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

    console.log(data?.session.userAgent);

    return (
        <>
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

                                <Field>
                                    <FieldTitle className="text-md">Change Password</FieldTitle>
                                    <FieldDescription>
                                        To change your password, please go to the <span className="btn-link cursor-pointer font-bold" onClick={() => { setShowEmailToReset(!showEmailToReset); }}>Reset Password</span> page.
                                    </FieldDescription>
                                    <FieldDescription>
                                        NB: If you are signed in with Google, our OAuth provider, you do not have a <span className="font-bold">password</span>. If you wish to <span className="font-bold">create vaults</span> or <span className="font-bold">delete your account</span>, you first need to create a password.
                                    </FieldDescription>
                                </Field>
                            </FieldGroup>
                        )}

                        <FieldGroup className="flex flex-row">
                            <Button variant="secondary" className="h-12 w-fit px-10" size="lg" onClick={() => setEditing(!editing)}>{editing ? "Cancel" : "Edit"}</Button>
                            <Button disabled={!editing || (newEmail === data?.user.email)} className="h-12 w-fit px-10" size="lg" onClick={changeEmail}>
                                {emailPending ? (
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
                            <FieldLabel className="text-xl text-foreground">Sign out</FieldLabel>
                            <FieldDescription>Sign out of this session.</FieldDescription>
                        </Field>
                        <Field className="w-fit">
                            <SignOut />
                        </Field>
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
            {showEmailToReset && <ResetPasswordComponent cancel={() => setShowEmailToReset(!showEmailToReset)} />}
        </>
    )
}