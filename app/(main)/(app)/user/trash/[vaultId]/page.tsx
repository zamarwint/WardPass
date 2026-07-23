"use client";

import ChooseVault from "../../_components/trash/ChooseVault";
import TrashItems from "../../_components/trash/TrashItems";
import { useParams } from "next/navigation";

export default function TrashPage() {
    const params = useParams();
    const vaultId = params.vaultId as string;

    return (
        <div className="flex-1 h-full flex flex-col items-center justify-center overflow-y-aut">
            <div className="flex w-full self-start flex-col gap-6 py-10 px-10">
                <h1 className="text-2xl md:text-6xl font-bold font-geist text-primary">
                    <span>Trash</span>
                </h1>
                <p className="text-xl text-muted-foreground">Here are the entries that you have deleted. They will be permanently deleted after 30 days.</p>
                <ChooseVault />
            </div>
            <TrashItems vaultId={vaultId} />
        </div>
    )
}