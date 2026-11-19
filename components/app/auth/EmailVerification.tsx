"use client";

import { authClient } from "@/utils/auth-client";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Field, FieldDescription, FieldSeparator, FieldSet, FieldTitle } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Loader2Icon } from "lucide-react";
import { WebsiteCredentialCard } from "@/components/UICards";
import { DotPattern } from "@/components/ui/dot-pattern";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp"
import { useRouter } from "next/navigation";

export default function EmailVerification() {
    const currentUserEmail = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('email') : null;

    const [verificationRequestPending, StartRequestTransition] = useTransition();
    const [verificationPending, StartVerificationTransition] = useTransition();

    const [newEmail, setNewEmail] = useState("");
    const [showEmailInput, setShowEmailInput] = useState<boolean>(false);

    const [otpValue, setOtpValue] = useState<string>("");

    const router = useRouter();

    const handleSendVerification = async () => {
        const emailToSend = showEmailInput ? newEmail : currentUserEmail as string;
        StartRequestTransition(async () => {
            await authClient.emailOtp.sendVerificationOtp({
                email: emailToSend,
                type: "email-verification",
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

    const handleVerifyEmail = async () => {
        const emailToVerify = newEmail.length > 0 ? newEmail : currentUserEmail as string;
        StartVerificationTransition(async () => {
            await authClient.emailOtp.verifyEmail({
                email: emailToVerify, // required, Email address to verify.
                otp: otpValue, // required, OTP to verify.
                fetchOptions: {
                    onRequest: () => {
                        toast.loading("Verifying...");
                    },
                    onSuccess: () => {
                        toast.dismiss();
                        toast.success("Success!");
                        router.push('/sign-in');
                    },
                    onError: () => {
                        toast.dismiss();
                        toast.error("Failed to verify email");
                    }
                }
            });
        })
    }

    return (
        <>
            <div className="bg-background flex items-center justify-center w-screen h-screen z-999 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                {/* EMAIL VERIFICATION CARD */}
                <div className="bg-background w-full h-full flex flex-col items-center justify-center gap-12 border-r border-foreground/5">
                    <FieldSet className="min-w-lg max-w-xl">
                        <Field className="space-y-4">
                            <FieldTitle className="text-6xl font-bold text-center w-lg">Verify Email to complete Sign Up</FieldTitle>
                            <FieldDescription className="text-center text-xl">Enter the verification code we sent to your email address.</FieldDescription>
                            <FieldSeparator />
                        </Field>
                        {!showEmailInput && <Field className="w-full">
                            <FieldTitle className="text-sm">Verification code</FieldTitle>
                            <FieldDescription>Enter your verification code</FieldDescription>
                            <InputOTP maxLength={6} id="otp-verification" pattern={REGEXP_ONLY_DIGITS} required onChange={(value) => setOtpValue(value)}>
                                <InputOTPGroup className="w-full flex items-center justify-center *:data-[slot=input-otp-slot]:h-14 *:data-[slot=input-otp-slot]:w-full *:data-[slot=input-otp-slot]:text-xl">
                                    <InputOTPSlot index={0} />
                                    <InputOTPSlot index={1} />
                                    <InputOTPSlot index={2} />
                                    <InputOTPSlot index={3} />
                                    <InputOTPSlot index={4} />
                                    <InputOTPSlot index={5} />
                                </InputOTPGroup>
                            </InputOTP>
                        </Field>}
                        {showEmailInput ? (
                            <Field>
                                <FieldTitle className="text-md">Enter your email again</FieldTitle>
                                <FieldDescription>Please provide your email address again to resend the verification code.</FieldDescription>
                                <Input type="email" id="email" required placeholder="Email Address" className="h-12" onChange={(e) => setNewEmail(e.target.value)} />
                            </Field>
                        ) : null}
                        <FieldSeparator />
                        <Field>
                            {!showEmailInput && <Button size="lg" className="text-md px-6 py-7" onClick={handleVerifyEmail}>
                                {verificationPending ? (
                                    <>
                                        <Loader2Icon className="animate-spin" />
                                        <span>Verifying...</span>
                                    </>
                                ) : (
                                    <span>Verify email</span>
                                )}
                            </Button>}
                            {showEmailInput && <Button size="lg" className="text-md px-6 py-7" onClick={handleSendVerification}>
                                {verificationRequestPending ? (
                                    <>
                                        <Loader2Icon className="animate-spin" />
                                        <span>Sending...</span>
                                    </>
                                ) : (
                                    <span>Send verification code</span>
                                )}
                            </Button>}
                        </Field>
                        <Field>
                            <Button variant="link" size="sm" onClick={() => setShowEmailInput(!showEmailInput)}>{!showEmailInput ? "Still not seeing the email?" : "Go back"}</Button>
                        </Field>
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