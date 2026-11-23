import Security from "@/components/app/settings/Security";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Security | Settings | WardPass",
    robots: {
        googleBot: {
            index: false,
            follow: false
        }
    }
};

export default function SecurityPage() {
    return <Security />
}