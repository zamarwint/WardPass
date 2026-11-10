'use server'

import { requireUserSession } from '@/lib/server/auth';
import { getAllTrashedVaultsForUser, getTrashedVaultForUser } from '@/lib/server/vault-repository';

export async function getVaultWithTrashedItems(vaultId: string) {
    const session = await requireUserSession();
    return getTrashedVaultForUser(session.user.id, vaultId);
}

export async function getAllVaultsWithTrashedItems() {
    const session = await requireUserSession();
    return getAllTrashedVaultsForUser(session.user.id);
}
