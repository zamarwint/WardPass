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
import { useState, useTransition } from "react";
import { toast } from "sonner";
import PasswordInput from "@/app/(auth)/_components/PasswordInput";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
    const [emailPending, startEmailTransition] = useTransition();
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    const signUpWithEmail = async () => {
        startEmailTransition(async () => {
            const { data, error } = await authClient.signUp.email({
                email, // user email address
                password, // user password -> min 8 characters by default
                name: fullName, // user display name
                callbackURL: "/dashboard" // A URL to redirect to after the user verifies their email (optional)
            }, {
                onRequest: (ctx) => {
                    toast.loading("Signing you up...");
                },
                onSuccess: (ctx) => {
                    //redirect to the dashboard or sign in page
                    toast.dismiss();
                    toast.success("Account created successfully. Redirecting to dashboard... " + ctx.data);
                    router.push("/dashboard"); // CALLBACK URL WILL ONLY WORK IF THE USER VERIFIES THEIR EMAIL, TODO ADD EMAIL VERIFICATION.
                },
                onError: (ctx) => {
                    // display the error message
                    toast.dismiss();
                    toast.error(ctx.error.message);
                },

            });
            console.log(data, error);
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
                        <div className="bg-card p-4 rounded border border-black/10 dark:border-white/10 space-y-3">
                            <h4 className="font-bold uppercase tracking-wider mb-2">Security Requirements</h4>
                            <ul className="space-y-2 font-mono text-sm">
                                <li className="flex items-center gap-2">
                                    <span className="text-[16px]" data-icon="check_circle">{/* <CheckCircleIcon /> */} <Circle /></span>
                                    12+ Characters Length
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="text-[16px]" data-icon="radio_button_unchecked"><Circle /> </span>
                                    Contains Uppercase Letter
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="text-[16px]" data-icon="radio_button_unchecked"><Circle /></span>
                                    Contains Number &amp; Symbol
                                </li>
                            </ul>

                            {/* Trust Bar Indicator */}
                            <div className="mt-4 pt-3 border-t border-black/10 dark:border-white/10 flex gap-1 h-1.5">
                                <div className="flex-1 size-2 bg-primary rounded-l-sm"></div>
                                <div className="flex-1 size-2 bg-neutral-300 dark:bg-neutral-600"></div>
                                <div className="flex-1 size-2 bg-neutral-300 dark:bg-neutral-600"></div>
                                <div className="flex-1 size-2 bg-neutral-300 dark:bg-neutral-600 rounded-r-sm"></div>
                            </div>
                            <p className="text-right text-[10px] mt-1">STRENGTH: WEAK</p>
                        </div>

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