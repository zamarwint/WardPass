'use server'

import { auth } from "@/utils/auth"
import { headers } from "next/headers";

export async function listUserSessions({ userId }: { userId: string }) {
    const data = await auth.api.listUserSessions({
        body: {
            userId, // required
        },
        // This endpoint requires session cookies.
        headers: await headers(),
    });

    return data;
}