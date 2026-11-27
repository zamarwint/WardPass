"use client";

import { PasswordInput } from "@/components/PasswordInput";
import PasswordStrengthBar from "@/components/PasswordStrengthBar";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useCreateUserMutation } from "@/lib/mutations/AdminMutations";
import { signUpSchema } from "@/lib/validations/authSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { passwordStrength } from "check-password-strength";
import { EyeIcon, EyeOffIcon, Loader2Icon, UserPlus } from "lucide-react";
import { useMemo, useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

export default function AdminCreateUser() {
    const [adminCreateUserPending, startAdminCreateUserTransition] = useTransition();
    const { mutate, isPending } = useCreateUserMutation();
    const [showPassword, setShowPassword] = useState(false);

    const form = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        mode: "onChange",
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    const watchedPassword = form.watch("password");
    const passStrength = useMemo(
        () => (watchedPassword ? passwordStrength(watchedPassword).value : ""),
        [watchedPassword]
    );

    function onSubmit(data: z.infer<typeof signUpSchema>) {
        startAdminCreateUserTransition(async () => {
            mutate(
                {
                    email: data.email,
                    password: data.password,
                    name: data.name,
                },
                {
                    onSuccess: () => {
                        toast.success("User created successfully");
                        form.reset();
                    },
                    onError: (error) => {
                        toast.error(error.message);
                    },
                }
            );
        });
    }

    return (
        <div className="rounded-2xl border border-border/50 bg-card/50 p-5 sm:p-6 shadow-2xs flex flex-col gap-5">
            <div className="flex items-center gap-3">
                <div className="size-9 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center justify-center shrink-0">
                    <UserPlus className="size-4" />
                </div>
                <div className="flex flex-col">
                    <h2 className="text-base font-bold text-foreground">Provision New User</h2>
                    <p className="text-xs text-muted-foreground">
                        Create a new WardPass account with an initial master password.
                    </p>
                </div>
            </div>

            <div className="border-t border-border/40" />

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 w-full">
                <FieldGroup className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Name Field */}
                    <Controller
                        name="name"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="name">Full Name</FieldLabel>
                                <Input
                                    {...field}
                                    id="name"
                                    placeholder="e.g. John Doe"
                                    aria-invalid={fieldState.invalid}
                                    className="h-11 rounded-xl"
                                    autoComplete="off"
                                    maxLength={31}
                                />
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />

                    {/* Email Field */}
                    <Controller
                        name="email"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="email">Email Address</FieldLabel>
                                <Input
                                    {...field}
                                    id="email"
                                    type="email"
                                    placeholder="e.g. john@example.com"
                                    aria-invalid={fieldState.invalid}
                                    className="h-11 rounded-xl"
                                    autoComplete="off"
                                />
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
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
                                        className="h-11 rounded-xl pr-10"
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
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
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
                                    className="h-11 rounded-xl"
                                    autoComplete="off"
                                />
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />
                </FieldGroup>

                <div className="border-t border-border/40 pt-2 flex justify-end">
                    <Button
                        type="submit"
                        variant="default"
                        className="h-11 px-6 rounded-xl font-semibold cursor-pointer w-full sm:w-auto"
                        disabled={form.formState.isSubmitting || adminCreateUserPending || isPending}
                    >
                        {adminCreateUserPending || isPending ? (
                            <>
                                <Loader2Icon className="size-4 animate-spin" />
                                <span>Creating...</span>
                            </>
                        ) : (
                            <span>Create User</span>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
}
