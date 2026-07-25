import { getUserSession } from "@/app/actions/getSession";
import { useQuery } from "@tanstack/react-query";

// GET SESSION, AND REFETCH WHEN CRUD OPERATIONS OCCUR, AND WHEN THE PAGE IS REVISITED
export function useGetSession() {
    return useQuery({
        queryKey: ['session'],
        queryFn: () => getUserSession(),
        refetchOnMount: true,
        refetchOnReconnect: true,
        refetchOnWindowFocus: true,
        staleTime: 1000 * 60 * 2,
        gcTime: 1000 * 60 * 5
    })
}