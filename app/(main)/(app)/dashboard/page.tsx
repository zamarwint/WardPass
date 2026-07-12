"use client";

import { motion } from "motion/react";
import { useQuery } from "@tanstack/react-query";
import { getUserSession } from "@/app/actions/getSession";
import { toast } from "sonner";

export default function DashboardPage() {
    const { isPending, data, error } = useQuery({
        queryKey: ["getSession2"],
        queryFn: async () => await getUserSession()
    })

    error && toast.error("There was an error loading your profile. Please try refreshing the page.");

    return (
        <motion.div className="flex flex-col bg-transparent backdrop-blur-xl fixed px-10 pt-10">
            <motion.div className="flex flex-col gap-6">
                <h1 className="text-2xl md:text-6xl font-bold font-geist text-primary">
                    {isPending ? (
                        <span className="text-muted">Loading...</span>
                    ) : (
                        <span>Welcome {data?.user.name}!</span>
                    )}
                </h1>
                <p className="text-xl text-muted-foreground">Here is your dashboard.</p>
            </motion.div>
        </motion.div>
    )
}