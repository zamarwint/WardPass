"use client";

import { Button } from "@/components/ui/button";
import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
    FieldLegend,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Loader2Icon, PenIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { SecureNoteJSON } from "@/lib/types/VaultItemType";
import { useUpdateVaultItem } from "@/lib/mutations/CoreUpdateMutations";
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader } from "@/components/ui/drawer";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { secureNoteSchema } from "@/lib/validations/vaultItemSchemas";
import { SecureNoteJSONRaw } from "@/lib/types/RawVaultItemType";

export default function UpdateSecureNoteItem({ open, onOpenChange, secureNoteItem }: { open: boolean, onOpenChange: (open: boolean) => void, secureNoteItem: SecureNoteJSON }) {
    // 2. Create form instance with resolver
    const form = useForm<z.infer<typeof secureNoteSchema>>({
        resolver: zodResolver(secureNoteSchema),
        mode: "onChange",
        defaultValues: {
            title: secureNoteItem.title,
            content: secureNoteItem.content
        }
    })

    const content = form.watch("content");
    const characterLength = content?.length ?? 0;

    const { mutate, isPending } = useUpdateVaultItem<SecureNoteJSONRaw>(
        secureNoteItem.id,
        secureNoteItem.vaultId,
        () => onOpenChange(false)
    );

    const onSubmit = (values: z.infer<typeof secureNoteSchema>) => {
        mutate(values);
    };

    return (
        <Drawer open={open} onOpenChange={onOpenChange} swipeDirection="right">
            <DrawerContent className="w-[50vw]">
                <DrawerHeader>
                    <FieldLegend>Update Secure Note</FieldLegend>
                    <FieldDescription>Update {secureNoteItem.title}.</FieldDescription>
                </DrawerHeader>

                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 size-full p-4">
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
                                    <Textarea
                                        {...field}
                                        placeholder="Write your notes here..."
                                        id="content"
                                        aria-invalid={fieldState.invalid}
                                        className="h-12 min-h-75 resize-none"
                                        autoComplete="off"
                                        maxLength={2000}
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
                        <Button type="submit" disabled={isPending || form.formState.isSubmitting} className="font-bold">
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
                </form>
            </DrawerContent>
        </Drawer>
    )
}