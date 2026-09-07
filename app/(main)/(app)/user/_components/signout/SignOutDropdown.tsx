import { useTransition } from "react";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction, AlertDialogCancel } from "@/components/ui/alert-dialog";
import { useSignOut } from "@/lib/mutations/AuthMutations";

export default function SignOutAlert({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {
    const signOutMutation = useSignOut();
    const [signOutPending, startSignOutTransition] = useTransition();

    const signOut = async () => {
        startSignOutTransition(async () => {
            signOutMutation.mutate();
        })
    }

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action will sign you out of this session.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={signOut} disabled={signOutPending || signOutMutation.isPending}>{signOutPending || signOutMutation.isPending ? "Signing you out..." : "Sign Out"}</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}