"use client";

import { Button } from "@/components/ui/button";
import TrashItems from "../../_components/trash/TrashItems";
import { ArrowLeftIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

export default function TrashPage() {
    const params = useParams();
    const vaultId = params.vaultId as string;
    const router = useRouter();

    return (
        <div className="flex-1 h-full flex flex-col items-center justify-center overflow-y-auto">
            <div className="flex w-full self-start flex-col gap-6 py-10 px-10">
                <h1 className="text-2xl md:text-6xl font-bold font-geist text-primary">
                    <span>Trash</span>
                </h1>
                <p className="text-xl text-muted-foreground">Here are the entries that you have deleted. They will be permanently deleted after 30 days.</p>
                <Button variant="secondary" size="lg" className="w-fit cursor-pointer" onClick={() => router.back()}>
                    <ArrowLeftIcon className="size-4" />
                    Back to Vaults
                </Button>
            </div>
            <TrashItems vaultId={vaultId} />
        </div>
    )
}