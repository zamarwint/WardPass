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
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArchiveRestore } from "lucide-react";
import { VaultItem } from "@/lib/types/VaultType";
import { restoreVaultItem } from "@/app/actions/vault-item/trashVaultItem";

export default function RestoreIdentityItemDialog({ identityItem }: { identityItem: VaultItem }) {
    const queryClient = useQueryClient();

    const { mutate, error, isPending } = useMutation({
        mutationFn: () => restoreVaultItem(identityItem.id!),
        onMutate: () => {
            toast.dismiss();
            toast.loading("Restoring Identity Item...");
        },
        onSuccess: () => {
            toast.dismiss();
            toast.success("Identity Item restored successfully!");
            queryClient.invalidateQueries({
                queryKey: ["restoreVaultItems", identityItem.vaultId],
                refetchType: 'active'
            });
        },
        onError: () => {
            toast.dismiss();
            toast.error("There was an error restoring your Identity Item. Please try again later." + error);
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
                    <AlertDialogTitle>Restore <span className="font-bold">{JSON.parse(identityItem.encryptedData!).name}</span></AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to restore <span className="font-bold">{JSON.parse(identityItem.encryptedData!).name}</span>?
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