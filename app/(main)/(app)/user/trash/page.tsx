import type { Metadata } from "next";
import TrashItems from "../_components/trash/TrashItems";

export const metadata: Metadata = {
    title: "Trash Bin",
};

export default function TrashPage() {
    return (
        <div className="flex-1 h-full flex flex-col items-center justify-center overflow-y-aut">
            <div className="flex w-full self-start flex-col gap-6 py-10 px-10">
                <h1 className="text-2xl md:text-6xl font-bold font-geist text-primary">
                    <span>Trash</span>
                </h1>
                <p className="text-xl text-muted-foreground">Here are the entries that you have deleted. They will be permanently deleted after 30 days.</p>
            </div>
            <TrashItems />
        </div>
    )
}