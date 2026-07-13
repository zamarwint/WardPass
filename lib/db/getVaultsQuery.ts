import { getVaults } from "@/app/actions/getVaults";
import { useQuery } from "@tanstack/react-query";

export const getVaultsQuery = () => {
    return useQuery({
        queryKey: ['get-vaults'],
        queryFn: () => getVaults(),
        refetchOnWindowFocus: false
    })
}