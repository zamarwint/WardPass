"use client";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { EllipsisVertical, PencilIcon, TrashIcon } from "lucide-react";
import { useState } from "react";
import EditVault from "./EditVault";
import DeleteVault from "./DeleteVault";

export default function VaultDropdown({ open, onOpenChange, vault }: { open: boolean, onOpenChange: (open: boolean) => void, vault: { id: string, name: string, slug: string, icon: string, iconColor: string | null } }) {
    const [openEditVault, setOpenEditVault] = useState(false);
    const [openDeleteVault, setOpenDeleteVault] = useState(false);

    return (
        <>
            <DropdownMenu open={open} onOpenChange={onOpenChange}>
                <DropdownMenuTrigger className="p-2 h-full cursor-pointer">
                    <EllipsisVertical size={16} />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="font-geist">
                    <DropdownMenuItem className="cursor-pointer" onClick={() => setOpenEditVault(!openEditVault)}>
                        <PencilIcon size={20} className="mr-2" />
                        <span>Edit</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer" onClick={() => setOpenDeleteVault(!openDeleteVault)}>
                        <TrashIcon size={20} className="mr-2" />
                        <span>Delete</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <EditVault open={openEditVault} onOpenChange={setOpenEditVault} vault={vault} />
            <DeleteVault open={openDeleteVault} onOpenChange={setOpenDeleteVault} vault={vault} />
        </>
    )
}