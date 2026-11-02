"use server";

import { getCurrentSession } from "@/lib/server/auth";

export const getUserSession = async () => {
    return getCurrentSession();
}

export const checkAdminSession = async () => {
    const session = await getCurrentSession();
    return session?.user.role === "admin";
}
