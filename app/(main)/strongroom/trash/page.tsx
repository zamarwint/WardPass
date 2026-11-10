import type { Metadata } from "next";
import TrashBinClient from "@/components/app/trash/TrashBinClient";

export const metadata: Metadata = {
    title: "Trash | Strongroom | WardPass",
    robots: {
        googleBot: {
            index: false,
            follow: false
        }
    }
};

export default function TrashPage() {
    return <TrashBinClient />;
}
