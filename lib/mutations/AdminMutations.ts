import { createUser } from "@/app/actions/admin/createUser";
import { revokeUserSession } from "@/app/actions/admin/revokeUserSession";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useRevokeUserSessionMutation({ sessionToken }: { sessionToken: string }) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['revoke-user-session'],
        mutationFn: () => revokeUserSession({ sessionToken }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['list-user-sessions'] });
        }
    })
}

export function useCreateUserMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['create-user'],
        mutationFn: ({ email, password, name }: { email: string, password: string, name: string }) => createUser({ email, password, name }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['list-users'] });
        }
    })
}