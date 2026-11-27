"use client";

import { SwitchDualIconLabelDemo } from "@/components/ThemeChange";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Globe, Loader2Icon, Palette, Settings2, SquarePen, User } from "lucide-react";
import { authClient } from "@/utils/auth-client";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { useGetSession } from "@/lib/queries/SessionQueries";
import { ProfilePicture } from "@/components/app/settings/Profile";

function ProfileName({ data }: { data: any }) {
    const currentName = (data?.user?.name as string) ?? "";
    const [draftName, setDraftName] = useState<string | null>(null);
    const newName = draftName ?? currentName;
    const [nameChangePending, startNameChangeTransition] = useTransition();

    const updateUserName = async () => {
        startNameChangeTransition(async () => {
            await authClient.updateUser({
                name: newName,
                fetchOptions: {
                    onRequest: () => {
                        toast.loading("Updating...");
                    },
                    onSuccess: () => {
                        toast.dismiss();
                        toast.success("Display name updated!");
                        setDraftName(null);
                    },
                    onError: (ctx) => {
                        toast.dismiss();
                        toast.error(ctx.error.message);
                    },
                },
            });
        });
    };

    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-col gap-0.5">
                <span className="text-sm font-semibold text-foreground">Full Name</span>
                <span className="text-xs text-muted-foreground">
                    Your display name across WardPass.
                </span>
            </div>
            <div className="flex items-center gap-2.5 w-full sm:w-auto">
                <Input
                    type="text"
                    className="h-10 sm:w-60 rounded-xl"
                    placeholder="e.g. John Doe"
                    value={newName}
                    onChange={(e) => setDraftName(e.target.value)}
                />
                <Button
                    disabled={!newName.trim() || nameChangePending || newName === currentName}
                    onClick={updateUserName}
                    className="h-10 px-4 rounded-xl font-semibold shrink-0 cursor-pointer"
                >
                    {nameChangePending ? (
                        <>
                            <Loader2Icon className="size-4 animate-spin" />
                            <span>Updating...</span>
                        </>
                    ) : (
                        <>
                            <SquarePen className="size-4" />
                            <span>Update</span>
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
}

// GENERAL SETTINGS
export default function GeneralSettings() {
    const { data } = useGetSession();

    return (
        <section className="flex flex-col gap-6">
            {/* Top Navigation & Header */}
            <div className="flex items-center justify-between border-b border-border/40 pb-4">
                <div className="flex items-center gap-3">
                    <SidebarTrigger className="cursor-pointer" />
                    <div className="flex items-center gap-2">
                        <span className="size-2 rounded-full bg-primary" />
                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            Preferences
                        </span>
                    </div>
                </div>
            </div>

            {/* Hero Header */}
            <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-br from-card/80 via-card/40 to-muted/20 p-6 shadow-xs">
                <div className="flex items-center gap-4">
                    <div className="size-12 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center shrink-0">
                        <Settings2 className="size-6" />
                    </div>
                    <div className="flex flex-col gap-1">
                        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                            General Settings
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Manage your language, appearance, and personal profile details.
                        </p>
                    </div>
                </div>
            </div>

            {/* Preferences Card (Language & Theme) */}
            <div className="rounded-2xl border border-border/50 bg-card/50 p-5 sm:p-6 shadow-2xs flex flex-col gap-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-3.5">
                        <div className="size-9 rounded-xl bg-blue-500/10 text-blue-500 border border-blue-500/20 flex items-center justify-center shrink-0 mt-0.5">
                            <Globe className="size-4" />
                        </div>
                        <div className="flex flex-col gap-0.5">
                            <span className="text-base font-semibold text-foreground">Language</span>
                            <span className="text-xs text-muted-foreground">
                                Choose your preferred interface language.
                            </span>
                        </div>
                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger
                            render={
                                <Button disabled variant="outline" className="h-10 px-4 rounded-xl w-full sm:w-auto">
                                    English (Coming soon)
                                </Button>
                            }
                        />
                        <DropdownMenuContent align="end" className="rounded-xl">
                            <DropdownMenuItem>English</DropdownMenuItem>
                            <DropdownMenuItem>Spanish</DropdownMenuItem>
                            <DropdownMenuItem>French</DropdownMenuItem>
                            <DropdownMenuItem>Dutch</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <div className="border-t border-border/40" />

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-3.5">
                        <div className="size-9 rounded-xl bg-violet-500/10 text-violet-500 border border-violet-500/20 flex items-center justify-center shrink-0 mt-0.5">
                            <Palette className="size-4" />
                        </div>
                        <div className="flex flex-col gap-0.5">
                            <span className="text-base font-semibold text-foreground">Theme</span>
                            <span className="text-xs text-muted-foreground">
                                Switch between light, dark, and system themes.
                            </span>
                        </div>
                    </div>

                    <div className="shrink-0">
                        <SwitchDualIconLabelDemo />
                    </div>
                </div>
            </div>

            {/* Profile Card */}
            <div className="rounded-2xl border border-border/50 bg-card/50 p-5 sm:p-6 shadow-2xs flex flex-col gap-5">
                <div className="flex items-center gap-3 pb-1">
                    <div className="size-9 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center shrink-0">
                        <User className="size-4" />
                    </div>
                    <div className="flex flex-col">
                        <h2 className="text-base font-bold text-foreground">Profile</h2>
                        <p className="text-xs text-muted-foreground">
                            Update your display name and profile picture.
                        </p>
                    </div>
                </div>

                <div className="border-t border-border/40" />
                <ProfileName data={data} />
                <div className="border-t border-border/40" />
                <ProfilePicture data={data} />
            </div>
        </section>
    );
}
