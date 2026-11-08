import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "License | WardPass",
};

import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldSeparator } from "@/components/ui/field";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { LineAnimationClass } from "@/components/ModalContent";

export default function LicensePage() {
    return (
        <main className="landing-shell flex min-h-[68vh] flex-col items-start justify-center gap-8 py-32 md:py-40">
            <div className="flex w-full max-w-4xl flex-col gap-6">
                <p className="eyebrow">Open source / MIT</p>
                <h1 className="landing-display text-5xl tracking-tight md:text-7xl">Built in the open.<br/><span className="landing-serif border-b-2 border-primary pb-1">Shared with care.</span></h1>
                <p className="text-muted-foreground">WardPass is open-source under the <Link href="https://opensource.org/license/mit/" target="_blank" rel="noopener noreferrer" className={`font-semibold text-foreground hover:text-primary ${LineAnimationClass}`}>MIT License.</Link></p>
                <div className="mt-4 grid border-y border-border md:grid-cols-[180px_1fr] md:divide-x md:divide-border">
                    <p className="border-b border-border px-5 py-4 font-mono text-xs leading-5 text-muted-foreground md:border-b-0">COPYRIGHT<br/>2026<br/>WARDPASS / ZWINT CO.</p>
                    <Field className="landing-card space-y-5 border-x-0 border-y-0 p-5 text-left text-sm leading-7 text-muted-foreground md:p-8">
                        <FieldDescription>Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:</FieldDescription>
                        <FieldSeparator />
                        <FieldDescription>The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.</FieldDescription>
                        <FieldSeparator />
                        <FieldDescription>THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.</FieldDescription>
                    </Field>
                </div>
            </div>
            <Link href="/"><Button size="lg" variant="outline" className="rounded-none"><ArrowLeft /> Back to WardPass</Button></Link>
        </main>
    )
}
