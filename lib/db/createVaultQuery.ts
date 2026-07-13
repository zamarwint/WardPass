import { createVault } from "@/app/actions/createVault";
import { useQuery } from "@tanstack/react-query";

export const createVaultQuery = (name: string, icon: string, iconColor: string) => {
    return useQuery({
        queryKey: ['create-vault', name, icon, iconColor],
        queryFn: () => createVault(name, icon, iconColor),
        refetchOnWindowFocus: false
    })
}