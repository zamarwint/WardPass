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
import { CreditCardItem } from "@/lib/types/VaultItemType"
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { restoreCreditCard } from "@/app/actions/credit-card/trashCreditCard";
import { ArchiveRestore } from "lucide-react";

export default function RestoreCreditCardItemDialog({ creditCardItem }: { creditCardItem: CreditCardItem }) {
    const queryClient = useQueryClient();

    const { mutate, error, isPending } = useMutation({
        mutationFn: () => restoreCreditCard(creditCardItem.id!),
        onMutate: () => {
            toast.dismiss();
            toast.loading("Restoring Credit Card Item...");
        },
        onSuccess: () => {
            toast.dismiss();
            toast.success("Credit Card Item restored successfully!");
            queryClient.invalidateQueries({
                queryKey: ["restoreVaultItems", creditCardItem.vaultId],
                refetchType: 'active'
            });
        },
        onError: () => {
            toast.dismiss();
            toast.error("There was an error restoring your Credit Card Item. Please try again later." + error);
        }
    });

    const handleSubmit = () => {
        mutate();
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon"><ArchiveRestore className="text-foreground" /></Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Restore <span className="font-bold">{creditCardItem.cardHolderName}</span></AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to restore <span className="font-bold">{creditCardItem.cardHolderName}</span>?
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel asChild>
                        <Button variant="outline">Cancel</Button>
                    </AlertDialogCancel>
                    <AlertDialogAction asChild>
                        <Button disabled={isPending} variant="default" className="font-bold" onClick={handleSubmit}>Restore</Button>
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}