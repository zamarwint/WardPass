"use client";

import { PasswordInput } from "@/app/(main)/(auth)/_components/PasswordInput";
import updateLogin from "@/app/actions/login/updateLogin";
import { Button } from "@/components/ui/button";
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
    FieldLegend,
    FieldSeparator,
    FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { LoginItem } from "@/lib/types/VaultItemType";
import { useMutation } from "@tanstack/react-query";
import { Loader2Icon, PenIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { motion } from "motion/react"
import { useRouter } from "next/navigation";

export default function UpdateLoginItem({ loginItem, cancel }: { loginItem: LoginItem, cancel: () => void }) {
    const router = useRouter();
    const [name, setName] = useState<string>(loginItem.name!)
    const [url, setUrl] = useState<string>(loginItem.url!)
    const [username, setUsername] = useState<string>(loginItem.username!)
    const [email, setEmail] = useState<string>(loginItem.email!)
    const [password, setPassword] = useState<string>(loginItem.password!)
    const [note, setNote] = useState<string>(loginItem.note!)

    const { mutate, error, isPending } = useMutation({
        mutationFn: () => updateLogin({ id: loginItem.id as string, vaultId: loginItem.vaultId as string, name, url, username, email, password, note }),
        onMutate: () => {
            toast.loading("Updating login item...")
        },
        onSuccess: () => {
            toast.dismiss();
            toast.success("Login item updated successfully");
            cancel();
            router.refresh();
        },
        onError: () => {
            toast.dismiss();
            toast.error("Failed to update login item." + error?.message)
        }
    })

    const handleSubmit = () => {
        mutate();
    }

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={{
                hidden: { opacity: 0, x: 1000 },
                visible: { opacity: 1, x: 0 },
            }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex w-screen h-screen items-center justify-center z-998 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        >
            <div className="flex w-full h-full bg-transparent backdrop-blur-sm opacity-100"></div>
            <Field className="size-full flex flex-col items-center justify-center border-r border-muted z-999 px-8 gap-8 bg-background overflow-y-scroll">
                <FieldSet>
                    <FieldLegend>Update Login</FieldLegend>
                    <FieldDescription>Update {loginItem.name}.</FieldDescription>
                </FieldSet>

                <FieldGroup>
                    <FieldSeparator />
                    <Field>
                        <FieldLabel>Name</FieldLabel>
                        <Input type="text" placeholder="Name of login item" id="name" value={name} onChange={(e) => { setName(e.target.value) }} className="h-12" />
                    </Field>
                    <Field>
                        <FieldLabel>URL</FieldLabel>
                        <Input type="text" placeholder="https://example.com" id="url" value={url} onChange={(e) => { setUrl(e.target.value) }} className="h-12" />
                    </Field>
                    <Field>
                        <FieldLabel>Username</FieldLabel>
                        <Input type="text" placeholder="Username" id="username" value={username} onChange={(e) => { setUsername(e.target.value) }} className="h-12" />
                    </Field>

                    <Field>
                        <FieldLabel>Email</FieldLabel>
                        <Input type="email" placeholder="Email" id="email" value={email} onChange={(e) => { setEmail(e.target.value) }} className="h-12" />
                    </Field>

                    <Field>
                        <FieldLabel>Password</FieldLabel>
                        <PasswordInput placeholder="Password" id="password" value={password} onChange={(e) => { setPassword(e.target.value) }} className="h-12" />
                    </Field>

                    <Field>
                        <FieldLabel>Note</FieldLabel>
                        <Input type="text" placeholder="Note" id="note" value={note} onChange={(e) => { setNote(e.target.value) }} className="h-12" />
                    </Field>
                    <FieldSeparator />
                </FieldGroup>

                <Field orientation="horizontal">
                    <Button variant="outline" onClick={cancel}>Cancel</Button>
                    <Button disabled={isPending || !name || !email || !password || (name == loginItem.name && url == loginItem.url && username == loginItem.username && email == loginItem.email && password == loginItem.password && note == loginItem.note)} onClick={handleSubmit} className="font-bold">
                        {isPending ? (
                            <>
                                <Loader2Icon className="size-4 animate-spin" />
                                <span>Updating...</span>
                            </>
                        ) : (
                            <>
                                <PenIcon className="size-4" />
                                <span>Update Login</span>
                            </>
                        )}
                    </Button>
                </Field>
            </Field>
        </motion.div>
    )
}