'use server';

import { prisma } from '@/utils/db';
import { getUserSession } from '../getSession';

export default async function createCreditCard({
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

    const newCreditCard = await prisma.creditCardItem.create({
        data: {
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
        }
    })

    return newCreditCard;
}