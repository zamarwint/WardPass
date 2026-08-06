import { listUserSessions } from "@/app/actions/admin/listUserSessions";
import { listUsers } from "@/app/actions/admin/listUsers";
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

// ADMIN SESSION QUERIES
export function useListUsers({ limit }: { limit?: number }) {
    return useQuery({
        queryKey: ['listUsers', limit],
        queryFn: () => listUsers(limit),
        refetchOnMount: true,
        refetchOnReconnect: true,
        refetchOnWindowFocus: true,
        staleTime: 1000 * 60 * 2,
        gcTime: 1000 * 60 * 5
    })
}

export function useListUserSessions({ userId }: { userId: string | undefined }) {
    return useQuery({
        queryKey: ['listUserSessions', userId],
        queryFn: () => listUserSessions({ userId: userId as string }),
        refetchOnMount: true,
        refetchOnReconnect: true,
        refetchOnWindowFocus: true,
        staleTime: 1000 * 60 * 2,
        gcTime: 1000 * 60 * 5
    })
}