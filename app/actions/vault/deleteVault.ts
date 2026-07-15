'use server';

import { prisma } from "@/utils/db";
import { getUserSession } from "../getSession";

export async function deleteVault(vaultId: string) {
    const session = await getUserSession();

    if (!session) return;

    const vault = await prisma.vault.delete({
        where: {
            userId: session.user.id,
            id: vaultId
        }
    })

    return vault;
}