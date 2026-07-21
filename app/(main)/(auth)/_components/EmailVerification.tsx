"use client";

import { authClient } from "@/utils/auth-client";
import { useTransition } from "react";
import { toast } from "sonner";
import { FieldDescription, FieldSet, FieldTitle } from "@/components/ui/field";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Loader2Icon, X } from "lucide-react";
import { WebsiteCredentialCard } from "@/app/_components/UICards";
import { DotPattern } from "@/components/ui/dot-pattern";

export default function VerifyEmailComponent({ currentUserEmail, type, cancel }: { currentUserEmail: string, type: string, cancel: () => void }) {
    const [verificationPending, StartVerificationTransition] = useTransition();
    const [resetPasswordPending, StartResetPasswordTransition] = useTransition();

    const handleResendPasswordResetEmail = async () => {
        StartResetPasswordTransition(async () => {
            await authClient.requestPasswordReset({
                email: currentUserEmail,
                redirectTo: process.env.NEXT_PUBLIC_APP_URL + '/reset-password',
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

    const handleResendVerification = async () => {
        StartVerificationTransition(async () => {
            await authClient.sendVerificationEmail({
                email: currentUserEmail,
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
                    <FieldSet>
                        <FieldTitle className="text-8xl font-bold text-center">{type === 'Sign Up' ? 'Verify Email to Sign Up' : type === 'Reset Password' ? 'Reset Your Password' : 'Verify Your Email'}</FieldTitle>
                        <FieldDescription className="text-center text-xl">Check your email for a <span className="font-bold">{type === 'Sign Up' ? 'verification link' : type === 'Reset Password' ? 'reset link' : 'verification link'}</span></FieldDescription>
                    </FieldSet>
                    <FieldSet>
                        <Button size="lg" className="text-md px-6 py-7" onClick={type === 'Sign Up' ? handleResendVerification : type === 'Reset Password' ? handleResendPasswordResetEmail : handleResendVerification}>
                            {verificationPending || resetPasswordPending ? (
                                <>
                                    <Loader2Icon className="animate-spin" />
                                    <span>Resending...</span>
                                </>
                            ) : (
                                <span>Resend {type === 'Sign Up' ? 'verification' : type === 'Reset Password' ? 'reset' : 'verification'} email</span>
                            )}
                        </Button>
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