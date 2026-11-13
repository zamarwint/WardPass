"use server";

import { and, eq } from "drizzle-orm";
import { db } from "@/drizzle/client";
import { vault } from "@/drizzle/schema";
import { requireUserSession } from "@/lib/server/auth";
import { revalidatePath } from "next/cache";

export async function updateVault(
  vaultId: string,
  name: string,
  icon?: string,
  iconColor?: string,
  salt?: string,
  encryptedKey?: string,
  keyIv?: string,
  verificationHash?: string,
  hashIv?: string,
) {
  const session = await requireUserSession();

  const slug = name.toLowerCase().replace(/\s/g, "-");
  const updates: Partial<typeof vault.$inferInsert> = {
    name,
    slug,
    updatedAt: new Date(),
  };
  if (icon !== undefined) updates.icon = icon;
  if (iconColor !== undefined) updates.iconColor = iconColor;
  if (salt !== undefined) updates.salt = salt;
  if (encryptedKey !== undefined) updates.encryptedKey = encryptedKey;
  if (keyIv !== undefined) updates.keyIv = keyIv;
  if (verificationHash !== undefined)
    updates.verificationHash = verificationHash;
  if (hashIv !== undefined) updates.hashIv = hashIv;

  const [updatedVault] = await db
    .update(vault)
    .set(updates)
    .where(and(eq(vault.id, vaultId), eq(vault.userId, session.user.id)))
    .returning({ id: vault.id });

  if (!updatedVault) throw new Error("Vault not found or access denied.");
  revalidatePath(`/strongroom/${updatedVault.id}`);
  return updatedVault;
}
