'use server'

import { requireUserSession } from '@/lib/server/auth';
import { getTrashedVaultForUser } from '@/lib/server/vault-repository';

export async function getVaultWithTrashedItems(vaultId: string) {
    const session = await requireUserSession();
    return getTrashedVaultForUser(session.user.id, vaultId);
}
