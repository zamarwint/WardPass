import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "WardPass - License",
};

import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldSeparator } from "@/components/ui/field";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { drawALineClass } from "@/app/_components/drawALine";

export default function LicensePage() {
    return (
        <div className="py-30 mx-auto flex flex-col gap-10">
            <div className="flex flex-col items-center justify-center text-center gap-12">
                <div className="flex flex-col gap-6">
                    <h1 className="text-2xl md:text-6xl font-bold font-geist text-primary">License</h1>
                    <p className="text-xl text-muted-foreground">WardPass is open-source, under the <Link href="https://opensource.org/license/mit/" target="_blank" rel="noopener noreferrer" className={`font-bold text-foreground hover:text-primary ${drawALineClass}`}>MIT License</Link>.</p>
                    <Field className="max-w-lg md:max-w-xl text-muted-foreground prose text-md">
                        <FieldDescription className="text-center">
                            Copyright. 2026. WardPass and ZW.
                        </FieldDescription>
                        <FieldSeparator />
                        <FieldDescription className="text-center">
                            Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
                        </FieldDescription>
                        <FieldSeparator />
                        <FieldDescription className="text-center">
                            The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
                        </FieldDescription>
                        <FieldSeparator />
                        <FieldDescription className="text-center">
                            THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
                        </FieldDescription>
                    </Field>
                </div>
                <Link href="/">
                    <Button size="lg" className="text-md p-8"><ArrowLeft /> Back to Home</Button>
                </Link>
            </div>
        </div >
    )
}