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
import { IdentityJSON } from "@/lib/types/VaultItemType";
import { useDeleteVaultItemMutation } from "@/lib/mutations/ItemMutations";

export default function DeleteIdentityItemDialog({ identityItem }: { identityItem: IdentityJSON }) {
    const [identityNameConfirm, setIdentityNameConfirm] = useState<string>("");
    const { mutate, isPending } = useDeleteVaultItemMutation(identityItem.id, identityItem.vaultId);

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
                    <AlertDialogTitle>Delete <span className="font-bold">{identityItem.name}</span></AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to delete <span className="font-bold">{identityItem.name}?</span>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <div>
                    <Label className="mt-2" htmlFor="identityItemNameConfirm">Type in<span className="font-bold">{identityItem.name?.toLowerCase()}</span>to confirm</Label>
                    <Input placeholder="type in identity item name to confirm" className="h-12 mt-3" id="identityItemNameConfirm" value={identityNameConfirm} onChange={(e) => setIdentityNameConfirm(e.target.value)} />
                </div>
                <AlertDialogFooter>
                    <AlertDialogCancel asChild>
                        <Button variant="outline">Cancel</Button>
                    </AlertDialogCancel>
                    <AlertDialogAction asChild>
                        <Button disabled={identityNameConfirm.toLowerCase() !== identityItem.name?.toLowerCase() || isPending} variant="destructive" className="font-bold" onClick={handleSubmit}>Delete</Button>
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}