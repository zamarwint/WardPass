"use client";

import { PaymentCard, WebsiteCredentialCard } from "@/app/_components/ui-cards";
import { Button } from "@/components/ui/button";
import DotPattern from "@/components/ui/dot-pattern";
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldSeparator, FieldSet, FieldTitle } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Circle, Loader2Icon, LockKeyholeOpen, ShieldPlus } from "lucide-react";
import Link from "next/link";
import { useTransition } from "react";
import { FaGoogle } from "react-icons/fa";
import { toast } from "sonner";

export default function SignInPage() {
    const [googlePending, startGoogleTransition] = useTransition()
    const [emailPending, startEmailTransition] = useTransition()

    // async function signInWithGoogle() {
    //     startGoogleTransition(async () => {
    //         await authClient.signIn.social({
    //             provider: "google",
    //             callbackURL: "/dashboard",
    //             fetchOptions: {
    //                 onSuccess: () => {
    //                     toast.success("Account created successfully. Redirecting...")
    //                 },
    //                 onError: (error) => {
    //                     toast.error("Internal server error. Please try again.")
    //                 }
    //             }
    //         });
    //     })
    // }

    const signInWithEmail = async () => {
        // TODO ADD SIGNIN w EMAIL LOGIC
    }

    return (
        <>
            <div className="flex items-center justify-center w-screen h-screen z-999">
                {/* SIGN IN CARD */}
                <div className="bg-background w-full h-full flex flex-col items-center justify-center gap-10 border-r border-foreground/5">
                    <Link href="/" className="font-bold text-3xl tracking-tighter text-primary uppercase">WARDPASS</Link>
                    <FieldSet>
                        <FieldTitle className="text-4xl font-bold">Login</FieldTitle>
                        <FieldDescription>Access your secure vault.</FieldDescription>

                        <Field>
                            <FieldTitle className="text-muted-foreground">Continue with Google</FieldTitle>
                            <Button variant="outline" size="lg" disabled={googlePending}>
                                {googlePending ? (
                                    <>
                                        <Loader2Icon className="size-4 animate-spin" />
                                        <span>Loading...</span>
                                    </>
                                ) : (
                                    <>
                                        <FaGoogle /> Sign in with Google
                                    </>
                                )}
                            </Button>
                        </Field>

                        <div className="flex flex-col justify-center items-center">
                            <FieldSeparator className="w-full" />
                            <div className="bg-background text-muted-foreground z-9 -translate-y-3.5 px-4">OR</div>
                        </div>

                        <FieldGroup className="w-xl">
                            <Field>
                                <FieldLabel htmlFor="email" className="text-muted-foreground">Email</FieldLabel>
                                <Input type="email" id="email" autoComplete="off" placeholder="e.g. johndoe@matrix.com" className="h-12" />
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="password" className="text-muted-foreground">Password</FieldLabel>
                                <Input type="password" id="password" autoComplete="off" placeholder="************" className="h-12" />
                            </Field>
                        </FieldGroup>

                        {/* Security Trust Bar (Decorative) */}
                        <div className="pt-2 pb-4">
                            <div className="flex justify-between items-end mb-1">
                                <span className="font-medium uppercase">Encryption Level</span>
                                <span className="font-mono text-xs text-primary">AES-256</span>
                            </div>
                            <div className="flex gap-1 h-1.5 w-full">
                                <div className="h-full bg-primary flex-1 rounded-sm"></div>
                                <div className="h-full bg-primary flex-1 rounded-sm"></div>
                                <div className="h-full bg-primary opacity-30 flex-1 rounded-sm"></div>
                                <div className="h-full bg-primary opacity-30 flex-1 rounded-sm"></div>
                                <div className="h-full bg-primary opacity-30 flex-1 rounded-sm"></div>
                            </div>
                        </div>

                        <Field orientation="horizontal">
                            <Button variant="default" size="lg" className="w-full"><LockKeyholeOpen /> UNLOCK VAULT</Button>
                        </Field>

                        <FieldSeparator />

                        <FieldDescription>
                            Don't have an account?
                            <Link href="/sign-up" className="mx-2">Create an Account</Link>
                        </FieldDescription>
                    </FieldSet>
                </div>
                {/* STACK THE CARDS ON TOP OF EACH OTHER */}
                <div className="w-full flex flex-col items-center justify-center">
                    <PaymentCard />
                </div>
            </div>
            <DotPattern />
        </>
    )
}