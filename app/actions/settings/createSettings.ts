'use server'

import { prisma } from "@/utils/db";
import { getUserSession } from "../getSession"

export default async function createSettings(userId: string) {
    const session = await getUserSession();
    if (!session) throw new Error("You are not logged in");

    return await prisma.settings.create({
        data: {
            userId
        }
    });
}