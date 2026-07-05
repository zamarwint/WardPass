"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { vaults } from "@/lib/data/dummyData";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";

export default function Sidebar() {
    return (
        <motion.div
            initial={{ x: -200 }}
            animate={{ x: 0 }}
            transition={{ duration: 0.5 }}
            className="h-screen px-4 py-8 bg-card w-fit flex flex-col gap-20"
        >
            <Link className="font-bold text-3xl tracking-tighter text-primary uppercase px-10" href="/dashboard">WardPass</Link>
            <div className="w-full flex flex-col gap-2">
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
        </motion.div>
    )
}