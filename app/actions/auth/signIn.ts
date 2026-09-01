"use server";

import { auth } from "@/utils/auth";
import { headers } from "next/headers";

export default async function signIn(email: string, password: string) {
  const data = await auth.api.signInEmail({
    body: {
      email, // required, The email address of the user.
      password, // required, The password of the user. It should be at least 8 characters long and max 128 by default.
      rememberMe: true, // If false, the user will be signed out when the browser is closed. (optional) (default: true)
      callbackURL: process.env.NEXT_PUBLIC_APP_URL + "/user/vault", // An optional URL to redirect to after the user signs in. (optional)
    },
    // This endpoint requires session cookies.
    headers: await headers(),
  });

  return data;
}
