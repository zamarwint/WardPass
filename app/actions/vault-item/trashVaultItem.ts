"use server";

import { and, eq, exists } from "drizzle-orm";
import { db } from "@/drizzle/client";
import { vault, vaultItem } from "@/drizzle/schema";
import { requireUserSession } from "@/lib/server/auth";

export async function trashVaultItem(id: string) {
  const session = await requireUserSession();
  const [item] = await db.update(vaultItem)
    .set({ deletedAt: new Date(), updatedAt: new Date() })
    .where(and(
      eq(vaultItem.id, id),
      exists(db.select({ id: vault.id }).from(vault).where(and(
        eq(vault.id, vaultItem.vaultId),
        eq(vault.userId, session.user.id),
      ))),
    ))
    .returning({ id: vaultItem.id });

  if (!item) throw new Error("Vault item not found or access denied.");
  return item;
}

export async function restoreVaultItem(id: string) {
  const session = await requireUserSession();
  const [item] = await db.update(vaultItem)
    .set({ deletedAt: null, updatedAt: new Date() })
    .where(and(
      eq(vaultItem.id, id),
      exists(db.select({ id: vault.id }).from(vault).where(and(
        eq(vault.id, vaultItem.vaultId),
        eq(vault.userId, session.user.id),
      ))),
    ))
    .returning({ id: vaultItem.id });

  if (!item) throw new Error("Vault item not found or access denied.");
  return item;
}
