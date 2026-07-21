'use server';

import { prisma } from "@/utils/db";
import { getUserSession } from "../getSession";
import { redirect } from "next/navigation";
import { toast } from "sonner";

export default async function getCreditCards({ vaultId }: { vaultId: string }) {
    const session = await getUserSession();
    if (!session) {
        toast.error("You must be logged in to view your vaults.");
        redirect("/login");
    }

    const creditCards = await prisma.creditCardItem.findMany({
        where: {
            vaultId,
            deletedAt: null
        },
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
    })

    return creditCards;
}