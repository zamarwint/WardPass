import { useMutation } from "@tanstack/react-query";
import { deriveKey, generateSalt, toBase64 } from "../crypto/argon2";
import { createVerificationHash, encryptData, encryptVaultKey } from "../crypto/aes";
import { updateVault } from "@/app/actions/vault/updateVault";
import { useVaultStore } from "@/stores/vault";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import updateVaultItem from "@/app/actions/vault-item/updateVaultItem";
import { CreditCardJSON, IdentityJSON, LoginJSON, SecureNoteJSON } from "../types/RawVaultItemType";

export function useUpdateVault(vaultId: string, vaultName: string, selectedIcon: string, vaultColor: string, masterPassword: string, setMasterPassword: (value: string) => void, onOpenChange: (open: boolean) => void) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['update-vault', vaultId],
        mutationFn: async () => {
            // ✅ Read directly from local state, not the Zustand store
            if (!masterPassword) {
                throw new Error("Please enter your master password.");
            }

            // Generate a fresh 16-byte salt for the new master password.
            // Never reuse the existing salt — deriving a new key must use a new salt.
            const saltBytes = generateSalt();
            const salt = toBase64(saltBytes);
            const derivedKey = await deriveKey(masterPassword, saltBytes);

            // ⚠️ CRITICAL: Reuse the EXISTING vault key — do NOT generate a new one.
            // All vault items are encrypted with this key. Generating a new key
            // would make every existing item permanently undecryptable.
            // The vault is already unlocked (user is editing it), so the key
            // is available in the in-memory store.
            const vaultKey = useVaultStore.getState().getVaultKey(vaultId);

            const { encryptedKey, keyIv } = encryptVaultKey(vaultKey, derivedKey);
            const { hash: verificationHash, hashIv } = createVerificationHash(vaultKey);

            // ✅ After vault is updated, unlock it immediately so the user
            //    doesn't have to re-enter their password right away
            const result = await updateVault(
                vaultId,
                vaultName,
                selectedIcon as string,  // icon
                vaultColor,              // iconColor
                salt,                    // salt (base64)
                encryptedKey,            // encryptedKey (base64)
                keyIv,                   // keyIv (base64)
                verificationHash,        // verificationHash (base64)
                hashIv                   // hashIv (base64)
            );

            // ✅ After updating the vault, unlock it immediately by passing its ID
            useVaultStore.getState().unlock(result!.id, vaultKey);

            return result;
        },
        onMutate: () => {
            toast.dismiss();
            toast.loading("Updating vault...");
        },
        onSuccess: () => {
            toast.dismiss();
            setMasterPassword("")
            toast.success("Vault updated successfully!");
            onOpenChange(false);
            queryClient.invalidateQueries({
                queryKey: ["vaults"],
                refetchType: 'active'
            });
        },
        onError: (error) => {
            toast.dismiss();
            toast.error("There was an error updating your vault. Please try again later." + error);
            onOpenChange(false);
        }
    });
}

export function useUpdateVaultItem(id: string, vaultId: string, data: CreditCardJSON | IdentityJSON | SecureNoteJSON | LoginJSON, cancel: () => void) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['update-vault-item', vaultId],
        mutationFn: () => {
            const vaultKey = useVaultStore.getState().getVaultKey(vaultId);
            const payload = JSON.stringify(data);
            const { ciphertext, iv } = encryptData(payload, vaultKey);
            return updateVaultItem({ id, vaultId, encryptedData: ciphertext, iv });
        },
        onMutate: () => {
            toast.loading("Updating vault item...")
        },
        onSuccess: () => {
            toast.dismiss();
            toast.success("Vault item updated successfully");
            cancel();
            queryClient.invalidateQueries({
                queryKey: ["vaultItems", vaultId],
                refetchType: 'active'
            });
        },
        onError: (error) => {
            toast.dismiss();
            toast.error("Failed to update vault item." + error)
        }
    })
}