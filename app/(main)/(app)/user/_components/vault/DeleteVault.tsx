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
import { Loader2Icon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useDeleteVaultMutation } from "@/lib/mutations/VaultMutations";

export default function DeleteVault({ open, onOpenChange, vault }: { open: boolean, onOpenChange: (open: boolean) => void, vault: { id: string, name: string, slug: string, icon: string, iconColor: string | null } }) {
    const [vaultNameConfirm, setVaultNameConfirm] = useState<string>("");
    const { mutate, isPending } = useDeleteVaultMutation(vault.id, onOpenChange);

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent className="font-geist">
                <AlertDialogHeader>
                    <AlertDialogTitle className="font-bold">Delete {vault.name}</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to delete the <span className="font-bold">{vault.name}</span> vault? This action is irreversible and will not be moved to the trash.
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
                            <span>Permanently Delete Vault</span>
                        )}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}