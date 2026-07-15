import { useQuery } from "@tanstack/react-query";
import { getCookie } from "@/app/actions/cookie/getCookie";

export function GetCookieQuery(name: string) {
    return useQuery({
        queryKey: ["get-cookie"],
        queryFn: () => getCookie(name),
        refetchOnWindowFocus: false,
    })
}