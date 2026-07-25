"use client";

import { Button } from "@/components/ui/button"

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { Trash2Icon } from "lucide-react";
import { SecureNoteJSON } from "@/lib/types/VaultItemType";
import { useDeleteVaultItemMutation } from "@/lib/mutations/ItemMutations";

export default function DeleteSecureNoteItemDialog({ secureNoteItem }: { secureNoteItem: SecureNoteJSON }) {
    const [secureNoteNameConfirm, setSecureNoteNameConfirm] = useState<string>("");
    const { mutate, isPending } = useDeleteVaultItemMutation(secureNoteItem.id, secureNoteItem.vaultId);

    const handleSubmit = () => {
        mutate();
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon"><Trash2Icon className="text-destructive" /></Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete <span className="font-bold">{secureNoteItem.title}</span></AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to delete <span className="font-bold">{secureNoteItem.title?.slice(0, 30)}?</span>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <div>
                    <Label className="mt-2" htmlFor="secureNoteNameConfirm">Type in<span className="font-bold">{secureNoteItem.title?.toLowerCase()}</span>to confirm</Label>
                    <Input placeholder="type in secure note name to confirm" className="h-12 mt-3" id="secureNoteNameConfirm" value={secureNoteNameConfirm} onChange={(e) => setSecureNoteNameConfirm(e.target.value)} />
                </div>
                <AlertDialogFooter>
                    <AlertDialogCancel asChild>
                        <Button variant="outline">Cancel</Button>
                    </AlertDialogCancel>
                    <AlertDialogAction asChild>
                        <Button disabled={secureNoteNameConfirm.toLowerCase() !== secureNoteItem.title?.toLowerCase() || isPending} variant="destructive" className="font-bold" onClick={handleSubmit}>Delete</Button>
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}