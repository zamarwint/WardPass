'use server';

import { prisma } from "@/utils/db";
import { getUserSession } from "../getSession";
import { redirect } from "next/navigation";
import { toast } from "sonner";

export default async function getVaultItems({ vaultId }: { vaultId: string }) {
    const session = await getUserSession();

    if (!session) {
        toast.error("You must be logged in to view vault items.");
        redirect("/login");
    }

    const vaultItems = await prisma.vaultItem.findMany({
        where: {
            vaultId,
            deletedAt: null
        }
    })

    return vaultItems;
}