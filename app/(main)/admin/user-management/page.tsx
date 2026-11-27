import UserManagementPage from "@/components/app/admin/UserManagementPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "User Management | Admin | WardPass",
    robots: {
        googleBot: {
            index: false,
            follow: false,
        },
    },
};

export default function SecurityPage() {
    return <UserManagementPage />
}