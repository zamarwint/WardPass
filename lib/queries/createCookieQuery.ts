import { useQuery } from "@tanstack/react-query";
import { createCookie } from "@/app/actions/createCookie";

export function createCookieQuery(name: string, value: string) {
    return useQuery({
        queryKey: ["create-cookie"],
        queryFn: () => createCookie(name, value),
        refetchOnWindowFocus: false
    })
}