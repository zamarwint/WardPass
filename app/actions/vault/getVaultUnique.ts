'use server'

import { prisma } from "@/utils/db";
import { getUserSession } from "../getSession";

export async function getVaultUnique(vaultId: string) {
    const session = await getUserSession();

    if (!session) return;

    const uniqueVault = await prisma.vault.findUnique({
        where: {
            userId: session?.user.id,
            id: vaultId
        },
        select: {
            id: true,
            name: true,
            slug: true,
            icon: true,
            iconColor: true
        }
    })

    return uniqueVault;
}