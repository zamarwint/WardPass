"use client";

import { QueryClient, QueryClientProvider, isServer } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import MainLoading from "./loading";
import { useKeyboardShortcuts } from "@/lib/functions";
import { TooltipProvider } from "@/components/ui/tooltip";

const ReactQueryDevtools = dynamic(
    () => import("@tanstack/react-query-devtools").then((module) => module.ReactQueryDevtools),
    { ssr: false },
);

function makeQueryClient() {
    return new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 1000 * 60 * 2,
            },
        },
    });
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
    if (isServer) {
        return makeQueryClient();
    }
    if (!browserQueryClient) {
        browserQueryClient = makeQueryClient();
    }
    return browserQueryClient;
}

export default function MainLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    const queryClient = getQueryClient();
    useKeyboardShortcuts();

    return (
        <div className="flex flex-col size-full items-center justify-center overflow-x-hidden">
            <QueryClientProvider client={queryClient}>
                <Suspense fallback={<MainLoading />}>
                    <TooltipProvider>
                        {children}
                    </TooltipProvider>
                </Suspense>
                {process.env.NODE_ENV === "development" && (
                    <ReactQueryDevtools initialIsOpen={false} />
                )}
            </QueryClientProvider>
        </div>
    )
}

