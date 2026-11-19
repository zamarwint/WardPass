import {
  requestPasswordReset,
  resetPasswordAndReencryptVaults,
  type UpdatedItemPayload,
  type UpdatedVaultPayload,
} from "@/actions/auth/reset-password";
import signIn from "@/actions/auth/signIn";
import signOut from "@/actions/auth/signOut";
import signUp from "@/actions/auth/signUp";
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
      router.push("/strongroom");
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
      // Clear all master password and vault keys from memory
      useVaultStore.getState().clearMasterPassword();
      useVaultStore.getState().lockAll();

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

export function useRequestPasswordReset(defaultEmail?: string) {
  return useMutation({
    mutationFn: (emailParam?: string) => {
      const emailToUse = emailParam || defaultEmail || "";
      return requestPasswordReset(emailToUse);
    },
    onMutate: () => {
      toast.loading("Sending reset password code...");
    },
    onSuccess: () => {
      toast.dismiss();
      toast.success(
        "Success. Check your email for the code to reset your password.",
      );
    },
    onError: (error: any) => {
      toast.dismiss();
      toast.error(error?.message || "Failed to send reset password code.");
    },
  });
}

export function useResetPassword() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (payload: {
      email: string;
      otp: string;
      newPassword: string;
      updatedVaults?: UpdatedVaultPayload[];
      updatedItems?: UpdatedItemPayload[];
      wipeVaults?: boolean;
    }) => resetPasswordAndReencryptVaults(payload),
    onMutate: () => {
      toast.loading("Resetting password and re-encrypting vaults...");
    },
    onSuccess: () => {
      useVaultStore.getState().clearMasterPassword();
      useVaultStore.getState().lockAll();
      toast.dismiss();
      toast.success(
        "Password reset and vaults re-encrypted successfully! Please sign in with your new password.",
      );
      queryClient.clear();
      router.push("/sign-in");
    },
    onError: (error: any) => {
      toast.dismiss();
      toast.error(error?.message || "Failed to reset password.");
    },
  });
}
