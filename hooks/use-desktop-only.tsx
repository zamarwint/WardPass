"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DesktopOnly() {
    const router = useRouter();
    return (
        <div className="lg:hidden flex flex-col gap-8 items-center justify-center w-full h-full text-center px-8">
            <h1 className="text-4xl font-bold">Desktop-First Security</h1>
            <p className="text-muted-foreground">WardPass is optimized only for desktop environments to ensure maximum precision and security. To use WardPass, please access this site on a desktop computer.</p>
            <div className="flex flex-col gap-2">
                <Button variant="default" size="lg" onClick={() => router.push("/")}>
                    <ArrowLeft />
                    <span>Back to Landing Page</span>
                </Button>
            </div>
        </div>
    )
}