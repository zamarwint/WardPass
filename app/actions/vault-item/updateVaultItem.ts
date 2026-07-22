'use server';

import { prisma } from '@/utils/db';
import { getUserSession } from '../getSession';
import { toast } from 'sonner';
import { redirect } from 'next/navigation';

export default async function updateLogin({
    id,
    vaultId,
    encryptedData,
    iv
}: {
    id: string,
    vaultId: string,
    encryptedData: string,
    iv: string
}) {
    const session = await getUserSession();

    if (!session) {
        toast.error("You must be logged in to update vault items.");
        redirect("/login");
    }

    const updatedLogin = await prisma.vaultItem.update({
        select: {
            encryptedData: true,
            iv: true
        },
        where: {
            id: id,
            vaultId: vaultId
        },
        data: {
            encryptedData,
            iv
        }
    })

    return updatedLogin;
}