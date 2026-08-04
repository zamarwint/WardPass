"use server";

import { headers } from "next/headers";
import { auth } from "../../utils/auth"

export const getUserSession = async () => {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    return session;
}

export const checkAdminSession = async () => {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user) return null;

    if (session.user.role !== 'admin') return null;

    return true;
}