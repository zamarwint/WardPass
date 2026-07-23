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
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2Icon } from "lucide-react";
import deleteVaultItem from "@/app/actions/vault-item/deleteVaultItem";

export default function DeleteCreditCardItemDialog({ creditCardItem }: { creditCardItem: any }) {
    const queryClient = useQueryClient();

    const [creditCardNameConfirm, setCreditCardNameConfirm] = useState<string>("");

    const { mutate, error, isPending } = useMutation({
        mutationFn: () => deleteVaultItem({ id: creditCardItem.id, vaultId: creditCardItem.vaultId as string }),
        onMutate: () => {
            toast.dismiss();
            toast.loading("Deleting Credit Card Item...");
        },
        onSuccess: () => {
            toast.dismiss();
            toast.success("Credit Card Item deleted successfully!");
            queryClient.invalidateQueries({
                queryKey: ["trashedItems"],
                refetchType: 'active'
            });
        },
        onError: () => {
            toast.dismiss();
            toast.error("There was an error deleting your Credit Card Item. Please try again later." + error);
        }
    });

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