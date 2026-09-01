"use server";

import { auth } from "@/utils/auth";

export default async function signUp(
  name: string,
  email: string,
  password: string,
  image?: string,
) {
  const data = await auth.api.signUpEmail({
    body: {
      name, // required, The name of the user.
      email, // required, The email address of the user.
      password, // required, The password of the user. It should be at least 8 characters long and max 128 by default.
      image, // An optional profile image of the user.
      callbackURL: process.env.NEXT_PUBLIC_APP_URL + "/sign-in", // An optional URL to redirect to after the user signs up.
    },
  });

  return data;
}
