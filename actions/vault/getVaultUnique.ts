'use server'

import { requireUserSession } from "@/lib/server/auth";
import { getVaultMetadataForUser } from "@/lib/server/vault-repository";

export async function getVaultUnique(vaultId: string) {
    const session = await requireUserSession();
    return getVaultMetadataForUser(session.user.id, vaultId);
}
