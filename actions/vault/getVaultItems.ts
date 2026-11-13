'use server';

import { requireUserSession } from "@/lib/server/auth";
import { getVaultPageDataForUser } from "@/lib/server/vault-repository";

export async function getVaultItems(vaultId: string) {
    const session = await requireUserSession();
    const data = await getVaultPageDataForUser(session.user.id, vaultId);
    if (!data) return null;
    return data;
}
