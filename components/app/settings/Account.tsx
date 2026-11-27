"use client";

import { Field, FieldDescription, FieldLabel, FieldTitle } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";
import { PasswordInput } from "@/components/PasswordInput";
import { useState, useTransition } from "react";
import { authClient } from "@/utils/auth-client";
import { toast } from "sonner";
import {
    AlertTriangle,
    KeyRound,
    Loader2Icon,
    LogOut,
    Mail,
    ShieldAlert,
    SquareArrowUpRight,
    UserCog,
} from "lucide-react";
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import SignOut from "@/components/app/auth/SignOut";
import { useGetSession } from "@/lib/queries/SessionQueries";
import { CustomLoadingState, SkeletonLoadingState } from "@/components/LoadingStates";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import Link from "next/link";

function ChangeEmail() {
    const session = useGetSession();
    const currentEmail = (session.data?.user?.email as string) ?? "";
    const [draftEmail, setDraftEmail] = useState<string | null>(null);
    const newEmail = draftEmail ?? currentEmail;

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
                        toast.success("Check your email for the email change request code.");
                        setStep("changeEmail");
                    },
                    onError: (error) => {
                        toast.dismiss();
                        toast.error("Internal server error. Please try again.");
                        console.log(error);
                    },
                },
            });
        });
    };

    const changeEmail = async () => {
        startEmailChangeTransition(async () => {
            await authClient.emailOtp.changeEmail({
                newEmail,
                otp: otpValue,
                fetchOptions: {
                    onRequest: () => {
                        toast.loading("Changing your email...");
                    },
                    onSuccess: () => {
                        toast.dismiss();
                        toast.success("Success!");
                    },
                    onError: (error) => {
                        toast.dismiss();
                        toast.error("Internal server error. Please try again.");
                        console.log(error);
                    },
                },
            });
        });
    };

    return (
        <Dialog>
            <DialogTrigger
                render={
                    <Button
                        disabled={!session.data?.user?.emailVerified}
                        variant="outline"
                        className="h-10 px-4 rounded-xl font-semibold cursor-pointer w-full sm:w-auto"
                    >
                        Edit Email
                    </Button>
                }
            />
            <DialogContent className="rounded-2xl">
                {step === "changeRequest" && (
                    <Field>
                        <FieldTitle className="text-base font-bold">Update Email Address</FieldTitle>
                        <FieldDescription>
                            To request an email address change, please enter your new email address below and click &lsquo;Request Email Change&rsquo;.
                        </FieldDescription>
                        <FieldLabel htmlFor="email" className="text-muted-foreground mt-2">
                            Email
                        </FieldLabel>
                        <Input
                            type="email"
                            id="email"
                            autoComplete="off"
                            placeholder="e.g. johndoe@gmail.com"
                            className="h-11 rounded-xl"
                            onChange={(e) => setDraftEmail(e.target.value)}
                            value={newEmail}
                        />
                    </Field>
                )}

                {step === "changeEmail" && (
                    <Field>
                        <FieldTitle className="text-base font-bold">Verify Email Change</FieldTitle>
                        <FieldDescription>
                            Check your email for a confirmation code to update your email address.
                        </FieldDescription>
                        <FieldLabel className="text-muted-foreground mt-2">Enter verification code</FieldLabel>
                        <InputOTP
                            maxLength={6}
                            id="otp-verification"
                            pattern={REGEXP_ONLY_DIGITS}
                            required
                            onChange={(value) => setOtpValue(value)}
                        >
                            <InputOTPGroup className="w-full flex items-center justify-center *:data-[slot=input-otp-slot]:h-14 *:data-[slot=input-otp-slot]:w-full *:data-[slot=input-otp-slot]:text-xl">
                                <InputOTPSlot index={0} />
                                <InputOTPSlot index={1} />
                                <InputOTPSlot index={2} />
                                <InputOTPSlot index={3} />
                                <InputOTPSlot index={4} />
                                <InputOTPSlot index={5} />
                            </InputOTPGroup>
                        </InputOTP>
                    </Field>
                )}

                {step === "changeEmail" && (
                    <Button variant="link" onClick={() => setStep("changeRequest")} className="w-fit px-0">
                        Go Back
                    </Button>
                )}

                <DialogFooter>
                    <DialogClose className={buttonVariants({ variant: "outline", className: "rounded-xl" })}>
                        Cancel
                    </DialogClose>

                    {step === "changeRequest" && (
                        <Button
                            disabled={!newEmail.trim() || newEmail === currentEmail || emailChangeRequestPending}
                            className="rounded-xl"
                            onClick={requestEmailChange}
                        >
                            {emailChangeRequestPending ? (
                                <>
                                    <Loader2Icon className="size-4 animate-spin" />
                                    <span>Sending Request code...</span>
                                </>
                            ) : (
                                <span>Request Email Change</span>
                            )}
                        </Button>
                    )}

                    {step === "changeEmail" && (
                        <Button className="rounded-xl" onClick={changeEmail} disabled={emailChangePending}>
                            {emailChangePending ? (
                                <>
                                    <Loader2Icon className="size-4 animate-spin" />
                                    <span>Updating...</span>
                                </>
                            ) : (
                                <span>Update Email</span>
                            )}
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
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
                        toast.success("Check your email to confirm your deletion request.");
                    },
                    onError: (error) => {
                        toast.dismiss();
                        toast.error("Internal server error. Please try again.");
                        console.log(error);
                    },
                },
            });
        });
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger
                render={
                    <Button variant="destructive" className="cursor-pointer h-10 px-4 rounded-xl font-semibold w-full sm:w-auto">
                        Delete Account
                    </Button>
                }
            />
            <AlertDialogContent className="rounded-2xl">
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete Account</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to delete your account? This action{" "}
                        <span className="underline underline-offset-4 font-semibold text-destructive">cannot be undone</span>.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <div className="flex flex-col gap-3">
                    <p className="text-sm font-semibold">
                        Type <span className="underline underline-offset-4">delete wardpass</span> to confirm.
                    </p>
                    <Input
                        type="text"
                        className="h-11 rounded-xl"
                        placeholder="delete wardpass"
                        onChange={(e) => setDeleteConfirm(e.target.value)}
                    />

                    <p className="text-sm font-semibold mt-1">Type in your master password.</p>
                    <PasswordInput
                        className="h-11 rounded-xl"
                        placeholder="••••••••••••••••••••••••••"
                        onChange={(e) => setPasswordForDeletion(e.target.value)}
                    />
                </div>

                <AlertDialogFooter>
                    <AlertDialogCancel
                        render={
                            <Button className="rounded-xl" variant="outline">
                                Cancel
                            </Button>
                        }
                    />
                    <Button
                        disabled={deleteConfirm !== "delete wardpass" || passwordForDeletion === "" || deletePending}
                        className="rounded-xl"
                        variant="destructive"
                        onClick={deleteAccount}
                    >
                        {deletePending ? (
                            <CustomLoadingState loaderChoice={1} className="size-full flex items-center justify-center gap-2">
                                <span className="shimmer shimmer-duration-1000">Loading...</span>
                            </CustomLoadingState>
                        ) : (
                            <span>Delete Account</span>
                        )}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

