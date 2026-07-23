import { Settings, Trash, Upload, Vault } from "lucide-react";
import Profile from "./Profile";

import { Separator } from "@/components/ui/separator";
import { LockSideButton, LinkSideButton, VaultSideButton } from "./SideButton"
import { getVaults } from "@/app/actions/vault/getVaults";
import { Suspense } from "react";

export default function Sidebar() {
    return (
        <Suspense fallback={<div className="h-screen px-4 py-8 bg-card/40 backdrop:blur-sm w-xs flex flex-col justify-between border-r border-muted">Loading...</div>}>
            <SidebarContent />
        </Suspense>
    );
}

async function SidebarContent() {
    const vaults = await getVaults();

    return (
        <div
            className="h-full px-4 py-4 bg-card/40 backdrop:blur-sm w-xs flex flex-col justify-between border-r border-muted"
        >
            <div className="flex flex-col items-center justify-center">
                <LinkSideButton hrefExact={true} href="/user/vault" text="All Vaults" Icon={<Vault />} />
                <Separator className="my-2" />
            </div>
            <div className="w-full flex flex-col gap-2 flex-1 overflow-y-auto">
                {!vaults || vaults.length === 0 ? (
                    <div className="text-muted-foreground text-center text-sm">No vaults found.</div>
                ) : vaults.map((vault) => (
                    <VaultSideButton key={vault.id} vault={vault} />
                ))}
            </div>
            <div className="flex flex-col items-start justify-start gap-1">
                <LinkSideButton hrefExact={true} href="/user/import" text="Import Data" Icon={<Upload />} />
                <LockSideButton />
                <Separator />
                <Profile />
                <Separator />
                <div className="pt-2 w-full flex flex-col items-start justify-start gap-1">
                    <LinkSideButton hrefExact={false} href="/user/settings" text="Settings" Icon={<Settings />} />
                    <LinkSideButton hrefExact={false} href="/user/trash" text="Trash" Icon={<Trash />} />
                </div>
            </div>
        </div>
    );
}