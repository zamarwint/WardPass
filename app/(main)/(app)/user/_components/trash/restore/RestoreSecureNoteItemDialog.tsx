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
import { SecureNoteItem } from "@/lib/types/VaultItemType"
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { restoreSecureNote } from "@/app/actions/secure-note/trashSecureNote";
import { ArchiveRestore } from "lucide-react";

export default function RestoreSecureNoteItemDialog({ secureNoteItem }: { secureNoteItem: SecureNoteItem }) {
    const queryClient = useQueryClient();

    const { mutate, error, isPending } = useMutation({
        mutationFn: () => restoreSecureNote(secureNoteItem.id!),
        onMutate: () => {
            toast.dismiss();
            toast.loading("Restoring Secure Note...");
        },
        onSuccess: () => {
            toast.dismiss();
            toast.success("Secure Note restored successfully!");
            queryClient.invalidateQueries({
                queryKey: ["restoreVaultItems", secureNoteItem.vaultId],
                refetchType: 'active'
            });
        },
        onError: () => {
            toast.dismiss();
            toast.error("There was an error restoring your Secure Note. Please try again later." + error);
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
                    <AlertDialogTitle>Restore <span className="font-bold">{secureNoteItem.title}</span></AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to restore <span className="font-bold">{secureNoteItem.title}</span>?
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