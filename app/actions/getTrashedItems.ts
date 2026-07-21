'use server'

import { prisma } from '@/utils/db';
import { getUserSession } from './getSession';
import { CreditCardItem, IdentityItem, LoginItem, SecureNoteItem } from '@/lib/types/VaultItemType';

export async function getTrashedItemsInAllVaults(userId: string) {
    const session = await getUserSession();
    if (!session) return;

    const trashedItems = await prisma.vault.findMany({
        where: {
            userId
        },
        select: {
            id: true,
            loginItems: {
                where: {
                    deletedAt: {
                        not: null
                    }
                }
            },
            secureNoteItems: {
                where: {
                    deletedAt: {
                        not: null
                    }
                }
            },
            creditCardItems: {
                where: {
                    deletedAt: {
                        not: null
                    }
                }
            },
            identities: {
                where: {
                    deletedAt: {
                        not: null
                    }
                }
            }
        },
    })

    const allLoginItems: LoginItem[] = [];
    const allSecureNoteItems: SecureNoteItem[] = [];
    const allCreditCardItems: CreditCardItem[] = [];
    const allIdentities: IdentityItem[] = [];

    trashedItems.forEach((item) => {
        allLoginItems.push(...item.loginItems as LoginItem[]);
        allSecureNoteItems.push(...item.secureNoteItems as SecureNoteItem[]);
        allCreditCardItems.push(...item.creditCardItems as CreditCardItem[]);
        allIdentities.push(...item.identities as IdentityItem[]);
    });

    return {
        loginItems: allLoginItems,
        secureNoteItems: allSecureNoteItems,
        creditCardItems: allCreditCardItems,
        identities: allIdentities,
    };
}