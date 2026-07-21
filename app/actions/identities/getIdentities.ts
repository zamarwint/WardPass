'use server';

import { prisma } from "@/utils/db";
import { getUserSession } from "../getSession";
import { redirect } from "next/navigation";
import { toast } from "sonner";

export default async function getIdentities({ vaultId }: { vaultId: string }) {
    const session = await getUserSession();
    if (!session) {
        toast.error("You must be logged in to view your vaults.");
        redirect("/login");
    }

    const identities = await prisma.identityItem.findMany({
        where: {
            vaultId,
            deletedAt: null
        },
        select: {
            id: true,
            name: true,
            email: true,
            phoneNumber: true,
            organizationName: true,
            address1: true,
            address2: true,
            zipCode: true,
            city: true,
            state: true,
            country: true,
            floor: true,
            county: true,
            poBox: true,
            socialSecurityNumber: true,
            passportNumber: true,
            licenseNumber: true,
            companyName: true,
            occupation: true,
            x: true,
            linkedin: true,
            instagram: true,
            tiktok: true,
            facebook: true,
            github: true,
            other: true,
            createdAt: true,
            updatedAt: true,
        },
    })

    return identities;
}