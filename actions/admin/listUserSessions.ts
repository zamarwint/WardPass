'use server'

import { auth } from "@/utils/auth"
import { headers } from "next/headers";
import { eq, isNotNull } from "drizzle-orm";
import { db } from "@/drizzle/client";
import { session } from "@/drizzle/schema";
import { requireAdminSession } from "@/lib/server/auth";

export async function searchUserSession({ userId }: { userId: string }) {
    if (!userId) return null;

    const data = await auth.api.listUserSessions({
        body: {
            userId, // required
        },
        // This endpoint requires session cookies.
        headers: await headers(),
    });

    return {
        sessions: data.sessions.map((userSession) => {
            const safeSession = Object.fromEntries(
                Object.entries(userSession).filter(([key]) => key !== "token"),
            ) as Omit<typeof userSession, "token">;
            return safeSession;
        }),
    };
}

export async function dbListUserSessions() {
    await requireAdminSession();
    return db.select({
        id: session.id,
        createdAt: session.createdAt,
        updatedAt: session.updatedAt,
        userId: session.userId,
        expiresAt: session.expiresAt,
        ipAddress: session.ipAddress,
        userAgent: session.userAgent,
        impersonatedBy: session.impersonatedBy,
    }).from(session);
}

export async function dbListUserImpersonations() {
    await requireAdminSession();
    return db.select({
        id: session.id,
        createdAt: session.createdAt,
        updatedAt: session.updatedAt,
        userId: session.userId,
        expiresAt: session.expiresAt,
        ipAddress: session.ipAddress,
        userAgent: session.userAgent,
        impersonatedBy: session.impersonatedBy,
    }).from(session).where(isNotNull(session.impersonatedBy));
}

export async function revokeUserSessionById(sessionId: string) {
    await requireAdminSession();
    const [row] = await db
        .select({ token: session.token })
        .from(session)
        .where(eq(session.id, sessionId))
        .limit(1);
    if (!row) throw new Error("Session not found.");
    return auth.api.revokeUserSession({
        body: { sessionToken: row.token },
        headers: await headers(),
    });
}
