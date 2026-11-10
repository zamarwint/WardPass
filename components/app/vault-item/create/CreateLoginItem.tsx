"use client";

import { Button } from "@/components/ui/button";
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { EyeIcon, EyeOffIcon, Loader2Icon, PlusIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { VaultItemType } from "@/lib/types/VaultType";
import { useCreateVaultItem } from "@/lib/mutations/CoreCreateMutations";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginItemSchema } from "@/lib/validations/vaultItemSchemas";
import z from "zod";
import { Controller, useForm } from "react-hook-form";
import { LoginJSONRaw } from "@/lib/types/RawVaultItemType";
import PasswordStrengthBar from "@/components/PasswordStrengthBar";
import { passwordStrength } from "check-password-strength";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";

export default function CreateLoginItem({ open, onOpenChange, vaultId }: { open: boolean, onOpenChange: (open: boolean) => void, vaultId: string }) {
    const [showPassword, setShowPassword] = useState(false);

    // 2. Create form instance with resolver
    const form = useForm<z.infer<typeof loginItemSchema>>({
        resolver: zodResolver(loginItemSchema),
        mode: "onChange",
        defaultValues: {
            name: "",
            url: "",
            username: "",
            email: "",
            password: "",
            note: ""
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
    const { mutate, isPending } = useCreateVaultItem(vaultId, data, VaultItemType.LOGIN);

    const handleSubmit = () => {
        mutate();
        form.setValues({
            name: "",
            url: "",
            username: "",
            email: "",
            password: "",
            note: ""
        })
    }

    return (
        <Drawer open={open} onOpenChange={onOpenChange} swipeDirection="right">
            <DrawerContent className="w-[50vw]">
                <DrawerHeader>
                    <DrawerTitle>Create Login Item</DrawerTitle>
                    <DrawerDescription>Create a new login item.</DrawerDescription>
                </DrawerHeader>
                <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-4 size-full p-4">
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
                        <Button type="submit" className="font-bold" disabled={isPending || form.formState.isSubmitting}>
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
                    </DrawerFooter>
                </form>
            </DrawerContent>
        </Drawer>
    )
}