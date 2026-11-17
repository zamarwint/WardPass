import { useMutation } from "@tanstack/react-query";
import { encryptData } from "../crypto/aes";
import { updateVault } from "@/actions/vault/updateVault";
import { useVaultStore } from "@/stores/vault";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import updateVaultItem from "@/actions/vault-item/updateVaultItem";
import {
  CreditCardJSONRaw,
  IdentityJSONRaw,
  LoginJSONRaw,
  SecureNoteJSONRaw,
} from "../types/RawVaultItemType";

export function useUpdateVault(
  vaultId: string,
  vaultName: string,
  selectedIcon: string,
  vaultColor: string,
  onOpenChange: (open: boolean) => void,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["update-vault", vaultId],
    mutationFn: async () => {
      // Updating vault metadata (name, icon, color) preserves existing encryption
      const result = await updateVault(
        vaultId,
        vaultName,
        selectedIcon as string, // icon
        vaultColor, // iconColor
      );

      return result;
    },
    onMutate: () => {
      toast.dismiss();
      toast.loading("Updating vault...");
    },
    onSuccess: () => {
      toast.dismiss();
      toast.success("Vault updated successfully!");
      onOpenChange(false);
      queryClient.invalidateQueries({
        queryKey: ["vaults"],
        refetchType: "active",
      });
      queryClient.invalidateQueries({
        queryKey: ["vaultPage", vaultId],
        refetchType: "active",
      });
    },
    onError: (error) => {
      toast.dismiss();
      toast.error(
        "There was an error updating your vault. Please try again later." +
          error,
      );
      onOpenChange(false);
    },
  });
}

export function useUpdateVaultItem<
  T extends CreditCardJSONRaw | IdentityJSONRaw | SecureNoteJSONRaw | LoginJSONRaw,
>(
  id: string,
  vaultId: string,
  onSuccessCallback?: () => void,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["update-vault-item", vaultId, id],
    mutationFn: async (data: T) => {
      const vaultKey = useVaultStore.getState().getVaultKey(vaultId);
      if (!vaultKey) {
        throw new Error("Vault is locked. Please unlock the vault first.");
      }
      const payload = JSON.stringify(data);
      const { ciphertext, iv } = encryptData(payload, vaultKey);
      return await updateVaultItem({ id, vaultId, encryptedData: ciphertext, iv });
    },
    onMutate: () => {
      toast.loading("Updating vault item...");
    },
    onSuccess: () => {
      toast.dismiss();
      toast.success("Vault item updated successfully");
      if (onSuccessCallback) onSuccessCallback();
      queryClient.invalidateQueries({
        queryKey: ["vaultPage", vaultId],
        refetchType: "active",
      });
    },
    onError: (error) => {
      toast.dismiss();
      toast.error("Failed to update vault item." + error);
    },
  });
}
