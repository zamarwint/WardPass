"use server";

import { and, count, eq, exists, isNull } from "drizzle-orm";
import { db } from "@/drizzle/client";
import { user, vault, vaultItem } from "@/drizzle/schema";
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

  const [existing] = await db
    .select({ id: vaultItem.id, vaultId: vaultItem.vaultId })
    .from(vaultItem)
    .innerJoin(vault, eq(vault.id, vaultItem.vaultId))
    .where(and(eq(vaultItem.id, id), eq(vault.userId, session.user.id)))
    .limit(1);

  if (!existing) throw new Error("Vault item not found or access denied.");

  const [userRecord] = await db
    .select({ vaultItemLimit: user.vaultItemLimit })
    .from(user)
    .where(eq(user.id, session.user.id))
    .limit(1);

  const maxItems = userRecord?.vaultItemLimit ?? (session.user as any).vaultItemLimit ?? 5;

  const [activeItems] = await db
    .select({ count: count() })
    .from(vaultItem)
    .where(and(eq(vaultItem.vaultId, existing.vaultId), isNull(vaultItem.deletedAt)));

  if (activeItems.count >= maxItems) {
    throw new Error(`Cannot restore item: vault is at capacity (maximum ${maxItems} active items).`);
  }

  const [item] = await db.update(vaultItem)
    .set({ deletedAt: null, updatedAt: new Date() })
    .where(eq(vaultItem.id, id))
    .returning({ id: vaultItem.id });

  if (!item) throw new Error("Vault item not found or access denied.");
  return item;
}
