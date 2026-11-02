'use server';

import { and, eq, exists } from 'drizzle-orm';
import { db } from '@/drizzle/client';
import { vault, vaultItem } from '@/drizzle/schema';
import { requireUserSession } from '@/lib/server/auth';

export default async function updateLogin({
    id,
    vaultId,
    encryptedData,
    iv
}: {
    id: string,
    vaultId: string,
    encryptedData: string,
    iv: string
}) {
    const session = await requireUserSession();

    const [updatedLogin] = await db.update(vaultItem)
        .set({ encryptedData, iv, updatedAt: new Date() })
        .where(and(
            eq(vaultItem.id, id),
            eq(vaultItem.vaultId, vaultId),
            exists(db.select({ id: vault.id }).from(vault).where(and(
                eq(vault.id, vaultItem.vaultId),
                eq(vault.userId, session.user.id),
            ))),
        ))
        .returning({ id: vaultItem.id });

    if (!updatedLogin) throw new Error("Vault item not found or access denied.");

    return updatedLogin;
}
