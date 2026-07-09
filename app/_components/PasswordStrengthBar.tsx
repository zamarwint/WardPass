"use client";

import { motion } from "motion/react";

export default function PasswordStrengthBar({ strength }: { strength: string }) {
    return (
        <motion.div className="pt-2 pb-4">
            {/* Password Strength Bar (Decorative) */}
            <motion.div className="flex gap-1 h-1.5 w-full">
                {strength.toLowerCase() === 'too weak' ? (
                    <>
                        <motion.div className="h-full bg-destructive flex-1 rounded-sm"></motion.div>
                        <motion.div className="h-full bg-destructive opacity-30 flex-1 rounded-sm"></motion.div>
                        <motion.div className="h-full bg-destructive opacity-30 flex-1 rounded-sm"></motion.div>
                        <motion.div className="h-full bg-destructive opacity-30 flex-1 rounded-sm"></motion.div>
                        <motion.div className="h-full bg-destructive opacity-30 flex-1 rounded-sm"></motion.div>
                    </>
                ) : strength.toLowerCase() === 'weak' ? (
                    <>
                        <motion.div className="h-full bg-orange-600 flex-1 rounded-sm"></motion.div>
                        <motion.div className="h-full bg-orange-600 flex-1 rounded-sm"></motion.div>
                        <motion.div className="h-full bg-orange-600 flex-1 rounded-sm"></motion.div>
                        <motion.div className="h-full bg-orange-600 opacity-30 flex-1 rounded-sm"></motion.div>
                        <motion.div className="h-full bg-orange-600 opacity-30 flex-1 rounded-sm"></motion.div>
                    </>

                ) : strength.toLowerCase() === 'medium' ? (
                    <>
                        <motion.div className="h-full bg-yellow-600 flex-1 rounded-sm"></motion.div>
                        <motion.div className="h-full bg-yellow-600 flex-1 rounded-sm"></motion.div>
                        <motion.div className="h-full bg-yellow-600 flex-1 rounded-sm"></motion.div>
                        <motion.div className="h-full bg-yellow-600 opacity-30 flex-1 rounded-sm"></motion.div>
                        <motion.div className="h-full bg-yellow-600 opacity-30 flex-1 rounded-sm"></motion.div>
                    </>
                ) : strength.toLowerCase() === 'strong' ? (
                    <>
                        <motion.div className="h-full bg-green-600 flex-1 rounded-sm"></motion.div>
                        <motion.div className="h-full bg-green-600 flex-1 rounded-sm"></motion.div>
                        <motion.div className="h-full bg-green-600 flex-1 rounded-sm"></motion.div>
                        <motion.div className="h-full bg-green-600 flex-1 rounded-sm"></motion.div>
                        <motion.div className="h-full bg-green-600 flex-1 rounded-sm"></motion.div>
                    </>
                ) : (
                    <>
                        <motion.div className="h-full bg-primary flex-1 rounded-sm"></motion.div>
                        <motion.div className="h-full bg-primary flex-1 rounded-sm"></motion.div>
                        <motion.div className="h-full bg-primary flex-1 rounded-sm"></motion.div>
                        <motion.div className="h-full bg-primary flex-1 rounded-sm"></motion.div>
                        <motion.div className="h-full bg-primary flex-1 rounded-sm"></motion.div>
                    </>
                )}
            </motion.div>
        </motion.div>
    )
}