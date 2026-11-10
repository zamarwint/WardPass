import { getAllVaultsWithTrashedItems, getVaultWithTrashedItems } from "@/app/actions/getVaultWithTrashedItems";
import { getVaultItems } from "@/app/actions/vault/getVaultItems";
import { getVaults } from "@/app/actions/vault/getVaults"
import { getVaultPageData } from "@/app/actions/vault/getVaultPageData";
import { useQuery } from "@tanstack/react-query"

// GET CURRENT VAULTS, AND REFETCH THEM WHEN CRUD OPERATIONS OCCUR, AND WHEN THE PAGE IS REVISITED
export function useGetVaults() {
    return useQuery({
        queryKey: ['vaults'],
        queryFn: () => getVaults(),
        refetchOnReconnect: true,
        refetchOnWindowFocus: true,
        staleTime: 1000 * 60 * 2,
        gcTime: 1000 * 60 * 5,
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
        refetchOnReconnect: true,
        refetchOnWindowFocus: true,
        staleTime: 1000 * 60 * 2,
        gcTime: 1000 * 60 * 5
    })
}

export function useGetVaultPageData(vaultId: string) {
    return useQuery({
        queryKey: ["vaultPage", vaultId],
        queryFn: () => getVaultPageData(vaultId),
        staleTime: 1000 * 60 * 2,
        gcTime: 1000 * 60 * 5,
    });
}

// GET CURRENT VAULTS WITH TRASHED ITEMS, AND REFETCH THEM WHEN CRUD OPERATIONS OCCUR, AND WHEN THE PAGE IS REVISITED
export function useGetVaultWithTrashedItems(vaultId: string) {
    return useQuery({
        queryKey: ['trashedItems', vaultId],
        queryFn: () => getVaultWithTrashedItems(vaultId),
        refetchOnReconnect: true,
        refetchOnWindowFocus: true,
        staleTime: 1000 * 60 * 2,
        gcTime: 1000 * 60 * 5
    })
}

// GET ALL VAULTS WITH TRASHED ITEMS
export function useGetAllVaultsWithTrashedItems() {
    return useQuery({
        queryKey: ['trashedItems'],
        queryFn: () => getAllVaultsWithTrashedItems(),
        refetchOnReconnect: true,
        refetchOnWindowFocus: true,
        staleTime: 1000 * 60 * 2,
        gcTime: 1000 * 60 * 5,
    })
}
