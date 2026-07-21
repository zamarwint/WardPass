'use server'

import { prisma } from '@/utils/db';
import { getUserSession } from '../getSession';

export async function trashIdentity(id: string) {
    const session = await getUserSession();
    if (!session) return;

    const trashedIdentity = await prisma.identityItem.update({
        where: {
            id
        },
        data: {
            deletedAt: new Date()
        }
    })

    return trashedIdentity
}

export async function restoreIdentity(id: string) {
    const session = await getUserSession();
    if (!session) return;

    const restoredIdentity = await prisma.identityItem.update({
        where: {
            id
        },
        data: {
            deletedAt: null
        }
    })

    return restoredIdentity
}