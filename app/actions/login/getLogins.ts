'use server';

import { prisma } from "@/utils/db";
import { getUserSession } from "../getSession";
import { redirect } from "next/navigation";
import { toast } from "sonner";

export default async function getLogins({ vaultId }: { vaultId: string }) {
    const session = await getUserSession();

    if (!session) {
        toast.error("You must be logged in to view your vaults.");
        redirect("/login");
    }

    const logins = await prisma.loginItem.findMany({
        where: {
            vaultId,
            deletedAt: null
        },
        select: {
            id: true,
            name: true,
            url: true,
            username: true,
            email: true,
            password: true,
            note: true,
            createdAt: true,
            updatedAt: true,
        },
    })

    return logins;
}