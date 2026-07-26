'use server';

import { prisma } from "@/utils/db";
import { getUserSession } from "../getSession";
import { revalidatePath } from "next/cache";

export async function updateVault(
    vaultId: string,
    name: string,
    icon?: string,
    iconColor?: string,
    salt?: string,
    encryptedKey?: string,
    keyIv?: string,
    verificationHash?: string,
    hashIv?: string,
) {
    const session = await getUserSession();

    if (!session) return;

    const slug = name.toLowerCase().replace(/\s/g, '-');
    const vault = await prisma.vault.update({
        where: {
            userId: session.user.id,
            id: vaultId
        },
        data: {
            name,
            slug,
            icon,
            iconColor,
            salt,
            encryptedKey,
            keyIv,
            verificationHash,
            hashIv,
        }
    })

    revalidatePath(`/user/vault/${vault.id}`);
    return vault;
}