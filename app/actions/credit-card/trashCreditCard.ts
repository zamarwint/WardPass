'use server'

import { prisma } from '@/utils/db';
import { getUserSession } from '../getSession';

export async function trashCreditCard(id: string) {
    const session = await getUserSession();
    if (!session) return;

    const trashedCreditCard = await prisma.creditCardItem.update({
        where: {
            id
        },
        data: {
            deletedAt: new Date()
        }
    })

    return trashedCreditCard
}

export async function restoreCreditCard(id: string) {
    const session = await getUserSession();
    if (!session) return;

    const restoredCreditCard = await prisma.creditCardItem.update({
        where: {
            id
        },
        data: {
            deletedAt: null
        }
    })

    return restoredCreditCard
}