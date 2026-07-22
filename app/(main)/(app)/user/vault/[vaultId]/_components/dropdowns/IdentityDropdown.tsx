"use client";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { EllipsisVertical, PencilIcon, TrashIcon } from "lucide-react";
import { useState } from "react";
import UpdateIdentityItem from "../update/UpdateIdentityItem";
import TrashIdentityItemDialog from "../trash/TrashIdentityItemDialog";
import { VaultItem } from "@/lib/types/VaultType";

export default function IdentityDropdown({ open, onOpenChange, identityItem }: { open: boolean, onOpenChange: (open: boolean) => void, identityItem: VaultItem }) {
    const [openUpdateIdentity, setOpenUpdateIdentity] = useState(false);
    const [openDeleteIdentity, setOpenDeleteIdentity] = useState(false);

    return (
        <>
            <DropdownMenu open={open} onOpenChange={onOpenChange}>
                <DropdownMenuTrigger className="p-2 h-full cursor-pointer">
                    <EllipsisVertical size={16} />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="font-geist">
                    <DropdownMenuItem className="cursor-pointer" onClick={() => setOpenUpdateIdentity(!openUpdateIdentity)}>
                        <PencilIcon size={20} className="mr-2" />
                        <span>Edit</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer" onClick={() => setOpenDeleteIdentity(!openDeleteIdentity)}>
                        <TrashIcon size={20} className="mr-2" />
                        <span>Trash</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            {openUpdateIdentity && <UpdateIdentityItem identityItem={identityItem} cancel={() => { setOpenUpdateIdentity(false) }} />}
            <TrashIdentityItemDialog open={openDeleteIdentity} onOpenChange={setOpenDeleteIdentity} identityItem={identityItem} />
        </>
    )
}