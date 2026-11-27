"use client";

import { authClient } from "@/utils/auth-client";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { Field, FieldContent, FieldDescription, FieldSeparator, FieldTitle } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Loader2Icon } from "lucide-react";
import { WebsiteCredentialCard } from "@/components/UICards";
import { DotPattern } from "@/components/ui/dot-pattern";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp"
import { useRouter } from "next/navigation";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";

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

    // Pre-fill email from query param if provided
    useEffect(() => {
        if (currentUserEmail) handleSendVerification();
    });

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
        <ResizablePanelGroup className="w-screen h-screen">
            {/* EMAIL VERIFICATION CARD */}
            <ResizablePanel className="z-11 bg-background/90 size-full flex items-center justify-center">
                <Field className="w-full px-20 space-y-1">
                    <FieldTitle className="text-6xl font-bold text-center w-lg">Verify Email to complete Sign Up</FieldTitle>
                    <FieldDescription className="text-center text-xl mb-4">Enter the verification code we sent to your email address.</FieldDescription>

                    <FieldSeparator />

                    <FieldContent className="gap-4">
                        {!showEmailInput && (
                            <Field className="size-full py-2">
                                <FieldTitle className="text-sm">Verification code</FieldTitle>
                                <FieldDescription>Enter your verification code</FieldDescription>
                                <FieldContent className="gap-4">
                                    <InputOTP maxLength={6} id="otp-verification" pattern={REGEXP_ONLY_DIGITS} required onChange={(value) => setOtpValue(value)} disabled={verificationPending} onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault();
                                            handleVerifyEmail();
                                        }
                                    }}>
                                        <InputOTPGroup className="w-full flex items-center justify-center *:data-[slot=input-otp-slot]:h-14 *:data-[slot=input-otp-slot]:w-full *:data-[slot=input-otp-slot]:text-xl">
                                            <InputOTPSlot index={0} />
                                            <InputOTPSlot index={1} />
                                            <InputOTPSlot index={2} />
                                            <InputOTPSlot index={3} />
                                            <InputOTPSlot index={4} />
                                            <InputOTPSlot index={5} />
                                        </InputOTPGroup>
                                    </InputOTP>

                                    <FieldSeparator />

                                    <Button size="lg" className="text-md px-6 py-7" onClick={handleVerifyEmail} disabled={verificationPending}>
                                        {verificationPending ? (
                                            <>
                                                <Loader2Icon className="animate-spin" />
                                                <span>Verifying...</span>
                                            </>
                                        ) : (
                                            <span>Verify email</span>
                                        )}
                                    </Button>
                                </FieldContent>
                            </Field>
                        )}

                        {showEmailInput && (
                            <Field className="size-full py-2">
                                <FieldTitle className="text-md">Enter your email again</FieldTitle>
                                <FieldDescription>Please provide your email address again to resend the verification code.</FieldDescription>
                                <FieldContent className="gap-4">
                                    <Input type="email" id="email" required placeholder="Email Address" className="h-12" onChange={(e) => setNewEmail(e.target.value)} disabled={verificationRequestPending} onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault();
                                            handleSendVerification();
                                        }
                                    }} />
                                    <FieldSeparator />
                                    <Button size="lg" className="text-md px-6 py-7" onClick={handleSendVerification} disabled={verificationRequestPending}>
                                        {verificationRequestPending ? (
                                            <>
                                                <Loader2Icon className="animate-spin" />
                                                <span>Sending...</span>
                                            </>
                                        ) : (
                                            <span>Send verification code</span>
                                        )}
                                    </Button>
                                </FieldContent>
                            </Field>
                        )}

                        <Button variant="link" onClick={() => setShowEmailInput(!showEmailInput)}>{!showEmailInput ? "Still not seeing the email?" : "Go back"}</Button>

                    </FieldContent>
                </Field>
            </ResizablePanel>

            <ResizableHandle withHandle />

            {/* ONE CARD */}
            <ResizablePanel className="size-full flex items-center justify-center">
                <div className="z-12"><WebsiteCredentialCard /></div>
            </ResizablePanel>

            <DotPattern className="absolute z-10 size-full opacity-80" />
        </ResizablePanelGroup>
    )
}