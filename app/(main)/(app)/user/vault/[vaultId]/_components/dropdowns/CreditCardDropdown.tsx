"use client";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { EllipsisVertical, PencilIcon, TrashIcon } from "lucide-react";
import { useState } from "react";
import UpdateCreditCardItem from "../update/UpdateCreditCardItem";
import DeleteCreditCardItemDialog from "../delete/DeleteCreditCardItemDialog";
import { CreditCardItem } from "@/lib/types/VaultItemType";

export default function CreditCardDropdown({ open, onOpenChange, creditCardItem }: { open: boolean, onOpenChange: (open: boolean) => void, creditCardItem: CreditCardItem }) {
    const [openUpdateCreditCard, setOpenUpdateCreditCard] = useState(false);
    const [openDeleteCreditCard, setOpenDeleteCreditCard] = useState(false);

    return (
        <>
            <DropdownMenu open={open} onOpenChange={onOpenChange}>
                <DropdownMenuTrigger className="p-2 h-full cursor-pointer">
                    <EllipsisVertical size={16} />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="font-geist">
                    <DropdownMenuItem className="cursor-pointer" onClick={() => setOpenUpdateCreditCard(!openUpdateCreditCard)}>
                        <PencilIcon size={20} className="mr-2" />
                        <span>Edit</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer" onClick={() => setOpenDeleteCreditCard(!openDeleteCreditCard)}>
                        <TrashIcon size={20} className="mr-2" />
                        <span>Delete</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            {openUpdateCreditCard && <UpdateCreditCardItem creditCardItem={creditCardItem} cancel={() => { setOpenUpdateCreditCard(false) }} />}
            <DeleteCreditCardItemDialog open={openDeleteCreditCard} onOpenChange={setOpenDeleteCreditCard} creditCardItem={creditCardItem} />
        </>
    )
}