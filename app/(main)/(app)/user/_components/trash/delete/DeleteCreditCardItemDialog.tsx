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
    AlertDialogTrigger
} from "@/components/ui/alert-dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { Trash2Icon } from "lucide-react";
import { CreditCardJSON } from "@/lib/types/VaultItemType";
import { useDeleteVaultItemMutation } from "@/lib/mutations/ItemMutations";

export default function DeleteCreditCardItemDialog({ creditCardItem }: { creditCardItem: CreditCardJSON }) {
    const [creditCardNameConfirm, setCreditCardNameConfirm] = useState<string>("");
    const { mutate, isPending } = useDeleteVaultItemMutation(creditCardItem.id, creditCardItem.vaultId);

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
                    <AlertDialogTitle>Delete <span className="font-bold">{creditCardItem.cardHolderName}</span></AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to delete <span className="font-bold">{creditCardItem.cardHolderName}?</span>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <div>
                    <Label className="mt-2" htmlFor="creditCardHolderNameConfirm">Type in<span className="font-bold">{creditCardItem.cardHolderName?.toLowerCase()}</span>to confirm</Label>
                    <Input placeholder="type in credit card holder's name to confirm" className="h-12 mt-3" id="creditCardHolderNameConfirm" value={creditCardNameConfirm} onChange={(e) => setCreditCardNameConfirm(e.target.value)} />
                </div>
                <AlertDialogFooter>
                    <AlertDialogCancel asChild>
                        <Button variant="outline">Cancel</Button>
                    </AlertDialogCancel>
                    <AlertDialogAction asChild>
                        <Button disabled={creditCardNameConfirm.toLowerCase() !== creditCardItem.cardHolderName?.toLowerCase() || isPending} variant="destructive" className="font-bold" onClick={handleSubmit}>Delete</Button>
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}