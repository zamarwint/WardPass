import {
  requestPasswordReset,
  resetPassword,
} from "@/app/actions/auth/reset-password";
import signIn from "@/app/actions/auth/signIn";
import signOut from "@/app/actions/auth/signOut";
import signUp from "@/app/actions/auth/signUp";
import { useVaultStore } from "@/stores/vault";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useSignIn(email: string, password: string) {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: () => signIn(email, password),
    onMutate: () => {
      toast.loading("Signing you in...");
    },
    onSuccess: () => {
      // Store the master password in memory to unlock vaults later
      useVaultStore.getState().setMasterPassword(password);

      //redirect to the user vault page
      toast.dismiss();
      toast.success("Success!");
      router.push("/user/vault");
      queryClient.invalidateQueries({ queryKey: ["session"] });
    },
    onError: (error) => {
      // display the error message
      toast.dismiss();
      toast.error(error.message);
    },
  });
}

export function useSignUp(
  name: string,
  email: string,
  password: string,
  image?: string,
) {
  const router = useRouter();

  return useMutation({
    mutationFn: () => signUp(name, email, password, image),
    onMutate: () => {
      toast.loading("Signing you up...");
    },
    onSuccess: () => {
      //redirect to verify email page
      toast.dismiss();
      toast.success("Success! Check your email to verify your account.");
      router.push(`/verify-email?email=${email}`);
    },
    onError: (error) => {
      // display the error message
      toast.dismiss();
      toast.error(error.message);
    },
  });
}

export function useSignOut() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: () => signOut(),
    onMutate: () => {
      toast.loading("Signing you out...");
    },
    onSuccess: () => {
      //clear the master password from memory
      useVaultStore.getState().clearMasterPassword();

      //redirect to the home page
      toast.dismiss();
      toast.success("Success!");
      router.push("/");
      queryClient.invalidateQueries({ queryKey: ["session"] });
    },
    onError: (error) => {
      // display the error message
      toast.dismiss();
      toast.error("An error occured. " + error.message);
    },
  });
}

export function useRequestPasswordReset(email: string) {
  return useMutation({
    mutationFn: () => requestPasswordReset(email),
    onMutate: () => {
      toast.loading("Sending reset password email...");
    },
    onSuccess: () => {
      toast.dismiss();
      toast.success("Success. Check your email to reset your password.");
    },
    onError: (error) => {
      toast.dismiss();
      toast.error("Failed to send reset password email" + error);
    },
  });
}

export function useResetPassword(newPassword: string, token: string) {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: () => resetPassword(newPassword, token),
    onMutate: () => {
      toast.loading("Resetting your password...");
    },
    onSuccess: () => {
      toast.dismiss();
      toast.success("Password reset successfully!");
      queryClient.invalidateQueries({ queryKey: ["session"] });
      router.push("/sign-in");
    },
    onError: (error) => {
      toast.dismiss();
      toast.error("Failed to reset password" + error);
    },
  });
}
