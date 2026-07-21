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
import { SecureNoteItem } from "@/lib/types/VaultItemType"
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { trashSecureNote } from "@/app/actions/secure-note/trashSecureNote";

export default function TrashSecureNoteItemDialog({ open, onOpenChange, secureNoteItem }: { open: boolean, onOpenChange: (open: boolean) => void, secureNoteItem: SecureNoteItem }) {
    const queryClient = useQueryClient();

    const { mutate, error, isPending } = useMutation({
        mutationFn: () => trashSecureNote(secureNoteItem.id!),
        onMutate: () => {
            toast.dismiss();
            toast.loading("Moving Secure Note to Trash...");
        },
        onSuccess: () => {
            toast.dismiss();
            toast.success("Secure Note moved to Trash successfully!");
            onOpenChange(false);
            queryClient.invalidateQueries({
                queryKey: ["vaultItems", secureNoteItem.vaultId],
                refetchType: 'active'
            });
        },
        onError: () => {
            toast.dismiss();
            toast.error("There was an error moving your Secure Note to Trash. Please try again later." + error);
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
                    <AlertDialogTitle>Move <span className="font-bold">{secureNoteItem.title}</span> to Trash</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to move <span className="font-bold">{secureNoteItem.title}</span> to Trash?
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