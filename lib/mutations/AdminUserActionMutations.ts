import { banUser, impersonateUser, removeUser, revokeAllUserSessions, setUserPassword, setUserRole, stopImpersonatingUser, unbanUser, updateUser } from "@/app/actions/admin/userActions";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useSetUserRole() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ userId, role }: { userId: string, role: "admin" | "user" | ("admin" | "user")[] }) => setUserRole({ userId, role }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['list-users'] });
        }
    })
}

export function useSetUserPassword() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ userId, newPassword }: { userId: string, newPassword: string }) => setUserPassword({ userId, newPassword }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['list-users'] });
        }
    })
}

export function useUpdateUser() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ userId, userData }: { userId: string, userData: { name?: string, email?: string, image?: string } }) => updateUser({ userId, userData }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['list-users'] });
        }
    })
}

export function useBanUser() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ userId, banReason, banExpiresIn }: { userId: string, banReason: string, banExpiresIn: number }) => banUser({ userId, banReason, banExpiresIn }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['list-users'] });
        }
    })
}

export function useUnbanUser() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ userId }: { userId: string }) => unbanUser({ userId }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['list-users'] });
        }
    })
}

export function useRevokeAllUserSessions() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ userId }: { userId: string }) => revokeAllUserSessions(userId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['list-users'] });
        }
    })
}

export function useImpersonateUser() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ userId }: { userId: string }) => impersonateUser(userId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['list-users'] });
        }
    })
}

export function useStopImpersonation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: () => stopImpersonatingUser(),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['list-users'] });
        }
    })
}

export function useRemoveUser() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ userId }: { userId: string }) => removeUser(userId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['list-users'] });
        }
    })
}