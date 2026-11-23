import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/drizzle/client";
import { schema } from "@/drizzle/schema";
import { Resend } from "resend";
import { admin, emailOTP } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import PasswordResetOTP from "@/emails/PasswordReset";
import VerifyEmailOTP from "@/emails/VerifyEmail";
import ChangeEmailOTP from "@/emails/ChangeEmail";
import DeleteAccount from "@/emails/DeleteAccount";

const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY);

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  baseURL: process.env.BETTER_AUTH_URL,
  plugins: [
    admin(),
    emailOTP({
      changeEmail: {
        enabled: true,
      },
      async sendVerificationOTP({ email, otp, type }) {
        if (type === "email-verification") {
          // Send the OTP for email verification
          void resend.emails.send({
            from: process.env.EMAIL_FROM as string,
            to: email,
            subject: "Verify Email for WardPass",
            react: VerifyEmailOTP({ email, otp }),
          });
        } else if (type === "forget-password") {
          // Send the OTP for password reset
          void resend.emails.send({
            from: process.env.EMAIL_FROM as string,
            to: email,
            subject: "Confirm Reset Password Request",
            react: PasswordResetOTP({ email, otp }),
          });
        } else if (type === "change-email") {
          // Send the OTP for change email
          void resend.emails.send({
            from: process.env.EMAIL_FROM as string,
            to: email, // Sent to the CURRENT email
            subject: "Confirm Email Change Request",
            react: ChangeEmailOTP({ email, otp }),
          });
        }
      },
    }),
    nextCookies(),
  ],
  emailAndPassword: {
    enabled: true,
    revokeSessionsOnPasswordReset: true,
    onPasswordReset: async ({ user }) => {
      console.log(`User ${user.email} has successfully reset their password.`);
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: false,
    async afterEmailVerification(user) {
      console.log(`User ${user.email} has been successfully verified.`);
    },
  },
  user: {
    deleteUser: {
      enabled: true,
      sendDeleteAccountVerification: async ({
        user, // The user object
        url, // The auto-generated URL for deletion
      }) => {
        // Your email sending logic here
        void resend.emails.send({
          from: process.env.EMAIL_FROM as string,
          to: user.email,
          subject: "Confirm Account Deletion Request",
          react: DeleteAccount({ user, url }),
        });
      },
    },
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "user", // Sets default role
        input: false, // Prevent users from setting their own role during signup
        required: true,
      },
      vaultLimit: {
        type: "number",
        defaultValue: 5,
        input: false, // Prevent users from setting their own vault limit during signup or updates
        required: true,
      },
      vaultItemLimit: {
        type: "number",
        defaultValue: 5,
        input: false, // Prevent users from setting their own vault item limit
        required: true,
      },
    },
  },
});
