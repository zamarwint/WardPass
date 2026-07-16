import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Contact WardPass",
};


export default function ContactPage() {
    return (
        <div className="py-30 mx-auto flex flex-col gap-10">
            <div className="flex flex-col items-center justify-center text-center gap-12">
                <div className="flex flex-col gap-6">
                    <h1 className="text-2xl md:text-6xl font-bold font-geist text-primary">Contact</h1>
                    <p className="text-xl text-muted-foreground">To contact the WardPass support team, please head over to our contact website.</p>
                </div>
                <a rel="noopener noreferrer" href="https://zamarwint.xyz/#contact" target="_blank">
                    <Button size="lg" className="text-md p-8">View website <ArrowUpRight /> </Button>
                </a>
            </div>
        </div>
    )
}