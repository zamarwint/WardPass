"use client";

import { Field, FieldDescription, FieldGroup, FieldLabel, FieldSeparator, FieldTitle } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";
import { PasswordInput } from "@/components/PasswordInput";
import { useState, useTransition } from "react";
import { authClient } from "@/utils/auth-client";
import { toast } from "sonner";
import { Loader2Icon, SquareArrowUpRight } from "lucide-react";

import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogCancel
} from "@/components/ui/alert-dialog"
import SignOut from "@/components/app/auth/SignOut";
import { useGetSession } from "@/lib/queries/SessionQueries";
import { useRouter } from "next/navigation";
import { CustomLoadingState, SkeletonLoadingState } from "@/components/LoadingStates";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import Link from "next/link";

function ChangeEmail() {
    const session = useGetSession();
    const [newEmail, setNewEmail] = useState(session.data?.user.email as string)
    const [emailChangeRequestPending, startEmailChangeRequestTransition] = useTransition();
    const [emailChangePending, startEmailChangeTransition] = useTransition();

    const [step, setStep] = useState<"changeRequest" | "changeEmail">("changeRequest");
    const [otpValue, setOtpValue] = useState<string>("");

    const requestEmailChange = () => {
        startEmailChangeRequestTransition(async () => {
            await authClient.emailOtp.requestEmailChange({
                newEmail: newEmail,
                fetchOptions: {
                    onRequest: () => {
                        toast.loading("Sending email change request code...");
                    },
                    onSuccess: () => {
                        toast.dismiss();
                        toast.success("Check your email for the email change request code.")
                        setStep('changeEmail');
                    },
                    onError: (error) => {
                        toast.dismiss();
                        toast.error("Internal server error. Please try again.")
                        console.log(error);
                    }
                }
            });
        })
    }

    const changeEmail = async () => {
        startEmailChangeTransition(async () => {
            await authClient.emailOtp.changeEmail({
                newEmail, // required, New email address to change to.
                otp: otpValue, // required, OTP sent to the new email.
                fetchOptions: {
                    onRequest: () => {
                        toast.loading("Changing your email...");
                    },
                    onSuccess: () => {
                        toast.dismiss();
                        toast.success("Success!")
                    },
                    onError: (error) => {
                        toast.dismiss();
                        toast.error("Internal server error. Please try again.")
                        console.log(error);
                    }
                }
            });
        })
    }

    return (
        <Dialog>
            <DialogTrigger render={
                <Button disabled={!session.data?.user?.emailVerified} className="h-12 w-fit px-10" size="lg">Edit Email</Button>
            } />
            <DialogContent>
                {step === "changeRequest" && <Field>
                    <FieldTitle className="text-sm">Update Email Address</FieldTitle>
                    <FieldDescription>To request an email address change, please enter your new email address in the field below and click the &lsquo;Request Email Change&rsquo; button.</FieldDescription>
                    <FieldLabel htmlFor="email" className="text-muted-foreground mt-2">Email</FieldLabel>
                    <Input type="email" id="email" autoComplete="off" placeholder="e.g. johndoe@gmail.com" className="h-12" onChange={(e) => setNewEmail(e.target.value)} value={newEmail} />
                </Field>}

                {step === "changeEmail" && <Field>
                    <FieldTitle className="text-sm">Update Email Address</FieldTitle>
                    <FieldDescription>Check your email for a confirmation code to update your email address.</FieldDescription>
                    <FieldLabel className="text-muted-foreground mt-2">Enter verification code</FieldLabel>
                    <InputOTP maxLength={6} id="otp-verification" pattern={REGEXP_ONLY_DIGITS} required onChange={(value) => setOtpValue(value)}>
                        <InputOTPGroup className="w-full flex items-center justify-center *:data-[slot=input-otp-slot]:h-14 *:data-[slot=input-otp-slot]:w-full *:data-[slot=input-otp-slot]:text-xl">
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                        </InputOTPGroup>
                    </InputOTP>
                </Field>}

                {step === "changeEmail" && <Button variant="link" onClick={() => setStep('changeRequest')}>Go Back</Button>}
                <DialogFooter>
                    <DialogClose>Cancel</DialogClose>

                    {step === "changeRequest" && <Button disabled={newEmail === session.data?.user.email} className="w-fit" size="lg" onClick={requestEmailChange}>
                        {emailChangeRequestPending ? (
                            <>
                                <Loader2Icon className="size-4 animate-spin" />
                                <span>Sending Request code...</span>
                            </>
                        ) : (
                            <>
                                <span>Request Email Change</span>
                            </>
                        )}
                    </Button>}

                    {step === "changeEmail" && <Button className="w-fit" size="lg" onClick={changeEmail}>
                        {emailChangePending ? (
                            <>
                                <Loader2Icon className="size-4 animate-spin" />
                                <span>Updating...</span>
                            </>
                        ) : (
                            <>
                                <span>Update Email</span>
                            </>
                        )}
                    </Button>}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

function DeleteAccount() {
    const [passwordForDeletion, setPasswordForDeletion] = useState("");
    const [deleteConfirm, setDeleteConfirm] = useState("");
    const [deletePending, startDeleteTransition] = useTransition();

    const deleteAccount = () => {
        startDeleteTransition(async () => {
            await authClient.deleteUser({
                password: passwordForDeletion,
                fetchOptions: {
                    onRequest: () => {
                        toast.loading("Deleting your account...");
                    },
                    onSuccess: () => {
                        toast.dismiss();
                        toast.success("Check your email to confirm your deletion request.")
                    },
                    onError: (error) => {
                        toast.dismiss();
                        toast.error("Internal server error. Please try again.")
                        console.log(error);
                    }
                }
            })
        })
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger render={
                <Button variant="destructive" className="cursor-pointer h-12 w-fit px-10">Delete Account</Button>
            }>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete Account</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to delete account? This action <span className="underline underline-offset-4 font-semibold text-destructive">cannot be undone</span>.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <div className="flex flex-col gap-4">
                    <h1 className="font-semibold">Type <span className="underline underline-offset-4">delete wardpass</span> to confirm.</h1>
                    <Input type="text" className="h-12" placeholder="delete wardpass" onChange={(e) => setDeleteConfirm(e.target.value)} />

                    <h1 className="font-semibold">Type in your master password.</h1>
                    <PasswordInput className="h-12" placeholder="••••••••••••••••••••••••••" onChange={(e) => setPasswordForDeletion(e.target.value)} />
                </div>

                <AlertDialogFooter>
                    <AlertDialogCancel render={
                        <Button className="w-fit px-8" size="lg" variant="secondary">Cancel</Button>
                    }>
                    </AlertDialogCancel>
                    <Button disabled={deleteConfirm !== "delete wardpass" || passwordForDeletion === "" || deletePending} className="w-fit px-8" size='lg' variant="destructive" onClick={deleteAccount}>
                        {deletePending ? (
                            <CustomLoadingState loaderChoice={1} className="size-full flex items-center justify-center gap-2">
                                <span className="shimmer shimmer-duration-1000"> Loading... </span>
                            </CustomLoadingState>
                        ) : (
                            <span>Delete Account</span>
                        )}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default function Account() {
    const session = useGetSession();
    console.log(session.data?.session.userAgent);

    const router = useRouter();

    return (
        <div className="flex flex-col gap-10 items-start justify-start pt-5 px-10 py-5">
            <Field className="flex flex-col gap-5">
                <FieldGroup>
                    <Field>
                        <FieldLabel className="text-2xl">Account Settings</FieldLabel>
                        <FieldDescription>Update your account information and preferences.</FieldDescription>
                    </Field>
                    <FieldSeparator />

                    {session.isPending ? (
                        <SkeletonLoadingState numberOfSkeletons={5} skeletonClassName="w-full max-w-sm h-12" wrapperClassName="flex flex-col gap-5" />
                    ) : (
                        <FieldGroup className="flex flex-row items-center justify-center">
                            <Field>
                                <FieldTitle className="text-xl">Update Email Address</FieldTitle>
                                <FieldDescription>
                                    Update your email address.
                                </FieldDescription>
                            </Field>
                            <Field className="w-fit">
                                <ChangeEmail />
                            </Field>
                        </FieldGroup>
                    )}
                </FieldGroup>

                {!session.data?.user?.emailVerified && <FieldSeparator />}

                {!session.data?.user?.emailVerified && <FieldGroup className="flex flex-row items-center justify-center">
                    <Field>
                        <FieldTitle className="text-sm text-destructive">Email not verified</FieldTitle>
                        <FieldDescription>Please verify your email to continue using the application.</FieldDescription>
                    </Field>
                    <Field className="w-fit">
                        <Link href={`/verify-email?email=${session.data?.user.email}`} className={buttonVariants({ variant: "link" })}>
                            <SquareArrowUpRight />
                            <span>Verify Email</span>
                        </Link>
                    </Field>
                </FieldGroup>}

                <FieldSeparator />
                <FieldGroup>
                    <FieldTitle className="text-xl">Change Password</FieldTitle>
                    <FieldDescription>
                        To change your password, please go to the <span className="btn-link cursor-pointer font-bold" onClick={() => router.push('/reset-password')}>Reset Password</span> page.
                    </FieldDescription>
                    <FieldDescription>
                        NB: If you are signed in with Google, our OAuth provider, you do not have a <span className="font-bold">password</span>. If you wish to delete your account, you will need a password. If you are having difficulties creating a password when signed in with Google, please contact support.<br />
                    </FieldDescription>
                </FieldGroup>

                <FieldSeparator />
                <FieldGroup className="flex flex-row items-center justify-center">
                    <Field>
                        <FieldLabel className="text-xl text-foreground">Sign out</FieldLabel>
                        <FieldDescription>Sign out of this session.</FieldDescription>
                    </Field>
                    <Field className="w-fit">
                        <SignOut />
                    </Field>
                </FieldGroup>

                <FieldSeparator />
                <FieldGroup className="flex flex-row items-center justify-center">
                    <Field>
                        <FieldLabel className="text-xl">Danger Zone</FieldLabel>
                        <FieldDescription>This section contains actions that are irreversible.</FieldDescription>
                    </Field>
                    <Field className="w-fit">
                        <DeleteAccount />
                    </Field>
                </FieldGroup>
            </Field>
        </div>
    )
}