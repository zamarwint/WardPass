"use client";

import { PasswordInput } from "@/app/(main)/(auth)/_components/PasswordInput";
import createVaultItem from "@/app/actions/vault-item/createVaultItem";
import { encryptData } from "@/lib/crypto/aes";
import { useVaultStore } from "@/stores/vault";
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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2Icon, PlusIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { motion } from "motion/react"
import { VaultItemType } from "@/lib/types/VaultType";

export default function CreateLoginItem({ vaultId, cancel }: { vaultId: string, cancel: () => void }) {
    const queryClient = useQueryClient();

    const [name, setName] = useState<string>("")
    const [url, setUrl] = useState<string>("")
    const [username, setUsername] = useState<string>("")
    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [note, setNote] = useState<string>("")

    const { mutate, isPending } = useMutation({
        mutationFn: () => {
            const vaultKey = useVaultStore.getState().getVaultKey();
            const payload = JSON.stringify({ name, url, username, email, password, note });
            const { ciphertext, iv } = encryptData(payload, vaultKey);
            return createVaultItem({ vaultId, encryptedData: ciphertext, iv, itemType: VaultItemType.LOGIN });
        },
        onMutate: () => {
            toast.loading("Creating login item...")
        },
        onSuccess: () => {
            toast.dismiss();
            toast.success("Login item created successfully");
            queryClient.invalidateQueries({
                queryKey: ["vaultItems", vaultId],
                refetchType: 'active'
            });
            cancel();
        },
        onError: (err) => {
            toast.dismiss();
            toast.error("Failed to create login item." + err)
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
            <div className="flex w-full h-full bg-transparent backdrop-blur-sm opacity-100 cursor-pointer" onClick={cancel}></div>
            <Field className="size-full flex flex-col items-start justify-start border-r border-muted z-999 px-8 py-8 gap-8 bg-background overflow-y-scroll">
                <FieldSet>
                    <FieldLegend>Create Login Item</FieldLegend>
                    <FieldDescription>Create a new login item.</FieldDescription>
                </FieldSet>

                <FieldSeparator />
                <FieldGroup className="hidden lg:grid grid-cols-2 gap-4 w-full">
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
                </FieldGroup>

                <FieldSeparator />
                <Field orientation="horizontal">
                    <Button variant="outline" onClick={cancel}>Cancel</Button>
                    <Button onClick={handleSubmit} className="font-bold" disabled={isPending || !name || !email || !password}>
                        {isPending ? (
                            <>
                                <Loader2Icon className="size-4 animate-spin" />
                                <span>Creating...</span>
                            </>
                        ) : (
                            <>
                                <PlusIcon className="size-4" />
                                <span>Create Login</span>
                            </>
                        )}
                    </Button>
                </Field>
            </Field>
        </motion.div>
    )
}