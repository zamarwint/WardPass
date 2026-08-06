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