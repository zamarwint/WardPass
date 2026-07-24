import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./db";
import { sendEmail } from "@/lib/sendEmail";
import { redirect } from "next/navigation";

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql", // or "mysql", "postgresql", ...etc
    }),
    baseURL: process.env.BETTER_AUTH_URL,
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: true,
        revokeSessionsOnPasswordReset: true,
        sendResetPassword: async ({ user, url }) => {
            sendEmail({
                to: user.email,
                subject: 'Reset your WardPass password',
                text: `<div><p>Click the link to reset your password:</p><a href="${url}">Reset password</a></div>`
            })
        },
        onPasswordReset: async ({ user }) => {
            console.log(`User ${user.email} has successfully reset their password.`);
        }
    },
    emailVerification: {
        sendOnSignUp: true,
        autoSignInAfterVerification: true,
        sendVerificationEmail: async ({ user, url }) => {
            sendEmail({
                to: user.email,
                subject: "Verify your email address for WardPass.",
                text: `<div><p>Click the link to verify your email:</p> <a href="${url}">Verify your email</a></div>`,
            });
        },
        async afterEmailVerification(user) {
            console.log(`User ${user.email} has been successfully verified.`);

            // Create Settings
            const createSettings = await prisma.settings.create({
                data: {
                    userId: user.id,
                }
            });

            console.log('Created settings: ' + createSettings.id);
            redirect('/user/vault');
        }
    },
    user: {
        changeEmail: {
            enabled: true,
            sendChangeEmailConfirmation: async ({ user, newEmail, url }) => {
                sendEmail({
                    to: user.email, // Sent to the CURRENT email
                    subject: 'Approve email change',
                    text: `<div><p>Click the link to approve the change to ${newEmail}:</p> <a href="${url}">Verify email change.</a></div>`
                })
            }
        },
        deleteUser: {
            enabled: true,
            sendDeleteAccountVerification: async (
                {
                    user,   // The user object
                    url, // The auto-generated URL for deletion
                },
            ) => {
                // Your email sending logic here
                sendEmail({
                    to: user.email,
                    subject: "Verify Deletion for your WardPass Account.",
                    text: `<div><p>Click the link to verify deletion:</p><a href="${url}">Verify Deletion</a></div>`
                });
            },
            afterDelete: async ({ id, name }) => {
                console.log('Account with name: ' + name + ' has been deleted.');

                const vaults = await prisma.vault.findMany({
                    where: {
                        userId: id,
                    }
                })

                console.log('Found ' + vaults.length + ' vaults for ' + name);
                console.log('Deleting all data from the vaults...');

                vaults.forEach(async (vault) => {
                    await prisma.vaultItem.deleteMany({
                        where: {
                            vaultId: vault.id,
                        }
                    });
                })

                console.log('Deleted all data from the vaults, deleting user vaults...');

                const { count } = await prisma.vault.deleteMany({
                    where: {
                        userId: id
                    }
                })

                console.log('Successfully deleted all of' + name + ' vaults. Total vaults: ' + count);
            }
        }
    },
    socialProviders: {
        google: {
            prompt: "select_account",
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        },
    },
});