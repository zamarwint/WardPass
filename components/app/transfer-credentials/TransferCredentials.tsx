"use client";

import { FileUp, Download, ArrowLeftRight } from "lucide-react";
import Import from "./Import";
import Export from "./Export";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const credentialTabs = ["import", "export"];

export default function TransferCredentials() {
    return (
        <div className="size-full min-h-[calc(100vh-4rem)] p-4 sm:p-8 flex flex-col items-center justify-center mx-auto space-y-8">
            {/* HEADER */}
            <div className="text-center flex flex-col items-center justify-center gap-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-1">
                    <ArrowLeftRight className="size-3.5" />
                    <span>Credential Transfer</span>
                </div>
                <div className="flex flex-col items-center justify-center gap-4">
                    <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-foreground">
                        Import & Export Credentials
                    </h1>
                    <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto">
                        Easily migrate passwords into WardPass from CSV, JSON, or TXT files, or backup your vault items anytime.
                    </p>
                </div>
            </div>

            {/* TAB SELECTOR */}
            <Tabs className="flex items-center rounded-xl w-full shadow-xs">
                <TabsList className="mb-2 py-5 w-fit">
                    <TabsTrigger className="p-4" value={credentialTabs[0]}>
                        <FileUp className="size-4 text-primary" />
                        <span>Import Credentials</span>
                    </TabsTrigger>
                    <TabsTrigger className="p-4" value={credentialTabs[1]}>
                        <Download className="size-4 text-primary" />
                        <span>Export Credentials</span>
                    </TabsTrigger>
                </TabsList>
                <TabsContent value={credentialTabs[0]}><Import /></TabsContent>
                <TabsContent value={credentialTabs[1]}><Export /></TabsContent>
            </Tabs>
        </div>
    )
}