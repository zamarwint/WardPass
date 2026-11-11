import "server-only";

import { and, asc, desc, eq, isNull, isNotNull, sql } from "drizzle-orm";
import { db } from "@/drizzle/client";
import { vault, vaultItem } from "@/drizzle/schema";

export async function listVaultsForUser(userId: string) {
  return db
    .select({
      id: vault.id,
      name: vault.name,
      slug: vault.slug,
      icon: vault.icon,
      iconColor: vault.iconColor,
    })
    .from(vault)
    .where(eq(vault.userId, userId))
    .orderBy(asc(vault.name));
}

export async function getVaultPageDataForUser(userId: string, vaultId: string) {
  const rows = await db
    .select({
      vault,
      item: vaultItem,
      trashedCount: sql<number>`(
        select count(*)::int
        from ${vaultItem} as trashed
        where trashed."vaultId" = ${vault.id} and trashed."deletedAt" is not null
      )`,
    })
    .from(vault)
    .leftJoin(
      vaultItem,
      and(eq(vaultItem.vaultId, vault.id), isNull(vaultItem.deletedAt)),
    )
    .where(and(eq(vault.id, vaultId), eq(vault.userId, userId)))
    .orderBy(asc(vaultItem.updatedAt));

  if (rows.length === 0) return null;

  const currentVault = rows[0].vault;
  const vaultItems = rows.flatMap((row) => (row.item ? [row.item] : []));

  return {
    ...currentVault,
    vaultItems,
    trashedCount: rows[0].trashedCount,
  };
}

export async function getTrashedVaultForUser(userId: string, vaultId: string) {
  const rows = await db
    .select({ vault, item: vaultItem })
    .from(vault)
    .leftJoin(vaultItem, eq(vaultItem.vaultId, vault.id))
    .where(and(eq(vault.id, vaultId), eq(vault.userId, userId)))
    .orderBy(desc(vaultItem.updatedAt));

  if (rows.length === 0) return null;

  const currentVault = rows[0].vault;
  return {
    ...currentVault,
    vaultItems: rows.flatMap((row) =>
      row.item && row.item.deletedAt !== null ? [row.item] : [],
    ),
  };
}

export async function getAllTrashedVaultsForUser(userId: string) {
  const rows = await db
    .select({ vault, item: vaultItem })
    .from(vault)
    .leftJoin(
      vaultItem,
      and(eq(vaultItem.vaultId, vault.id), isNotNull(vaultItem.deletedAt)),
    )
    .where(eq(vault.userId, userId))
    .orderBy(asc(vault.name), desc(vaultItem.updatedAt));

  const map = new Map<
    string,
    (typeof rows)[0]["vault"] & {
      vaultItems: NonNullable<(typeof rows)[0]["item"]>[];
    }
  >();
  for (const row of rows) {
    if (!map.has(row.vault.id)) {
      map.set(row.vault.id, {
        ...row.vault,
        vaultItems: [],
      });
    }
    if (row.item && row.item.deletedAt !== null) {
      map.get(row.vault.id)!.vaultItems.push(row.item);
    }
  }

  return Array.from(map.values());
}

export async function getVaultMetadataForUser(userId: string, vaultId: string) {
  const [result] = await db
    .select({
      id: vault.id,
      name: vault.name,
      slug: vault.slug,
      icon: vault.icon,
      iconColor: vault.iconColor,
    })
    .from(vault)
    .where(and(eq(vault.id, vaultId), eq(vault.userId, userId)))
    .limit(1);

  return result ?? null;
}
