'use server';

import { cookies } from 'next/headers';

export async function createCookie(name: string, value: string, path?: string) {
    const cookieStore = await cookies();

    cookieStore.set({
        name,
        value,
        maxAge: 10 * 60, // 10 minutes
        path: path || '/' // default path is '/'
    })

    return cookieStore;
}