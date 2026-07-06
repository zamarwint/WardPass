"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { vaults } from "@/lib/data/dummyData";
import { Button } from "@/components/ui/button";
import { Loader2Icon, PlusIcon } from "lucide-react";
import { authClient } from "@/utils/auth-client";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

export default function Sidebar() {
    const router = useRouter();
    const [signOutPending, startSignOutTransition] = useTransition();

    const signOut = async () => {
        startSignOutTransition(async () => {
            await authClient.signOut({
                fetchOptions: {
                    onRequest: (ctx) => {
                        toast.loading("Signing you out...");
                    },
                    onSuccess: (ctx) => {
                        toast.dismiss();
                        toast.success("Signed out successfully. Redirecting...");
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
        <motion.div
            initial={{ x: -200 }}
            animate={{ x: 0 }}
            transition={{ duration: 0.5 }}
            className="h-screen px-4 py-8 bg-card w-fit flex flex-col gap-20 justify-between"
        >
            <Link className="font-bold text-3xl tracking-tighter text-primary uppercase px-10" href="/dashboard">WardPass</Link>
            <div className="w-full flex flex-col gap-2 h-full">
                <Button variant="ghost" size="lg" className="w-full flex justify-between">
                    <h1 className="font-bold text-lg">Vaults</h1>
                    <PlusIcon />
                </Button>
                {vaults.map((vault, index) => (
                    <Button key={index} variant="ghost" size="lg" className="w-full flex justify-start">
                        <vault.icon />
                        {vault.name}
                    </Button>
                ))}
            </div>
            <Button disabled={signOutPending} variant="default" size="lg" className="w-full text-center" onClick={signOut}>
                {signOutPending ? (
                    <>
                        <Loader2Icon className="size-4 animate-spin" />
                        <span>Loading...</span>
                    </>
                ) : (
                    <>
                        Sign Out
                    </>
                )}
            </Button>
        </motion.div>
    )
}