'use server'

import { auth } from "@/utils/auth"
import { headers } from "next/headers";

export async function listUsers(limit?: number) {
    const users = await auth.api.listUsers({
        query: {
            limit: limit ?? 100,
        },
        // This endpoint requires session cookies.
        headers: await headers(),
    });

    return users;
}