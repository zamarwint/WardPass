"use server";

import { requireUserSession } from "@/lib/server/auth";
import { getVaultPageDataForUser } from "@/lib/server/vault-repository";

export default async function getVaultItems({ vaultId }: { vaultId: string }) {
  const session = await requireUserSession();
  const vaultPage = await getVaultPageDataForUser(session.user.id, vaultId);
  if (!vaultPage) throw new Error("Vault not found or access denied.");
  return vaultPage.vaultItems;
}
