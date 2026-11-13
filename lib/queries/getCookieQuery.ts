import { useQuery } from "@tanstack/react-query";
import { getCookie } from "@/actions/cookie/getCookie";

export function GetCookieQuery(name: string) {
  return useQuery({
    queryKey: ["get-cookie"],
    queryFn: () => getCookie(name),
    refetchOnReconnect: true,
    refetchOnWindowFocus: true,
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 5,
  });
}
