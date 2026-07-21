'use server';

import { prisma } from "@/utils/db";
import { getUserSession } from "../getSession";
import { redirect } from "next/navigation";
import { toast } from "sonner";

export default async function getSecureNotes({ vaultId }: { vaultId: string }) {
    const session = await getUserSession();

    if (!session) {
        toast.error("You must be logged in to view your vaults.");
        redirect("/login");
    }

    const secureNotes = await prisma.secureNoteItem.findMany({
        where: {
            vaultId,
            deletedAt: null
        },
        select: {
            id: true,
            title: true,
            content: true,
            createdAt: true,
            updatedAt: true,
        },
    })

    return secureNotes;
}