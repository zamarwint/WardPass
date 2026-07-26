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
import { Loader2Icon, PenIcon, X } from "lucide-react";
import { useState } from "react";
import { motion } from "motion/react"
import { Textarea } from "@/components/ui/textarea";
import { SecureNoteJSON } from "@/lib/types/VaultItemType";
import { useUpdateVaultItem } from "@/lib/mutations/CoreUpdateMutations";

export default function UpdateSecureNoteItem({ secureNoteItem, cancel }: { secureNoteItem: SecureNoteJSON, cancel: () => void }) {
    const [title, setTitle] = useState<string>(secureNoteItem.title)
    const [content, setContent] = useState<string>(secureNoteItem.content)
    const [characterLength, setCharacterLength] = useState<number>(content.length)

    const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const target = e.target;
        const value = target.value;

        if (value.length <= 2000) {
            setContent(value);
            setCharacterLength(value.length);
        }
    };

    const data = { title, content };
    const { mutate, isPending } = useUpdateVaultItem(secureNoteItem.id, secureNoteItem.vaultId, data, cancel)

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
            <Field className="size-full flex flex-col items-start justify-start border-r border-muted z-999 px-8 py-8 gap-8 bg-background overflow-y-scroll">
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
                        <Textarea placeholder="Content of secure note item" id="content" value={content} onChange={handleContentChange} className="min-h-75" />
                        <FieldDescription>{characterLength}/2000 characters</FieldDescription>
                    </Field>
                    <FieldSeparator />
                </FieldGroup>

                <Field orientation="horizontal">
                    <Button variant="outline" onClick={cancel}>Cancel</Button>
                    <Button disabled={isPending || !title || !content || (title === secureNoteItem.title && content === secureNoteItem.content)} onClick={handleSubmit} className="font-bold">
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
            <Button variant="ghost" size="icon-lg" onClick={cancel} className="absolute top-4 right-4 z-999"><X className="size-4" /></Button>
        </motion.div>
    )
}