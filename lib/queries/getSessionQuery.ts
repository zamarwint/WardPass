import { useQuery } from "@tanstack/react-query";
import { getUserSession } from "@/app/actions/getSession";

export const GetAuthSession = () => {
    return useQuery({
        queryKey: ["get-session"],
        queryFn: () => getUserSession(),
        refetchOnMount: true,
        refetchOnReconnect: true,
        refetchOnWindowFocus: true,
        staleTime: 1000 * 60 * 2,
        gcTime: 1000 * 60 * 5
    })
}