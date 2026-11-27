"use client";

import HandleUserSessions from "@/components/app/admin/users/UserSessions";
import HandleListUsers from "@/components/app/admin/users/Users";
import AdminCreateUser from "@/components/app/admin/users/CreateUser";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { KeyRound, ShieldUser, UserPlus, Users } from "lucide-react";

type ContentSection = "users" | "user-sessions" | "create-user";

const CONTENT_SECTIONS: { value: ContentSection; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { value: "users", label: "All Users", icon: Users },
    { value: "user-sessions", label: "User Sessions", icon: KeyRound },
    { value: "create-user", label: "Create User", icon: UserPlus },
];

export default function UserManagementPage() {
    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-6 sm:py-8 flex flex-col gap-6">
            {/* Top Bar */}
            <div className="flex items-center justify-between border-b border-border/40 pb-4">
                <div className="flex items-center gap-3">
                    <SidebarTrigger className="cursor-pointer" />
                    <div className="flex items-center gap-2">
                        <span className="size-2 rounded-full bg-primary" />
                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            Admin Console
                        </span>
                    </div>
                </div>
                <Badge variant="outline" className="rounded-full text-xs font-mono px-2.5 py-0.5">
                    User Management
                </Badge>
            </div>

            {/* Hero Header */}
            <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-br from-card/80 via-card/40 to-muted/20 p-6 shadow-xs">
                <div className="flex items-center gap-4">
                    <div className="size-12 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center shrink-0">
                        <ShieldUser className="size-6" />
                    </div>
                    <div className="flex flex-col gap-1">
                        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                            User Management
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Inspect user accounts, manage active sessions, impersonate for support, or provision new users.
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Tabs */}
            <Tabs defaultValue="users" className="flex flex-col gap-5">
                <TabsList className="h-auto w-full sm:w-fit p-1 rounded-xl bg-muted/50 border border-border/40 grid grid-cols-3 sm:inline-flex">
                    {CONTENT_SECTIONS.map((section) => {
                        const Icon = section.icon;
                        return (
                            <TabsTrigger
                                key={section.value}
                                value={section.value}
                                className="rounded-lg px-4 py-2 text-xs sm:text-sm font-medium gap-2 cursor-pointer"
                            >
                                <Icon className="size-4 shrink-0" />
                                <span className="truncate">{section.label}</span>
                            </TabsTrigger>
                        );
                    })}
                </TabsList>

                <TabsContent value="users" className="mt-0">
                    <HandleListUsers />
                </TabsContent>
                <TabsContent value="user-sessions" className="mt-0">
                    <HandleUserSessions />
                </TabsContent>
                <TabsContent value="create-user" className="mt-0">
                    <AdminCreateUser />
                </TabsContent>
            </Tabs>
        </div>
    );
}
