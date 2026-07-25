import { getVaultWithTrashedItems } from "@/app/actions/getVaultWithTrashedItems";
import { getVaultItems } from "@/app/actions/vault/getVaultItems";
import { getVaults } from "@/app/actions/vault/getVaults"
import { useQuery } from "@tanstack/react-query"

// GET CURRENT VAULTS, AND REFETCH THEM WHEN CRUD OPERATIONS OCCUR, AND WHEN THE PAGE IS REVISITED
export function useGetVaults() {
    return useQuery({
        queryKey: ['vaults'],
        queryFn: () => getVaults(),
        refetchOnMount: true,
        refetchOnReconnect: true,
        refetchOnWindowFocus: true,
        staleTime: 1000 * 60 * 2,
        gcTime: 1000 * 60 * 5,
        enabled: true
    })
}

// USE THIS FOR SERVER COMPONENTS
export async function getVaultsAsync() {
    return await getVaults().then((vaults) => vaults);
}

// GET CURRENT VAULT ITEMS, AND REFETCH THEM WHEN CRUD OPERATIONS OCCUR, AND WHEN THE PAGE IS REVISITE
export function useGetVaultItems(vaultId: string) {
    return useQuery({
        queryKey: ['vaultItems', vaultId],
        queryFn: () => getVaultItems(vaultId),
        refetchOnMount: true,
        refetchOnReconnect: true,
        refetchOnWindowFocus: true,
        staleTime: 1000 * 60 * 2,
        gcTime: 1000 * 60 * 5
    })
}

// GET CURRENT VAULTS WITH TRASHED ITEMS, AND REFETCH THEM WHEN CRUD OPERATIONS OCCUR, AND WHEN THE PAGE IS REVISITED
export function useGetVaultWithTrashedItems(vaultId: string) {
    return useQuery({
        queryKey: ['trashedItems', vaultId],
        queryFn: () => getVaultWithTrashedItems(vaultId),
        refetchOnMount: true,
        refetchOnReconnect: true,
        refetchOnWindowFocus: true,
        staleTime: 1000 * 60 * 2,
        gcTime: 1000 * 60 * 5
    })
}