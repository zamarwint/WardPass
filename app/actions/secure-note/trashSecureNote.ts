'use server'

import { prisma } from '@/utils/db';
import { getUserSession } from '../getSession';

export async function trashSecureNote(id: string) {
    const session = await getUserSession();
    if (!session) return;

    const trashedSecureNote = await prisma.secureNoteItem.update({
        where: {
            id
        },
        data: {
            deletedAt: new Date()
        }
    })

    return trashedSecureNote
}

export async function restoreSecureNote(id: string) {
    const session = await getUserSession();
    if (!session) return;

    const restoredSecureNote = await prisma.secureNoteItem.update({
        where: {
            id
        },
        data: {
            deletedAt: null
        }
    })

    return restoredSecureNote
}