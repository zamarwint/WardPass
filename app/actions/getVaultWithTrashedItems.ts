'use server'

import { prisma } from '@/utils/db';
import { getUserSession } from './getSession';
import { Vault } from '@/lib/types/VaultType';

export async function getVaultWithTrashedItems(vaultId: string) {
    const session = await getUserSession();
    if (!session) return;

    const trashedItems = await prisma.vault.findUnique({
        where: {
            userId: session?.user.id,
            id: vaultId
        },
        include: {
            vaultItems: {
                where: {
                    deletedAt: { not: null }
                },
                orderBy: {
                    updatedAt: "desc"
                }
            }
        },
    });

    return trashedItems as unknown as Vault | null;
}