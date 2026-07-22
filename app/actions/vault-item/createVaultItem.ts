'use server';

import { prisma } from '@/utils/db';
import { getUserSession } from '../getSession';
import { VaultItemType } from '@/lib/types/VaultType';
import { toast } from 'sonner';
import { redirect } from 'next/navigation';

export default async function createVaultItem({
    vaultId,
    encryptedData,
    iv,
    itemType
}: {
    vaultId: string,
    encryptedData: string,
    iv: string,
    itemType: VaultItemType
}) {
    const session = await getUserSession();

    if (!session) {
        toast.error("You must be logged in to create a vault item.");
        redirect("/login");
    }

    const newVaultItem = await prisma.vaultItem.create({
        data: {
            itemType,
            vaultId,
            encryptedData,
            iv
        }
    })

    return newVaultItem;
}