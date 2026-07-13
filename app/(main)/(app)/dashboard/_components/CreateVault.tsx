"use client";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import { Button } from "../../../../../components/ui/button";
import * as Lucide from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { motion } from "motion/react";
import { DynamicIcon, IconName } from 'lucide-react/dynamic';
import { createVaultQuery } from "@/lib/db/createVaultQuery";
import { getVaultsQuery } from "@/lib/db/getVaultsQuery";
import { toast } from "sonner";

const iconsToRender: IconName[] = ['user', 'lock', 'settings', 'credit-card', 'wallet', 'activity', 'alarm-check', 'alarm-clock', 'alarm-minus', 'alarm-plus', 'album'];

export default function CreateVault() {
    const [selectedIcon, setSelectedIcon] = useState<IconName>();
    const [vaultName, setVaultName] = useState<string>("");

    const { data: vaults, isPending: vaultsIsLoading } = getVaultsQuery();

    function createNewVault(name: string, icon: string, iconColor = "white") {
        const { error, isPending } = createVaultQuery(name, icon, iconColor);

        if (isPending) {
            toast.loading("Creating vault...");
        }

        error && toast.error("There was an error creating your vault. Please try again later.");
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="lg" className="w-full flex justify-between text-lg font-bold">Vaults <Lucide.ChevronDown size="lg" /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="font-geist">
                <DropdownMenuGroup>
                    <DropdownMenuLabel>Vaults</DropdownMenuLabel>
                    {vaults ? (vaults?.map((vault) => (
                        <DropdownMenuItem key={vault.id}>{vault.name}</DropdownMenuItem>
                    ))) : <DropdownMenuItem disabled>No vaults.</DropdownMenuItem>}
                    <DropdownMenuSeparator />
                    <Dialog>
                        <DialogTrigger className="w-full cursor-pointer hover:bg-primary hover:text-muted flex items-center justify-center text-sm">Create Vault <Lucide.PlusIcon size="16" className="ml-1" /></DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>New Vault</DialogTitle>
                                <DialogDescription>
                                    Create a new vault.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="flex flex-col gap-3">
                                <Label htmlFor="vaultName">Enter Vault Name</Label>
                                <Input id="vaultName" placeholder="e.g. Work, Personal, etc." value={vaultName} onChange={(e) => setVaultName(e.target.value)} />
                            </div>
                            <div className="flex flex-col gap-3">
                                <Label htmlFor="vaultIcon">Choose an icon</Label>
                                <motion.div className="flex flex-wrap">
                                    {iconsToRender.map((iconName) => (
                                        <Button
                                            variant={selectedIcon === iconName ? "default" : "ghost"}
                                            size="lg"
                                            className="w-fit flex justify-between text-lg font-bold"
                                            key={iconName}
                                            onClick={() => setSelectedIcon(iconName as IconName)}
                                        >
                                            <DynamicIcon name={iconName as IconName} size={32} />
                                        </Button>
                                    ))}
                                </motion.div>
                            </div>
                            <DialogFooter>
                                <Button variant="secondary" size="lg" className="text-lg">Cancel</Button>
                                <Button variant="default" size="lg" className="text-lg font-bold" onClick={() => createNewVault(vaultName!, selectedIcon!)}>Create Vault</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}