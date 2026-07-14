import Link from "next/link";
import { ChevronLeft, CircleQuestionMark, Settings, Trash, Vault } from "lucide-react";
import Profile from "./Profile";
import CreateVault from "./CreateVault";
import { prisma } from '../../../../utils/db';
import { getUserSession } from '@/app/actions/getSession';

import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import SignOut from "./SignOut";
import { SideButton, VaultSideButton } from "./SideButton"
import { Button } from "@/components/ui/button";

export default async function Sidebar() {
    const session = await getUserSession();
    const vaults = await prisma.vault.findMany({
        where: {
            userId: session?.user.id
        },
        select: {
            id: true,
            name: true,
            slug: true,
            icon: true,
            iconColor: true,
        },
        orderBy: {
            name: "asc",
        }
    }).then((vaults) => {
        if (!vaults || vaults.length === 0) {
            return <div className="text-muted-foreground text-center text-sm">No vaults found. Create one above.</div>
        }
        return vaults.map((vault) => (
            <VaultSideButton key={vault.id} vault={vault} />
        ))
    })

    return (
        <div
            className="h-screen px-4 py-8 bg-card/40 backdrop:blur-sm w-xs flex flex-col justify-between"
        >
            <div className="flex flex-col items-center justify-center">
                <Link className="font-bold text-3xl tracking-tighter text-primary px-5 flex flex-col items-center justify-center gap-0.5" href="/dashboard">
                    <Image src="/../../icon.png" alt="logo" width={0} height={0} className="w-[48px] h-[48px]" loading="eager" />
                    <span>WardPass</span>
                </Link>
                <p className="font-semibold text-sm">ACTIVE SECURITY</p>
                <SideButton href="/user/vault" text="All Vaults" Icon={<Vault />} className="mt-10" />
                <Separator className="my-2" />
            </div>
            <div className="w-full flex flex-col gap-2 h-full overflow-y-scroll no-scrollbar">
                <CreateVault />
                {vaults}
            </div>
            <div className="flex flex-col items-start justify-start gap-1">
                <SideButton href="/contact" text="Contact Support" Icon={<CircleQuestionMark />} />
                <SignOut buttonText={`Lock WardPass (Log Out)`} />
                <Separator className="my-2" />
                <Profile />
                <div className="pt-2 w-full flex flex-col items-start justify-start gap-0.5">
                    <SideButton href="/user/settings" text="Settings" Icon={<Settings />} />
                    <SideButton href="/user/trash" text="Trash" Icon={<Trash />} />
                </div>
            </div>
        </div>
    )
}