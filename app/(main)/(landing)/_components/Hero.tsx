import GridPattern from "@/components/ui/grid-pattern";
import { ShieldCheck } from "lucide-react"
import { MoveRight, MoveUpRight } from "lucide-react"
import Link from "next/link";
import Vault3DObject from "./Vault3DObject";

export default function Hero() {
    return (
        <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden bg-black">
            {/* Subtle background grid */}
            <div>
                <GridPattern width={40} height={40} strokeDasharray="0" squares={[[0, 0]]} />
            </div>
            <div className="mx-auto px-4 md:px-10 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="flex flex-col items-start max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 border border-primary/30 bg-primary/5 text-primary uppercase tracking-wider">
                            <span><ShieldCheck /></span>
                            Active Protection Enabled
                        </div>
                        <h1 className="text-4xl font-bold md:text-6xl mb-6">
                            The Password Management Solution, <br /><span className="text-primary">You Deserve.</span>
                        </h1>
                        <p className="mb-10 max-w-xl">
                            Deploy a high-performance digital vault engineered for power users. Zero-knowledge architecture meets uncompromising speed. Your data remains an impenetrable asset.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto font-geist">
                            <Link href="/sign-up" className="font-bold btn-primary px-8 py-4 text-center uppercase tracking-wider flex items-center justify-center gap-2">
                                Get Started for Free
                                <span className="text-[18px]"><MoveRight /></span>
                            </Link>
                            <Link href="#about" className="font-bold btn-outline px-8 py-4 text-center uppercase tracking-wider flex items-center justify-center gap-2">
                                Learn More
                                <span className="text-[18px]"><MoveUpRight /></span>
                            </Link >
                        </div>
                        <div className="mt-8 flex items-center gap-2 font-mono text-muted-foreground">
                            <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                            System Status: Operational &amp; Secure
                        </div>
                    </div>
                    <Vault3DObject />
                </div>
            </div>
        </section>
    )
}