"use client";

import { motion } from "motion/react";
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldSeparator, FieldSet, FieldTitle } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { useState, useTransition } from "react";
import PasswordInput from "@/app/(auth)/_components/PasswordInput";
import { authClient } from "@/utils/auth-client";
import { toast } from "sonner";
import { Loader2Icon } from "lucide-react";
import { ModeToggleButton } from "@/app/_components/themeChange";

export default function SettingsPage() {
    const { data: session, error, isPending } = authClient.useSession.get();

    const [deleteConfirm, setDeleteConfirm] = useState("");
    const [password, setPassword] = useState("");
    const [changedEmail, setChangedEmail] = useState(session?.user?.email as string)
    const [changedPassword, setChangedPassword] = useState("")
    const [deletePending, startDeleteTransition] = useTransition();

    const deleteAccount = () => {
        startDeleteTransition(async () => {
            const { data, error } = await authClient.deleteUser({
                password,
                fetchOptions: {
                    onRequest: () => {
                        toast.loading("Deleting your account...");
                    },
                    onSuccess: () => {
                        toast.dismiss();
                        toast.success("Account deleted successfully. Redirecting...")
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
        <motion.div className="py-10 px-15 mx-auto flex flex-col gap-10 items-start justify-start h-screen w-full">
            <motion.div className="flex flex-col gap-6">
                <h1 className="text-2xl md:text-6xl font-bold font-geist text-primary">Settings</h1>
                <p className="text-xl text-muted-foreground">Manage your account settings.</p>
            </motion.div>
            <Field>
                <FieldLabel className="text-xl">Account Settings</FieldLabel>
                <FieldDescription>Update your account information and preferences.</FieldDescription>

                <FieldSeparator />

                <FieldGroup>
                    <Field className="w-xl">
                        <FieldLabel htmlFor="email" className="text-muted-foreground">Email</FieldLabel>
                        <Input type="email" id="email" autoComplete="off" placeholder="e.g. johndoe@matrix.com" className="h-12" onChange={(e) => setChangedEmail(e.target.value)} value={changedEmail} />
                    </Field>

                    <Field className="w-xl">
                        <FieldLabel htmlFor="password" className="text-muted-foreground">Password</FieldLabel>
                        <PasswordInput id="password" autoComplete="off" placeholder="************" className="h-12" onChange={(e) => setChangedPassword(e.target.value)} />
                    </Field>

                    <Field className="w-fit">
                        <Button className="h-12 w-fit px-10" size="lg" onClick={() => { }}>Update Settings</Button>
                    </Field>
                </FieldGroup>

                <FieldSeparator />

                <FieldGroup>
                    <Field>
                        <FieldLabel className="text-xl">Change Theme</FieldLabel>
                        <FieldDescription>Switch between light, dark, and system themes.</FieldDescription>
                    </Field>

                    <Field className="w-fit">
                        <ModeToggleButton />
                    </Field>
                </FieldGroup>

                <FieldSeparator />

                <FieldGroup>
                    <Field>
                        <FieldLabel className="text-xl text-destructive">Danger Zone</FieldLabel>
                        <FieldDescription>This section contains actions that are irreversible.</FieldDescription>
                    </Field>
                    <Field className="w-fit">
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="destructive" className="cursor-pointer h-12 w-fit px-10">Delete Account</Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Delete Account</DialogTitle>
                                    <DialogDescription>
                                        Are you sure you want to delete account? This action <span className="underline underline-offset-4 font-semibold text-destructive">cannot be undone</span>.
                                    </DialogDescription>
                                </DialogHeader>

                                <div className="flex flex-col gap-4">
                                    <h1 className="font-semibold">Type <span className="underline underline-offset-4">delete wardpass</span> to confirm.</h1>
                                    <Input type="text" className="h-12" placeholder="delete wardpass" onChange={(e) => setDeleteConfirm(e.target.value)} />

                                    <h1 className="font-semibold">Type in your master password.</h1>
                                    <PasswordInput className="h-12" placeholder="•••••••••••••" onChange={(e) => setPassword(e.target.value)} />
                                </div>

                                <Button disabled={deleteConfirm !== "delete wardpass" || password === "" || deletePending} className="h-12 w-fit px-10" size="lg" variant="destructive" onClick={deleteAccount}>
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

                                <DialogFooter className="flex flex-row justify-between">
                                    <DialogClose asChild>
                                        <Button className="h-12 w-fit px-10" size="lg" variant="secondary">Cancel</Button>
                                    </DialogClose>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </Field>
                </FieldGroup>
            </Field>
        </motion.div>
    )
}