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
import { SecureNoteItem } from "@/lib/types/VaultItemType"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import deleteSecureNote from "@/app/actions/secure-note/deleteSecureNote";

export default function DeleteSecureNoteItemDialog({ open, onOpenChange, secureNoteItem }: { open: boolean, onOpenChange: (open: boolean) => void, secureNoteItem: SecureNoteItem }) {
    const router = useRouter();
    const [secureNoteNameConfirm, setSecureNoteNameConfirm] = useState<string>("");

    const { mutate, error, isPending } = useMutation({
        mutationFn: () => deleteSecureNote({ id: secureNoteItem.id as string, vaultId: secureNoteItem.vaultId as string, title: secureNoteItem.title as string }),
        onMutate: () => {
            toast.dismiss();
            toast.loading("Deleting Secure Note...");
        },
        onSuccess: () => {
            toast.dismiss();
            toast.success("Secure Note deleted successfully!");
            onOpenChange(false);
            router.refresh();
        },
        onError: () => {
            toast.dismiss();
            toast.error("There was an error deleting your Secure Note. Please try again later." + error);
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
                    <AlertDialogTitle>Delete <span className="font-bold">{secureNoteItem.title}</span></AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to delete <span className="font-bold">{secureNoteItem.title?.slice(0, 30)}?</span>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <div>
                    <Label className="mt-2" htmlFor="secureNoteNameConfirm">Type in<span className="font-bold">{secureNoteItem.title?.toLowerCase()}</span>to confirm</Label>
                    <Input placeholder="type in secure note name to confirm" className="h-12 mt-3" id="secureNoteNameConfirm" value={secureNoteNameConfirm} onChange={(e) => setSecureNoteNameConfirm(e.target.value)} />
                </div>
                <AlertDialogFooter>
                    <AlertDialogCancel asChild>
                        <Button variant="outline">Cancel</Button>
                    </AlertDialogCancel>
                    <AlertDialogAction asChild>
                        <Button disabled={secureNoteNameConfirm.toLowerCase() !== secureNoteItem.title?.toLowerCase() || isPending} variant="destructive" className="font-bold" onClick={handleSubmit}>Delete</Button>
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}