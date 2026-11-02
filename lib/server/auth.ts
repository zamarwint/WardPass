import "server-only";

import { headers } from "next/headers";
import { auth } from "@/utils/auth";

export async function getCurrentSession() {
  const current = await auth.api.getSession({ headers: await headers() });
  if (!current) return null;

  const safeSession = Object.fromEntries(
    Object.entries(current.session).filter(([key]) => key !== "token"),
  ) as Omit<typeof current.session, "token">;
  return { ...current, session: safeSession };
}

export async function requireUserSession() {
  const session = await getCurrentSession();
  if (!session?.user) {
    throw new Error("You must be signed in to perform this action.");
  }
  return session;
}

export async function requireAdminSession() {
  const session = await requireUserSession();
  if (session.user.role !== "admin") {
    throw new Error("You do not have permission to perform this action.");
  }
  return session;
}
