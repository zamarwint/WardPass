import deleteVaultItem from "@/app/actions/vault-item/deleteVaultItem";
import { restoreVaultItem, trashVaultItem } from "@/app/actions/vault-item/trashVaultItem";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useDeleteVaultItemMutation(id: string, vaultId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['delete-item', id, vaultId],
        mutationFn: () => deleteVaultItem({ id, vaultId }),
        onMutate: () => {
            toast.dismiss();
            toast.loading("Deleting Item...");
        },
        onSuccess: () => {
            toast.dismiss();
            toast.success("Item deleted successfully!");
            queryClient.invalidateQueries({
                queryKey: ["trashedItems"],
                refetchType: 'active'
            });
            queryClient.invalidateQueries({
                queryKey: ["vaultItems"],
                refetchType: 'active'
            });
        },
        onError: (error) => {
            toast.dismiss();
            toast.error("There was an error deleting your Item. Please try again later." + error);
        }
    });
}

export function useRestoreVaultItemMutation(id: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['restore-item', id],
        mutationFn: () => restoreVaultItem(id),
        onMutate: () => {
            toast.dismiss();
            toast.loading("Restoring Item...");
        },
        onSuccess: () => {
            toast.dismiss();
            toast.success("Item restored successfully!");
            queryClient.invalidateQueries({
                queryKey: ["trashedItems"],
                refetchType: 'active'
            });
            queryClient.invalidateQueries({
                queryKey: ["vaultItems"],
                refetchType: 'active'
            });
        },
        onError: (error) => {
            toast.dismiss();
            toast.error("There was an error restoring your Item. Please try again later." + error);
        }
    });
}

export function useTrashVaultItemMutation(id: string, vaultId: string, onOpenChange: (open: boolean) => void) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['trash-item', id, vaultId],
        mutationFn: () => trashVaultItem(id),
        onMutate: () => {
            toast.dismiss();
            toast.loading("Moving Item to Trash...");
        },
        onSuccess: () => {
            toast.dismiss();
            toast.success("Item moved to Trash successfully!");
            onOpenChange(false);
            queryClient.invalidateQueries({
                queryKey: ["vaultItems", vaultId],
                refetchType: 'active'
            });
            queryClient.invalidateQueries({
                queryKey: ["trashedItems"],
                refetchType: 'active'
            });
        },
        onError: (error) => {
            toast.dismiss();
            toast.error("There was an error moving your Item to Trash. Please try again later." + error);
            onOpenChange(false);

        }
    });
}