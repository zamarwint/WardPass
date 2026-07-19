'use server';

import { prisma } from '@/utils/db';
import { getUserSession } from '../getSession';

export default async function updateSecureNote({
    id,
    vaultId,
    title,
    content
}: {
    id: string,
    vaultId: string,
    title: string,
    content: string
}) {
    const session = await getUserSession();
    if (!session) return;

    const updatedSecureNote = await prisma.secureNoteItem.update({
        select: {
            id: true,
            title: true,
            content: true,
        },
        where: {
            id: id,
            vaultId: vaultId,
            title: title
        },
        data: {
            title,
            content
        }
    })

    return updatedSecureNote;
}