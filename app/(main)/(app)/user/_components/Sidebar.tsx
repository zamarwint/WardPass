"use client";

import { Settings, ShieldUser, Trash, Upload, Vault } from "lucide-react";
import Profile from "./Profile";

import { Separator } from "@/components/ui/separator";
import { LockSideButton, LinkSideButton, VaultSideButton, CollapseSideButton } from "./SideButton"
import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useGetVaults } from "@/lib/queries/VaultQueries";
import { motion } from "motion/react";
import { useCheckAdminSession } from "@/lib/queries/SessionQueries";

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

    if (vaultsLoadingError || adminLoadingError) {
        toast.error("There was an error loading your vaults or admin session. Please try refreshing the page." + vaultsLoadingError?.message || adminLoadingError?.message);
    }

    return (
        vaultsLoading || adminLoading ? (
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{
                    duration: 1,
                }}
                className="h-screen px-4 py-8 bg-card/40 backdrop:blur-sm w-xs flex flex-col justify-between border-r border-muted">
                Loading...
            </motion.div>
        ) : vaultsLoadingError || adminLoadingError ? (
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{
                    duration: 1,
                }}
                className="h-screen px-4 py-8 bg-card/40 backdrop:blur-sm w-xs flex flex-col justify-between border-r border-muted">
                {vaultsLoadingError && "There was an error loading your vaults. Please try refreshing the page." + vaultsLoadingError?.message}
                {adminLoadingError && "There was an error loading your admin session. Please try refreshing the page." + adminLoadingError?.message}
            </motion.div>
        ) : (
            <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                    hidden: { opacity: 0, x: -100 },
                    visible: { opacity: 1, x: 0 },
                }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className={cn("size-full px-4 py-4 bg-card/40 flex flex-col justify-between items-center border-r border-muted", collapsed ? "w-fit" : "w-xs")}
            >
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
                    <Separator />
                    <LinkSideButton hrefExact={true} href="/user/import" text="Import Data" Icon={<Upload />} collapsed={collapsed} />
                    {admin && <LinkSideButton hrefExact={false} href="/user/admin" text="Admin" Icon={<ShieldUser />} collapsed={collapsed} />}
                    <LockSideButton collapsed={collapsed} />
                    <Separator />
                    <Profile collapsed={collapsed} />
                    <Separator />
                    <div className="pt-2 w-full flex flex-col items-start justify-start gap-1">
                        <LinkSideButton hrefExact={false} href="/user/settings" text="Settings" Icon={<Settings />} collapsed={collapsed} />
                        <LinkSideButton hrefExact={false} href="/user/trash" text="Trash" Icon={<Trash />} collapsed={collapsed} />
                    </div>
                </div>
            </motion.div>
        )
    )
}