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
import { EyeIcon, EyeOffIcon, Loader2Icon, PenIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { useUpdateVaultItem } from "@/lib/mutations/CoreUpdateMutations";
import { passwordStrength } from "check-password-strength";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { loginItemSchema } from "@/lib/validations/vaultItemSchemas";
import { LoginJSONRaw } from "@/lib/types/RawVaultItemType";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginJSON } from "@/lib/types/VaultItemType";
import PasswordStrengthBar from "@/components/PasswordStrengthBar";
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader } from "@/components/ui/drawer";

export default function UpdateLoginItem({ open, onOpenChange, loginItem }: { open: boolean, onOpenChange: (open: boolean) => void, loginItem: LoginJSON }) {
    const [showPassword, setShowPassword] = useState(false);

    // 2. Create form instance with resolver
    const form = useForm<z.infer<typeof loginItemSchema>>({
        resolver: zodResolver(loginItemSchema),
        mode: "onChange",
        defaultValues: {
            name: loginItem.name,
            url: loginItem.url,
            username: loginItem.username,
            email: loginItem.email,
            password: loginItem.password,
            note: loginItem.note
        }
    })

    const watchedPassword = form.watch("password");
    const passStrength = useMemo(
        () => (watchedPassword ? passwordStrength(watchedPassword).value : ""),
        [watchedPassword]
    );

    const data: LoginJSONRaw = {
        name: form.getValues().name,
        url: form.getValues().url,
        username: form.getValues().username,
        email: form.getValues().email,
        password: form.getValues().password,
        note: form.getValues().note
    };

    {/* SUBMISSION */ }
    const { mutate, isPending } = useUpdateVaultItem(loginItem.id, loginItem.vaultId, data);

    const handleSubmit = () => {
        mutate();
    }

    return (
        <Drawer open={open} onOpenChange={onOpenChange} swipeDirection="right">
            <DrawerContent className="w-[50vw]">
                <DrawerHeader>
                    <FieldLegend>Update Login</FieldLegend>
                    <FieldDescription>Update {loginItem.name}.</FieldDescription>
                </DrawerHeader>

                <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-4 p-4">
                    <FieldGroup className="hidden lg:grid grid-cols-2 gap-4 w-full">
                        <Controller
                            name="name"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="name">Name</FieldLabel>
                                    <Input
                                        {...field}
                                        type="text"
                                        placeholder="Name of login item"
                                        id="name"
                                        aria-invalid={fieldState.invalid}
                                        className="h-12"
                                        autoComplete="off"
                                        maxLength={31}
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />
                        <Controller
                            name="url"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel>URL</FieldLabel>
                                    <Input
                                        {...field}
                                        type="text"
                                        placeholder="https://example.com"
                                        id="url"
                                        aria-invalid={fieldState.invalid}
                                        className="h-12"
                                        autoComplete="off"
                                        maxLength={31}
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />
                        <Controller
                            name="username"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel>Username</FieldLabel>
                                    <Input
                                        {...field}
                                        type="text"
                                        placeholder="Username"
                                        id="username"
                                        aria-invalid={fieldState.invalid}
                                        className="h-12"
                                        autoComplete="off"
                                        maxLength={31}
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />

                        <Controller
                            name="email"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel>Email</FieldLabel>
                                    <Input
                                        {...field}
                                        type="email"
                                        placeholder="Email"
                                        id="email"
                                        aria-invalid={fieldState.invalid}
                                        className="h-12"
                                        autoComplete="off"
                                        maxLength={31}
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />

                        <Controller
                            name="password"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="master-password">Password</FieldLabel>
                                    <div className="relative">
                                        <Input
                                            {...field}
                                            id="master-password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="************"
                                            aria-invalid={fieldState.invalid}
                                            className="h-12"
                                            autoComplete="off"
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent cursor-pointer"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? (
                                                <EyeIcon className="h-4 w-4" aria-hidden="true" />
                                            ) : (
                                                <EyeOffIcon className="h-4 w-4" aria-hidden="true" />
                                            )}
                                        </Button>
                                    </div>
                                    <PasswordStrengthBar strength={passStrength} />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />

                        <Controller
                            name="note"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel>Note</FieldLabel>
                                    <Input
                                        {...field}
                                        type="note"
                                        placeholder="Note"
                                        id="note"
                                        aria-invalid={fieldState.invalid}
                                        className="h-12"
                                        autoComplete="off"
                                        maxLength={31}
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
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
                                    <span>Update Login</span>
                                </>
                            )}
                        </Button>
                    </DrawerFooter>
                </form>
            </DrawerContent>
        </Drawer>
    )
}