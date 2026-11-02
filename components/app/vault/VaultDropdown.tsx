"use client";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { EllipsisVertical, PencilIcon, TrashIcon } from "lucide-react";
import { useState } from "react";
import UpdateVault from "./vault-crud/UpdateVault";
import DeleteVault from "./vault-crud/DeleteVault";
import { VaultSummary } from "@/lib/types/VaultType";

export default function VaultDropdown({ vault }: { vault: VaultSummary }) {
    const [openUpdateVault, setOpenUpdateVault] = useState(false);
    const [openDeleteVault, setOpenDeleteVault] = useState(false);

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger className="p-2 h-full cursor-pointer">
                    <EllipsisVertical size={16} />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="font-geist">
                    <DropdownMenuItem className="cursor-pointer" onClick={() => setOpenUpdateVault(!openUpdateVault)}>
                        <PencilIcon size={20} className="mr-2" />
                        <span>Update</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer" onClick={() => setOpenDeleteVault(!openDeleteVault)}>
                        <TrashIcon size={20} className="mr-2" />
                        <span>Delete</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <UpdateVault open={openUpdateVault} onOpenChange={setOpenUpdateVault} vault={vault} />
            <DeleteVault open={openDeleteVault} onOpenChange={setOpenDeleteVault} vault={vault} />
        </>
    )
}
