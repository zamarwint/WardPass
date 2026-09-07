"use client";

import { AlertTriangle, ShieldUser, Upload, Vault } from "lucide-react";

import { Separator } from "@/components/ui/separator";
import { LockSideButton, LinkSideButton, VaultSideButton, CollapseSideButton } from "./SideButton"
import { Suspense, useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useGetVaults } from "@/lib/queries/VaultQueries";
import { motion } from "motion/react";
import { useCheckAdminSession, useGetSession } from "@/lib/queries/SessionQueries";
import UserDropdown from "./UserDropdown";
import { CustomLoadingState } from "@/app/_components/LoadingStates";

export default function Sidebar() {
    return (
        <SidebarContent />
    );
}

export function SidebarContent() {
    const [collapsed, setCollapsed] = useState<boolean>(false);

    // GET CURRENT VAULT ITEMS, AND REFETCH THEM WHEN CRUD OPERATIONS OCCUR, AND WHEN THE PAGE IS REVISITED
    const { data: vaults, isLoading: vaultsLoading, error: vaultsLoadingError } = useGetVaults();
    const { data: admin, isLoading: adminLoading, error: adminLoadingError } = useCheckAdminSession();
    const { isPending: sessionPending, data: sessionData, error: sessionError } = useGetSession();

    if (vaultsLoadingError || adminLoadingError) {
        toast.error("There was an error loading your vaults or admin session. Please try refreshing the page." + vaultsLoadingError?.message || adminLoadingError?.message);
    }

    return (
        <Suspense fallback={
            <div className="h-screen px-4 py-8 bg-card/40 backdrop:blur-sm w-xs flex flex-col justify-center items-center border-r border-muted">
                <CustomLoadingState loaderChoice={1} className="flex items-center gap-2 text-muted-foreground">
                    <span className="shimmer shimmer-duration-1000"> Loading... </span>
                </CustomLoadingState>
            </div>
        }>
            <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                    hidden: { opacity: 0, x: -100 },
                    visible: { opacity: 1, x: 0 },
                }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className={cn("size-full px-4 py-4 bg-card/40 flex flex-col justify-center items-center border-r border-muted", collapsed ? "w-fit" : "w-xs")}
            >
                {vaultsLoading || adminLoading ? (
                    <CustomLoadingState loaderChoice={1} className="size-full flex items-center justify-center gap-2 text-muted-foreground">
                        <span className="shimmer shimmer-duration-1000"> Loading... </span>
                    </CustomLoadingState>
                ) : vaultsLoadingError || adminLoadingError ? (
                    <div className="size-full flex flex-col items-center justify-center gap-2 text-muted-foreground">
                        <AlertTriangle size={16} />
                        <span className="text-wrap">{vaultsLoadingError && "There was an error loading your vaults. Please try refreshing the page." + vaultsLoadingError?.message}</span>
                        <span className="text-wrap">{adminLoadingError && "There was an error loading your admin session. Please try refreshing the page." + adminLoadingError?.message}</span>
                    </div>
                ) : (
                    <div className="size-full flex flex-col justify-between items-center">
                        <div className="flex flex-col items-center justify-center w-full">
                            <LinkSideButton hrefExact={true} href="/user/vault" text="All Vaults" Icon={<Vault />} collapsed={collapsed} />
                            <Separator className="my-2" />
                        </div>
                        <div className="w-full flex flex-col items-center justify-start flex-1 overflow-y-auto">
                            {!vaults || vaults.length === 0 ? (
                                <div className="text-muted-foreground text-center text-sm">{collapsed ? "+" : "No vaults found."}</div>
                            ) : vaults.map((vault) => (
                                <div key={vault.id} className="w-full flex items-center justify-start">
                                    <VaultSideButton vault={vault} collapsed={collapsed} />
                                </div>
                            ))}
                        </div>
                        <div className="w-full flex flex-col items-start justify-start gap-1">
                            <CollapseSideButton collapsed={collapsed} setIsCollapsed={setCollapsed} />
                            <Separator className="my-1" />
                            <LinkSideButton hrefExact={true} href="/user/import" text="Import Passwords" Icon={<Upload />} collapsed={collapsed} />
                            {admin && <LinkSideButton hrefExact={false} href="/user/admin" text="Admin Panel" Icon={<ShieldUser />} collapsed={collapsed} />}
                            <LockSideButton collapsed={collapsed} />
                            <Separator className="my-1" />
                            <UserDropdown onSidebar={true} collapsed={collapsed} sessionData={{ isPending: sessionPending, data: sessionData, error: sessionError }} />
                        </div>
                    </div>
                )}
            </motion.div>
        </Suspense>
    )
}