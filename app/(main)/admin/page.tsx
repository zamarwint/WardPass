import AdminPage from "@/components/app/admin/AdminPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Analytics | Admin | WardPass",
    robots: {
        googleBot: {
            index: false,
            follow: false,
        },
    },
};

export default function SecurityPage() {
    return <AdminPage />
}