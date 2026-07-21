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
import { LoginItem } from "@/lib/types/VaultItemType"
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { trashLogin } from "@/app/actions/login/trashLogin";

export default function TrashLoginItemDialog({ open, onOpenChange, loginItem }: { open: boolean, onOpenChange: (open: boolean) => void, loginItem: LoginItem }) {
    const queryClient = useQueryClient();

    const { mutate, error, isPending } = useMutation({
        mutationFn: () => trashLogin(loginItem.id!),
        onMutate: () => {
            toast.dismiss();
            toast.loading("Moving Login Item to Trash...");
        },
        onSuccess: () => {
            toast.dismiss();
            toast.success("Login Item moved to Trash successfully!");
            onOpenChange(false);
            queryClient.invalidateQueries({
                queryKey: ["vaultItems", loginItem.vaultId],
                refetchType: 'active'
            });
        },
        onError: () => {
            toast.dismiss();
            toast.error("There was an error moving your Login Item to Trash. Please try again later." + error);
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
                    <AlertDialogTitle>Move <span className="font-bold">{loginItem.name}</span> to Trash</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to move <span className="font-bold">{loginItem.name}</span> to Trash?
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