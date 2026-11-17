import { useMutation } from "@tanstack/react-query";
import { deriveKey, generateSalt, toBase64 } from "../crypto/argon2";
import {
  createVerificationHash,
  encryptData,
  encryptVaultKey,
  generateVaultKey,
} from "../crypto/aes";
import { createVault } from "@/actions/vault/createVault";
import { useVaultStore } from "@/stores/vault";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import {
  CreditCardJSONRaw,
  IdentityJSONRaw,
  LoginJSONRaw,
  SecureNoteJSONRaw,
} from "../types/RawVaultItemType";
import createVaultItem from "@/actions/vault-item/createVaultItem";
import { VaultItemType } from "../types/VaultType";

export function useCreateVault(
  vaultName: string,
  selectedIcon: string,
  vaultColor: string,
  masterPassword?: string,
  setMasterPassword?: (value: string) => void,
  setOpen?: (value: boolean) => void,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["create-vault", vaultName],
    mutationFn: async () => {
      // Use provided password or fall back to the in-memory account password
      const password = masterPassword || useVaultStore.getState().masterPassword;
      if (!password) {
        throw new Error("Please enter your account password to create a vault.");
      }

      const salt = generateSalt();
      const derivedKey = await deriveKey(password, salt);
      const vaultKey = generateVaultKey();

      const { encryptedKey, keyIv } = encryptVaultKey(vaultKey, derivedKey);
      const { hash: verificationHash, hashIv } =
        createVerificationHash(vaultKey);

      // ✅ After vault is created, unlock it immediately using the account password
      const result = await createVault(
        vaultName,
        selectedIcon,
        vaultColor,
        toBase64(salt),
        encryptedKey,
        keyIv,
        verificationHash,
        hashIv,
      );

      // ✅ Ensure masterPassword is saved and vault is unlocked immediately
      useVaultStore.getState().setMasterPassword(password);
      useVaultStore.getState().unlock(result!.id, vaultKey);

      return result;
    },
    onMutate: () => {
      toast.dismiss();
      toast.loading("Generating encryption keys and creating vault...");
    },
    onSuccess: () => {
      toast.dismiss();
      if (setMasterPassword) setMasterPassword("");
      if (setOpen) setOpen(false);
      queryClient.invalidateQueries({
        queryKey: ["vaults"],
        refetchType: "active",
      });
      toast.success("Vault created successfully!");
    },
    onError: (error) => {
      toast.dismiss();
      if (setOpen) setOpen(false);
      toast.error(
        error.message ||
          "There was an error creating your vault. Please try again later.",
      );
    },
  });
}

export function useCreateVaultItem<
  T extends CreditCardJSONRaw | IdentityJSONRaw | SecureNoteJSONRaw | LoginJSONRaw,
>(
  vaultId: string,
  type: VaultItemType,
  onSuccessCallback?: () => void,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["create-vault-item", vaultId],
    mutationFn: async (data: T) => {
      const vaultKey = useVaultStore.getState().getVaultKey(vaultId);
      if (!vaultKey) {
        throw new Error("Vault is locked. Please unlock the vault first.");
      }
      const payload = JSON.stringify(data);
      const { ciphertext, iv } = encryptData(payload, vaultKey);
      return await createVaultItem({
        vaultId,
        encryptedData: ciphertext,
        iv,
        itemType: type,
      });
    },
    onMutate: () => {
      toast.loading("Adding vault item...");
    },
    onSuccess: () => {
      toast.dismiss();
      toast.success("Vault item added successfully");
      if (onSuccessCallback) onSuccessCallback();
      queryClient.invalidateQueries({
        queryKey: ["vaultPage", vaultId],
        refetchType: "active",
      });
    },
    onError: (error) => {
      toast.dismiss();
      toast.error("Failed to add vault item. " + error);
    },
  });
}
