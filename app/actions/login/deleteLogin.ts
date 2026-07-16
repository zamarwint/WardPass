'use server';

import { prisma } from '@/utils/db';
import { getUserSession } from '../getSession';

export default async function deleteLogin({
    id,
    vaultId,
    name
}: {
    id: string,
    vaultId: string,
    name: string
}) {
    const session = await getUserSession();

    if (!session) return;

    const deletedLogin = await prisma.loginItem.delete({
        where: {
            id: id,
            vaultId: vaultId,
            name: name
        },
    })

    return deletedLogin;
}