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
import { Trash2Icon } from "lucide-react";
import { LoginJSON } from "@/lib/types/VaultItemType";
import { useDeleteVaultItemMutation } from "@/lib/mutations/ItemMutations";

export default function DeleteLoginItemDialog({ loginItem }: { loginItem: LoginJSON }) {
    const [loginNameConfirm, setLoginNameConfirm] = useState<string>("");
    const { mutate, isPending } = useDeleteVaultItemMutation(loginItem.id, loginItem.vaultId);

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
                        <Button disabled={loginNameConfirm.toLowerCase() !== loginItem.name?.toLowerCase() || isPending} variant="destructive" className="font-bold" onClick={handleSubmit}>Delete</Button>
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}