import Sidebar from "./_components/sidebar/Sidebar"
import TopBar from "./_components/topbar/TopBar"
import { QueryClient, dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getUserSession } from "@/app/actions/getSession";

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
                    <div className="flex-1 h-full overflow-y-auto">{children}</div>
                </div>
            </div>
        </HydrationBoundary>
    )
}

