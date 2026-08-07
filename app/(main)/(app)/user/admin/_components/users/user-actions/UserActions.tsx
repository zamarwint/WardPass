import { PasswordInput } from "@/app/(main)/(auth)/_components/PasswordInput"
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
import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useBanUser, useImpersonateUser, useRemoveUser, useRevokeAllUserSessions, useSetUserPassword, useSetUserRole, useStopImpersonation, useUnbanUser, useUpdateUser } from "@/lib/mutations/AdminUserActionMutations"
import { resetPasswordSchema } from "@/lib/validations/authSchemas"
import { zodResolver } from "@hookform/resolvers/zod"
import { EyeIcon, EyeOffIcon } from "lucide-react"
import { useState, useTransition } from "react"
import { Controller, useForm } from "react-hook-form"
import z from "zod"
import { ProfileAvatar } from "../../../../_components/Profile"

export function SetUserRoleAlert({ open, onOpenChange, userId, currentRole }: { open: boolean, onOpenChange: (open: boolean) => void, userId: string, currentRole: "admin" | "user" | ("admin" | "user")[] }) {
    const [role, setRole] = useState<"admin" | "user" | ("admin" | "user")[]>(currentRole)
    const { mutate, isPending, error } = useSetUserRole();

    const handleSubmit = () => {
        mutate({ userId, role });
        onOpenChange(false);
    }

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Set User Role</AlertDialogTitle>
                    <AlertDialogDescription>
                        Set user role of this user.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <Select value={role as string} onValueChange={(value) => setRole(value as "admin" | "user" | ("admin" | "user")[])}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select user role" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="admin" className="cursor-pointer">Admin</SelectItem>
                        <SelectItem value="user" className="cursor-pointer">User</SelectItem>
                        <SelectItem value={JSON.stringify(["admin", "user"])} className="cursor-pointer">Admin & User</SelectItem>
                    </SelectContent>
                </Select>
                {error && <p className="text-red-500 text-center">{error.message}</p>}
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleSubmit} disabled={isPending}>Set Role</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export function SetUserPasswordAlert({ open, onOpenChange, userId }: { open: boolean, onOpenChange: (open: boolean) => void, userId: string }) {
    const [showPassword, setShowPassword] = useState(false);

    const [setUserPasswordPending, startSetUserPasswordTransition] = useTransition();
    const { mutate, isPending, error } = useSetUserPassword();

    // 2. Create form instance with resolver
    const form = useForm<z.infer<typeof resetPasswordSchema>>({
        resolver: zodResolver(resetPasswordSchema),
        mode: "onChange",
        defaultValues: {
            password: "",
            confirmPassword: ""
        }
    })

    function onSubmit(data: z.infer<typeof resetPasswordSchema>) {
        startSetUserPasswordTransition(async () => {
            mutate({ userId, newPassword: data.password });
            onOpenChange(false);
        })
    }

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Set User Password</AlertDialogTitle>
                    <AlertDialogDescription>
                        Set new password of this user.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    {/* Password Field */}
                    <Controller
                        name="password"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="master-password">New Master Password</FieldLabel>
                                <div className="relative">
                                    <Input
                                        {...field}
                                        id="master-password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="************"
                                        aria-invalid={fieldState.invalid}
                                        className="h-12"
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
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />

                    {/* Confirm Password Field */}
                    <Controller
                        name="confirmPassword"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="confirmMasterPassword">Confirm New Master Password</FieldLabel>
                                <PasswordInput
                                    {...field}
                                    id="confirmMasterPassword"
                                    type="password"
                                    placeholder="************"
                                    aria-invalid={fieldState.invalid}
                                    className="h-12"
                                    autoComplete="off"
                                />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />
                </form>
                {error && <p className="text-red-500 text-center">{error.message}</p>}
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction type="submit" disabled={isPending || setUserPasswordPending}>Set Password</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export function UpdateUserAlert({ open, onOpenChange, user }: { open: boolean, onOpenChange: (open: boolean) => void, user: any }) {
    const { mutate, isPending } = useUpdateUser();

    const [name, setName] = useState<string>(user.name);
    const [email, setEmail] = useState<string>(user.email);
    const [image, setImage] = useState<string>(user.image);

    const handleSubmit = () => {
        mutate({ userId: user.id, userData: { name, email, image } });
        onOpenChange(false);
    }

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Update User</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to update this user?
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <Field>
                    <FieldLabel htmlFor="name">Name</FieldLabel>
                    <Input id="name" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="h-12" />
                    <FieldError errors={[]} />
                </Field>
                <Field>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input id="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="h-12" />
                    <FieldError errors={[]} />
                </Field>
                <Field>
                    <FieldLabel htmlFor="image">Image (Coming soon)</FieldLabel>
                    <div className="flex flex-col items-center justify-center gap-2">
                        <ProfileAvatar size="size-32" image={image} alt={name || "Profile picture"} fallback={`${name.split(" ")[0][0]}${name.split(" ")[1][0]}`} />
                        <div className="w-fit flex items-center justify-center gap-2">
                            <Button disabled>Edit Image</Button>
                            <Button variant="destructive" disabled>Remove Image</Button>
                        </div>
                    </div>
                    <FieldError errors={[]} />
                </Field>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleSubmit} disabled={isPending}>Update User</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export function BanUserAlert({ open, onOpenChange, userId }: { open: boolean, onOpenChange: (open: boolean) => void, userId: string }) {
    const [banReason, setBanReason] = useState<string>("");
    const [banExpiresIn, setBanExpiresIn] = useState<string>("7");
    const { mutate, isPending, error } = useBanUser();

    const handleSubmit = () => {
        mutate({ userId, banReason, banExpiresIn: parseInt(banExpiresIn) });
        onOpenChange(false);
    }

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Ban User</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to ban this user?
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <Label htmlFor='ban'>Enter the ban reason</Label>
                <Input id='ban' placeholder="Ban reason" value={banReason} onChange={(e) => setBanReason(e.target.value)} />
                <Select value={banExpiresIn} onValueChange={(value) => setBanExpiresIn(value)}>
                    <SelectTrigger>
                        <SelectValue placeholder="Ban expires in" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="7" className="cursor-pointer">7 days</SelectItem>
                        <SelectItem value="30" className="cursor-pointer">30 days</SelectItem>
                        <SelectItem value="90" className="cursor-pointer">90 days</SelectItem>
                        <SelectItem value="180" className="cursor-pointer">180 days</SelectItem>
                        <SelectItem value="365" className="cursor-pointer">1 year</SelectItem>
                        <SelectItem value="-1" className="cursor-pointer">Permanent</SelectItem>
                    </SelectContent>
                </Select>
                {error && <p className="text-red-500 text-center">{error.message}</p>}
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleSubmit} disabled={isPending}>Ban</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export function UnbanUserAlert({ open, onOpenChange, userId }: { open: boolean, onOpenChange: (open: boolean) => void, userId: string }) {
    const { mutate, isPending } = useUnbanUser();

    const handleSubmit = () => {
        mutate({ userId });
        onOpenChange(false);
    }

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Unban User</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to unban this user?
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleSubmit} disabled={isPending}>Unban</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

// REVOKE ALL USER SESSIONS
export function RevokeAllUserSessions({ open, onOpenChange, userId }: { open: boolean, onOpenChange: (open: boolean) => void, userId: string }) {
    const { mutate, isPending } = useRevokeAllUserSessions();

    const handleSubmit = () => {
        mutate({ userId });
        onOpenChange(false);
    }

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Revoke All User Sessions</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to revoke all sessions for this user? This will log them out of all sessions, and they will need to log in again.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleSubmit} disabled={isPending}>Revoke All Sessions</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export function ImpersonateUser({ open, onOpenChange, userId }: { open: boolean, onOpenChange: (open: boolean) => void, userId: string }) {
    const { mutate, isPending } = useImpersonateUser();

    const handleSubmit = () => {
        mutate({ userId });
        onOpenChange(false);
    }

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Impersonate User</AlertDialogTitle>
                    <AlertDialogDescription>
                        This will temporarily give you full admin access to the user account.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleSubmit} disabled={isPending}>Impersonate</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export function StopImpersonation({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {
    const { mutate, isPending } = useStopImpersonation();

    const handleSubmit = () => {
        mutate();
        onOpenChange(false);
    }

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Stop Impersonation</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to stop your current impersonation?
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleSubmit} disabled={isPending}>Stop Impersonation</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

// REMOVE / DELETE USER
export function RemoveUser({ open, onOpenChange, userId }: { open: boolean, onOpenChange: (open: boolean) => void, userId: string }) {
    const { mutate, isPending } = useRemoveUser();

    const handleSubmit = () => {
        mutate({ userId });
        onOpenChange(false);
    }

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Remove User</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to remove this user? This action is irreversible and will permanently delete the user.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleSubmit} disabled={isPending}>Remove User</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}