"use server";

import { headers } from "next/headers";
import { auth } from "../../utils/auth"

export const getUserSession = async () => {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    return session;
}