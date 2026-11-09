import Account from "@/components/app/settings/Account";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Account | Settings | WardPass",
    robots: {
        googleBot: {
            index: false,
            follow: false
        }
    }
};

export default function AccountPage() {
    return <Account />
}