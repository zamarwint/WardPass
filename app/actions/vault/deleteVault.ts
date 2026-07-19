'use server';

import { prisma } from "@/utils/db";
import { getUserSession } from "../getSession";
import { revalidatePath } from "next/cache";

export async function deleteVault(vaultId: string) {
    const session = await getUserSession();

    if (!session) return;

    const vault = await prisma.vault.delete({
        where: {
            userId: session.user.id,
            id: vaultId
        }
    })

    revalidatePath(`/user/vault`);
    return vault;
}