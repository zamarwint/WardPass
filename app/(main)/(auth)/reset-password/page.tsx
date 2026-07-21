"use client";

import { FieldDescription, FieldGroup, FieldLabel, FieldSet, FieldTitle } from "@/components/ui/field";
import { PasswordInput } from "../_components/PasswordInput";
import { Button } from "@/components/ui/button";
import { useState, useTransition } from "react";
import { Loader2Icon } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/utils/auth-client";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
    const router = useRouter();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [resetPasswordPending, startResetPasswordTransition] = useTransition();
    const token = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get("token") : null;

    const handleResetPassword = () => {
        console.log("Reset Password:", password, confirmPassword, token);
        if (!token) {
            toast.error("Token not found");
            return;
        }

        startResetPasswordTransition(async () => {
            authClient.resetPassword({
                newPassword: password,
                token,
                fetchOptions: {
                    onRequest: () => {
                        toast.loading("Resetting your password...");
                    },
                    onSuccess: () => {
                        toast.dismiss();
                        toast.success("Password reset successfully!");
                        router.push("/login");
                    },
                    onError: () => {
                        toast.dismiss();
                        toast.error("Failed to reset password");
                    }
                }
            })
        })
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen w-screen">
            <FieldSet className="w-xl">
                <FieldTitle className="text-4xl font-bold">Reset Your Password</FieldTitle>
                <FieldDescription>Enter your new password.</FieldDescription>
                <FieldGroup className="py-10">
                    <FieldLabel htmlFor="password">New Password</FieldLabel>
                    <PasswordInput id="password" required placeholder="************" className="h-12" onChange={(e) => setPassword(e.target.value)} />

                    <FieldLabel htmlFor="confirm-password">Confirm New Password</FieldLabel>
                    <PasswordInput id="confirm-password" required placeholder="************" className="h-12" onChange={(e) => setConfirmPassword(e.target.value)} autoComplete="off" />
                </FieldGroup>

                <Button disabled={!password || !confirmPassword || password !== confirmPassword || resetPasswordPending} variant="default" size="lg" onClick={handleResetPassword} className="py-6">
                    {resetPasswordPending ? (
                        <>
                            <Loader2Icon className="size-4 animate-spin" />
                            <span>Loading...</span>
                        </>
                    ) : (
                        <span>Reset Password</span>
                    )}
                </Button>
            </FieldSet>
        </div>
    )
}