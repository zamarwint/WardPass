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
import { IdentityJSON } from "@/lib/types/VaultItemType";
import { useRestoreVaultItemMutation } from "@/lib/mutations/ItemMutations";

export default function RestoreIdentityItemDialog({ identityItem }: { identityItem: IdentityJSON }) {
    const { mutate, isPending } = useRestoreVaultItemMutation(identityItem.id);

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
                    <AlertDialogTitle>Restore <span className="font-bold">{identityItem.name}</span></AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to restore <span className="font-bold">{identityItem.name}</span>?
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel render={
                        <Button variant="outline">Cancel</Button>
                    }>
                    </AlertDialogCancel>
                    <AlertDialogAction>
                        <Button disabled={isPending} variant="default" className="font-bold" onClick={handleSubmit}>Restore</Button>
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}