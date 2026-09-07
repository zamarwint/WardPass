"use client";

import { QueryClient, QueryClientProvider, isServer } from "@tanstack/react-query";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Suspense } from "react";
import MainLoading from "./loading";
import { useKeyboardShortcuts } from "@/lib/functions";

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
        <div className="flex flex-col w-full h-full min-h-screen min-w-screen overflow-x-hidden">
            <QueryClientProvider client={queryClient}>
                <Suspense fallback={<MainLoading />}>
                    {children}
                </Suspense>
                <ReactQueryDevtools initialIsOpen={false} />
            </QueryClientProvider>
        </div>
    )
}

