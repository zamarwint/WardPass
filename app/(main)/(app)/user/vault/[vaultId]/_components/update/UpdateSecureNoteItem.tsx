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
import { useMutation } from "@tanstack/react-query";
import { Loader2Icon, PenIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { motion } from "motion/react"
import { useRouter } from "next/navigation";
import updateSecureNote from "@/app/actions/secure-note/updateSecureNote";
import { SecureNoteItem } from "@/lib/types/VaultItemType";
import { Textarea } from "@/components/ui/textarea";

export default function UpdateSecureNoteItem({ secureNoteItem, cancel }: { secureNoteItem: SecureNoteItem, cancel: () => void }) {
    const router = useRouter();
    const [title, setTitle] = useState<string>(secureNoteItem.title as string)
    const [content, setContent] = useState<string>(secureNoteItem.content as string)

    const { mutate, error, isPending } = useMutation({
        mutationFn: () => updateSecureNote({ id: secureNoteItem.id as string, vaultId: secureNoteItem.vaultId as string, title, content }),
        onMutate: () => {
            toast.loading("Updating secure note item...")
        },
        onSuccess: () => {
            toast.dismiss();
            toast.success("Secure note item updated successfully");
            cancel();
            router.refresh();
        },
        onError: () => {
            toast.dismiss();
            toast.error("Failed to update secure note item." + error?.message)
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
                    <FieldLegend>Update Secure Note</FieldLegend>
                    <FieldDescription>Update {secureNoteItem.title}.</FieldDescription>
                </FieldSet>

                <FieldGroup>
                    <FieldSeparator />
                    <Field>
                        <FieldLabel>Title</FieldLabel>
                        <Input type="text" placeholder="Name of secure note item" id="title" value={title} onChange={(e) => { setTitle(e.target.value) }} className="h-12" />
                    </Field>
                    <Field>
                        <FieldLabel>Content</FieldLabel>
                        <Textarea placeholder="Content of secure note item" id="content" value={content} onChange={(e) => { setContent(e.target.value) }} className="min-h-[300px]" />
                    </Field>
                    <FieldSeparator />
                </FieldGroup>

                <Field orientation="horizontal">
                    <Button variant="outline" onClick={cancel}>Cancel</Button>
                    <Button disabled={isPending || !title || !content || (title == secureNoteItem.title && content == secureNoteItem.content)} onClick={handleSubmit} className="font-bold">
                        {isPending ? (
                            <>
                                <Loader2Icon className="size-4 animate-spin" />
                                <span>Updating...</span>
                            </>
                        ) : (
                            <>
                                <PenIcon className="size-4" />
                                <span>Update Secure Note</span>
                            </>
                        )}
                    </Button>
                </Field>
            </Field>
        </motion.div>
    )
}