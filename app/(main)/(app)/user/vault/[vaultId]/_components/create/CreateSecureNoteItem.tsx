"use client";

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
import createSecureNote from "@/app/actions/secure-note/createSecureNote";
import { Textarea } from "@/components/ui/textarea";

export default function CreateSecureNoteItem({ vaultId, cancel }: { vaultId: string, cancel: () => void }) {
    const queryClient = useQueryClient();

    const [title, setTitle] = useState<string>("")
    const [content, setContent] = useState<string>("")
    const [characterLength, setCharacterLength] = useState<number>(content.length)

    const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const target = e.target;
        const value = target.value;

        if (value.length <= 2000) {
            setContent(value);
            setCharacterLength(value.length);
        }
    };

    const { mutate, error, isPending } = useMutation({
        mutationFn: () => createSecureNote({ vaultId, title, content }),
        onMutate: () => {
            toast.loading("Creating secure note item...")
        },
        onSuccess: () => {
            toast.dismiss();
            toast.success("Secure note item created successfully");
            cancel();
            queryClient.invalidateQueries({
                queryKey: ["vaultItems", vaultId],
                refetchType: 'active'
            });
        },
        onError: () => {
            toast.dismiss();
            toast.error("Failed to create secure note item." + error?.message)
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
                    <FieldLegend>Create Secure Note Item</FieldLegend>
                    <FieldDescription>Create a new secure note item.</FieldDescription>
                </FieldSet>

                <FieldGroup>
                    <FieldSeparator />
                    <Field>
                        <FieldLabel>Title</FieldLabel>
                        <Input type="text" placeholder="Title of secure note item" id="title" value={title} onChange={(e) => { setTitle(e.target.value) }} className="h-12" />
                    </Field>
                    <Field>
                        <FieldLabel>Content</FieldLabel>
                        <Textarea placeholder="Write your notes here..." id="content" value={content} onChange={handleContentChange} className="min-h-75" />
                        <FieldDescription>{characterLength}/2000 characters</FieldDescription>
                    </Field>
                    <FieldSeparator />
                </FieldGroup>

                <Field orientation="horizontal">
                    <Button variant="outline" onClick={cancel}>Cancel</Button>
                    <Button onClick={handleSubmit} className="font-bold" disabled={isPending || !title || !content}>
                        {isPending ? (
                            <>
                                <Loader2Icon className="size-4 animate-spin" />
                                <span>Creating...</span>
                            </>
                        ) : (
                            <>
                                <PlusIcon className="size-4" />
                                <span>Create Secure Note</span>
                            </>
                        )}
                    </Button>
                </Field>
            </Field>
        </motion.div>
    )
}