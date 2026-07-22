'use server'

import { prisma } from '@/utils/db';
import { getUserSession } from '../getSession';
import { toast } from 'sonner';
import { redirect } from 'next/navigation';

export async function trashVaultItem(id: string) {
    const session = await getUserSession();

    if (!session) {
        toast.error("You must be logged in to trash a vault item.");
        redirect("/login");
    }

    const trashedVaultItem = await prisma.vaultItem.update({
        where: {
            id
        },
        data: {
            deletedAt: new Date()
        }
    })

    return trashedVaultItem
}

export async function restoreVaultItem(id: string) {
    const session = await getUserSession();

    if (!session) {
        toast.error("You must be logged in to restore a vault item.");
        redirect("/login");
    }

    const restoredVaultItem = await prisma.vaultItem.update({
        where: {
            id
        },
        data: {
            deletedAt: null
        }
    })

    return restoredVaultItem
}