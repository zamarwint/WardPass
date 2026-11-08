"use client";

import { Button } from "@/components/ui/button";
import { Loader2Icon, LogOut } from "lucide-react";
import { useTransition } from "react";
import { useSignOut } from "@/lib/mutations/AuthMutations";

export default function SignOut() {
    const signOutMutation = useSignOut();
    const [signOutPending, startSignOutTransition] = useTransition();

    const signOut = async () => {
        startSignOutTransition(async () => {
            signOutMutation.mutate();
        })
    }

    return (
        <Button disabled={signOutPending || signOutMutation.isPending} variant="secondary" size="lg" className="cursor-pointer h-12 w-fit px-10" onClick={signOut}>
            {signOutPending || signOutMutation.isPending ? (
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