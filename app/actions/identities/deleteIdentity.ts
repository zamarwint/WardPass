'use server';

import { prisma } from '@/utils/db';
import { getUserSession } from '../getSession';

export default async function deleteIdentity({ id, vaultId, name, email, phoneNumber, organizationName }: {
    id: string,
    vaultId: string,
    name: string,
    email: string,
    phoneNumber: string,
    organizationName: string
}) {
    const session = await getUserSession();
    if (!session) return;

    const deletedIdentity = await prisma.identityItem.delete({
        where: {
            id: id,
            vaultId: vaultId,
            name: name,
            email: email,
            phoneNumber: phoneNumber,
            organizationName: organizationName
        },
    })

    return deletedIdentity;
}