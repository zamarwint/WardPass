'use server'

import { auth } from "@/utils/auth"
import { headers } from "next/headers";
import { checkAdminSession } from "../getSession";
import { prisma } from "@/utils/db";

export async function searchUserSession({ userId }: { userId: string }) {
    if (!userId) return null;

    const data = await auth.api.listUserSessions({
        body: {
            userId, // required
        },
        // This endpoint requires session cookies.
        headers: await headers(),
    });

    return data;
}

export async function dbListUserSessions() {
    const checkAdmin = checkAdminSession();

    if (!checkAdmin) return null;

    const data = await prisma.session.findMany({
        select: {
            id: true,
            createdAt: true,
            updatedAt: true,
            userId: true,
            expiresAt: true,
            ipAddress: true,
            userAgent: true,
            token: true,
            impersonatedBy: true,
        }
    })

    return data;
}

export async function dbListUserImpersonations() {
    const checkAdmin = checkAdminSession();

    if (!checkAdmin) return null;

    const data = await prisma.session.findMany({
        where: {
            impersonatedBy: {
                not: null
            }
        },
        select: {
            id: true,
            createdAt: true,
            updatedAt: true,
            userId: true,
            expiresAt: true,
            ipAddress: true,
            userAgent: true,
            impersonatedBy: true,
        }
    })

    return data;
}