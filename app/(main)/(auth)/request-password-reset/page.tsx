"use client";

import { useState, useTransition } from "react";
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldSet, FieldTitle } from "@/components/ui/field";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Loader2Icon } from "lucide-react";
import { WebsiteCredentialCard } from "@/app/_components/UICards";
import { DotPattern } from "@/components/ui/dot-pattern";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useRequestPasswordReset } from "@/lib/mutations/AuthMutations";

export default function RequestPasswordResetPage() {
    const [resetPasswordPending, StartResetPasswordTransition] = useTransition();
    const [email, setEmail] = useState("");
    const requestResetPassword = useRequestPasswordReset(email);

    const handleResendPasswordResetEmail = async () => {
        StartResetPasswordTransition(() => {
            requestResetPassword.mutate();
        })
    }

    return (
        <>
            <div className="bg-background flex items-center justify-center w-screen h-screen z-999 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                {/* RESET PASSWORD CARD */}
                <div className="bg-background w-full h-full flex flex-col items-center justify-center gap-12 border-r border-foreground/5">
                    <Link href="/" className="font-bold text-3xl tracking-tighter text-primary uppercase">WARDPASS</Link>

                    <FieldSet>
                        <FieldGroup className="w-xl">
                            <Field className="space-y-2">
                                <FieldTitle className="text-7xl font-bold text-center">Reset Password</FieldTitle>
                                {!email && <FieldDescription className="text-center text-xl">Enter your email address to receive a password reset link.</FieldDescription>}
                            </Field>

                            <Separator className="mt-4" />

                            <Field>
                                <FieldLabel htmlFor="email" className="text-muted-foreground">Email</FieldLabel>
                                <Input type="email" id="email" required placeholder="e.g. alexpeart@gmail.com" value={email} className="h-12" onChange={(e) => setEmail(e.target.value)} />
                            </Field>
                        </FieldGroup>
                    </FieldSet>
                    <FieldSet>
                        {email && <FieldDescription className="text-center text-xl">Check your email for a <span className="font-bold">reset link afterwards.</span></FieldDescription>}
                        <Button size="lg" className="text-md px-6 py-7" onClick={handleResendPasswordResetEmail}>
                            {resetPasswordPending ? (
                                <>
                                    <Loader2Icon className="animate-spin" />
                                    <span>Sending reset email...</span>
                                </>
                            ) : (
                                <span>Resend reset password email</span>
                            )}
                        </Button>
                    </FieldSet>
                </div>
                {/* ONE CARD */}
                <div className="w-full flex flex-col items-center justify-center">
                    <WebsiteCredentialCard />
                </div>
            </div>
            <DotPattern />
        </>
    )
}