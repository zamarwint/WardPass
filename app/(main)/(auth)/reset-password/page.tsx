import ResetPassword from "@/components/app/auth/ResetPassword";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Reset Password | WardPass",
    robots: {
        googleBot: {
            index: false,
            follow: false
        }
    }
}

export default function ResetPasswordPage() {
    return <ResetPassword />
}