"use client";

import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import { Button } from "../../../../../../components/ui/button";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";
import { deleteVault } from "@/app/actions/vault/deleteVault";

export default function DeleteVault({ open, onOpenChange, vault }: { open: boolean, onOpenChange: (open: boolean) => void, vault: { id: string, name: string, slug: string, icon: string, iconColor: string | null } }) {
    const { mutate, data, isPending } = useMutation({
        mutationFn: () => deleteVault(vault.id),
        onMutate: () => {
            toast.dismiss();
            toast.loading("Deleting vault...");
        },
        onSuccess: () => {
            toast.dismiss();
            toast.success("Vault deleted successfully!" + data);
            onOpenChange(false);
        },
        onError: () => {
            toast.dismiss();
            toast.error("There was an error deleting your vault. Please try again later.");
        }
    });

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="font-geist">
                <DialogHeader>
                    <DialogTitle className="font-bold">Delete {vault.name}</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete the <span className="font-bold">{vault.name}</span> vault? This action is irreversible.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="font-geist">
                    <DialogClose className="text-md mr-1">Cancel</DialogClose>
                    <Button variant="destructive" size="lg" className="text-md font-bold" onClick={() => mutate()}>
                        {isPending ? (
                            <>
                                <Loader2Icon className="size-4 animate-spin" />
                                <span>Deleting...</span>
                            </>
                        ) : (
                            <span>Delete Vault</span>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}