"use server";

import { count, eq } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import { db } from "@/drizzle/client";
import { vault } from "@/drizzle/schema";
import { requireUserSession } from "@/lib/server/auth";
import { revalidatePath } from "next/cache";

export async function createVault(
  name: string,
  icon: string,
  iconColor: string,
  salt: string,
  encryptedKey: string,
  keyIv: string,
  verificationHash: string,
  hashIv: string,
) {
  const session = await requireUserSession();
  const userId = session.user.id;
  const [vaultCount] = await db
    .select({ count: count() })
    .from(vault)
    .where(eq(vault.userId, userId));

  if (vaultCount.count >= 5) {
    throw new Error("You can create at most 5 vaults.");
  }

  const slug = name.toLowerCase().replace(/\s/g, "-");
  const [createdVault] = await db
    .insert(vault)
    .values({
      id: randomUUID(),
      name,
      slug,
      icon,
      iconColor,
      salt,
      encryptedKey,
      keyIv,
      verificationHash,
      hashIv,
      userId,
      updatedAt: new Date(),
    })
    .returning({ id: vault.id });

  if (!createdVault) throw new Error("Vault could not be created.");
  revalidatePath(`/strongroom/${createdVault.id}`);
  return createdVault;
}
