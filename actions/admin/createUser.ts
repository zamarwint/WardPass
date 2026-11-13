'use server'

import { auth } from "@/utils/auth"

export async function createUser({
    email,
    password,
    name
}: {
    email: string,
    password: string,
    name: string
}) {
    const newUser = await auth.api.createUser({
        body: {
            email, // required
            password, // required
            name, // required
            role: "user",
        },
    });

    return newUser;
}