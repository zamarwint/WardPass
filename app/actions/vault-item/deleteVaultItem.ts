'use server';

import { prisma } from '@/utils/db';
import { getUserSession } from '../getSession';
import { toast } from 'sonner';
import { redirect } from 'next/navigation';

export default async function deleteVaultItem({
    id,
    vaultId
}: {
    id: string,
    vaultId: string
}) {
    const session = await getUserSession();

    if (!session) {
        toast.error("You must be logged in to delete items from vaults.");
        redirect("/login");
    }

    const deletedVaultItem = await prisma.vaultItem.delete({
        where: {
            id: id,
            vaultId: vaultId
        }
    })

    // // UPDATING STATE FROM THE SERVER ACTION AFTER CREATING THE LOGIN ITEM. ONLY WORKS WITH DIALOGS, NOT DIVS, NOT ALERT DIALOGS.
    // revalidatePath(`/user/vault/${vaultId}`);
    return deletedVaultItem;
}