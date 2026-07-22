'use server';

import { Vault } from "@/lib/types/VaultType";
import { prisma } from "@/utils/db";
import { getUserSession } from "../getSession";

export async function getVaultItems(vaultId: string) {
    const session = await getUserSession();

    if (!session) return;

    const vaultItems = await prisma.vault.findUnique({
        where: {
            userId: session?.user.id,
            id: vaultId
        },
        include: {
            vaultItems: {
                where: {
                    deletedAt: null
                },
                orderBy: {
                    updatedAt: "asc"
                }
            }
        },
    })

    return vaultItems as unknown as Vault | null;
}