"use server";

import { requireUserSession } from "@/lib/server/auth";
import { getVaultPageDataForUser } from "@/lib/server/vault-repository";

export async function getVaultPageData(vaultId: string) {
  const session = await requireUserSession();
  return getVaultPageDataForUser(session.user.id, vaultId);
}
