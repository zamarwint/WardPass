import { PasswordInput } from "@/app/(main)/(auth)/_components/PasswordInput";
import { Button } from "@/components/ui/button";

import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
    FieldLegend,
    FieldSeparator
} from "@/components/ui/field"
import { Input } from "@/components/ui/input";
import { useCreateUserMutation } from "@/lib/mutations/AdminMutations";
import { signUpSchema } from "@/lib/validations/authSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeIcon, EyeOffIcon, Loader2Icon } from "lucide-react";
import { useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

export default function AdminCreateUser() {
    const [adminCreateUserPending, startAdminCreateUserTransition] = useTransition();
    const { mutate, isPending } = useCreateUserMutation();
    const [showPassword, setShowPassword] = useState(false);

    // 2. Create form instance with resolver
    const form = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        mode: "onChange",
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: ""
        }
    })

    function onSubmit(data: z.infer<typeof signUpSchema>) {
        startAdminCreateUserTransition(async () => {
            mutate({
                email: data.email,
                password: data.password,
                name: data.name
            }, {
                onSuccess: () => {
                    toast.success("User created successfully");
                    form.reset();
                },
                onError: (error) => {
                    toast.error(error.message);
                }
            });
        })
    }
    return (
        <FieldGroup className="border border-border rounded-xl p-10">
            <Field>
                <FieldLegend>Create User</FieldLegend>
                <FieldDescription>
                    Create a new user.
                </FieldDescription>
            </Field>
            <FieldSeparator />
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full">
                <FieldGroup className="w-full">
                    {/* Name Field */}
                    <Controller
                        name="name"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="name">Name</FieldLabel>
                                <Input
                                    {...field}
                                    id="name"
                                    placeholder="e.g. John Doe"
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

                    {/* Email Field */}
                    <Controller
                        name="email"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="email">Email</FieldLabel>
                                <Input
                                    {...field}
                                    id="email"
                                    type="email"
                                    placeholder="e.g. john@example.com"
                                    aria-invalid={fieldState.invalid}
                                    className="h-12"
                                    autoComplete="off"
                                />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />

                    {/* Password Field */}
                    <Controller
                        name="password"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="master-password">Master Password</FieldLabel>
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
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />

                    {/* Confirm Password Field */}
                    <Controller
                        name="confirmPassword"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="confirmMasterPassword">Confirm Master Password</FieldLabel>
                                <PasswordInput
                                    {...field}
                                    id="confirmMasterPassword"
                                    type="password"
                                    placeholder="************"
                                    aria-invalid={fieldState.invalid}
                                    className="h-12"
                                    autoComplete="off"
                                />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />
                    <FieldSeparator />
                </FieldGroup>

                <Button type="submit" variant="default" size="lg" className="w-full h-12" disabled={form.formState.isSubmitting || adminCreateUserPending || isPending}>
                    {adminCreateUserPending ? (
                        <>
                            <Loader2Icon className="size-4 animate-spin" />
                            <span>Creating...</span>
                        </>
                    ) : (
                        <p>Create User</p>
                    )}
                </Button>
            </form>
        </FieldGroup>
    )
}