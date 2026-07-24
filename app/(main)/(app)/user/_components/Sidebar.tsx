"use client";

import { Settings, Trash, Upload, Vault } from "lucide-react";
import Profile from "./Profile";

import { Separator } from "@/components/ui/separator";
import { LockSideButton, LinkSideButton, VaultSideButton, CollapseSideButton } from "./SideButton"
import { getVaults } from "@/app/actions/vault/getVaults";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function Sidebar() {
    return (
        <SidebarContent />
    );
}

export function SidebarContent() {
    const [collapsed, setCollapsed] = useState<boolean>(false);

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

    return (
        isLoading ? (
            <div className="h-screen px-4 py-8 bg-card/40 backdrop:blur-sm w-xs flex flex-col justify-between border-r border-muted">
                Loading...
            </div>
        ) : (
            <div
                className={cn("size-full px-4 py-4 bg-card/40 flex flex-col justify-between items-center border-r border-muted", collapsed ? "w-fit" : "w-xs")}
            >
                <div className="flex flex-col items-center justify-center w-full">
                    <LinkSideButton hrefExact={true} href="/user/vault" text="All Vaults" Icon={<Vault />} collapsed={collapsed} />
                    <Separator className="my-2" />
                </div>
                <div className="w-full flex flex-col items-center justify-start gap-2 flex-1 overflow-y-auto">
                    {!vaults || vaults.length === 0 ? (
                        <div className="text-muted-foreground text-center text-sm">{collapsed ? "+" : "No vaults found."}</div>
                    ) : vaults.map((vault) => (
                        <VaultSideButton key={vault.id} vault={vault} collapsed={collapsed} />
                    ))}
                </div>
                <div className="w-full flex flex-col items-start justify-start gap-1">
                    <CollapseSideButton collapsed={collapsed} setIsCollapsed={setCollapsed} />
                    <Separator />
                    <LinkSideButton hrefExact={true} href="/user/import" text="Import Data" Icon={<Upload />} collapsed={collapsed} />
                    <LockSideButton collapsed={collapsed} />
                    <Separator />
                    <Profile collapsed={collapsed} />
                    <Separator />
                    <div className="pt-2 w-full flex flex-col items-start justify-start gap-1">
                        <LinkSideButton hrefExact={false} href="/user/settings" text="Settings" Icon={<Settings />} collapsed={collapsed} />
                        <LinkSideButton hrefExact={false} href="/user/trash" text="Trash" Icon={<Trash />} collapsed={collapsed} />
                    </div>
                </div>
            </div>
        )
    )
}