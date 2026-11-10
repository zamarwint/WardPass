"use client";

import { Button } from "@/components/ui/button";
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
    FieldLegend,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Loader2Icon, PenIcon } from "lucide-react";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { SecureNoteJSON } from "@/lib/types/VaultItemType";
import { useUpdateVaultItem } from "@/lib/mutations/CoreUpdateMutations";
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader } from "@/components/ui/drawer";

export default function UpdateSecureNoteItem({ open, onOpenChange, secureNoteItem }: { open: boolean, onOpenChange: (open: boolean) => void, secureNoteItem: SecureNoteJSON }) {
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
    const { mutate, isPending } = useUpdateVaultItem(secureNoteItem.id, secureNoteItem.vaultId, data)

    const handleSubmit = () => {
        mutate();
    }

    return (
        <Drawer open={open} onOpenChange={onOpenChange} swipeDirection="right">
            <DrawerContent className="w-[50vw]">
                <DrawerHeader>
                    <FieldLegend>Update Secure Note</FieldLegend>
                    <FieldDescription>Update {secureNoteItem.title}.</FieldDescription>
                </DrawerHeader>

                <FieldGroup className="p-4">
                    <Field>
                        <FieldLabel>Title</FieldLabel>
                        <Input type="text" placeholder="Name of secure note item" id="title" value={title} onChange={(e) => { setTitle(e.target.value) }} className="h-12" />
                    </Field>
                    <Field>
                        <FieldLabel>Content</FieldLabel>
                        <Textarea placeholder="Content of secure note item" id="content" value={content} onChange={handleContentChange} className="min-h-75 resize-none" />
                        <FieldDescription>{characterLength}/2000 characters</FieldDescription>
                    </Field>
                </FieldGroup>

                <DrawerFooter className="flex flex-row">
                    <DrawerClose>Cancel</DrawerClose>
                    <Button disabled={isPending || !title || !content} onClick={handleSubmit} className="font-bold">
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
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}