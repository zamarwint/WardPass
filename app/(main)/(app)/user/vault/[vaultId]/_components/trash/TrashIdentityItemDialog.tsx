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
} from "@/components/ui/alert-dialog"
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { trashVaultItem } from "@/app/actions/vault-item/trashVaultItem";

export default function TrashIdentityItemDialog({ open, onOpenChange, identityItem }: { open: boolean, onOpenChange: (open: boolean) => void, identityItem: any }) {
    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationFn: () => trashVaultItem(identityItem.id),
        onMutate: () => {
            toast.dismiss();
            toast.loading("Moving Identity Item to Trash...");
        },
        onSuccess: () => {
            toast.dismiss();
            toast.success("Identity Item moved to Trash successfully!");
            onOpenChange(false);
            queryClient.invalidateQueries({
                queryKey: ["vaultItems", identityItem.vaultId],
                refetchType: 'active'
            });
        },
        onError: (err) => {
            toast.dismiss();
            toast.error("There was an error moving your Identity Item to Trash. Please try again later." + err);
            onOpenChange(false);

        }
    });

    const handleSubmit = () => {
        mutate();
    }

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Move <span className="font-bold">{identityItem.name}</span> to Trash</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to move <span className="font-bold">{identityItem.name}</span> to Trash?
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel asChild>
                        <Button variant="outline">Cancel</Button>
                    </AlertDialogCancel>
                    <AlertDialogAction asChild>
                        <Button disabled={isPending} variant="destructive" className="font-bold" onClick={handleSubmit}>Move to Trash</Button>
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}