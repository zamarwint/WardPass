'use server';

import { requireUserSession } from "@/lib/server/auth";
import { listVaultsForUser } from "@/lib/server/vault-repository";

export async function getVaults() {
    const session = await requireUserSession();
    return listVaultsForUser(session.user.id);
}
