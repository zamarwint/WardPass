import SignIn from "@/components/app/auth/SignIn";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Sign In · WardPass",
    robots: {
        googleBot: {
            index: false,
            follow: false
        }
    }
}

export default function SignInPage() {
    return <SignIn />
}