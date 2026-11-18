import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/drizzle/client";
import { schema } from "@/drizzle/schema";
import { Resend } from "resend";
import { admin } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import PasswordReset from "@/emails/PasswordReset";
import VerifyEmail from "@/emails/VerifyEmail";
import ChangeEmail from "@/emails/ChangeEmail";
import DeleteAccount from "@/emails/DeleteAccount";

const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY);

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  baseURL: process.env.BETTER_AUTH_URL,
  plugins: [admin(), nextCookies()],
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    revokeSessionsOnPasswordReset: true,
    sendResetPassword: async ({ user, url }) => {
      void resend.emails.send({
        from: process.env.EMAIL_FROM as string,
        to: user.email,
        subject: "Confirm Reset Password Request",
        react: PasswordReset({ user, url }),
      });
    },
    onPasswordReset: async ({ user }) => {
      console.log(`User ${user.email} has successfully reset their password.`);
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: false,
    sendVerificationEmail: async ({ user, url }) => {
      void resend.emails.send({
        from: process.env.EMAIL_FROM as string,
        to: user.email,
        subject: "Verify Email for WardPass",
        react: VerifyEmail({ user, url }),
      });
    },
    async afterEmailVerification(user) {
      console.log(`User ${user.email} has been successfully verified.`);
    },
  },
  user: {
    changeEmail: {
      enabled: true,
      sendChangeEmailConfirmation: async ({ user, newEmail, url }) => {
        void resend.emails.send({
          from: process.env.EMAIL_FROM as string,
          to: user.email, // Sent to the CURRENT email
          subject: "Confirm Email Change Request",
          react: ChangeEmail({ user, newEmail, url }),
        });
      },
    },
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
    },
  },
});
