"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/utils/auth-client";;
import { Loader2Icon, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

export default function SignOut() {
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
        <Button disabled={signOutPending} variant="secondary" size="lg" className="cursor-pointer h-12 w-fit px-10" onClick={signOut}>
            {signOutPending ? (
                <>
                    <Loader2Icon className="size-4 animate-spin" />
                    <span>Signing you out...</span>
                </>
            ) : (
                <>
                    <LogOut size="lg" />
                    <span>Sign out</span>
                </>
            )}
        </Button>
    )
}