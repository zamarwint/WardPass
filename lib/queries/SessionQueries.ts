import { checkAdminSession, getUserSession } from "@/app/actions/getSession";
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

// CHECK ADMIN SESSION, AND REFETCH WHEN CRUD OPERATIONS OCCUR, AND WHEN THE PAGE IS REVISITED
export function useCheckAdminSession() {
    return useQuery({
        queryKey: ['checkAdminSession'],
        queryFn: () => checkAdminSession(),
        refetchOnMount: true,
        refetchOnReconnect: true,
        refetchOnWindowFocus: true,
        staleTime: 1000 * 60 * 2,
        gcTime: 1000 * 60 * 5
    })
}