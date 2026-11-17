"use client";

import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldSet, FieldTitle } from "@/components/ui/field";
import { PasswordInput } from "@/components/PasswordInput";
import { Button } from "@/components/ui/button";
import { useEffect, useState, useTransition } from "react";
import { AlertCircle, EyeIcon, EyeOffIcon, KeyRoundIcon, ShieldAlertIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Controller, useForm } from "react-hook-form";
import { resetPasswordSchema } from "@/lib/validations/authSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { Input } from "@/components/ui/input";
import { useResetPassword } from "@/lib/mutations/AuthMutations";
import { CustomLoadingState } from "@/components/LoadingStates";
import { getVaultDataForPasswordReset, UpdatedItemPayload, UpdatedVaultPayload } from "@/actions/auth/reset-password";
import { useVaultStore } from "@/stores/vault";
import { deriveKey, fromBase64, generateSalt, toBase64 } from "@/lib/crypto/argon2";
import { createVerificationHash, decryptData, decryptVaultKey, encryptData, encryptVaultKey, generateVaultKey, verifyVaultKey } from "@/lib/crypto/aes";
import { toast } from "sonner";
import Link from "next/link";

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

export default function ResetPassword() {
    const [showPassword, setShowPassword] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [resetPasswordPending, startResetPasswordTransition] = useTransition();
    const token = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get("token") : null;

    const [isLoadingVaults, setIsLoadingVaults] = useState(true);
    const [vaultError, setVaultError] = useState<string | null>(null);
    const [vaults, setVaults] = useState<VaultData[]>([]);
    const [items, setItems] = useState<ItemData[]>([]);
    const [wipeVaults, setWipeVaults] = useState(false);

    const storePassword = useVaultStore((state) => state.masterPassword);

    // 2. Create form instance with resolver
    const form = useForm<z.infer<typeof resetPasswordSchema>>({
        resolver: zodResolver(resetPasswordSchema),
        mode: "onChange",
        defaultValues: {
            currentPassword: storePassword || "",
            password: "",
            confirmPassword: ""
        }
    });

    const resetPasswordMutation = useResetPassword();

    useEffect(() => {
        if (!token) {
            setVaultError("Password reset token is missing from the URL.");
            setIsLoadingVaults(false);
            return;
        }

        let isMounted = true;
        const fetchVaults = async () => {
            try {
                const data = await getVaultDataForPasswordReset(token);
                if (isMounted) {
                    setVaults(data.vaults);
                    setItems(data.items);
                }
            } catch (err: any) {
                if (isMounted) {
                    setVaultError(err?.message || "Invalid or expired password reset link.");
                }
            } finally {
                if (isMounted) {
                    setIsLoadingVaults(false);
                }
            }
        };

        fetchVaults();
        return () => { isMounted = false; };
    }, [token]);

    async function onSubmit(data: z.infer<typeof resetPasswordSchema>) {
        if (!token) {
            toast.error("Password reset token is missing.");
            return;
        }

        startResetPasswordTransition(async () => {
            try {
                const hasVaults = vaults.length > 0;

                // Case 1: User has existing vaults and is re-encrypting them with the new password
                if (hasVaults && !wipeVaults) {
                    const currentPwd = data.currentPassword?.trim();
                    if (!currentPwd) {
                        toast.error("Please enter your current account password to re-encrypt your vaults.");
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
                        const newDerivedKey = await deriveKey(data.password, newSaltBytes);

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
                        token,
                        newPassword: data.password,
                        updatedVaults,
                        updatedItems,
                    });
                } else if (hasVaults && wipeVaults) {
                    // Case 2: User forgot current password and chose to wipe old vaults
                    await resetPasswordMutation.mutateAsync({
                        token,
                        newPassword: data.password,
                        wipeVaults: true,
                    });
                } else {
                    // Case 3: User has no vaults yet
                    await resetPasswordMutation.mutateAsync({
                        token,
                        newPassword: data.password,
                    });
                }
            } catch (err: any) {
                toast.dismiss();
                toast.error(err?.message || "Failed to reset password and re-encrypt vaults.");
            }
        });
    }

    if (isLoadingVaults) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen w-screen">
                <CustomLoadingState loaderChoice={2} className="flex flex-col items-center gap-4">
                    <span className="shimmer shimmer-duration-1000 text-lg font-semibold">VERIFYING RESET LINK...</span>
                </CustomLoadingState>
            </div>
        );
    }

    if (vaultError) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen w-screen p-4">
                <FieldSet className="w-xl max-w-full space-y-4 text-center">
                    <div className="flex justify-center text-destructive">
                        <AlertCircle className="size-16" />
                    </div>
                    <FieldTitle className="text-3xl font-bold">Invalid Reset Link</FieldTitle>
                    <FieldDescription className="text-base text-muted-foreground">{vaultError}</FieldDescription>
                    <div className="pt-4">
                        <Link href="/request-password-reset">
                            <Button variant="default" size="lg" className="w-full py-6">
                                Request a New Reset Link
                            </Button>
                        </Link>
                    </div>
                </FieldSet>
            </div>
        );
    }

    const hasVaults = vaults.length > 0;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen w-screen z-999 p-4">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FieldSet className="w-xl max-w-full">
                    <Field>
                        <FieldTitle className="text-3xl font-bold">Reset Your Password</FieldTitle>
                        <FieldDescription>
                            {hasVaults
                                ? "Enter your current password to re-encrypt your vaults, followed by your new password."
                                : "Enter your new account password below."}
                        </FieldDescription>
                    </Field>

                    <FieldGroup className="mt-8 space-y-4">
                        {/* Current Password Field (when user has existing vaults and hasn't chosen to wipe) */}
                        {hasVaults && !wipeVaults && (
                            <Controller
                                name="currentPassword"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <div className="flex items-center justify-between">
                                            <FieldLabel htmlFor="current-password">Current Account Password</FieldLabel>
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
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Your current password is used client-side to decrypt your vault items and re-encrypt them with your new password.
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
                            <div className="p-3 bg-muted/50 rounded-lg border border-border text-xs flex flex-col gap-2">
                                <label className="flex items-center gap-2 cursor-pointer select-none">
                                    <input
                                        type="checkbox"
                                        checked={wipeVaults}
                                        onChange={(e) => setWipeVaults(e.target.checked)}
                                        className="rounded border-border"
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

                        {/* New Password Field */}
                        <Controller
                            name="password"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="master-password">New Account Password</FieldLabel>
                                    <div className="relative">
                                        <Input
                                            {...field}
                                            id="master-password"
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

                        {/* Confirm New Password Field */}
                        <Controller
                            name="confirmPassword"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="confirmMasterPassword">Confirm New Account Password</FieldLabel>
                                    <PasswordInput
                                        {...field}
                                        id="confirmMasterPassword"
                                        type="password"
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
                    </FieldGroup>

                    <Separator className="my-6" />

                    <Field>
                        <Button
                            type="submit"
                            disabled={resetPasswordPending || resetPasswordMutation.isPending}
                            variant="default"
                            size="lg"
                            className="w-full py-6 font-bold cursor-pointer"
                        >
                            {resetPasswordPending || resetPasswordMutation.isPending ? (
                                <CustomLoadingState loaderChoice={2} className="size-full flex items-center justify-center gap-2">
                                    <span className="shimmer shimmer-duration-1000"> RESETTING & RE-ENCRYPTING... </span>
                                </CustomLoadingState>
                            ) : (
                                <span>Reset Password & Re-encrypt Vaults</span>
                            )}
                        </Button>
                    </Field>
                </FieldSet>
            </form>
        </div>
    );
}