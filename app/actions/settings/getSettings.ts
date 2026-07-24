'use server'

import { prisma } from "@/utils/db";
import { getUserSession } from "../getSession"

export default async function getSettings() {
    const session = await getUserSession();

    if (!session) {
        throw new Error("No session found.");
    }

    const settings = await prisma.settings.findUnique({
        where: {
            userId: session.user.id,
        }
    });

    return settings;
}