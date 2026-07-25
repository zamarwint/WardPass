import { createCookie } from "@/app/actions/cookie/createCookie";
import { useMutation } from "@tanstack/react-query";

export function CreateCookieMutation(name: string, value: string) {
    return useMutation({
        mutationKey: ['create-cookie'],
        mutationFn: () => createCookie(name, value)
    })
}