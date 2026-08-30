import { authClient } from "@/utils/auth-client";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction, AlertDialogCancel } from "@/components/ui/alert-dialog";

export default function SignOutAlert({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {
    const [signOutPending, startSignOutTransition] = useTransition();

    const queryClient = useQueryClient();
    const router = useRouter();

    const signOut = async () => {
        startSignOutTransition(async () => {
            await authClient.signOut({
                fetchOptions: {
                    onRequest: () => {
                        toast.loading("Signing you out...");
                    },
                    onSuccess: () => {
                        toast.dismiss();
                        toast.success("Signed out successfully.");
                        router.push("/sign-in"); // redirect to login page
                        queryClient.invalidateQueries({ queryKey: ['session'] });
                    },
                    onError: (ctx) => {
                        toast.error("Sign out failed. Internal server error. " + ctx.error.message);
                    }
                },
            });
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
                    <AlertDialogAction onClick={signOut} disabled={signOutPending}>{signOutPending ? "Signing you out..." : "Continue"}</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}