'use server';

import { prisma } from '@/utils/db';
import { getUserSession } from '../getSession';

export default async function updateCreditCard({
    id,
    vaultId,
    cardNumber,
    cardHolderName,
    expiryDate,
    cvv,
    billingAddress1,
    billingAddress2,
    zipCode,
    city,
    state,
    country
}: {
    id: string,
    vaultId: string,
    cardNumber: string,
    cardHolderName: string,
    expiryDate: string,
    cvv: number,
    billingAddress1: string,
    billingAddress2?: string,
    zipCode: string,
    city: string,
    state?: string,
    country: string
}) {
    const session = await getUserSession();
    if (!session) return;

    const updatedCreditCard = await prisma.creditCardItem.update({
        select: {
            id: true,
            cardNumber: true,
            cardHolderName: true,
            expiryDate: true,
            cvv: true,
            billingAddress1: true,
            billingAddress2: true,
            zipCode: true,
            city: true,
            state: true,
            country: true
        },
        where: {
            id: id,
            vaultId: vaultId
        },
        data: {
            cardNumber,
            cardHolderName,
            expiryDate,
            cvv,
            billingAddress1,
            billingAddress2,
            zipCode,
            city,
            state,
            country
        }
    })

    return updatedCreditCard;
}