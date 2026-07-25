"use client";

import { authClient } from "@/utils/auth-client";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Field, FieldDescription, FieldLabel, FieldSeparator, FieldSet, FieldTitle } from "@/components/ui/field";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Loader2Icon, X } from "lucide-react";
import { WebsiteCredentialCard } from "@/app/_components/UICards";
import { DotPattern } from "@/components/ui/dot-pattern";
import { Input } from "@/components/ui/input";

export default function VerifyEmailComponent({ currentUserEmail, cancel }: { currentUserEmail: string, cancel: () => void }) {
    const [verificationPending, StartVerificationTransition] = useTransition();
    const [showEmailInput, setShowEmailInput] = useState(false);
    const [newEmail, setNewEmail] = useState("");

    const handleResendVerification = async () => {
        const emailToSend = showEmailInput ? newEmail : currentUserEmail;
        StartVerificationTransition(async () => {
            await authClient.sendVerificationEmail({
                email: emailToSend,
                callbackURL: "/",
                fetchOptions: {
                    onRequest: () => {
                        toast.loading("Sending email verification...");
                    },
                    onSuccess: () => {
                        toast.dismiss();
                        toast.success("Success. Check your email.");
                    },
                    onError: () => {
                        toast.dismiss();
                        toast.error("Failed to send verification email");
                    }
                }
            })
        })
    }

    return (
        <>
            <div className="bg-background flex items-center justify-center w-screen h-screen z-999 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                {/* EMAIL VERIFICATION CARD */}
                <div className="bg-background w-full h-full flex flex-col items-center justify-center gap-12 border-r border-foreground/5">
                    <Link href="/" className="font-bold text-3xl tracking-tighter text-primary uppercase">WARDPASS</Link>
                    <FieldSet className="min-w-lg max-w-xl">
                        <Field className="space-y-4">
                            <FieldTitle className="text-7xl font-bold text-center w-lg">Verify Email to Sign Up</FieldTitle>
                            <FieldDescription className="text-center text-xl">Check your email for a <span className="font-bold">verification link</span></FieldDescription>
                        </Field>
                        {showEmailInput ? (
                            <Field>
                                <FieldSeparator />
                                <FieldTitle className="text-md">Enter your email again</FieldTitle>
                                <FieldDescription>Please provide your email address to receive a verification link.</FieldDescription>
                                <FieldLabel htmlFor="email">Email</FieldLabel>
                                <Input type="email" id="email" required placeholder="Email Address" className="h-12" onChange={(e) => setNewEmail(e.target.value)} />
                            </Field>
                        ) : null}
                        <FieldSeparator />
                        <Field>
                            <Button size="lg" className="text-md px-6 py-7" onClick={handleResendVerification}>
                                {verificationPending ? (
                                    <>
                                        <Loader2Icon className="animate-spin" />
                                        <span>Resending...</span>
                                    </>
                                ) : (
                                    <span>Resend verification email</span>
                                )}
                            </Button>
                        </Field>
                        <Field>
                            <Button variant="link" size="sm" onClick={() => { setShowEmailInput(!showEmailInput); }}>{!showEmailInput ? "Email not resending?" : "Go back"}</Button>
                        </Field>
                    </FieldSet>
                </div>
                {/* ONE CARD */}
                <div className="w-full flex flex-col items-center justify-center">
                    <Button variant="ghost" size="icon-lg" onClick={cancel} className="absolute top-4 right-4 z-999"><X className="size-4" /></Button>
                    <WebsiteCredentialCard />
                </div>
            </div>
            <DotPattern />
        </>
    )
}