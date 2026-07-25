import getSettings from "@/app/actions/settings/getSettings";
import { useQuery } from "@tanstack/react-query";

// GET SETTINGS, AND REFETCH WHEN CRUD OPERATIONS OCCUR, AND WHEN THE PAGE IS REVISITED
export function useGetSettings() {
    return useQuery({
        queryKey: ['settings'],
        queryFn: () => getSettings(),
        refetchOnMount: true,
        refetchOnReconnect: true,
        refetchOnWindowFocus: true,
        staleTime: 1000 * 60 * 2,
        gcTime: 1000 * 60 * 5
    })
}