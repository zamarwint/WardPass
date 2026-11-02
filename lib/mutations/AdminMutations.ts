import { createUser } from "@/app/actions/admin/createUser";
import { revokeUserSessionById } from "@/app/actions/admin/listUserSessions";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useRevokeUserSessionMutation({ sessionId }: { sessionId: string }) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['revoke-user-session'],
        mutationFn: () => revokeUserSessionById(sessionId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["dbListUserSessions"] });
            queryClient.invalidateQueries({ queryKey: ["listUserSessions"] });
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