export default function Account() {
    const session = useGetSession();

    return (
        <section className="flex flex-col gap-6">
            {/* Account Settings Card */}
            <div className="rounded-2xl border border-border/50 bg-card/50 p-5 sm:p-6 shadow-2xs flex flex-col gap-5">
                <div className="flex items-center gap-3 pb-1">
                    <div className="size-9 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center shrink-0">
                        <UserCog className="size-4" />
                    </div>
                    <div className="flex flex-col">
                        <h2 className="text-base font-bold text-foreground">Account Settings</h2>
                        <p className="text-xs text-muted-foreground">
                            Manage your email address, password, and active session.
                        </p>
                    </div>
                </div>

                <div className="border-t border-border/40" />

                {/* Update Email */}
                {session.isPending ? (
                    <SkeletonLoadingState
                        numberOfSkeletons={2}
                        skeletonClassName="w-full h-11 rounded-xl"
                        wrapperClassName="flex flex-col gap-3"
                    />
                ) : (
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-start gap-3.5">
                            <div className="size-9 rounded-xl bg-blue-500/10 text-blue-500 border border-blue-500/20 flex items-center justify-center shrink-0 mt-0.5">
                                <Mail className="size-4" />
                            </div>
                            <div className="flex flex-col gap-0.5">
                                <span className="text-sm font-semibold text-foreground">Email Address</span>
                                <span className="text-xs text-muted-foreground">
                                    {session.data?.user?.email || "Update your primary email address."}
                                </span>
                            </div>
                        </div>
                        <div className="shrink-0">
                            <ChangeEmail />
                        </div>
                    </div>
                )}

                {/* Unverified Email Banner */}
                {!session.isPending && !session.data?.user?.emailVerified && (
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
                        <div className="flex items-start gap-3">
                            <AlertTriangle className="size-4 text-amber-500 shrink-0 mt-0.5" />
                            <div className="flex flex-col gap-0.5">
                                <span className="text-sm font-semibold text-foreground">Email not verified</span>
                                <span className="text-xs text-muted-foreground">
                                    Please verify your email to unlock all features.
                                </span>
                            </div>
                        </div>
                        <Link
                            href={`/verify-email?email=${session.data?.user?.email ?? ""}`}
                            className={buttonVariants({
                                variant: "outline",
                                size: "sm",
                                className: "rounded-xl gap-1.5 shrink-0",
                            })}
                        >
                            <span>Verify Email</span>
                            <SquareArrowUpRight className="size-3.5" />
                        </Link>
                    </div>
                )}

                <div className="border-t border-border/40" />

                {/* Update Password */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-3.5">
                        <div className="size-9 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5">
                            <KeyRound className="size-4" />
                        </div>
                        <div className="flex flex-col gap-0.5">
                            <span className="text-sm font-semibold text-foreground">Master Password</span>
                            <span className="text-xs text-muted-foreground">
                                Update your account password.
                            </span>
                        </div>
                    </div>
                    <Link
                        href="/reset-password"
                        className={buttonVariants({
                            variant: "outline",
                            className: "h-10 px-4 rounded-xl font-semibold w-full sm:w-auto",
                        })}
                    >
                        Reset Password
                    </Link>
                </div>

                <div className="border-t border-border/40" />

                {/* Sign Out */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-3.5">
                        <div className="size-9 rounded-xl bg-muted/80 text-muted-foreground border border-border/60 flex items-center justify-center shrink-0 mt-0.5">
                            <LogOut className="size-4" />
                        </div>
                        <div className="flex flex-col gap-0.5">
                            <span className="text-sm font-semibold text-foreground">Sign Out</span>
                            <span className="text-xs text-muted-foreground">
                                End your current authenticated session.
                            </span>
                        </div>
                    </div>
                    <div className="shrink-0">
                        <SignOut />
                    </div>
                </div>
            </div>

            {/* Danger Zone Card */}
            <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-5 sm:p-6 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3.5">
                    <div className="size-9 rounded-xl bg-destructive/15 text-destructive border border-destructive/25 flex items-center justify-center shrink-0 mt-0.5">
                        <ShieldAlert className="size-4" />
                    </div>
                    <div className="flex flex-col gap-0.5">
                        <h3 className="text-base font-bold text-destructive">Danger Zone</h3>
                        <p className="text-xs text-muted-foreground">
                            Permanently delete your WardPass account and all encrypted vaults. This action is irreversible.
                        </p>
                    </div>
                </div>
                <div className="shrink-0">
                    <DeleteAccount />
                </div>
            </div>
        </section>
    );
}
