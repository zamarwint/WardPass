'use server';

import { prisma } from '@/utils/db';
import { getUserSession } from '../getSession';

export default async function deleteSecureNote({
    id,
    vaultId,
    title
}: {
    id: string,
    vaultId: string,
    title: string
}) {
    const session = await getUserSession();
    if (!session) return;

    const deletedSecureNote = await prisma.secureNoteItem.delete({
        where: {
            id: id,
            vaultId: vaultId,
            title: title
        }
    });

    return deletedSecureNote;
}