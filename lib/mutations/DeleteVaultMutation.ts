import { deleteVault } from "@/actions/vault/deleteVault";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useDeleteVaultMutation(
  vaultId: string,
  onOpenChange: (open: boolean) => void,
) {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationKey: ["delete-vault", vaultId],
    mutationFn: () => deleteVault(vaultId),
    onMutate: () => {
      toast.dismiss();
      toast.loading("Deleting vault...");
    },
    onSuccess: () => {
      toast.dismiss();
      toast.success("Vault deleted successfully!");
      router.push("/");
      queryClient.invalidateQueries({
        queryKey: ["vaults"],
        refetchType: "active",
      });
      onOpenChange(false);
    },
    onError: (error) => {
      toast.dismiss();
      toast.error(
        "There was an error deleting your vault. Please try again later." +
          error,
      );
      onOpenChange(false);
    },
  });
}
