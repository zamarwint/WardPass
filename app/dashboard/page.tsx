"use client";

import { motion } from "motion/react";

export default function DashboardPage() {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="h-screen px-4"
        >
            <h1>Dashboard</h1>
        </motion.div>
    )
}