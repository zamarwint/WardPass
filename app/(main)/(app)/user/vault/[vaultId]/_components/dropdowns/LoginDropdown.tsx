"use client";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { EllipsisVertical, PencilIcon, TrashIcon } from "lucide-react";
import { useState } from "react";
import UpdateLoginItem from "../update/UpdateLoginItem";
import TrashLoginItemDialog from "../trash/TrashLoginItemDialog";
import { VaultItem } from "@/lib/types/VaultType";

export default function LoginDropdown({ open, onOpenChange, loginItem }: { open: boolean, onOpenChange: (open: boolean) => void, loginItem: VaultItem }) {
    const [openUpdateLogin, setOpenUpdateLogin] = useState(false);
    const [openDeleteLogin, setOpenDeleteLogin] = useState(false);

    return (
        <>
            <DropdownMenu open={open} onOpenChange={onOpenChange}>
                <DropdownMenuTrigger className="p-2 h-full cursor-pointer">
                    <EllipsisVertical size={16} />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="font-geist">
                    <DropdownMenuItem className="cursor-pointer" onClick={() => setOpenUpdateLogin(!openUpdateLogin)}>
                        <PencilIcon size={20} className="mr-2" />
                        <span>Edit</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer" onClick={() => setOpenDeleteLogin(!openDeleteLogin)}>
                        <TrashIcon size={20} className="mr-2" />
                        <span>Trash</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            {openUpdateLogin && <UpdateLoginItem loginItem={loginItem} cancel={() => { setOpenUpdateLogin(false) }} />}
            <TrashLoginItemDialog open={openDeleteLogin} onOpenChange={setOpenDeleteLogin} loginItem={loginItem} />
        </>
    )
}