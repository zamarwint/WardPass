"use client";

import { Button } from "@/components/ui/button";
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Loader2Icon, PlusIcon } from "lucide-react";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { VaultItemType } from "@/lib/types/VaultType";
import { useCreateVaultItem } from "@/lib/mutations/CoreCreateMutations";
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerDescription, DrawerTitle } from "@/components/ui/drawer";

export default function CreateSecureNoteItem({ open, onOpenChange, vaultId }: { open: boolean, onOpenChange: (open: boolean) => void, vaultId: string }) {
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

    const data = { title, content };
    const { mutate, isPending } = useCreateVaultItem(vaultId, data, VaultItemType.SECURE_NOTE);

    const handleSubmit = () => {
        mutate();

        setTitle("");
        setContent("");
    }

    return (
        <Drawer open={open} onOpenChange={onOpenChange} swipeDirection="right">
            <DrawerContent className="w-[50vw]">
                <DrawerHeader>
                    <DrawerTitle>Create Secure Note Item</DrawerTitle>
                    <DrawerDescription>Create a new secure note item.</DrawerDescription>
                </DrawerHeader>
                <FieldGroup className="flex flex-col p-4">
                    <Field>
                        <FieldLabel>Title</FieldLabel>
                        <Input type="text" placeholder="Title of secure note item" id="title" value={title} onChange={(e) => { setTitle(e.target.value) }} className="h-12" />
                    </Field>
                    <Field>
                        <FieldLabel>Content</FieldLabel>
                        <Textarea placeholder="Write your notes here..." id="content" value={content} onChange={handleContentChange} className="min-h-75 resize-none" />
                        <FieldDescription>{characterLength}/2000 characters</FieldDescription>
                    </Field>
                </FieldGroup>
                <DrawerFooter className="flex flex-row">
                    <DrawerClose>Cancel</DrawerClose>
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
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}