import { useQuery } from "@tanstack/react-query";
import { getUserSession } from "@/app/actions/getSession";

export const getAuthSession = () => {
    return useQuery({
        queryKey: ["get-session"],
        refetchOnWindowFocus: false,
        queryFn: () => getUserSession()
    })
}