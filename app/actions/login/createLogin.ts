'use server';

import { prisma } from '@/utils/db';
import { getUserSession } from '../getSession';

export default async function createLogin({
    vaultId,
    name,
    url,
    username,
    email,
    password,
    note
}: {
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

    const newLogin = await prisma.loginItem.create({
        data: {
            vaultId,
            name,
            url,
            username,
            email,
            password,
            note
        }
    })

    return newLogin;
}