"use client";

import { authClient } from "@/utils/auth-client";
import { motion } from "motion/react";

export default function DashboardPage() {
    const session = authClient.useSession.get();
    return (
        <motion.div className="flex flex-col bg-transparent backdrop-blur-xl fixed px-10 pt-10">
            <motion.div className="flex flex-col gap-6">
                <h1 className="text-2xl md:text-6xl font-bold font-geist text-primary">Welcome {session.data?.user.name}!</h1>
                <p className="text-xl text-muted-foreground">Here is your dashboard.</p>
            </motion.div>
        </motion.div>
    )
}