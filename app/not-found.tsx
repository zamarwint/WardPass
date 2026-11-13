import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { MoveLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "404 Not Found | WardPass",
    description:
        "WardPass is an open-source, zero-knowledge credential and secrets management platform with client-side Argon2id key derivation and AES-256-GCM authenticated encryption.",
};

export default function NotFoundPage() {
    return (
        <div className="w-screen h-screen flex items-center justify-center">
            <div className="flex flex-col w-[80%] h-screen border-x border-border items-center justify-center gap-4 text-center">
                <h1 className="text-primary text-2xl font-bold">404</h1>
                <h1 className="text-4xl md:text-8xl font-bold">Page Not Found</h1>
                <p className="text-muted-foreground">We are sorry, the page you requested could not be found. Please go back to the homepage.</p>
                <Separator className="my-2" />
                <Link href="/" className={buttonVariants({ variant: "default", size: "lg" })}>
                    <MoveLeft />
                    <span>Go Back</span>
                </Link>
            </div>
        </div>
    )
}