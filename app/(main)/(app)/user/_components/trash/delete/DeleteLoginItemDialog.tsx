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
import { VaultItem } from "@/lib/types/VaultType";
import deleteVaultItem from "@/app/actions/vault-item/deleteVaultItem";

export default function DeleteLoginItemDialog({ loginItem }: { loginItem: VaultItem }) {
    const queryClient = useQueryClient();

    const [loginNameConfirm, setLoginNameConfirm] = useState<string>("");

    const { mutate, error, isPending } = useMutation({
        mutationFn: () => deleteVaultItem({ id: loginItem.id as string, vaultId: loginItem.vaultId as string }),
        onMutate: () => {
            toast.dismiss();
            toast.loading("Deleting Login Item...");
        },
        onSuccess: () => {
            toast.dismiss();
            toast.success("Login Item deleted successfully!");
            queryClient.invalidateQueries({
                queryKey: ["deleteVaultItems", loginItem.vaultId],
                refetchType: 'active'
            });
        },
        onError: () => {
            toast.dismiss();
            toast.error("There was an error deleting your Login Item. Please try again later." + error);
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
                    <AlertDialogTitle>Delete <span className="font-bold">{JSON.parse(loginItem.encryptedData!).name}</span></AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to delete <span className="font-bold">{JSON.parse(loginItem.encryptedData!).name}?</span>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <div>
                    <Label className="mt-2" htmlFor="loginItemNameConfirm">Type in<span className="font-bold">{JSON.parse(loginItem.encryptedData!).name?.toLowerCase()}</span>to confirm</Label>
                    <Input placeholder="type in login item name to confirm" className="h-12 mt-3" id="loginItemNameConfirm" value={loginNameConfirm} onChange={(e) => setLoginNameConfirm(e.target.value)} />
                </div>
                <AlertDialogFooter>
                    <AlertDialogCancel asChild>
                        <Button variant="outline">Cancel</Button>
                    </AlertDialogCancel>
                    <AlertDialogAction asChild>
                        <Button disabled={loginNameConfirm.toLowerCase() !== JSON.parse(loginItem.encryptedData!).name?.toLowerCase() || isPending} variant="destructive" className="font-bold" onClick={handleSubmit}>Delete</Button>
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}