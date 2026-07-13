import { useQuery } from "@tanstack/react-query";
import { getCookie } from "@/app/actions/getCookie";

export function getCookieQuery(name: string) {
    return useQuery({
        queryKey: ["get-cookie"],
        queryFn: () => getCookie(name),
        refetchOnWindowFocus: false,
    })
}