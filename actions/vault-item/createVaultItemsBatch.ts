"use server";

import { and, count, eq } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import { db } from "@/drizzle/client";
import { vault, vaultItem } from "@/drizzle/schema";
import { requireUserSession } from "@/lib/server/auth";
import { VaultItemType } from "@/lib/types/VaultType";
import { revalidatePath } from "next/cache";

export type BatchVaultItemInput = {
  encryptedData: string;
  iv: string;
  itemType: VaultItemType;
};

export async function createVaultItemsBatch({
  vaultId,
  items,
}: {
  vaultId: string;
  items: BatchVaultItemInput[];
}) {
  const session = await requireUserSession();

  if (!items || items.length === 0) {
    return { insertedCount: 0, totalAttempted: 0, vaultId };
  }

  // Validate item types
  for (const item of items) {
    if (!Object.values(VaultItemType).includes(item.itemType)) {
      throw new Error(`Invalid vault item type: ${item.itemType}`);
    }
  }

  // Check vault ownership and current count
  const [ownedVault] = await db
    .select({ id: vault.id, itemCount: count(vaultItem.id) })
    .from(vault)
    .leftJoin(vaultItem, eq(vaultItem.vaultId, vault.id))
    .where(and(eq(vault.id, vaultId), eq(vault.userId, session.user.id)))
    .groupBy(vault.id)
    .limit(1);

  if (!ownedVault) throw new Error("Vault not found or access denied.");

  const currentCount = Number(ownedVault.itemCount);
  const remainingSlots = Math.max(0, 5 - currentCount);

  if (remainingSlots <= 0) {
    throw new Error("This vault is full (maximum 5 items including trashed).");
  }

  // Insert up to available slots
  const itemsToInsert = items.slice(0, remainingSlots);

  const valuesToInsert = itemsToInsert.map((item) => ({
    id: randomUUID(),
    itemType: item.itemType,
    vaultId,
    encryptedData: item.encryptedData,
    iv: item.iv,
    updatedAt: new Date(),
  }));

  const inserted = await db
    .insert(vaultItem)
    .values(valuesToInsert)
    .returning({ id: vaultItem.id });

  revalidatePath(`/strongroom/${vaultId}`);

  return {
    insertedCount: inserted.length,
    totalAttempted: items.length,
    vaultId,
  };
}
