"use client";

import PasswordInput from "./../_components/PasswordInput";
import { PaymentCard } from "@/app/_components/ui-cards";
import { Button } from "@/components/ui/button";
import DotPattern from "@/components/ui/dot-pattern";
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldSeparator, FieldSet, FieldTitle } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authClient } from "@/utils/auth-client";
import { Circle, Loader2Icon, LockKeyholeOpen, ShieldPlus } from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";
import { FaGoogle } from "react-icons/fa";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function SignInPage() {
    const router = useRouter();
    const [googlePending, startGoogleTransition] = useTransition()
    const [emailPending, startEmailTransition] = useTransition()
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const signInWithGoogle = async () => {
        startGoogleTransition(async () => {
            await authClient.signIn.social({
                provider: "google",
                callbackURL: "/user/vault",
                fetchOptions: {
                    onRequest: () => {
                        toast.loading("Signing you up with Google...");
                    },
                    onSuccess: () => {
                        toast.dismiss();
                        toast.success("Successfully signed in!")
                        router.push("/user/vault"); // CALLBACK URL WILL ONLY WORK IF THE USER VERIFIES THEIR EMAIL, TODO ADD EMAIL VERIFICATION.
                    },
                    onError: (error) => {
                        toast.error("Internal server error. Please try again.")
                        console.log(error);
                    }
                }
            });
        })
    }

    const signInWithEmail = async () => {
        startEmailTransition(async () => {
            await authClient.signIn.email({
                /**
                 * The user email
                 */
                email,
                /**
                 * The user password
                 */
                password,
                /**
                 * A URL to redirect to after the user verifies their email (optional)
                 */
                callbackURL: process.env.NEXT_PUBLIC_APP_URL + '/user/vault',
                /**
                 * remember the user session after the browser is closed. 
                 * @default true
                 */
                rememberMe: false
            }, {
                onRequest: (ctx) => {
                    toast.loading("Signing you in...");
                },
                onSuccess: (ctx) => {
                    //redirect to the dashboard or sign in page
                    toast.dismiss();
                    toast.success("Success!");
                },
                onError: (ctx) => {
                    // display the error message
                    toast.dismiss();
                    toast.error(ctx.error.message);
                },
            })
        })
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
                            <Button variant="outline" size="lg" disabled={googlePending} onClick={signInWithGoogle}>
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
                                <Input type="email" id="email" autoComplete="off" placeholder="e.g. johndoe@matrix.com" className="h-12" onChange={(e) => setEmail(e.target.value)} />
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="password" className="text-muted-foreground">Password</FieldLabel>
                                <PasswordInput id="password" autoComplete="off" placeholder="************" className="h-12" onChange={(e) => setPassword(e.target.value)} />
                            </Field>
                        </FieldGroup>

                        <Field orientation="horizontal">
                            <Button disabled={emailPending} variant="default" size="lg" className="w-full" onClick={signInWithEmail}>
                                {emailPending ? (
                                    <>
                                        <Loader2Icon className="size-4 animate-spin" />
                                        <span>Loading...</span>
                                    </>
                                ) : (
                                    <>
                                        <LockKeyholeOpen /> UNLOCK VAULT
                                    </>
                                )}
                            </Button>
                        </Field>

                        <FieldSeparator />

                        <FieldDescription>
                            Don't have an account?
                            <Link href="/sign-up" className="mx-2">Create an Account</Link>
                        </FieldDescription>
                    </FieldSet>
                </div>
                {/* ONE CARD */}
                <div className="w-full flex flex-col items-center justify-center">
                    <PaymentCard />
                </div>
            </div>
            <DotPattern />
        </>
    )
}