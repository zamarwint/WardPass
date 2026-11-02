'use server';

import { and, count, eq } from 'drizzle-orm';
import { randomUUID } from 'node:crypto';
import { db } from '@/drizzle/client';
import { vault, vaultItem } from '@/drizzle/schema';
import { requireUserSession } from '@/lib/server/auth';
import { VaultItemType } from '@/lib/types/VaultType';

export default async function createVaultItem({
    vaultId,
    encryptedData,
    iv,
    itemType
}: {
    vaultId: string,
    encryptedData: string,
    iv: string,
    itemType: VaultItemType
}) {
    const session = await requireUserSession();
    if (!Object.values(VaultItemType).includes(itemType)) {
        throw new Error("Invalid vault item type.");
    }

    const [ownedVault] = await db
        .select({ id: vault.id, itemCount: count(vaultItem.id) })
        .from(vault)
        .leftJoin(vaultItem, eq(vaultItem.vaultId, vault.id))
        .where(and(eq(vault.id, vaultId), eq(vault.userId, session.user.id)))
        .groupBy(vault.id)
        .limit(1);

    if (!ownedVault) throw new Error("Vault not found or access denied.");
    if (ownedVault.itemCount >= 3) {
        throw new Error("A vault can contain at most 3 items, including trashed items.");
    }

    const [newVaultItem] = await db.insert(vaultItem).values({
        id: randomUUID(),
        itemType,
        vaultId,
        encryptedData,
        iv,
        updatedAt: new Date(),
    }).returning({ id: vaultItem.id });

    return newVaultItem;
}
