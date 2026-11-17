import TransferCredentials from "@/components/app/transfer-credentials/TransferCredentials";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Transfer Credentials | WardPass",
    robots: {
        googleBot: {
            index: false,
            follow: false
        }
    }
};

export default function TransferCredentialsPageLayout() {
    return (
        <TransferCredentials />
    )
}
