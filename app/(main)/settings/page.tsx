import Account from "@/components/app/settings/Account";
import GeneralSettings from "@/components/app/settings/General";
import { Separator } from "@/components/ui/separator";
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
    return (
        <>
            <GeneralSettings />
            <Separator />
            <Account />
        </>
    )
}