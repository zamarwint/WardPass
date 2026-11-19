"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { toast } from "sonner";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import {
  ArrowLeftIcon,
  EyeIcon,
  EyeOffIcon,
  KeyRoundIcon,
  Loader2Icon,
  MailIcon,
  RotateCcwIcon,
  ShieldAlertIcon,
} from "lucide-react";

import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/PasswordInput";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { WebsiteCredentialCard } from "@/components/UICards";
import { DotPattern } from "@/components/ui/dot-pattern";
import { CustomLoadingState } from "@/components/LoadingStates";

import { resetPasswordSchema } from "@/lib/validations/authSchemas";
import { useVaultStore } from "@/stores/vault";
import {
  getVaultDataForPasswordReset,
  requestPasswordReset,
  UpdatedItemPayload,
  UpdatedVaultPayload,
} from "@/actions/auth/reset-password";
import { useResetPassword } from "@/lib/mutations/AuthMutations";
import {
  deriveKey,
  fromBase64,
  generateSalt,
  toBase64,
} from "@/lib/crypto/argon2";
import {
  createVerificationHash,
  decryptData,
  decryptVaultKey,
  encryptData,
  encryptVaultKey,
  generateVaultKey,
  verifyVaultKey,
} from "@/lib/crypto/aes";

interface VaultData {
  id: string;
  name: string;
  salt: string | null;
  encryptedKey: string | null;
  keyIv: string | null;
  verificationHash: string | null;
  hashIv: string | null;
}

interface ItemData {
  id: string;
  vaultId: string;
  encryptedData: string | null;
  iv: string | null;
}

const emailValidationSchema = z.string().email("Please enter a valid email address.");

