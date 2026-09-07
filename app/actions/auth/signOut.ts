"use server";

import { headers } from "next/headers";
import { auth } from "@/utils/auth";

export default async function signOut() {
  const data = await auth.api.signOut({
    // This endpoint requires session cookies.
    headers: await headers(),
  });

  return data;
}
