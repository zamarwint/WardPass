'use server';

import { prisma } from '@/utils/db';
import { getUserSession } from '../getSession';

export default async function createSecureNote({
    vaultId,
    title,
    content
}: {
    vaultId: string,
    title: string,
    content: string
}) {
    const session = await getUserSession();
    if (!session) return;

    const newSecureNote = await prisma.secureNoteItem.create({
        data: {
            vaultId,
            title,
            content
        }
    });

    return newSecureNote;
}