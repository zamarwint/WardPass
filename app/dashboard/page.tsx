"use client";

import { motion } from "motion/react";

export default function DashboardPage() {
    return (
        <motion.div className="flex flex-col bg-transparent backdrop-blur-xl fixed px-10 pt-10">
            <motion.div className="flex flex-col gap-6">
                <h1 className="text-2xl md:text-6xl font-bold font-geist text-primary">Dashboard</h1>
                <p className="text-xl text-muted-foreground">Welcome to your dashboard.</p>
            </motion.div>
        </motion.div>
    )
}