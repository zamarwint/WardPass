'use server';

import { prisma } from '@/utils/db';
import { getUserSession } from '../getSession';

export default async function deleteCreditCard({
    id,
    vaultId,
    cardHolderName,
    cardNumber
}: {
    id: string,
    vaultId: string,
    cardHolderName: string,
    cardNumber: string
}) {
    const session = await getUserSession();
    if (!session) return;

    const deletedCreditCard = await prisma.creditCardItem.delete({
        where: {
            id: id,
            vaultId: vaultId,
            cardNumber: cardNumber,
            cardHolderName: cardHolderName
        },

    })

    return deletedCreditCard;
}