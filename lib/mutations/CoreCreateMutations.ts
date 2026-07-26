import { useMutation } from "@tanstack/react-query";
import { deriveKey, generateSalt, toBase64 } from "../crypto/argon2";
import { createVerificationHash, encryptData, encryptVaultKey, generateVaultKey } from "../crypto/aes";
import { createVault } from "@/app/actions/vault/createVault";
import { useVaultStore } from "@/stores/vault";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { CreditCardJSON, IdentityJSON, LoginJSON, SecureNoteJSON } from "../types/RawVaultItemType";
import createVaultItem from "@/app/actions/vault-item/createVaultItem";
import { VaultItemType } from "../types/VaultType";

export function useCreateVault(vaultName: string, selectedIcon: string, vaultColor: string, masterPassword: string, setMasterPassword: (value: string) => void, setOpen: (value: boolean) => void) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['create-vault', vaultName],
        mutationFn: async () => {
            // ✅ Read directly from local state, not the Zustand store
            if (!masterPassword) {
                throw new Error("Please enter your master password.");
            }

            const salt = generateSalt();
            const derivedKey = await deriveKey(masterPassword, salt);
            const vaultKey = generateVaultKey();

            const { encryptedKey, keyIv } = encryptVaultKey(vaultKey, derivedKey);
            const { hash: verificationHash, hashIv } = createVerificationHash(vaultKey);

            // ✅ After vault is created, unlock it immediately so the user
            //    doesn't have to re-enter their password right away
            const result = await createVault(
                vaultName,
                selectedIcon,
                vaultColor,
                toBase64(salt),
                encryptedKey,
                keyIv,
                verificationHash,
                hashIv
            );

            // ✅ After creating the vault, unlock it immediately by passing its ID
            useVaultStore.getState().unlock(result!.id, vaultKey);

            return result;
        },
        onMutate: () => {
            toast.dismiss();
            toast.loading("Generating encryption keys and creating vault...");
        },
        onSuccess: () => {
            toast.dismiss();
            setMasterPassword("")
            setOpen(false);
            queryClient.invalidateQueries({
                queryKey: ["vaults"],
                refetchType: 'active'
            });
            toast.success("Vault created successfully!");
        },
        onError: (error) => {
            toast.dismiss();
            setOpen(false);
            toast.error(error.message || "There was an error creating your vault. Please try again later.");
        }
    });
}

export function useCreateVaultItem(vaultId: string, data: CreditCardJSON | IdentityJSON | SecureNoteJSON | LoginJSON, cancel: () => void, type: VaultItemType) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['create-vault-item', vaultId],
        mutationFn: () => {
            const vaultKey = useVaultStore.getState().getVaultKey(vaultId);
            const payload = JSON.stringify(data);
            const { ciphertext, iv } = encryptData(payload, vaultKey);
            return createVaultItem({ vaultId, encryptedData: ciphertext, iv, itemType: type });
        },
        onMutate: () => {
            toast.loading("Adding vault item...")
        },
        onSuccess: () => {
            toast.dismiss();
            toast.success("Vault item added successfully");
            cancel();
            queryClient.invalidateQueries({
                queryKey: ["vaultItems", vaultId],
                refetchType: 'active'
            });
        },
        onError: (error) => {
            toast.dismiss();
            toast.error("Failed to add vault item. " + error)
        }
    })
}