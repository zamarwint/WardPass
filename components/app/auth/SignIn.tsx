"use client";

import { PasswordInput } from "@/components/PasswordInput";
import { PaymentCard } from "@/components/UICards";
import { Button } from "@/components/ui/button";
import { DotPattern } from "@/components/ui/dot-pattern";
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldSeparator, FieldSet, FieldTitle } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { LockKeyholeOpen } from "lucide-react";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { EmailDeliveryNotWorkingAlert } from "@/components/Banners";
import { useSignIn } from "@/lib/mutations/AuthMutations";
import { CustomLoadingState } from "@/components/LoadingStates";

export default function SignIn() {
    const router = useRouter();

    const [emailPending, startEmailTransition] = useTransition()
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const emailSignIn = useSignIn(email, password);

    const signInWithEmail = () => {
        startEmailTransition(() => {
            emailSignIn.mutate();
        })
    }

    return (
        <>
            <EmailDeliveryNotWorkingAlert />
            <div className="flex items-center justify-center w-screen h-screen z-998">
                {/* SIGN IN CARD */}
                <div className="bg-background w-full h-full flex flex-col items-center justify-center gap-10 border-r border-foreground/5">
                    <FieldSet>
                        <FieldTitle className="text-4xl font-bold">Login</FieldTitle>
                        <FieldDescription>Access vaults in your strongroom.</FieldDescription>

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
                            <Button disabled={emailPending || emailSignIn.isPending} variant="default" size="lg" className="w-full h-12" onClick={signInWithEmail}>
                                {emailPending || emailSignIn.isPending ? (
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