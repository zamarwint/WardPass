"use client";

// SIGN UP AND EMAIL VERIFICATION PAGE

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Controller } from "react-hook-form"
import * as z from "zod"

import { PaymentCard, WebsiteCredentialCard } from "@/app/_components/UICards";
import { Button } from "@/components/ui/button";
import { DotPattern } from "@/components/ui/dot-pattern";
import { Field, FieldError, FieldGroup, FieldLabel, FieldSeparator, FieldTitle } from "@/components/ui/field";
import { FieldDescription } from "@/components/ui/field"
import { Input } from "@/components/ui/input";
import { EyeIcon, EyeOffIcon, Loader2Icon, ShieldPlus } from "lucide-react";
import Link from "next/link";
import { authClient } from "@/utils/auth-client";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { PasswordInput } from "./../_components/PasswordInput";

// import PasswordStrengthBar from "@/app/_components/PasswordStrengthBar";
import VerifyEmailComponent from "../_components/EmailVerification";
import { signUpSchema } from "@/lib/validations/authSchemas";

export default function SignUpPage() {
    const [currentEmail, setCurrentEmail] = useState<string>("");
    const [showEmailVerification, setShowEmailVerification] = useState<boolean>(false);

    const [emailPending, startEmailTransition] = useTransition();
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
        startEmailTransition(async () => {
            await authClient.signUp.email({
                email: data.email, // user email address
                password: data.password, // user password -> min 8 characters by default
                name: data.name, // user display name
                callbackURL: process.env.NEXT_PUBLIC_APP_URL + '/sign-in' // A URL to redirect to after the user verifies their email (optional)
            }, {
                onRequest: () => {
                    toast.loading("Signing you up...");
                },
                onSuccess: () => {
                    //redirect to verify email page
                    toast.dismiss();
                    setCurrentEmail(data.email);
                    toast.success("Success! Check your email to verify your account. This session expires in 10 minutes.");
                    setShowEmailVerification(true);
                },
                onError: (ctx) => {
                    // display the error message
                    toast.dismiss();
                    toast.error(ctx.error.message);
                },
            });
        })
    }

    return (
        <>
            <div className="flex items-center justify-center w-screen h-screen z-999">
                {/* SIGN UP CARD */}
                <div className="bg-background w-full h-full flex flex-col items-center justify-center gap-5 border-r border-foreground/5">
                    <Link href="/" className="font-bold text-3xl tracking-tighter text-primary uppercase">WARDPASS</Link>

                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FieldGroup className="w-xl">
                            <FieldTitle className="text-4xl text-primary font-bold">Sign Up</FieldTitle>
                            <FieldDescription>Create an account for a vault. <span className="font-bold">OAuth</span> is <span className="font-bold underline">NOT</span> supported on the Sign Up page.</FieldDescription>

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
                                        <FieldLabel htmlFor="password">Password</FieldLabel>
                                        <div className="relative">
                                            <Input
                                                {...field}
                                                id="password"
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
                                        <FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>
                                        <PasswordInput
                                            {...field}
                                            id="confirmPassword"
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

                        <Button type="submit" variant="default" size="lg" className="w-full" disabled={form.formState.isSubmitting || emailPending}>
                            {emailPending ? (
                                <>
                                    <Loader2Icon className="size-4 animate-spin" />
                                    <span>Initializing...</span>
                                </>
                            ) : (
                                <>
                                    <ShieldPlus /> INITIALIZE VAULT
                                </>
                            )}
                        </Button>

                        <FieldSeparator />

                        <FieldDescription className="py-4">
                            Already have an account?
                            <Link href="/sign-in" className="mx-2">LOGIN</Link>
                        </FieldDescription>
                    </form>
                </div>
                {/* STACK THE CARDS ON TOP OF EACH OTHER */}
                <div className="w-full flex flex-col items-center justify-center">
                    <div className="z-998 rotate-13 -translate-y-8"><PaymentCard withoutHeader={true} /></div>
                    <div className="z-999 -rotate-13 translate-y-1"><WebsiteCredentialCard withoutHeader={true} /></div>
                </div>
            </div>
            <DotPattern />
            {showEmailVerification && <VerifyEmailComponent currentUserEmail={currentEmail} cancel={() => setShowEmailVerification(!showEmailVerification)} />}
        </>
    )
}