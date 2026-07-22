'use server';

import { prisma } from "@/utils/db";
import { getUserSession } from "../getSession";
import { revalidatePath } from "next/cache";

export async function updateVault(vaultId: string, name?: string, slug?: string, icon?: string, iconColor?: string) {
    const session = await getUserSession();

    if (!session) return;

    const vault = await prisma.vault.update({
        where: {
            userId: session.user.id,
            id: vaultId
        },
        data: {
            name,
            slug,
            icon,
            iconColor
        }
    })

    revalidatePath(`/user/vault/${vault.id}`);
    return vault;
}