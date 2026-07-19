"use client";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { EllipsisVertical, PencilIcon, TrashIcon } from "lucide-react";
import { useState } from "react";
import UpdateSecureNoteItem from "../update/UpdateSecureNoteItem";
import DeleteSecureNoteItemDialog from "../delete/DeleteSecureNoteItemDialog";
import { SecureNoteItem } from "@/lib/types/VaultItemType";

export default function SecureNoteDropdown({ open, onOpenChange, secureNoteItem }: { open: boolean, onOpenChange: (open: boolean) => void, secureNoteItem: SecureNoteItem }) {
    const [openUpdateSecureNote, setOpenUpdateSecureNote] = useState(false);
    const [openDeleteSecureNote, setOpenDeleteSecureNote] = useState(false);

    return (
        <>
            <DropdownMenu open={open} onOpenChange={onOpenChange}>
                <DropdownMenuTrigger className="p-2 h-full cursor-pointer">
                    <EllipsisVertical size={16} />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="font-geist">
                    <DropdownMenuItem className="cursor-pointer" onClick={() => setOpenUpdateSecureNote(!openUpdateSecureNote)}>
                        <PencilIcon size={20} className="mr-2" />
                        <span>Edit</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer" onClick={() => setOpenDeleteSecureNote(!openDeleteSecureNote)}>
                        <TrashIcon size={20} className="mr-2" />
                        <span>Delete</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            {openUpdateSecureNote && <UpdateSecureNoteItem secureNoteItem={secureNoteItem} cancel={() => { setOpenUpdateSecureNote(false) }} />}
            <DeleteSecureNoteItemDialog open={openDeleteSecureNote} onOpenChange={setOpenDeleteSecureNote} secureNoteItem={secureNoteItem} />
        </>
    )
}