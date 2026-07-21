'use server'

import { prisma } from '@/utils/db';
import { getUserSession } from '../getSession';

export async function trashLogin(id: string) {
    const session = await getUserSession();
    if (!session) return;

    const trashedLogin = await prisma.loginItem.update({
        where: {
            id
        },
        data: {
            deletedAt: new Date()
        }
    })

    return trashedLogin
}

export async function restoreLogin(id: string) {
    const session = await getUserSession();
    if (!session) return;

    const restoredLogin = await prisma.loginItem.update({
        where: {
            id
        },
        data: {
            deletedAt: null
        }
    })

    return restoredLogin
}