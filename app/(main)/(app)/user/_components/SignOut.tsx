"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/utils/auth-client";;
import { Loader2Icon, LockKeyhole } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

export default function SignOut({ buttonText }: { buttonText: string }) {
    const [signOutPending, startSignOutTransition] = useTransition();
    const router = useRouter();

    const signOut = async () => {
        startSignOutTransition(async () => {
            await authClient.signOut({
                fetchOptions: {
                    onRequest: () => {
                        toast.loading("Signing you out...");
                    },
                    onSuccess: () => {
                        toast.dismiss();
                        toast.success("Signed out successfully.");
                        router.push("/sign-in"); // redirect to login page
                    },
                    onError: (ctx) => {
                        toast.error("Sign out failed. Internal server error. " + ctx.error.message);
                    }
                },
            });
        })
    }

    return (
        <Button disabled={signOutPending} variant="ghost" size="lg" className="w-full flex justify-start" onClick={signOut}>
            {signOutPending ? (
                <>
                    <Loader2Icon className="size-4 animate-spin" />
                    <span>Loading...</span>
                </>
            ) : (
                <>
                    <LockKeyhole size="lg" />
                    <span>{buttonText}</span>
                </>
            )}
        </Button>
    )
}