export default function ResetPassword() {
  const router = useRouter();

  // Multi-step flow state: "email" (stage 1) -> "reset" (stage 2)
  const [step, setStep] = useState<"email" | "reset">("email");
  const [email, setEmail] = useState<string>("");
  const [otpValue, setOtpValue] = useState<string>("");

  // Transitions
  const [requestResetPending, startRequestResetTransition] = useTransition();
  const [resendPending, startResendTransition] = useTransition();
  const [resetPasswordPending, startResetPasswordTransition] = useTransition();

  // Vault data state for re-encryption
  const [isLoadingVaults, setIsLoadingVaults] = useState(false);
  const [vaults, setVaults] = useState<VaultData[]>([]);
  const [items, setItems] = useState<ItemData[]>([]);
  const [wipeVaults, setWipeVaults] = useState(false);

  // Password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);

  // Store password pre-fill
  const storePassword = useVaultStore((state) => state.masterPassword);

  const resetPasswordMutation = useResetPassword();

  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onChange",
    defaultValues: {
      currentPassword: storePassword || "",
      password: "",
      confirmPassword: "",
    },
  });

  // Pre-fill email from query param if provided
  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlEmail = new URLSearchParams(window.location.search).get("email");
      if (urlEmail) {
        setEmail(urlEmail);
      }
    }
  }, []);

  // Stage 1: Send OTP to user's email & fetch vault info
  const handleSendResetCode = () => {
    const trimmedEmail = email.trim();
    const emailResult = emailValidationSchema.safeParse(trimmedEmail);
    if (!emailResult.success) {
      toast.error(emailResult.error.issues[0].message);
      return;
    }

    startRequestResetTransition(async () => {
      try {
        toast.loading("Sending password reset code...");
        await requestPasswordReset(trimmedEmail);
        toast.dismiss();
        toast.success("Verification code sent! Please check your email.");

        // Fetch user's vault metadata for re-encryption
        setIsLoadingVaults(true);
        try {
          const vaultData = await getVaultDataForPasswordReset(trimmedEmail);
          setVaults(vaultData.vaults);
          setItems(vaultData.items);
        } catch {
          // If vault retrieval fails or user has no vaults, default to empty
          setVaults([]);
          setItems([]);
        } finally {
          setIsLoadingVaults(false);
        }

        setStep("reset");
      } catch (err: any) {
        toast.dismiss();
        toast.error(err?.message || "Failed to send reset code. Please try again.");
      }
    });
  };

  // Resend OTP code
  const handleResendCode = () => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail) return;

    startResendTransition(async () => {
      try {
        toast.loading("Resending verification code...");
        await requestPasswordReset(trimmedEmail);
        toast.dismiss();
        toast.success("A fresh verification code has been sent to your email.");
      } catch (err: any) {
        toast.dismiss();
        toast.error(err?.message || "Failed to resend code.");
      }
    });
  };

  // Stage 2: Verify OTP, Re-encrypt vaults client-side, and Reset Password
  const onSubmit = async (formData: z.infer<typeof resetPasswordSchema>) => {
    const trimmedEmail = email.trim();
    const trimmedOtp = otpValue.trim();

    if (!trimmedOtp || trimmedOtp.length !== 6) {
      toast.error("Please enter the complete 6-digit verification code.");
      return;
    }

    startResetPasswordTransition(async () => {
      try {
        const hasVaults = vaults.length > 0;

        // Case 1: User has existing vaults and is re-encrypting them with the new password
        if (hasVaults && !wipeVaults) {
          const currentPwd = formData.currentPassword?.trim();
          if (!currentPwd) {
            toast.error("Please enter your current master password to re-encrypt your vaults.");
            return;
          }

          toast.loading("Unlocking and re-encrypting your vaults with your new password...");

          const updatedVaults: UpdatedVaultPayload[] = [];
          const updatedItems: UpdatedItemPayload[] = [];

          for (const v of vaults) {
            if (!v.salt || !v.encryptedKey || !v.keyIv || !v.verificationHash || !v.hashIv) {
              continue;
            }

            // 1. Decrypt old vaultKey using currentPassword
            const oldSaltBytes = fromBase64(v.salt);
            const oldDerivedKey = await deriveKey(currentPwd, oldSaltBytes);
            const oldVaultKey = decryptVaultKey(v.encryptedKey, v.keyIv, oldDerivedKey);

            // 2. Verify that oldVaultKey is authentic
            if (!verifyVaultKey(v.verificationHash, v.hashIv, oldVaultKey)) {
              toast.dismiss();
              toast.error(`Incorrect current password. Could not decrypt vault "${v.name}".`);
              return;
            }

            // 3. Generate a fresh 32-byte vault key and new salt for the new password
            const newVaultKey = generateVaultKey();
            const newSaltBytes = generateSalt();
            const newDerivedKey = await deriveKey(formData.password, newSaltBytes);

            // 4. Encrypt new vault key with new derived key
            const { encryptedKey, keyIv } = encryptVaultKey(newVaultKey, newDerivedKey);
            const { hash: verificationHash, hashIv } = createVerificationHash(newVaultKey);

            updatedVaults.push({
              id: v.id,
              salt: toBase64(newSaltBytes),
              encryptedKey,
              keyIv,
              verificationHash,
              hashIv,
            });

            // 5. Re-encrypt all items belonging to this vault
            const itemsForVault = items.filter((item) => item.vaultId === v.id);
            for (const item of itemsForVault) {
              if (item.encryptedData && item.iv) {
                const decryptedPayload = decryptData(item.encryptedData, item.iv, oldVaultKey);
                const { ciphertext, iv } = encryptData(decryptedPayload, newVaultKey);
                updatedItems.push({
                  id: item.id,
                  encryptedData: ciphertext,
                  iv,
                });
              }
            }
          }

          await resetPasswordMutation.mutateAsync({
            email: trimmedEmail,
            otp: trimmedOtp,
            newPassword: formData.password,
            updatedVaults,
            updatedItems,
          });
        } else if (hasVaults && wipeVaults) {
          // Case 2: User forgot current password and chose to wipe old vaults
          await resetPasswordMutation.mutateAsync({
            email: trimmedEmail,
            otp: trimmedOtp,
            newPassword: formData.password,
            wipeVaults: true,
          });
        } else {
          // Case 3: User has no vaults yet
          await resetPasswordMutation.mutateAsync({
            email: trimmedEmail,
            otp: trimmedOtp,
            newPassword: formData.password,
          });
        }
      } catch (err: any) {
        toast.dismiss();
        toast.error(err?.message || "Failed to reset password and re-encrypt vaults.");
      }
    });
  };

  const hasVaults = vaults.length > 0;
  const isBusy = resetPasswordPending || resetPasswordMutation.isPending;

  return (
    <>
      <div className="bg-background flex items-center justify-center w-screen h-screen z-999 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 overflow-hidden">
        {/* RESET PASSWORD CARD / FORM COLUMN */}
        <div className="bg-background w-full h-full flex flex-col items-center justify-center border-r border-foreground/5 p-6 overflow-y-auto">
          <div className="w-full max-w-lg my-auto py-8">
            {step === "email" ? (
              /* ── STAGE 1: ENTER EMAIL ────────────────────────────────────────── */
              <FieldSet className="space-y-6">
                <Field className="space-y-1">
                  <FieldTitle className="text-4xl font-bold text-left">Reset Password</FieldTitle>
                  <FieldDescription className="text-left text-md">
                    Enter your email address to receive a 6-digit verification code.
                  </FieldDescription>
                </Field>

                <FieldGroup className="space-y-4">
                  <Field>
                    <FieldLabel htmlFor="email" className="text-sm font-medium">
                      Email address
                    </FieldLabel>
                    <div className="relative">
                      <Input
                        type="email"
                        id="email"
                        required
                        placeholder="e.g. alexpeart@gmail.com"
                        value={email}
                        className="h-12 pr-10"
                        autoComplete="email"
                        onChange={(e) => setEmail(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleSendResetCode();
                          }
                        }}
                      />
                      <MailIcon className="absolute right-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                    </div>
                  </Field>

                  <FieldSeparator />

                  <Field>
                    <Button
                      size="lg"
                      className="w-full h-12 text-md font-semibold cursor-pointer"
                      disabled={requestResetPending || !email.trim()}
                      onClick={handleSendResetCode}
                    >
                      {requestResetPending ? (
                        <>
                          <Loader2Icon className="animate-spin size-4 mr-2" />
                          <span>Sending reset code...</span>
                        </>
                      ) : (
                        <span>Send Verification Code</span>
                      )}
                    </Button>
                  </Field>

                  <div className="text-center pt-2">
                    <Link
                      href="/sign-in"
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1.5"
                    >
                      <ArrowLeftIcon className="size-3.5" /> Back to Sign In
                    </Link>
                  </div>
                </FieldGroup>
              </FieldSet>
            ) : (
              /* ── STAGE 2: OTP + OLD PASSWORD + NEW PASSWORD ───────────────────── */
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FieldSet className="space-y-6">
                  <Field className="space-y-1">
                    <div className="flex items-center justify-between mb-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-xs text-muted-foreground hover:text-foreground -ml-2 h-8 px-2 flex items-center gap-1 cursor-pointer"
                        onClick={() => setStep("email")}
                      >
                        <ArrowLeftIcon className="size-3" /> Change email
                      </Button>
                      <span className="text-xs text-muted-foreground truncate max-w-50">
                        {email}
                      </span>
                    </div>
                    <FieldTitle className="text-3xl font-bold text-left">
                      Set New Password
                    </FieldTitle>
                    <FieldDescription className="text-left text-sm">
                      Enter the 6-digit verification code sent to your email and choose a new master password.
                    </FieldDescription>
                  </Field>

                  <FieldGroup className="space-y-5">
                    {/* 1. Verification Code (OTP) */}
                    <Field className="space-y-2">
                      <div className="flex items-center justify-between">
                        <FieldLabel htmlFor="otp-verification" className="text-sm font-medium">
                          Verification Code
                        </FieldLabel>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          disabled={resendPending}
                          className="h-7 text-xs text-primary hover:text-primary/80 px-2 cursor-pointer"
                          onClick={handleResendCode}
                        >
                          {resendPending ? (
                            <Loader2Icon className="animate-spin size-3 mr-1" />
                          ) : (
                            <RotateCcwIcon className="size-3 mr-1" />
                          )}
                          Resend code
                        </Button>
                      </div>
                      <InputOTP
                        maxLength={6}
                        id="otp-verification"
                        pattern={REGEXP_ONLY_DIGITS}
                        value={otpValue}
                        onChange={(val) => setOtpValue(val)}
                      >
                        <InputOTPGroup className="w-full flex items-center justify-between gap-1.5 sm:gap-2 *:data-[slot=input-otp-slot]:h-13 *:data-[slot=input-otp-slot]:flex-1 *:data-[slot=input-otp-slot]:text-xl *:data-[slot=input-otp-slot]:rounded-md">
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </Field>

                    <FieldSeparator />

                    {/* 2. Re-encryption Section (if user has existing vaults) */}
                    {hasVaults && !wipeVaults && (
                      <Controller
                        name="currentPassword"
                        control={form.control}
                        render={({ field, fieldState }) => (
                          <Field data-invalid={fieldState.invalid} className="space-y-1.5">
                            <div className="flex items-center justify-between">
                              <FieldLabel htmlFor="current-password" className="text-sm font-medium">
                                Current Master Password
                              </FieldLabel>
                              <span className="text-xs text-primary font-medium flex items-center gap-1">
                                <KeyRoundIcon className="size-3" /> Re-encrypts {vaults.length} vault{vaults.length !== 1 ? "s" : ""}
                              </span>
                            </div>
                            <div className="relative">
                              <Input
                                {...field}
                                id="current-password"
                                type={showCurrentPassword ? "text" : "password"}
                                placeholder="Enter your current password"
                                aria-invalid={fieldState.invalid}
                                className="h-12 pr-10"
                                autoComplete="current-password"
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent cursor-pointer"
                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                              >
                                {showCurrentPassword ? (
                                  <EyeIcon className="h-4 w-4" aria-hidden="true" />
                                ) : (
                                  <EyeOffIcon className="h-4 w-4" aria-hidden="true" />
                                )}
                              </Button>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Used client-side to decrypt your existing vault items and re-encrypt them with your new password.
                            </p>
                            {fieldState.invalid && (
                              <FieldError errors={[fieldState.error]} />
                            )}
                          </Field>
                        )}
                      />
                    )}

                    {/* Option for users who forgot their current password */}
                    {hasVaults && (
                      <div className="p-3 bg-muted/40 rounded-lg border border-border text-xs flex flex-col gap-2">
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={wipeVaults}
                            onChange={(e) => setWipeVaults(e.target.checked)}
                            className="rounded border-border accent-primary cursor-pointer"
                          />
                          <span className="font-medium text-foreground">
                            I do not know my current password
                          </span>
                        </label>
                        {wipeVaults && (
                          <div className="flex items-start gap-2 text-destructive mt-1">
                            <ShieldAlertIcon className="size-4 shrink-0 mt-0.5" />
                            <span>
                              Warning: Because WardPass uses zero-knowledge encryption, your existing {vaults.length} vault{vaults.length !== 1 ? "s" : ""} cannot be decrypted without your current password. Resetting will permanently clear your old vaults so you can start fresh.
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* 3. New Master Password */}
                    <Controller
                      name="password"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid} className="space-y-1.5">
                          <FieldLabel htmlFor="new-master-password" className="text-sm font-medium">
                            New Master Password
                          </FieldLabel>
                          <div className="relative">
                            <Input
                              {...field}
                              id="new-master-password"
                              type={showPassword ? "text" : "password"}
                              placeholder="************"
                              aria-invalid={fieldState.invalid}
                              className="h-12 pr-10"
                              autoComplete="new-password"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent cursor-pointer"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? (
                                <EyeIcon className="h-4 w-4" aria-hidden="true" />
                              ) : (
                                <EyeOffIcon className="h-4 w-4" aria-hidden="true" />
                              )}
                            </Button>
                          </div>
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />

                    {/* 4. Confirm New Master Password */}
                    <Controller
                      name="confirmPassword"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid} className="space-y-1.5">
                          <FieldLabel htmlFor="confirm-master-password" className="text-sm font-medium">
                            Confirm New Master Password
                          </FieldLabel>
                          <PasswordInput
                            {...field}
                            id="confirm-master-password"
                            placeholder="************"
                            aria-invalid={fieldState.invalid}
                            className="h-12"
                            autoComplete="new-password"
                          />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />

                    <FieldSeparator />

                    {/* 5. Submit Button */}
                    <Field>
                      <Button
                        type="submit"
                        disabled={isBusy || otpValue.length !== 6}
                        size="lg"
                        className="w-full h-12 text-md font-semibold cursor-pointer"
                      >
                        {isBusy ? (
                          <CustomLoadingState loaderChoice={2} className="size-full flex items-center justify-center gap-2">
                            <span className="shimmer shimmer-duration-1000">
                              RESETTING & RE-ENCRYPTING...
                            </span>
                          </CustomLoadingState>
                        ) : hasVaults && !wipeVaults ? (
                          <span>Reset Password & Re-encrypt Vaults</span>
                        ) : hasVaults && wipeVaults ? (
                          <span>Reset Password & Clear Vaults</span>
                        ) : (
                          <span>Reset Password</span>
                        )}
                      </Button>
                    </Field>

                    <div className="text-center pt-1">
                      <Link
                        href="/sign-in"
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1.5"
                      >
                        <ArrowLeftIcon className="size-3.5" /> Back to Sign In
                      </Link>
                    </div>
                  </FieldGroup>
                </FieldSet>
              </form>
            )}
          </div>
        </div>

        {/* PROMOTIONAL / BRANDING CARD COLUMN */}
        <div className="w-full hidden lg:flex flex-col items-center justify-center p-8">
          <WebsiteCredentialCard />
        </div>
      </div>
      <DotPattern />
    </>
  );
}
