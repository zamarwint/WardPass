import EmailVerification from "@/components/app/auth/EmailVerification"
import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Email Verification | WardPass",
    robots: {
        googleBot: {
            index: false,
            follow: false
        }
    }
}

export default function EmailVerificationPage() {
    return <EmailVerification />
}