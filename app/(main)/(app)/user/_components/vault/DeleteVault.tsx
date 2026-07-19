"use client";

import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogCancel
} from "@/components/ui/alert-dialog"

import { Button } from "../../../../../../components/ui/button";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";
import { deleteVault } from "@/app/actions/vault/deleteVault";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export default function DeleteVault({ open, onOpenChange, vault }: { open: boolean, onOpenChange: (open: boolean) => void, vault: { id: string, name: string, slug: string, icon: string, iconColor: string | null } }) {
    const [vaultNameConfirm, setVaultNameConfirm] = useState<string>("");

    const { mutate, error, isPending } = useMutation({
        mutationFn: () => deleteVault(vault.id),
        onMutate: () => {
            toast.dismiss();
            toast.loading("Deleting vault...");
        },
        onSuccess: () => {
            toast.dismiss();
            toast.success("Vault deleted successfully!");
            onOpenChange(false);
        },
        onError: () => {
            toast.dismiss();
            toast.error("There was an error deleting your vault. Please try again later." + error);
            onOpenChange(false);
        }
    });

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent className="font-geist">
                <AlertDialogHeader>
                    <AlertDialogTitle className="font-bold">Delete {vault.name}</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to delete the <span className="font-bold">{vault.name}</span> vault? This action is irreversible.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <div>
                    <Label className="mt-2" htmlFor="vaultNameConfirm">Type in<span className="font-bold">{vault.name.toLowerCase()}</span>to confirm</Label>
                    <Input placeholder="type in vault name to confirm" className="h-12 mt-3" id="vaultNameConfirm" value={vaultNameConfirm} onChange={(e) => setVaultNameConfirm(e.target.value)} />
                </div>
                <AlertDialogFooter className="font-geist">
                    <AlertDialogCancel className="text-md" size="lg">
                        <span className="font-bold">Cancel</span>
                    </AlertDialogCancel>
                    <Button disabled={vaultNameConfirm.toLowerCase() !== vault.name.toLowerCase() || isPending} variant="destructive" size="lg" className="text-md font-bold" onClick={() => mutate()}>
                        {isPending ? (
                            <>
                                <Loader2Icon className="size-4 animate-spin" />
                                <span>Deleting...</span>
                            </>
                        ) : (
                            <span>Delete Vault</span>
                        )}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}