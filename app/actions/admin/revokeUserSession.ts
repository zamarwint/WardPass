'use server'

import { auth } from "@/utils/auth"
import { headers } from "next/headers";

export async function revokeUserSession({ sessionToken }: { sessionToken: string }) {
    const data = await auth.api.revokeUserSession({
        body: {
            sessionToken, // required
        },
        // This endpoint requires session cookies.
        headers: await headers(),
    });

    return data;
}