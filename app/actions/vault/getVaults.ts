'use server';

import { prisma } from "@/utils/db";
import { getUserSession } from "../getSession";

export async function getVaults() {
    const session = await getUserSession();

    if (!session) return;

    const vaults = await prisma.vault.findMany({
        where: {
            userId: session?.user.id
        },
        select: {
            id: true,
            name: true,
            slug: true,
            icon: true,
            iconColor: true,
            encryptedKey: true,
            keyIv: true,
            verificationHash: true,
            hashIv: true,
            salt: true,
            userId: true,
            createdAt: true,
            updatedAt: true
        },
        orderBy: {
            name: "asc",
        }
    })

    return vaults;
}