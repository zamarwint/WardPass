import SignUp from "@/components/app/auth/SignUp";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Sign up | WardPass",
    robots: {
        googleBot: {
            index: false,
            follow: false
        }
    }
}

export default function SignUpPage() {
    return <SignUp />
}