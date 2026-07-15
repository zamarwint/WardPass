'use server';

import { prisma } from "@/utils/db";
import { getUserSession } from "../getSession";

export async function getVaultItems(vaultId: string) {
    const session = await getUserSession();

    if (!session) return;

    const vaultItems = await prisma.vault.findMany({
        where: {
            userId: session?.user.id,
            id: vaultId,
        },
        include: {
            loginItems: true,
            secureNoteItems: true,
            creditCardItems: true,
            identities: true,
        },
        orderBy: {
            name: "asc",
        }
    })

    return vaultItems;
}