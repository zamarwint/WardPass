"use client";

import { WebsiteCredentialCard } from "@/app/_components/ui-cards";
import { Button } from "@/components/ui/button";
import { DotPattern } from "@/components/ui/dot-pattern";
import { Field, FieldGroup, FieldLabel, FieldLegend, FieldSeparator, FieldSet, FieldTitle } from "@/components/ui/field";
import { FieldDescription } from "@/components/ui/field"
import { authClient } from "@/utils/auth-client";
import { Loader2Icon } from "lucide-react";
import Link from "next/link";
import { useTransition } from "react";
import { toast } from "sonner";

export default function VerifyEmailPage() {
    const [verificationPending, StartVerificationTransition] = useTransition();
    const email = () => {
        let dataEmail = localStorage.getItem("currentUserEmail");

        if (!dataEmail) {
            toast.error("No email found");
            return null
        }

        return dataEmail;
    }

    const handleResendVerification = async () => {
        StartVerificationTransition(async () => {
            const { data, error } = await authClient.sendVerificationEmail({
                email: email() as string,
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
            console.log(data, error);
        })
    }

    return (
        <>
            <div className="flex items-center justify-center w-screen h-screen z-999">
                {/* SIGN UP CARD */}
                <div className="bg-background w-full h-full flex flex-col items-center justify-center gap-12 border-r border-foreground/5">
                    <Link href="/" className="font-bold text-3xl tracking-tighter text-primary uppercase">WARDPASS</Link>
                    <FieldSet>
                        <FieldTitle className="text-8xl font-bold text-center">Verify Your Email</FieldTitle>
                        <FieldDescription className="text-center text-xl">Check your email for a <span className="font-bold">verification link.</span></FieldDescription>
                    </FieldSet>
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