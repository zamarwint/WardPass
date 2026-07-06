"use client";

import { WebsiteCredentialCard } from "@/app/_components/ui-cards";
import { DotPattern } from "@/components/ui/dot-pattern";
import { Field, FieldGroup, FieldLabel, FieldLegend, FieldSeparator, FieldSet, FieldTitle } from "@/components/ui/field";
import { FieldDescription } from "@/components/ui/field"
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function VerifyEmailPage() {
    const router = useRouter();

    return (
        <>
            <div className="flex items-center justify-center w-screen h-screen z-999">
                {/* SIGN UP CARD */}
                <div className="bg-background w-full h-full flex flex-col items-center justify-center gap-5 border-r border-foreground/5">
                    <Link href="/" className="font-bold text-3xl tracking-tighter text-primary uppercase">WARDPASS</Link>
                    <FieldSet>
                        <FieldTitle className="text-8xl font-bold text-center">Verify Your Email</FieldTitle>
                        <FieldDescription className="text-center text-xl">Check your email for a <span className="font-bold">verification link.</span></FieldDescription>
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