"use server";

import { db } from "@/drizzle/client";
import { session, user, vault, vaultItem } from "@/drizzle/schema";
import { auth } from "@/utils/auth";
import { and, eq, inArray } from "drizzle-orm";
import { headers } from "next/headers";

export async function requestPasswordReset(email: string) {
  if (!email || !email.trim()) {
    throw new Error("Email address is required.");
  }

  const normalizedEmail = email.trim().toLowerCase();

  const data = await auth.api.requestPasswordResetEmailOTP({
    body: {
      email: normalizedEmail,
    },
  });

  return data;
}

export async function resetPassword(
  email: string,
  otp: string,
  password: string,
) {
  if (!email || !otp || !password) {
    throw new Error("Email, OTP code, and new password are required.");
  }

  const normalizedEmail = email.trim().toLowerCase();

  const data = await auth.api.resetPasswordEmailOTP({
    body: {
      email: normalizedEmail,
      otp: otp.trim(),
      password,
    },
  });

  return data;
}

export async function getVaultDataForPasswordReset(email: string) {
  if (!email || !email.trim()) {
    throw new Error("Missing email address.");
  }

  const normalizedEmail = email.trim().toLowerCase();

  // Find user by email
  const [userRecord] = await db
    .select({ id: user.id })
    .from(user)
    .where(eq(user.email, normalizedEmail));

  if (!userRecord) {
    throw new Error("No user found with that email address.");
  }

  const userId = userRecord.id;

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
  email,
  otp,
  newPassword,
  updatedVaults,
  updatedItems,
  wipeVaults = false,
}: {
  email: string;
  otp: string;
  newPassword: string;
  updatedVaults?: UpdatedVaultPayload[];
  updatedItems?: UpdatedItemPayload[];
  wipeVaults?: boolean;
}) {
  if (!email || !otp || !newPassword) {
    throw new Error(
      "Missing required fields: email, OTP code, or new password.",
    );
  }

  const normalizedEmail = email.trim().toLowerCase();

  const [userRecord] = await db
    .select({ id: user.id })
    .from(user)
    .where(eq(user.email, normalizedEmail));

  if (!userRecord) {
    throw new Error("User not found.");
  }

  const userId = userRecord.id;

  // 1. Reset password in Better-Auth via emailOTP (atomically verifies OTP, updates password, sets emailVerified)
  let resetResult;
  try {
    resetResult = await auth.api.resetPasswordEmailOTP({
      body: {
        email: normalizedEmail,
        otp: otp.trim(),
        password: newPassword,
      },
    });
  } catch (err: any) {
    const errorMsg =
      err?.body?.message ||
      err?.message ||
      "Invalid or expired verification code.";
    throw new Error(errorMsg);
  }

  // 2. Handle vault data re-encryption or wipe
  if (wipeVaults) {
    const userVaults = await db
      .select({ id: vault.id })
      .from(vault)
      .where(eq(vault.userId, userId));
    const vIds = userVaults.map((v) => v.id);
    if (vIds.length > 0) {
      await db.delete(vaultItem).where(inArray(vaultItem.vaultId, vIds));
      await db.delete(vault).where(eq(vault.userId, userId));
    }
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

  // 3. Revoke all existing sessions for this user across all devices
  await db.delete(session).where(eq(session.userId, userId));

  // 4. Sign out the current session
  try {
    await auth.api.signOut({
      headers: await headers(),
    });
  } catch {
    // Ignore if response headers cannot be written
  }

  return { ...resetResult, success: true };
}
