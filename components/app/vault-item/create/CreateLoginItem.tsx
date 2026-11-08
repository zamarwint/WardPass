"use client";

import { Button } from "@/components/ui/button";
import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
    FieldLegend,
    FieldSeparator,
    FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { EyeIcon, EyeOffIcon, Loader2Icon, PlusIcon, X } from "lucide-react";
import { useMemo, useState } from "react";
import { motion } from "motion/react"
import { VaultItemType } from "@/lib/types/VaultType";
import { useCreateVaultItem } from "@/lib/mutations/CoreCreateMutations";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginItemSchema } from "@/lib/validations/vaultItemSchemas";
import z from "zod";
import { Controller, useForm } from "react-hook-form";
import { LoginJSONRaw } from "@/lib/types/RawVaultItemType";
import PasswordStrengthBar from "@/components/PasswordStrengthBar";
import { passwordStrength } from "check-password-strength";

export default function CreateLoginItem({ vaultId, cancel }: { vaultId: string, cancel: () => void }) {
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
    const { mutate, isPending } = useCreateVaultItem(vaultId, data, cancel, VaultItemType.LOGIN);

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
                    <FieldLegend>Create Login Item</FieldLegend>
                    <FieldDescription>Create a new login item.</FieldDescription>
                </FieldSet>

                <FieldSeparator />
                <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-4">
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

                    <FieldSeparator className="mb-5" />

                    <Field orientation="horizontal">
                        <Button variant="outline" onClick={cancel}>Cancel</Button>
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
                    </Field>
                </form>
            </Field>
            <Button variant="ghost" size="icon-lg" onClick={cancel} className="absolute top-4 right-4 z-999"><X className="size-4" /></Button>
        </motion.div>
    )
}