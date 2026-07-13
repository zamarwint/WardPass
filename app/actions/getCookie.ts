"use server"

import { cookies } from 'next/headers'

export async function getCookie(name: string) {
    const cookieStore = await cookies();

    if (!cookieStore.has(name)) throw new Error("Cookie not found!");
    const cookieValue = cookieStore.get(name);

    return cookieValue?.value;
}