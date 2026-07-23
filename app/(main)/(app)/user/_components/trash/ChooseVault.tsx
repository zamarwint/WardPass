import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Vault } from "@/lib/types/VaultType";
import { useQuery } from "@tanstack/react-query";
import { getVaults } from "@/app/actions/vault/getVaults";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function ChooseVault() {
    const router = useRouter();

    // GET CURRENT VAULT ITEMS, AND REFETCH THEM WHEN CRUD OPERATIONS OCCUR, AND WHEN THE PAGE IS REVISITED
    const { data: vaults, isLoading, error } = useQuery({
        queryKey: ["vaults"],
        queryFn: () => getVaults(),
        refetchOnMount: true,
        refetchOnReconnect: true,
        refetchOnWindowFocus: true,
        staleTime: 1000 * 60 * 2,
        gcTime: 1000 * 60 * 5,
        enabled: true
    })

    if (error) {
        toast.error("There was an error loading your vaults. Please try refreshing the page." + error?.message);
    }

    const handleVaultChange = (value: string) => {
        router.push(`/user/trash/${value}`);
    }

    return (
        isLoading ? (
            <>
                <h1>Loading...</h1>
                <Skeleton className="w-full max-w-sm h-12" />
            </>
        ) : (
            <Select onValueChange={handleVaultChange}>
                <SelectTrigger>
                    <SelectValue placeholder="Select a vault" />
                </SelectTrigger>
                <SelectContent>
                    {vaults?.map((vault: Vault) => (
                        <SelectItem className="cursor-pointer" key={vault.id} value={vault.id}>
                            {vault.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        )
    )
}