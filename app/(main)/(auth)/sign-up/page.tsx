"use client";

import { PaymentCard, WebsiteCredentialCard } from "@/app/_components/ui-cards";
import { Button } from "@/components/ui/button";
import { DotPattern } from "@/components/ui/dot-pattern";
import { Field, FieldGroup, FieldLabel, FieldLegend, FieldSeparator, FieldSet, FieldTitle } from "@/components/ui/field";
import { FieldDescription } from "@/components/ui/field"
import { Input } from "@/components/ui/input";
import { CheckCircle, CheckCircleIcon, Circle, Loader2Icon, ShieldPlus } from "lucide-react";
import { FaGoogle } from "react-icons/fa";
import Link from "next/link";
import { authClient } from "@/utils/auth-client";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import PasswordInput from "./../_components/PasswordInput";
import { useRouter } from "next/navigation";

import { passwordStrength } from 'check-password-strength';
import PasswordStrengthBar from "@/app/_components/PasswordStrengthBar";

export default function SignUpPage() {
    const [emailPending, startEmailTransition] = useTransition();
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [checkStrength, setCheckStrength] = useState("");
    const router = useRouter();

    useEffect(() => {
        const strength = passwordStrength(password).value;
        setCheckStrength(strength);
    }, [password])
    // Returns: 'Too weak', 'Weak', 'Medium', or 'Strong'   

    const signUpWithEmail = async () => {
        startEmailTransition(async () => {
            await authClient.signUp.email({
                email, // user email address
                password, // user password -> min 8 characters by default
                name: fullName, // user display name
                callbackURL: process.env.NEXT_PUBLIC_APP_URL + '/dashboard' // A URL to redirect to after the user verifies their email (optional)
            }, {
                onRequest: (ctx) => {
                    toast.loading("Signing you up...");
                },
                onSuccess: (ctx) => {
                    //redirect to the dashboard or sign in page
                    toast.dismiss();
                    toast.success("Success! Check your email to verify your account." + ctx.data);
                    router.push("/verify-email");
                },
                onError: (ctx) => {
                    // display the error message
                    toast.dismiss();
                    toast.error(ctx.error.message);
                },

            });
            localStorage.setItem("currentUserEmail", email);
        })
    }

    return (
        <>
            <div className="flex items-center justify-center w-screen h-screen z-999">
                {/* SIGN UP CARD */}
                <div className="bg-background w-full h-full flex flex-col items-center justify-center gap-5 border-r border-foreground/5">
                    <Link href="/" className="font-bold text-3xl tracking-tighter text-primary uppercase">WARDPASS</Link>
                    <FieldSet>
                        <FieldTitle className="text-4xl text-primary font-bold">Sign Up</FieldTitle>
                        <FieldDescription>Create an account for a vault. <span className="font-bold">OAuth</span> is <span className="font-bold underline">NOT</span> supported on the Sign Up page.</FieldDescription>

                        <FieldGroup className="w-xl">
                            <Field>
                                <FieldLabel htmlFor="name" className="text-muted-foreground">Full Name</FieldLabel>
                                <Input type="text" id="name" autoComplete="off" placeholder="e.g. John Doe" className="h-12" onChange={(e) => setFullName(e.target.value)} />
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="email" className="text-muted-foreground">Email</FieldLabel>
                                <Input type="email" id="email" autoComplete="off" placeholder="e.g. johndoe@matrix.com" className="h-12" onChange={(e) => setEmail(e.target.value)} />
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="password" className="text-muted-foreground">Password</FieldLabel>
                                <PasswordInput id="password" autoComplete="off" placeholder="************" className="h-12" onChange={(e) => setPassword(e.target.value)} />
                            </Field>
                        </FieldGroup>

                        {/* Security Checklist */}
                        <span className="text-left">
                            {checkStrength}
                            <PasswordStrengthBar strength={checkStrength} />
                        </span>

                        <Field orientation="horizontal">
                            <Button disabled={emailPending} variant="default" size="lg" className="w-full" onClick={signUpWithEmail}>
                                {emailPending ? (
                                    <>
                                        <Loader2Icon className="size-4 animate-spin" />
                                        <span>Loading...</span>
                                    </>
                                ) : (
                                    <>
                                        <ShieldPlus /> INITIALIZE VAULT
                                    </>
                                )}
                            </Button>
                        </Field>

                        <FieldSeparator />

                        <FieldDescription>
                            Already have an account?
                            <Link href="/sign-in" className="mx-2">LOGIN</Link>
                        </FieldDescription>
                    </FieldSet>
                </div>
                {/* STACK THE CARDS ON TOP OF EACH OTHER */}
                <div className="w-full flex flex-col items-center justify-center">
                    <div className="z-998 rotate-13 -translate-y-8"><PaymentCard withoutHeader={true} /></div>
                    <div className="z-999 -rotate-13 translate-y-1"><WebsiteCredentialCard withoutHeader={true} /></div>
                </div>
            </div>
            <DotPattern />
        </>
    )
}