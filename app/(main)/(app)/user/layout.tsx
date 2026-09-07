import Sidebar from "./_components/sidebar/Sidebar"
import TopBar from "./_components/topbar/TopBar"
import { QueryClient, dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getUserSession } from "@/app/actions/getSession";
import { Suspense } from "react";
import { CustomLoadingState } from "@/app/_components/LoadingStates";

export default async function AppLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: ['session'],
        queryFn: () => getUserSession(),
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <div className="hidden lg:flex flex-col h-screen w-screen font-geist overflow-hidden">
                <TopBar />
                <div className="flex w-full h-full overflow-hidden">
                    <Sidebar />
                    <div className="flex-1 h-full overflow-y-auto">
                        <Suspense fallback={
                            <CustomLoadingState loaderChoice={1} className="size-full flex items-center justify-center gap-2">
                                <span className="shimmer shimmer-duration-1000"> Loading... </span>
                            </CustomLoadingState>
                        }>
                            {children}
                        </Suspense>
                    </div>
                </div>
            </div>
        </HydrationBoundary>
    )
}

