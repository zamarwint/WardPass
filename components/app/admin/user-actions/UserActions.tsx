"use client";

import { PasswordInput } from "@/components/PasswordInput";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    useBanUser,
    useImpersonateUser,
    useRemoveUser,
    useRevokeAllUserSessions,
    useSetUserPassword,
    useSetUserRole,
    useStopImpersonation,
    useUnbanUser,
    useUpdateUser,
} from "@/lib/mutations/AdminUserActionMutations";
import { resetPasswordSchema } from "@/lib/validations/authSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { ProfilePictureUpload } from "../../settings/ProfilePicUpload";

export function SetUserRoleAlert({
    open,
    onOpenChange,
    userId,
    currentRole,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    userId: string;
    currentRole: "admin" | "user" | ("admin" | "user")[];
}) {
    const [role, setRole] = useState<"admin" | "user" | ("admin" | "user")[]>(currentRole);
    const { mutate, isPending, error } = useSetUserRole();

    const handleSubmit = () => {
        mutate({ userId, role });
        onOpenChange(false);
    };

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent className="rounded-2xl">
                <AlertDialogHeader>
                    <AlertDialogTitle>Set User Role</AlertDialogTitle>
                    <AlertDialogDescription>Select the permission role for this user.</AlertDialogDescription>
                </AlertDialogHeader>
                <Select
                    value={role as string}
                    onValueChange={(value) => setRole(value as "admin" | "user" | ("admin" | "user")[])}
                >
                    <SelectTrigger className="h-11 rounded-xl">
                        <SelectValue placeholder="Select user role" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                        <SelectItem value="admin" className="cursor-pointer rounded-lg">Admin</SelectItem>
                        <SelectItem value="user" className="cursor-pointer rounded-lg">User</SelectItem>
                        <SelectItem value={JSON.stringify(["admin", "user"])} className="cursor-pointer rounded-lg">
                            Admin &amp; User
                        </SelectItem>
                    </SelectContent>
                </Select>
                {error && <p className="text-destructive text-sm text-center">{error.message}</p>}
                <AlertDialogFooter>
                    <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                    <AlertDialogAction className="rounded-xl" onClick={handleSubmit} disabled={isPending}>
                        Set Role
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

export function SetUserPasswordAlert({
    open,
    onOpenChange,
    userId,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    userId: string;
}) {
    const [showPassword, setShowPassword] = useState(false);
    const [setUserPasswordPending, startSetUserPasswordTransition] = useTransition();
    const { mutate, isPending, error } = useSetUserPassword();

    const form = useForm<z.infer<typeof resetPasswordSchema>>({
        resolver: zodResolver(resetPasswordSchema),
        mode: "onChange",
        defaultValues: {
            password: "",
            confirmPassword: "",
        },
    });

    function onSubmit(data: z.infer<typeof resetPasswordSchema>) {
        startSetUserPasswordTransition(async () => {
            mutate({ userId, newPassword: data.password });
            onOpenChange(false);
        });
    }

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent className="rounded-2xl">
                <AlertDialogHeader>
                    <AlertDialogTitle>Set User Password</AlertDialogTitle>
                    <AlertDialogDescription>Set a new master password for this user.</AlertDialogDescription>
                </AlertDialogHeader>
                <form id="set-user-password-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <Controller
                        name="password"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="admin-set-master-password">New Master Password</FieldLabel>
                                <div className="relative">
                                    <Input
                                        {...field}
                                        id="admin-set-master-password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="************"
                                        aria-invalid={fieldState.invalid}
                                        className="h-11 rounded-xl pr-10"
                                        autoComplete="off"
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
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />

                    <Controller
                        name="confirmPassword"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="admin-confirm-master-password">Confirm New Master Password</FieldLabel>
                                <PasswordInput
                                    {...field}
                                    id="admin-confirm-master-password"
                                    type="password"
                                    placeholder="************"
                                    aria-invalid={fieldState.invalid}
                                    className="h-11 rounded-xl"
                                    autoComplete="off"
                                />
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />
                </form>
                {error && <p className="text-destructive text-sm text-center">{error.message}</p>}
                <AlertDialogFooter>
                    <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                    <Button
                        type="submit"
                        form="set-user-password-form"
                        className="rounded-xl"
                        disabled={isPending || setUserPasswordPending}
                    >
                        Set Password
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

export function UpdateUserAlert({
    open,
    onOpenChange,
    user,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    user: any;
}) {
    const { mutate, isPending } = useUpdateUser();

    const [name, setName] = useState<string>(user.name);
    const [email, setEmail] = useState<string>(user.email);

    const handleSubmit = () => {
        mutate({ userId: user.id, userData: { name, email } });
        onOpenChange(false);
    };

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent className="rounded-2xl max-h-[90vh] overflow-y-auto">
                <AlertDialogHeader>
                    <AlertDialogTitle>Update User</AlertDialogTitle>
                    <AlertDialogDescription>Update profile details for this user.</AlertDialogDescription>
                </AlertDialogHeader>
                <Field>
                    <FieldLabel htmlFor="admin-update-name">Name</FieldLabel>
                    <Input
                        id="admin-update-name"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="h-11 rounded-xl"
                    />
                    <FieldError errors={[]} />
                </Field>
                <Field>
                    <FieldLabel htmlFor="admin-update-email">Email</FieldLabel>
                    <Input
                        id="admin-update-email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="h-11 rounded-xl"
                    />
                    <FieldError errors={[]} />
                </Field>
                <Field>
                    <FieldLabel htmlFor="admin-update-image">Profile Picture</FieldLabel>
                    <div className="flex flex-col items-center justify-center gap-2">
                        <ProfilePictureUpload imageUrl={user.image} userName={user.name} />
                    </div>
                    <FieldError errors={[]} />
                </Field>
                <AlertDialogFooter>
                    <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                    <AlertDialogAction className="rounded-xl" onClick={handleSubmit} disabled={isPending}>
                        Update User
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

export function BanUserAlert({
    open,
    onOpenChange,
    userId,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    userId: string;
}) {
    const [banReason, setBanReason] = useState<string>("");
    const [banExpiresIn, setBanExpiresIn] = useState<string>("7");
    const { mutate, isPending, error } = useBanUser();

    const handleSubmit = () => {
        mutate({ userId, banReason, banExpiresIn: parseInt(banExpiresIn) });
        onOpenChange(false);
    };

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent className="rounded-2xl">
                <AlertDialogHeader>
                    <AlertDialogTitle>Ban User</AlertDialogTitle>
                    <AlertDialogDescription>Suspend this user&apos;s access to WardPass.</AlertDialogDescription>
                </AlertDialogHeader>
                <div className="flex flex-col gap-3">
                    <Label htmlFor="ban">Ban Reason</Label>
                    <Input
                        id="ban"
                        placeholder="Enter ban reason..."
                        value={banReason}
                        onChange={(e) => setBanReason(e.target.value)}
                        className="h-11 rounded-xl"
                    />
                    <Label>Duration</Label>
                    <Select value={banExpiresIn} onValueChange={(value) => setBanExpiresIn(value as string)}>
                        <SelectTrigger className="h-11 rounded-xl">
                            <SelectValue placeholder="Ban expires in" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                            <SelectItem value="7" className="cursor-pointer rounded-lg">7 days</SelectItem>
                            <SelectItem value="30" className="cursor-pointer rounded-lg">30 days</SelectItem>
                            <SelectItem value="90" className="cursor-pointer rounded-lg">90 days</SelectItem>
                            <SelectItem value="180" className="cursor-pointer rounded-lg">180 days</SelectItem>
                            <SelectItem value="365" className="cursor-pointer rounded-lg">1 year</SelectItem>
                            <SelectItem value="-1" className="cursor-pointer rounded-lg">Permanent</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                {error && <p className="text-destructive text-sm text-center">{error.message}</p>}
                <AlertDialogFooter>
                    <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                    <AlertDialogAction className="rounded-xl" onClick={handleSubmit} disabled={isPending}>
                        Ban User
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

export function UnbanUserAlert({
    open,
    onOpenChange,
    userId,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    userId: string;
}) {
    const { mutate, isPending } = useUnbanUser();

    const handleSubmit = () => {
        mutate({ userId });
        onOpenChange(false);
    };

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent className="rounded-2xl">
                <AlertDialogHeader>
                    <AlertDialogTitle>Unban User</AlertDialogTitle>
                    <AlertDialogDescription>Restore this user&apos;s access to WardPass.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                    <AlertDialogAction className="rounded-xl" onClick={handleSubmit} disabled={isPending}>
                        Unban User
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

export function RevokeAllUserSessions({
    open,
    onOpenChange,
    userId,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    userId: string;
}) {
    const { mutate, isPending } = useRevokeAllUserSessions();

    const handleSubmit = () => {
        mutate({ userId });
        onOpenChange(false);
    };

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent className="rounded-2xl">
                <AlertDialogHeader>
                    <AlertDialogTitle>Revoke All User Sessions</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to revoke all sessions for this user? This will log them out of all devices.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                    <AlertDialogAction className="rounded-xl" onClick={handleSubmit} disabled={isPending}>
                        Revoke All Sessions
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

export function ImpersonateUser({
    open,
    onOpenChange,
    userId,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    userId: string;
}) {
    const { mutate, isPending } = useImpersonateUser();

    const handleSubmit = () => {
        mutate({ userId });
        onOpenChange(false);
    };

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent className="rounded-2xl">
                <AlertDialogHeader>
                    <AlertDialogTitle>Impersonate User</AlertDialogTitle>
                    <AlertDialogDescription>
                        This will temporarily give you admin impersonation access to this user&apos;s account.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                    <AlertDialogAction className="rounded-xl" onClick={handleSubmit} disabled={isPending}>
                        Impersonate
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

export function StopImpersonation({
    open,
    onOpenChange,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) {
    const { mutate, isPending } = useStopImpersonation();

    const handleSubmit = () => {
        mutate();
        onOpenChange(false);
    };

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent className="rounded-2xl">
                <AlertDialogHeader>
                    <AlertDialogTitle>Stop Impersonation</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to stop your current impersonation session?
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                    <AlertDialogAction className="rounded-xl" onClick={handleSubmit} disabled={isPending}>
                        Stop Impersonation
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

export function RemoveUser({
    open,
    onOpenChange,
    userId,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    userId: string;
}) {
    const { mutate, isPending } = useRemoveUser();

    const handleSubmit = () => {
        mutate({ userId });
        onOpenChange(false);
    };

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent className="rounded-2xl">
                <AlertDialogHeader>
                    <AlertDialogTitle>Remove User</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to remove this user? This action is irreversible and will permanently delete the user.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        className="rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        onClick={handleSubmit}
                        disabled={isPending}
                    >
                        Remove User
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
