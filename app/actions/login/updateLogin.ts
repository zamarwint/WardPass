'use server';

import { prisma } from '@/utils/db';
import { getUserSession } from '../getSession';

export default async function updateLogin({
    id,
    vaultId,
    name,
    url,
    username,
    email,
    password,
    note
}: {
    id: string,
    vaultId: string,
    name: string,
    url?: string,
    username?: string,
    email: string,
    password: string,
    note?: string
}) {
    const session = await getUserSession();

    if (!session) return;

    const updatedLogin = await prisma.loginItem.update({
        select: {
            name: true,
            url: true,
            username: true,
            email: true,
            password: true,
            note: true,
        },
        where: {
            id: id,
            vaultId: vaultId
        },
        data: {
            name,
            url,
            username,
            email,
            password,
            note
        }
    })

    return updatedLogin;
}