"use server";

import { db } from "@/drizzle/client";
import { session, vault, vaultItem, verification } from "@/drizzle/schema";
import { auth } from "@/utils/auth";
import { and, eq, inArray } from "drizzle-orm";
import { headers } from "next/headers";

export async function requestPasswordReset(email: string) {
  const data = await auth.api.requestPasswordReset({
    body: {
      email, // required, The email address of the user to send a password reset email to
      redirectTo: process.env.BETTER_AUTH_URL + "/reset-password", // The URL to redirect the user to reset their password. If the token isn't valid or expired, it'll be redirected with a query parameter `?error=INVALID_TOKEN`. If the token is valid, it'll be redirected with a query parameter `?token=VALID_TOKEN
    },
  });

  return data;
}

export async function resetPassword(newPassword: string, token: string) {
  const data = await auth.api.resetPassword({
    body: {
      newPassword, // required, The new password to set
      token, // required, The token to reset the password
    },
  });

  return data;
}

export async function getVaultDataForPasswordReset(token: string) {
  if (!token) {
    throw new Error("Missing password reset token.");
  }

  // Better-Auth stores reset password tokens as 'reset-password:<token>'
  const [record] = await db
    .select()
    .from(verification)
    .where(eq(verification.identifier, `reset-password:${token}`));

  if (!record || record.expiresAt < new Date()) {
    throw new Error("Invalid or expired password reset token.");
  }

  const userId = record.value;

  const userVaults = await db
    .select({
      id: vault.id,
      name: vault.name,
      salt: vault.salt,
      encryptedKey: vault.encryptedKey,
      keyIv: vault.keyIv,
      verificationHash: vault.verificationHash,
      hashIv: vault.hashIv,
    })
    .from(vault)
    .where(eq(vault.userId, userId));

  if (userVaults.length === 0) {
    return {
      vaults: [],
      items: [],
    };
  }

  const vaultIds = userVaults.map((v) => v.id);
  const userItems = await db
    .select({
      id: vaultItem.id,
      vaultId: vaultItem.vaultId,
      encryptedData: vaultItem.encryptedData,
      iv: vaultItem.iv,
    })
    .from(vaultItem)
    .where(inArray(vaultItem.vaultId, vaultIds));

  return {
    vaults: userVaults,
    items: userItems,
  };
}

export interface UpdatedVaultPayload {
  id: string;
  salt: string;
  encryptedKey: string;
  keyIv: string;
  verificationHash: string;
  hashIv: string;
}

export interface UpdatedItemPayload {
  id: string;
  encryptedData: string;
  iv: string;
}

export async function resetPasswordAndReencryptVaults({
  token,
  newPassword,
  updatedVaults,
  updatedItems,
  wipeVaults = false,
}: {
  token: string;
  newPassword: string;
  updatedVaults?: UpdatedVaultPayload[];
  updatedItems?: UpdatedItemPayload[];
  wipeVaults?: boolean;
}) {
  if (!token) {
    throw new Error("Missing password reset token.");
  }

  // 1. Verify token exists and retrieve user ID before Better-Auth consumes it
  const [record] = await db
    .select()
    .from(verification)
    .where(eq(verification.identifier, `reset-password:${token}`));

  if (!record || record.expiresAt < new Date()) {
    throw new Error("Invalid or expired password reset token.");
  }

  const userId = record.value;

  // 2. Handle vault data re-encryption or wipe
  if (wipeVaults) {
    await db.delete(vault).where(eq(vault.userId, userId));
  } else {
    if (updatedVaults && updatedVaults.length > 0) {
      for (const v of updatedVaults) {
        await db
          .update(vault)
          .set({
            salt: v.salt,
            encryptedKey: v.encryptedKey,
            keyIv: v.keyIv,
            verificationHash: v.verificationHash,
            hashIv: v.hashIv,
            updatedAt: new Date(),
          })
          .where(and(eq(vault.id, v.id), eq(vault.userId, userId)));
      }
    }

    if (updatedItems && updatedItems.length > 0) {
      for (const item of updatedItems) {
        await db
          .update(vaultItem)
          .set({
            encryptedData: item.encryptedData,
            iv: item.iv,
            updatedAt: new Date(),
          })
          .where(eq(vaultItem.id, item.id));
      }
    }
  }

  // 3. Reset password in Better-Auth (this also consumes the verification token)
  const resetResult = await auth.api.resetPassword({
    body: {
      newPassword,
      token,
    },
  });

  // 4. Revoke all existing sessions for this user across all devices
  await db.delete(session).where(eq(session.userId, userId));

  // 5. Sign out the current session
  try {
    await auth.api.signOut({
      headers: await headers(),
    });
  } catch {
    // Ignore if response headers cannot be written
  }

  return { success: true, ...resetResult };
}
