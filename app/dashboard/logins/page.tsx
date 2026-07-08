"use client";

import { motion } from "motion/react";

export default function LoginsPage() {
    return (
        <motion.div className="py-10 px-15 mx-auto flex flex-col gap-10 items-start justify-start h-screen w-full">
            <motion.div className="flex flex-col gap-6">
                <h1 className="text-2xl md:text-6xl font-bold font-geist text-primary">Logins</h1>
                <p className="text-xl text-muted-foreground">Manage your logins.</p>
            </motion.div>
        </motion.div>
    )
}