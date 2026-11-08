import { z } from "zod";
import { passwordSchema } from "./authSchemas";

export const loginItemSchema = z.object({
  name: z
    .string()
    .min(3, "Name of login item must be at least 3 characters.")
    .max(50, "Name of login item must not exceed 50 characters."),
  url: z.url("Please enter a valid url."),
  username: z
    .string()
    .min(5, "Username must be at least 5 characters.")
    .max(20, "Username must not exceed 20 characters.")
    .lowercase("Username must be lowercase letters."),
  email: z.email("Please enter a vaild email address"),
  password: passwordSchema,
  note: z
    .string()
    .max(
      100,
      "Notes for login items must not exceed 100 characters. Please create a secure note if you would like to write more.",
    ),
});
