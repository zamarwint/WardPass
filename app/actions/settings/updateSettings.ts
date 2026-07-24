'use server'

import { prisma } from "@/utils/db";
import { getUserSession } from "../getSession"

export default async function updateSettings(autoLockTimeInMinutes?: number, hiddenTabTimeoutInMinutes?: number) {
    const session = await getUserSession();

    if (!session) {
        throw new Error("No session found.");
    }

    let data = {};

    if (autoLockTimeInMinutes && hiddenTabTimeoutInMinutes) {
        data = {
            autoLockTimeInMinutes,
            hiddenTabTimeoutInMinutes
        }
    } else if (autoLockTimeInMinutes) {
        data = {
            autoLockTimeInMinutes
        }
    } else if (hiddenTabTimeoutInMinutes) {
        data = {
            hiddenTabTimeoutInMinutes
        }
    }

    if (!data) {
        return null;
    }

    const settings = await prisma.settings.update({
        where: {
            userId: session.user.id,
        },
        data: data
    });

    console.log("Updated settings: " + settings.id);
    return settings;
}