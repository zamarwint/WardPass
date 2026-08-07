import { dbListUserImpersonations, dbListUserSessions, searchUserSession } from "@/app/actions/admin/listUserSessions";
import { getUser, listUsers } from "@/app/actions/admin/users";
import { useQuery } from "@tanstack/react-query";

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

export function useGetUser({ userId }: { userId: string }) {
    return useQuery({
        queryKey: ['getUser', userId],
        queryFn: () => getUser({ userId }),
        refetchOnMount: true,
        refetchOnReconnect: true,
        refetchOnWindowFocus: true,
        staleTime: 1000 * 60 * 2,
        gcTime: 1000 * 60 * 5
    })
}

export function useSearchUserSession({ userId }: { userId: string | undefined }) {
    return useQuery({
        queryKey: ['listUserSessions', userId],
        queryFn: () => searchUserSession({ userId: userId as string }),
        refetchOnMount: true,
        refetchOnReconnect: true,
        refetchOnWindowFocus: true,
        staleTime: 1000 * 60 * 2,
        gcTime: 1000 * 60 * 5
    })
}

export function useDBListUserSessions() {
    return useQuery({
        queryKey: ['dbListUserSessions'],
        queryFn: () => dbListUserSessions(),
        refetchOnMount: true,
        refetchOnReconnect: true,
        refetchOnWindowFocus: true,
        staleTime: 1000 * 60 * 2,
        gcTime: 1000 * 60 * 5
    })
}

export function useDBListUserImpersonations() {
    return useQuery({
        queryKey: ['dbListUserImpersonations'],
        queryFn: () => dbListUserImpersonations(),
        refetchOnMount: true,
        refetchOnReconnect: true,
        refetchOnWindowFocus: true,
        staleTime: 1000 * 60 * 2,
        gcTime: 1000 * 60 * 5
    })
}