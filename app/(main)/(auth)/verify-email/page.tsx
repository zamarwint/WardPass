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
import { useQuery } from "@tanstack/react-query";
import { getUserSession } from "@/app/actions/getSession";

export default function VerifyEmailPage() {
    const [verificationPending, StartVerificationTransition] = useTransition();
    const { isPending, data, error } = useQuery({
        queryKey: ["getSession2"],
        queryFn: async () => await getUserSession()
    })

    error && toast.error("There was an error loading your profile. Please try refreshing the page.");

    const handleResendVerification = async () => {
        StartVerificationTransition(async () => {
            await authClient.sendVerificationEmail({
                email: data?.user?.email!,
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
                        ) : isPending ? (
                            <>
                                <Loader2Icon className="size-4 animate-spin" />
                                <span>Loading...</span>
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