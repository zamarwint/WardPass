import { QueryClient, dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getUserSession } from "@/actions/getSession";
import { listVaultsForUser } from "@/lib/server/vault-repository";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { CustomLoadingState } from "@/components/LoadingStates";

export default async function AppLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    const queryClient = new QueryClient({
        defaultOptions: { queries: { staleTime: 1000 * 60 * 2 } },
    });
    const session = await getUserSession();
    if (!session?.user) redirect("/sign-in");

    queryClient.setQueryData(["session"], session);
    await queryClient.prefetchQuery({
        queryKey: ["vaults"],
        queryFn: () => listVaultsForUser(session.user.id),
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <Suspense fallback={
                <CustomLoadingState loaderChoice={1} className="size-full flex items-center justify-center gap-2">
                    <span className="shimmer shimmer-duration-1000"> Loading... </span>
                </CustomLoadingState>
            }>
                {children}
            </Suspense>
        </HydrationBoundary>
    );
}
