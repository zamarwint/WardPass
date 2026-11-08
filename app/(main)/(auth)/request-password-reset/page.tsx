import RequestPasswordReset from "@/components/app/auth/RequestPasswordReset";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Request Password Reset | WardPass",
    robots: {
        googleBot: {
            index: false,
            follow: false
        }
    }
}

export default function RequestPasswordResetPage() {
    return <RequestPasswordReset />
}