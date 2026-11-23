"use client";

import { Button } from "@/components/ui/button";
import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Loader2Icon, PlusIcon } from "lucide-react";
import { VaultItemType } from "@/lib/types/VaultType";
import { useCreateVaultItem } from "@/lib/mutations/CoreCreateMutations";
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerDescription, DrawerTitle } from "@/components/ui/drawer";
import { SecureNoteJSONRaw } from "@/lib/types/RawVaultItemType";
import { secureNoteSchema } from "@/lib/validations/vaultItemSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { SecureNoteTiptapEditor } from "@/components/tiptap/SecureNoteTiptapEditor";

export default function CreateSecureNoteItem({ open, onOpenChange, vaultId }: { open: boolean, onOpenChange: (open: boolean) => void, vaultId: string }) {
    // 2. Create form instance with resolver
    const form = useForm<z.infer<typeof secureNoteSchema>>({
        resolver: zodResolver(secureNoteSchema),
        mode: "onChange",
        defaultValues: {
            title: "",
            content: ""
        }
    })

    const content = form.watch("content");
    const characterLength = content?.length ?? 0;

    {/* SUBMISSION */ }
    const { mutate, isPending } = useCreateVaultItem<SecureNoteJSONRaw>(
        vaultId,
        VaultItemType.SECURE_NOTE,
        () => {
            form.reset();
            onOpenChange(false);
        }
    );

    const onSubmit = (values: z.infer<typeof secureNoteSchema>) => {
        mutate(values);
    }

    return (
        <Drawer open={open} onOpenChange={onOpenChange} swipeDirection="right">
            <DrawerContent className="w-[50vw]">
                <DrawerHeader>
                    <DrawerTitle>Create Secure Note Item</DrawerTitle>
                    <DrawerDescription>Create a new secure note item.</DrawerDescription>
                </DrawerHeader>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 size-full p-4 overflow-y-scroll">
                    <FieldGroup>
                        <Controller
                            name="title"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="title">Title</FieldLabel>
                                    <Input
                                        {...field}
                                        type="text"
                                        placeholder="Title of secure note item"
                                        id="title"
                                        aria-invalid={fieldState.invalid}
                                        className="h-12"
                                        autoComplete="off"
                                        maxLength={50}
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />
                        <Controller
                            name="content"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="content">Content</FieldLabel>
                                    <SecureNoteTiptapEditor
                                        value={field.value}
                                        onChange={field.onChange}
                                        onBlur={field.onBlur}
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                    <FieldDescription>{characterLength}/2000 characters</FieldDescription>
                                </Field>
                            )}
                        />

                    </FieldGroup>
                    <DrawerFooter className="flex flex-row">
                        <DrawerClose>Cancel</DrawerClose>
                        <Button type="submit" className="font-bold" disabled={isPending || form.formState.isSubmitting}>
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
                </form>
            </DrawerContent>
        </Drawer>
    )
}