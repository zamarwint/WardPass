'use server';

import { prisma } from "@/utils/db";
import { getUserSession } from "../getSession";
import { revalidatePath } from "next/cache";

export async function createVault(name: string, icon: string, iconColor: string) {
    const session = await getUserSession();

    if (!session) return;

    const slug = name.toLowerCase().replace(/\s/g, '-');
    const vault = await prisma.vault.create({
        data: {
            name,
            slug,
            icon,
            iconColor,
            userId: session.user.id
        }
    })

    revalidatePath(`/user/vault/${vault.id}`);
    return vault;
}