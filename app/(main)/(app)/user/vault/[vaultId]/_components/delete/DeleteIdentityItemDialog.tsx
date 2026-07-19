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
import { IdentityItem } from "@/lib/types/VaultItemType"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import deleteIdentity from "@/app/actions/identities/deleteIdentity";

export default function DeleteIdentityItemDialog({ open, onOpenChange, identityItem }: { open: boolean, onOpenChange: (open: boolean) => void, identityItem: IdentityItem }) {
    const router = useRouter();
    const [identityNameConfirm, setIdentityNameConfirm] = useState<string>("");

    const { mutate, data, isPending } = useMutation({
        mutationFn: () => deleteIdentity({ id: identityItem.id as string, vaultId: identityItem.vaultId as string, name: identityItem.name as string, email: identityItem.email as string, phoneNumber: identityItem.phoneNumber as string, organizationName: identityItem.organizationName as string }),
        onMutate: () => {
            toast.dismiss();
            toast.loading("Deleting Identity Item...");
        },
        onSuccess: () => {
            toast.dismiss();
            toast.success("Identity Item deleted successfully!" + data);
            onOpenChange(false);
            router.refresh();
        },
        onError: () => {
            toast.dismiss();
            toast.error("There was an error deleting your Identity Item. Please try again later.");
            onOpenChange(false);
            router.refresh();
        }
    });

    const handleSubmit = () => {
        mutate();
    }

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete <span className="font-bold">{identityItem.name}</span></AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to delete <span className="font-bold">{identityItem.name}?</span>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <div>
                    <Label className="mt-2" htmlFor="identityItemNameConfirm">Type in<span className="font-bold">{identityItem.name?.toLowerCase()}</span>to confirm</Label>
                    <Input placeholder="type in identity item name to confirm" className="h-12 mt-3" id="identityItemNameConfirm" value={identityNameConfirm} onChange={(e) => setIdentityNameConfirm(e.target.value)} />
                </div>
                <AlertDialogFooter>
                    <AlertDialogCancel asChild>
                        <Button variant="outline">Cancel</Button>
                    </AlertDialogCancel>
                    <AlertDialogAction asChild>
                        <Button disabled={identityNameConfirm.toLowerCase() !== identityItem.name?.toLowerCase() || isPending} variant="destructive" className="font-bold" onClick={handleSubmit}>Delete</Button>
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}