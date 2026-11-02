"use server";

import { and, eq } from "drizzle-orm";
import { db } from "@/drizzle/client";
import { vault } from "@/drizzle/schema";
import { requireUserSession } from "@/lib/server/auth";
import { revalidatePath } from "next/cache";

export async function deleteVault(vaultId: string) {
  const session = await requireUserSession();
  const [deletedVault] = await db
    .delete(vault)
    .where(and(eq(vault.userId, session.user.id), eq(vault.id, vaultId)))
    .returning({ id: vault.id });

  if (!deletedVault) throw new Error("Vault not found or access denied.");

  revalidatePath(`/strongroom`);
  return deletedVault;
}
