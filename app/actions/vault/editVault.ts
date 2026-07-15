'use server';

import { prisma } from "@/utils/db";
import { getUserSession } from "../getSession";

export async function editVault(vaultId: string, name?: string, icon?: string, iconColor?: string) {
    const session = await getUserSession();

    if (!session) return;

    const vault = await prisma.vault.update({
        where: {
            userId: session.user.id,
            id: vaultId
        },
        data: {
            name,
            icon,
            iconColor
        }
    })

    return vault;
}