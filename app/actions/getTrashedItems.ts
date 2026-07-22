'use server'

import { prisma } from '@/utils/db';
import { getUserSession } from './getSession';
import { VaultItem } from '@/lib/types/VaultType';

export async function getTrashedItemsInAllVaults(userId: string) {
    const session = await getUserSession();
    if (!session) return;

    const trashedItems = await prisma.vault.findMany({
        where: {
            userId
        },
        select: {
            id: true,
            vaultItems: {
                where: {
                    deletedAt: {
                        not: null
                    }
                }
            }
        },
    })

    const allVaultItems: VaultItem[] = [];
    trashedItems.forEach((item) => {
        allVaultItems.push(...item.vaultItems as VaultItem[]);
    });

    return {
        vaultItems: allVaultItems,
    };
}