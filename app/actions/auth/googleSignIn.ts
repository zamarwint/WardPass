"use server";

import { auth } from "@/utils/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function googleSignIn() {
  const response = await auth.api.signInSocial({
    body: {
      provider: "google",
      callbackURL:
        process.env.BETTER_AUTH_URL +
        process.env.NEXT_PUBLIC_SIGN_IN_REDIRECT_URL!,
    },
    headers: await headers(),
  });

  if (response?.url) {
    redirect(response.url);
  }
}
