"use server";

import { auth } from "@/utils/auth";

export async function requestPasswordReset(email: string) {
  const data = await auth.api.requestPasswordReset({
    body: {
      email, // required, The email address of the user to send a password reset email to
      redirectTo: process.env.NEXT_PUBLIC_APP_URL + "/reset-password", // The URL to redirect the user to reset their password. If the token isn't valid or expired, it'll be redirected with a query parameter `?error=INVALID_TOKEN`. If the token is valid, it'll be redirected with a query parameter `?token=VALID_TOKEN
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
