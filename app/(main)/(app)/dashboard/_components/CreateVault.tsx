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
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import { Button } from "../../../../../components/ui/button";
import * as Lucide from "lucide-react";
import { LucideIcon } from "lucide-react"
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import GetIcons from "./GetIcons";

export default function CreateVault() {
    const [selectedIcon, setSelectedIcon] = useState<LucideIcon>();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="lg" className="w-full flex justify-between text-lg font-bold">Vaults <Lucide.ChevronDown size="lg" /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="font-geist">
                <DropdownMenuGroup>
                    <DropdownMenuLabel>Vaults</DropdownMenuLabel>
                    <DropdownMenuItem disabled>No vaults.</DropdownMenuItem>
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
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="vaultName">Enter Vault Name</Label>
                                <Input id="vaultName" placeholder="e.g. Work, Personal, etc." />
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="vaultName">Choose an icon</Label>
                                <GetIcons />
                            </div>
                        </DialogContent>
                    </Dialog>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}