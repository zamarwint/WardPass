import Link from "next/link";
import { CircleQuestionMark, Settings, Trash, Vault } from "lucide-react";
import Profile from "./Profile";

import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { LockSideButton, SideButton, VaultSideButton } from "./SideButton"
import { getVaults } from "@/app/actions/vault/getVaults";

export default async function Sidebar() {
    const vaults = await getVaults();

    return (
        <div
            className="h-screen px-4 py-8 bg-card/40 backdrop:blur-sm w-xs flex flex-col justify-between border-r border-muted"
        >
            <div className="flex flex-col items-center justify-center">
                <Link className="font-bold text-3xl tracking-tighter text-primary px-5 flex flex-col items-center justify-center gap-0.5" href="/">
                    <Image src="/../../icon.png" alt="logo" width={0} height={0} className="w-12 h-12" loading="eager" />
                    <span>WardPass</span>
                </Link>
                <p className="font-semibold text-sm">ACTIVE SECURITY</p>
                <SideButton hrefExact={true} href="/user/vault" text="All Vaults" Icon={<Vault />} className="mt-10" />
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
                <LockSideButton disabled={true} />
                <SideButton hrefExact={true} href="/contact" text="Contact Support" Icon={<CircleQuestionMark />} />
                <Separator className="my-2" />
                <Profile />
                <div className="pt-2 w-full flex flex-col items-start justify-start gap-1">
                    <SideButton hrefExact={false} href="/user/settings" text="Settings" Icon={<Settings />} />
                    <SideButton hrefExact={true} href="/user/trash" text="Trash" Icon={<Trash />} />
                </div>
            </div>
        </div>
    );
}