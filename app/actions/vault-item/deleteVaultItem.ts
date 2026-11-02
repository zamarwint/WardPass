"use server";

import { and, eq, exists } from "drizzle-orm";
import { db } from "@/drizzle/client";
import { vault, vaultItem } from "@/drizzle/schema";
import { requireUserSession } from "@/lib/server/auth";

export default async function deleteVaultItem({
  id,
  vaultId,
}: {
  id: string;
  vaultId: string;
}) {
  const session = await requireUserSession();

  const [deletedVaultItem] = await db
    .delete(vaultItem)
    .where(
      and(
        eq(vaultItem.id, id),
        eq(vaultItem.vaultId, vaultId),
        exists(
          db
            .select({ id: vault.id })
            .from(vault)
            .where(
              and(
                eq(vault.id, vaultItem.vaultId),
                eq(vault.userId, session.user.id),
              ),
            ),
        ),
      ),
    )
    .returning({ id: vaultItem.id });

  if (!deletedVaultItem)
    throw new Error("Vault item not found or access denied.");

  // // UPDATING STATE FROM THE SERVER ACTION AFTER CREATING THE LOGIN ITEM. ONLY WORKS WITH DIALOGS, NOT DIVS, NOT ALERT DIALOGS.
  // revalidatePath(`/strongroom/${vaultId}`);
  return deletedVaultItem;
}
