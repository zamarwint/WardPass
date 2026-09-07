"use client";

import { PasswordInput } from "./../_components/PasswordInput";
import { PaymentCard } from "@/app/_components/UICards";
import { Button } from "@/components/ui/button";
import DotPattern from "@/components/ui/dot-pattern";
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldSeparator, FieldSet, FieldTitle } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authClient } from "@/utils/auth-client";
import { LockKeyholeOpen } from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";
import { FaGoogle } from "react-icons/fa";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { EmailDeliveryNotWorkingAlert } from "@/app/_components/Banners";
import { useSignIn } from "@/lib/mutations/AuthMutations";
import { CustomLoadingState } from "@/app/_components/LoadingStates";

export default function SignInPage() {
    const router = useRouter();

    const [googlePending, startGoogleTransition] = useTransition()
    const [emailPending, startEmailTransition] = useTransition()

    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const signInWithGoogle = async () => {
        startGoogleTransition(async () => {
            await authClient.signIn.social({
                provider: "google",
                callbackURL: process.env.NEXT_PUBLIC_APP_URL + "/user/vault",
                fetchOptions: {
                    onRequest: () => {
                        toast.loading("Signing you up with Google...");
                    },
                    onSuccess: () => {
                        toast.dismiss();
                        toast.success("Successfully signed in!")
                        router.push("/user/vault");
                    },
                    onError: (error) => {
                        toast.error("Internal server error. Please try again.")
                        console.log(error);
                    }
                }
            });
        })
    }

    const { mutate, isPending: emailIsPending } = useSignIn(email, password);

    const signInWithEmail = () => {
        startEmailTransition(() => {
            mutate();
        })
    }

    return (
        <>
            <EmailDeliveryNotWorkingAlert />
            <div className="flex items-center justify-center w-screen h-screen z-998">
                {/* SIGN IN CARD */}
                <div className="bg-background w-full h-full flex flex-col items-center justify-center gap-10 border-r border-foreground/5">
                    <Link href="/" className="font-bold text-3xl tracking-tighter text-primary uppercase">WARDPASS</Link>
                    <FieldSet>
                        <FieldTitle className="text-4xl font-bold">Login</FieldTitle>
                        <FieldDescription>Access your secure vault.</FieldDescription>

                        <Field>
                            <FieldTitle className="text-muted-foreground">Continue with Google</FieldTitle>
                            <Button variant="outline" size="lg" disabled={googlePending} onClick={signInWithGoogle} className="h-12">
                                {googlePending ? (
                                    <CustomLoadingState loaderChoice={1} className="size-full flex items-center justify-center gap-2">
                                        <span className="shimmer shimmer-duration-1000"> AUTHENTICATING WITH GOOGLE </span>
                                    </CustomLoadingState>
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
                                <Input type="email" id="email" required placeholder="e.g. john@example.com" className="h-12" onChange={(e) => setEmail(e.target.value)} />
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="master-password" className="text-muted-foreground">Master Password</FieldLabel>
                                <PasswordInput id="master-password" required placeholder="************" className="h-12" onChange={(e) => setPassword(e.target.value)} />
                            </Field>
                        </FieldGroup>

                        <Field orientation="horizontal">
                            <Button disabled={emailPending || emailIsPending} variant="default" size="lg" className="w-full h-12" onClick={signInWithEmail}>
                                {emailPending || emailIsPending ? (
                                    <CustomLoadingState loaderChoice={1} className="size-full flex items-center justify-center gap-2">
                                        <span className="shimmer shimmer-duration-1000"> UNLOCKING WARDPASS </span>
                                    </CustomLoadingState>
                                ) : (
                                    <>
                                        <LockKeyholeOpen /> UNLOCK WARDPASS
                                    </>
                                )}
                            </Button>
                        </Field>

                        <FieldSeparator />

                        <FieldDescription>
                            Forgot your Password?
                            <Button variant="link" onClick={() => router.push('/request-password-reset')}>Reset Password</Button>
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