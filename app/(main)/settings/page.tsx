import Account from "@/components/app/settings/Account";
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
    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-8 py-6 sm:py-8 flex flex-col gap-8">
            <GeneralSettings />
            <Account />
        </div>
    );
}
