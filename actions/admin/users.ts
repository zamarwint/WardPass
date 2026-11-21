'use server'

import { auth } from "@/utils/auth"
import { headers } from "next/headers";
import { requireAdminSession } from "@/lib/server/auth";

export async function listUsers(limit?: number) {
    await requireAdminSession();
    const users = await auth.api.listUsers({
        query: {
            limit: limit ?? 100,
        },
        // This endpoint requires session cookies.
        headers: await headers(),
    });

    return users;
}

export async function getUser({ userId }: { userId: string }) {
    await requireAdminSession();
    if (!userId) return null;

    const data = await auth.api.getUser({
        query: {
            id: userId, // required
        },
        // This endpoint requires session cookies.
        headers: await headers(),
    });

    return data;
}
