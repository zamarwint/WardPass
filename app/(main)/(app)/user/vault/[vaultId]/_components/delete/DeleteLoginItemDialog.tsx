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
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import deleteLogin from "@/app/actions/login/deleteLogin";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";

export default function DeleteLoginItemDialog({ open, onOpenChange, loginItem }: { open: boolean, onOpenChange: (open: boolean) => void, loginItem: LoginItem }) {
    const [loginNameConfirm, setLoginNameConfirm] = useState<string>("");

    const { mutate, data, isPending } = useMutation({
        mutationFn: () => deleteLogin({ id: loginItem.id as string, vaultId: loginItem.vaultId as string, name: loginItem.name as string }),
        onMutate: () => {
            toast.dismiss();
            toast.loading("Deleting Login Item...");
        },
        onSuccess: () => {
            toast.dismiss();
            toast.success("Login Item deleted successfully!" + data);
            onOpenChange(false);
        },
        onError: () => {
            toast.dismiss();
            toast.error("There was an error deleting your Login Item. Please try again later.");
        }
    });

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete <span className="font-bold">{loginItem.name}</span></AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to delete <span className="font-bold">{loginItem.name}?</span>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <div>
                    <Label className="mt-2" htmlFor="loginItemNameConfirm">Type in<span className="font-bold">{loginItem.name?.toLowerCase()}</span>to confirm</Label>
                    <Input placeholder="type in login item name to confirm" className="h-12 mt-3" id="loginItemNameConfirm" value={loginNameConfirm} onChange={(e) => setLoginNameConfirm(e.target.value)} />
                </div>
                <AlertDialogFooter>
                    <AlertDialogCancel asChild>
                        <Button variant="outline">Cancel</Button>
                    </AlertDialogCancel>
                    <AlertDialogAction asChild>
                        <Button disabled={loginNameConfirm.toLowerCase() !== loginItem.name?.toLowerCase() || isPending} variant="destructive" className="font-bold" onClick={() => mutate()}>Delete</Button>
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}