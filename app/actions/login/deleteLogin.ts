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

    // // UPDATING STATE FROM THE SERVER ACTION AFTER CREATING THE LOGIN ITEM. ONLY WORKS WITH DIALOGS, NOT DIVS, NOT ALERT DIALOGS.
    // revalidatePath(`/user/vault/${vaultId}`);
    return deletedLogin;
}