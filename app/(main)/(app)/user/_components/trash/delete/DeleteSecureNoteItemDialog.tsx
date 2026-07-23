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

export default function DeleteSecureNoteItemDialog({ secureNoteItem }: { secureNoteItem: any }) {
    const queryClient = useQueryClient();

    const [secureNoteNameConfirm, setSecureNoteNameConfirm] = useState<string>("");

    const { mutate, error, isPending } = useMutation({
        mutationFn: () => deleteVaultItem({ id: secureNoteItem.id, vaultId: secureNoteItem.vaultId as string }),
        onMutate: () => {
            toast.dismiss();
            toast.loading("Deleting Secure Note...");
        },
        onSuccess: () => {
            toast.dismiss();
            toast.success("Secure Note deleted successfully!");
            queryClient.invalidateQueries({
                queryKey: ["trashedItems"],
                refetchType: 'active'
            });
        },
        onError: () => {
            toast.dismiss();
            toast.error("There was an error deleting your Secure Note. Please try again later." + error);
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
                    <AlertDialogTitle>Delete <span className="font-bold">{secureNoteItem.name}</span></AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to delete <span className="font-bold">{secureNoteItem.name?.slice(0, 30)}?</span>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <div>
                    <Label className="mt-2" htmlFor="secureNoteNameConfirm">Type in<span className="font-bold">{secureNoteItem.name?.toLowerCase()}</span>to confirm</Label>
                    <Input placeholder="type in secure note name to confirm" className="h-12 mt-3" id="secureNoteNameConfirm" value={secureNoteNameConfirm} onChange={(e) => setSecureNoteNameConfirm(e.target.value)} />
                </div>
                <AlertDialogFooter>
                    <AlertDialogCancel asChild>
                        <Button variant="outline">Cancel</Button>
                    </AlertDialogCancel>
                    <AlertDialogAction asChild>
                        <Button disabled={secureNoteNameConfirm.toLowerCase() !== secureNoteItem.name?.toLowerCase() || isPending} variant="destructive" className="font-bold" onClick={handleSubmit}>Delete</Button>
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}