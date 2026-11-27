"use client";

import { PaymentCard } from "@/components/UICards";
import { Button, buttonVariants } from "@/components/ui/button";
import { DotPattern } from "@/components/ui/dot-pattern";
import { Field, FieldContent, FieldDescription, FieldError, FieldLabel, FieldSeparator, FieldTitle } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { EyeIcon, EyeOffIcon, LockKeyholeOpen } from "lucide-react";
import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useSignIn } from "@/lib/mutations/AuthMutations";
import { CustomLoadingState } from "@/components/LoadingStates";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Controller, useForm } from "react-hook-form";
import { loginSchema } from "@/lib/validations/authSchemas";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import PasswordStrengthBar from "@/components/PasswordStrengthBar";
import { passwordStrength } from "check-password-strength";
import Link from "next/link";

export default function SignIn() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);


    // 2. Create form instance with resolver
    const form = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        mode: "onChange",
        defaultValues: {
            email: "",
            password: "",
        }
    })

    // PASSWORD STRENGTH
    const watchedPassword = form.watch("password");
    const passStrength = useMemo(
        () => (watchedPassword ? passwordStrength(watchedPassword).value : ""),
        [watchedPassword]
    );

    const [emailPending, startEmailTransition] = useTransition()
    const emailSignIn = useSignIn(form.getValues().email, form.getValues().password);

    const onSubmit = () => {
        startEmailTransition(() => {
            emailSignIn.mutate();
        })
    }

    return (
        <ResizablePanelGroup className="w-screen h-screen">
            {/* SIGN IN CARD */}
            <ResizablePanel className="z-11 bg-background/90 size-full flex items-center justify-center">
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
                    <Field className="w-full px-20 space-y-1">
                        <FieldTitle className="text-4xl font-bold">Login</FieldTitle>
                        <FieldDescription className="mb-4">Access vaults in your strongroom.</FieldDescription>

                        <FieldContent className="gap-4">
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
                                            disabled={form.formState.isSubmitting || emailPending || emailSignIn.isPending}
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
                                        <div className="flex items-center justify-between">
                                            <FieldLabel htmlFor="master-password">Master Password</FieldLabel>
                                            <FieldDescription>
                                                <Button variant="link" onClick={() => router.push('/reset-password')}>Forgot password?</Button>
                                            </FieldDescription>
                                        </div>
                                        <div className="relative">
                                            <Input
                                                {...field}
                                                id="master-password"
                                                type={showPassword ? "text" : "password"}
                                                placeholder="************"
                                                aria-invalid={fieldState.invalid}
                                                className="h-12"
                                                autoComplete="off"
                                                disabled={form.formState.isSubmitting || emailPending || emailSignIn.isPending}
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

                            <Button type="submit" disabled={form.formState.isSubmitting || emailPending || emailSignIn.isPending} size="lg" className="w-full h-12">
                                {emailPending || emailSignIn.isPending ? (
                                    <CustomLoadingState loaderChoice={1} className="size-full flex items-center justify-center gap-2">
                                        <span className="shimmer shimmer-duration-1000"> UNLOCKING WARDPASS </span>
                                    </CustomLoadingState>
                                ) : (
                                    <>
                                        <LockKeyholeOpen /> UNLOCK WARDPASS
                                    </>
                                )}
                            </Button>

                            <FieldSeparator />

                            <FieldDescription>
                                Don&apos;t have an account?
                                <Link href="/sign-up" className={buttonVariants({ variant: "link" })}>SIGN UP</Link>
                            </FieldDescription>
                        </FieldContent>
                    </Field>
                </form>
            </ResizablePanel>

            <ResizableHandle withHandle />

            {/* ONE CARD */}
            <ResizablePanel className="size-full flex items-center justify-center">
                <div className="z-12"><PaymentCard /></div>
            </ResizablePanel>

            <DotPattern className="absolute z-10 size-full opacity-80" />
        </ResizablePanelGroup>
    )
}