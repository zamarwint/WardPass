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
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2Icon } from "lucide-react";
import deleteVaultItem from "@/app/actions/vault-item/deleteVaultItem";
import { VaultItem } from "@/lib/types/VaultType";

export default function DeleteIdentityItemDialog({ identityItem }: { identityItem: VaultItem }) {
    const queryClient = useQueryClient();

    const [identityNameConfirm, setIdentityNameConfirm] = useState<string>("");

    const { mutate, error, isPending } = useMutation({
        mutationFn: () => deleteVaultItem({ id: identityItem.id as string, vaultId: identityItem.vaultId as string }),
        onMutate: () => {
            toast.dismiss();
            toast.loading("Deleting Identity Item...");
        },
        onSuccess: () => {
            toast.dismiss();
            toast.success("Identity Item deleted successfully!");
            queryClient.invalidateQueries({
                queryKey: ["deleteVaultItems", identityItem.vaultId],
                refetchType: 'active'
            });
        },
        onError: () => {
            toast.dismiss();
            toast.error("There was an error deleting your Identity Item. Please try again later." + error);
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
                    <AlertDialogTitle>Delete <span className="font-bold">{JSON.parse(identityItem.encryptedData!).name}</span></AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to delete <span className="font-bold">{JSON.parse(identityItem.encryptedData!).name}?</span>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <div>
                    <Label className="mt-2" htmlFor="identityItemNameConfirm">Type in<span className="font-bold">{JSON.parse(identityItem.encryptedData!).name?.toLowerCase()}</span>to confirm</Label>
                    <Input placeholder="type in identity item name to confirm" className="h-12 mt-3" id="identityItemNameConfirm" value={identityNameConfirm} onChange={(e) => setIdentityNameConfirm(e.target.value)} />
                </div>
                <AlertDialogFooter>
                    <AlertDialogCancel asChild>
                        <Button variant="outline">Cancel</Button>
                    </AlertDialogCancel>
                    <AlertDialogAction asChild>
                        <Button disabled={identityNameConfirm.toLowerCase() !== JSON.parse(identityItem.encryptedData!).name?.toLowerCase() || isPending} variant="destructive" className="font-bold" onClick={handleSubmit}>Delete</Button>
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}