import GeneralSettings from "@/components/app/settings/General";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "General | Settings | WardPass",
    robots: {
        googleBot: {
            index: false,
            follow: false
        }
    }
};
export default function GeneralSettingsPage() {
    return <GeneralSettings />
}