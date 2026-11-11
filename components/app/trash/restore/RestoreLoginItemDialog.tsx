"use client";

import { Button, buttonVariants } from "@/components/ui/button"

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
import { ArchiveRestore } from "lucide-react";
import { LoginJSON } from "@/lib/types/VaultItemType";
import { useRestoreVaultItemMutation } from "@/lib/mutations/ItemMutations";

export default function RestoreLoginItemDialog({ loginItem }: { loginItem: LoginJSON }) {
    const { mutate, isPending } = useRestoreVaultItemMutation(loginItem.id);

    const handleSubmit = () => {
        mutate();
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger className={buttonVariants({ variant: "ghost", size: "icon" })}>
                <ArchiveRestore className="text-foreground" />
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Restore <span className="font-bold">{loginItem.name}</span></AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to restore <span className="font-bold">{loginItem.name}</span>?
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel render={
                        <Button variant="outline">Cancel</Button>
                    }>
                    </AlertDialogCancel>
                    <AlertDialogAction render={
                        <Button disabled={isPending} variant="default" className="font-bold" onClick={handleSubmit}>Restore</Button>
                    }>
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}