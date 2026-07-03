"use client";

import { Button } from "@/components/ui/button";
import { TriangleAlert } from "lucide-react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";

export default function NotFoundPage() {
    const router = useRouter();
    return (
        <motion.div className="flex flex-col w-screen h-screen items-center justify-center gap-4 font-geist text-center">
            <TriangleAlert size={128} color="#FFFF00" />
            <h1 className="text-4xl md:text-8xl font-geist font-bold text-primary">404</h1>
            <p className="text-muted-foreground">Page Not Found</p>
            <div className="w-full flex items-center justify-center">
                <svg height="20" width="2000" xmlns="http://www.w3.org/2000/svg">
                    <line
                        x1="0"
                        y1="10"
                        x2="2000"
                        y2="10"
                        className="stroke-1 stroke-white/5"
                    />
                </svg>
            </div>
            <p className="text-muted-foreground">We're sorry, the page you requested could not be found. Please go back to the homepage.</p>
            <Button variant="default" size="lg" className="px-8 py-6 font-geist" onClick={() => router.push("/")}>Back to Homepage</Button>
        </motion.div>
    )
}