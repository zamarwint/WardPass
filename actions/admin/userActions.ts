'use server'

import { auth } from "@/utils/auth"
import { headers } from "next/headers";

export async function setUserRole({ userId, role }: { userId: string, role: "admin" | "user" | ("admin" | "user")[] }) {
    const data = await auth.api.setRole({
        body: {
            userId,
            role, // required
        },
        // This endpoint requires session cookies.
        headers: await headers(),
    });
    return data
}

export async function setUserPassword({ userId, newPassword }: { userId: string, newPassword: string }) {
    const data = await auth.api.setUserPassword({
        body: {
            newPassword, // required
            userId, // required
        },
        // This endpoint requires session cookies.
        headers: await headers(),
    });
    return data;
}

export async function updateUser({
    userId,
    userData,
}: {
    userId: string,
    userData: { name?: string, email?: string, image?: string }
}) {
    const data = await auth.api.adminUpdateUser({
        body: {
            userId, // required
            data: userData, // required
        },
        // This endpoint requires session cookies.
        headers: await headers(),
    });
    return data;
}

export async function banUser({
    userId,
    banReason,
    banExpiresIn,
}: {
    userId: string,
    banReason: string,
    banExpiresIn: number,
}) {
    const data = await auth.api.banUser({
        body: {
            userId, // required
            banReason, // required
            banExpiresIn, // required
        },
        // This endpoint requires session cookies.
        headers: await headers(),
    });
    return data;
}

export async function unbanUser({ userId }: { userId: string }) {
    const data = await auth.api.unbanUser({
        body: {
            userId, // required
        },
        // This endpoint requires session cookies.
        headers: await headers(),
    });
    return data;
}

export async function revokeAllUserSessions(userId: string) {
    const data = await auth.api.revokeUserSessions({
        body: {
            userId, // required
        },
        // This endpoint requires session cookies.
        headers: await headers(),
    });
    return data
}

export async function impersonateUser(userId: string) {
    const data = await auth.api.impersonateUser({
        body: {
            userId, // required
        },
        // This endpoint requires session cookies.
        headers: await headers(),
    });
    return data;
}

export async function stopImpersonatingUser() {
    const data = await auth.api.stopImpersonating({
        // This endpoint requires session cookies.
        headers: await headers(),
    });
    return data;
}

export async function removeUser(userId: string) {
    const deletedUser = await auth.api.removeUser({
        body: {
            userId, // required
        },
        // This endpoint requires session cookies.
        headers: await headers(),
    });
    return deletedUser;
}