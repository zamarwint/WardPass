"use client";

import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldSet, FieldTitle } from "@/components/ui/field";
import { PasswordInput } from "../_components/PasswordInput";
import { Button } from "@/components/ui/button";
import { useState, useTransition } from "react";
import { EyeIcon, EyeOffIcon, Loader2Icon } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/utils/auth-client";
import { useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { Controller, useForm } from "react-hook-form";
import { resetPasswordSchema } from "@/lib/validations/authSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { Input } from "@/components/ui/input";

export default function ResetPasswordPage() {
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();
    const [resetPasswordPending, startResetPasswordTransition] = useTransition();
    const token = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get("token") : null;

    // 2. Create form instance with resolver
    const form = useForm<z.infer<typeof resetPasswordSchema>>({
        resolver: zodResolver(resetPasswordSchema),
        mode: "onChange",
        defaultValues: {
            password: "",
            confirmPassword: ""
        }
    })

    function onSubmit(data: z.infer<typeof resetPasswordSchema>) {
        console.log("Reset Password:", data.password, data.confirmPassword, token);
        if (!token) {
            toast.error("Token not found");
            return;
        }

        startResetPasswordTransition(async () => {
            authClient.resetPassword({
                newPassword: data.password,
                token,
                fetchOptions: {
                    onRequest: () => {
                        toast.loading("Resetting your password...");
                    },
                    onSuccess: () => {
                        toast.dismiss();
                        toast.success("Password reset successfully!");
                        router.push("/sign-in");
                    },
                    onError: () => {
                        toast.dismiss();
                        toast.error("Failed to reset password");
                    }
                }
            })
        })
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen w-screen z-999">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FieldSet className="w-xl">
                    <Field>
                        <FieldTitle className="text-3xl font-bold">Reset Your Password</FieldTitle>
                        <FieldDescription>Enter your new password.</FieldDescription>
                    </Field>
                    <FieldGroup className="mt-10">
                        {/* Password Field */}
                        <Controller
                            name="password"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="master-password">New Master Password</FieldLabel>
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
                                    <FieldLabel htmlFor="confirmMasterPassword">Confirm New Master Password</FieldLabel>
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
                    </FieldGroup>
                    <Separator />
                    <Field>
                        <Button type="submit" disabled={resetPasswordPending} variant="default" size="lg" className="py-6">
                            {resetPasswordPending ? (
                                <>
                                    <Loader2Icon className="size-4 animate-spin" />
                                    <span>Loading...</span>
                                </>
                            ) : (
                                <span>Reset Password</span>
                            )}
                        </Button>
                    </Field>
                </FieldSet>
            </form>
        </div>
    )
}