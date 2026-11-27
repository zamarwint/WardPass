"use client";

import { useGetSession } from "@/lib/queries/SessionQueries";
import { Activity, ShieldAlert, ShieldCheck, TriangleAlert, UserCheck, Users } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, LabelList } from "recharts";
import { useDBListUserSessions, useListUsers } from "@/lib/queries/AdminQueries";
import { useTheme } from "next-themes";
import { CustomLoadingState } from "@/components/LoadingStates";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { useMemo } from "react";

const AdminSessionsChart = () => {
    const { resolvedTheme } = useTheme();
    const { data: allSessionsData } = useDBListUserSessions();
    const { data: allUsersData } = useListUsers({});

    const userNameMap = useMemo(() => {
        const map: Record<string, string> = {};
        for (const user of allUsersData?.users ?? []) {
            map[user.id] = user.name;
        }
        return map;
    }, [allUsersData]);

    const sessionChartData = useMemo(() => {
        const now = new Date();
        const activeSessions = (allSessionsData ?? []).filter(
            (s) => new Date(s.expiresAt) > now
        );

        const grouped = activeSessions.reduce((acc, session) => {
            const name = userNameMap[session.userId] ?? "Unknown User";
            acc[name] = (acc[name] ?? 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        return Object.entries(grouped)
            .map(([userName, activeSessions]) => ({ userName, activeSessions }))
            .sort((a, b) => b.activeSessions - a.activeSessions);
    }, [allSessionsData, userNameMap]);

    const totalActiveSessions = sessionChartData.reduce((sum, d) => sum + d.activeSessions, 0);

    const sessionChartConfig = {
        activeSessions: {
            label: "Active Sessions",
            color: resolvedTheme === "dark" ? "#F7C873" : "#434343",
        },
    } satisfies ChartConfig;

    return (
        <div className="rounded-2xl border border-border/50 bg-card/50 p-5 sm:p-6 shadow-2xs flex flex-col gap-4">
            <div className="flex items-start justify-between gap-3">
                <div className="flex flex-col gap-1">
                    <h2 className="text-base font-bold text-foreground">Active Sessions</h2>
                    <p className="text-xs text-muted-foreground">
                        Active sessions per user (expired sessions excluded).
                    </p>
                </div>
                <Badge variant="outline" className="font-mono text-xs rounded-full px-2.5 py-0.5 shrink-0">
                    {totalActiveSessions} active · {sessionChartData.length} user{sessionChartData.length !== 1 ? "s" : ""}
                </Badge>
            </div>

            {sessionChartData.length > 0 ? (
                <ChartContainer config={sessionChartConfig} className="h-64 w-full">
                    <BarChart accessibilityLayer data={sessionChartData} layout="horizontal">
                        <CartesianGrid vertical={false} strokeDasharray="3 3" />
                        <XAxis
                            dataKey="userName"
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) =>
                                value.length > 12 ? value.slice(0, 12) + "…" : value
                            }
                        />
                        <YAxis allowDecimals={false} tickLine={false} axisLine={false} width={30} />
                        <Bar dataKey="activeSessions" fill={sessionChartConfig.activeSessions.color} radius={[6, 6, 0, 0]}>
                            <LabelList dataKey="activeSessions" position="top" className="fill-foreground text-xs" />
                        </Bar>
                        <ChartTooltip
                            content={<ChartTooltipContent labelKey="userName" nameKey="activeSessions" />}
                        />
                    </BarChart>
                </ChartContainer>
            ) : (
                <div className="h-48 flex items-center justify-center rounded-xl border border-dashed border-border/60 text-sm text-muted-foreground">
                    No active sessions found.
                </div>
            )}
        </div>
    );
};

const AdminUsersChart = () => {
    const { resolvedTheme } = useTheme();
    const { data: allUsersData } = useListUsers({});

    const userChartData = useMemo(() => {
        const users = allUsersData?.users ?? [];
        const monthMap: Record<string, { month: string; activeUsers: number; bannedUsers: number }> = {};

        for (const user of users) {
            const date = new Date(user.createdAt);
            const monthKey = date.toLocaleDateString("en-US", { year: "numeric", month: "short" });

            if (!monthMap[monthKey]) {
                monthMap[monthKey] = { month: monthKey, activeUsers: 0, bannedUsers: 0 };
            }

            if (user.banned) {
                monthMap[monthKey].bannedUsers += 1;
            } else {
                monthMap[monthKey].activeUsers += 1;
            }
        }

        return Object.values(monthMap).sort(
            (a, b) => new Date(a.month).getTime() - new Date(b.month).getTime()
        );
    }, [allUsersData]);

    const totalUsers = allUsersData?.users?.length ?? 0;
    const activeUsers = allUsersData?.users?.filter((u) => !u.banned).length ?? 0;
    const bannedUsers = totalUsers - activeUsers;

    const userChartConfig = {
        activeUsers: { label: "Active Users", color: resolvedTheme === "dark" ? "#4ade80" : "#16a34a" },
        bannedUsers: { label: "Banned Users", color: resolvedTheme === "dark" ? "#f87171" : "#dc2626" },
    } satisfies ChartConfig;

    return (
        <div className="rounded-2xl border border-border/50 bg-card/50 p-5 sm:p-6 shadow-2xs flex flex-col gap-4">
            <div className="flex items-start justify-between gap-3">
                <div className="flex flex-col gap-1">
                    <h2 className="text-base font-bold text-foreground">User Registrations</h2>
                    <p className="text-xs text-muted-foreground">
                        Monthly sign-ups split by active vs banned accounts.
                    </p>
                </div>
                <Badge variant="outline" className="font-mono text-xs rounded-full px-2.5 py-0.5 shrink-0">
                    {activeUsers} active{bannedUsers > 0 ? ` · ${bannedUsers} banned` : ""}
                </Badge>
            </div>

            {userChartData.length > 0 ? (
                <ChartContainer config={userChartConfig} className="h-64 w-full">
                    <BarChart accessibilityLayer data={userChartData}>
                        <CartesianGrid vertical={false} strokeDasharray="3 3" />
                        <XAxis dataKey="month" tickLine={false} axisLine={false} />
                        <YAxis allowDecimals={false} tickLine={false} axisLine={false} width={30} />
                        <Bar dataKey="activeUsers" fill={userChartConfig.activeUsers.color} stackId="users" radius={[0, 0, 0, 0]}>
                            <LabelList dataKey="activeUsers" position="center" className="fill-white text-xs font-medium" />
                        </Bar>
                        <Bar dataKey="bannedUsers" fill={userChartConfig.bannedUsers.color} stackId="users" radius={[6, 6, 0, 0]}>
                            <LabelList
                                dataKey="bannedUsers"
                                position="center"
                                className="fill-white text-xs font-medium"
                                formatter={(value: any) => (Number(value) > 0 ? value : "")}
                            />
                        </Bar>
                        <ChartTooltip content={<ChartTooltipContent />} />
                    </BarChart>
                </ChartContainer>
            ) : (
                <div className="h-48 flex items-center justify-center rounded-xl border border-dashed border-border/60 text-sm text-muted-foreground">
                    No users found.
                </div>
            )}
        </div>
    );
};

const AdminAnalyticsPanel = ({ userSessionData }: { userSessionData: any }) => {
    const { data: allSessionsData } = useDBListUserSessions();
    const { data: allUsersData } = useListUsers({});

    const totalUsers = allUsersData?.users?.length ?? 0;
    const bannedUsers = allUsersData?.users?.filter((u) => u.banned).length ?? 0;
    const activeUsers = totalUsers - bannedUsers;
    const activeSessions = useMemo(() => {
        const now = new Date();
        return (allSessionsData ?? []).filter((s) => new Date(s.expiresAt) > now).length;
    }, [allSessionsData]);

    const statCards = [
        {
            label: "Total Users",
            value: totalUsers,
            icon: Users,
            accent: "bg-primary/10 text-primary border-primary/20",
        },
        {
            label: "Active Users",
            value: activeUsers,
            icon: UserCheck,
            accent: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
        },
        {
            label: "Active Sessions",
            value: activeSessions,
            icon: Activity,
            accent: "bg-blue-500/10 text-blue-500 border-blue-500/20",
        },
        {
            label: "Banned Users",
            value: bannedUsers,
            icon: ShieldAlert,
            accent: "bg-destructive/10 text-destructive border-destructive/20",
        },
    ];

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
                    Analytics
                </Badge>
            </div>

            {/* Hero Header */}
            <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-br from-card/80 via-card/40 to-muted/20 p-6 sm:p-7 shadow-xs">
                <div className="flex items-center gap-4">
                    <div className="size-12 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center shrink-0">
                        <ShieldCheck className="size-6" />
                    </div>
                    <div className="flex flex-col gap-1">
                        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                            Welcome, {userSessionData?.name || "Admin"}
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Monitor active user sessions, registrations, and system health across WardPass.
                        </p>
                    </div>
                </div>
            </div>

            {/* Stat Summary Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <div
                            key={stat.label}
                            className="rounded-2xl border border-border/50 bg-card/50 p-4 sm:p-5 shadow-2xs flex items-center justify-between gap-3"
                        >
                            <div className="flex flex-col gap-0.5">
                                <span className="text-xs font-medium text-muted-foreground">{stat.label}</span>
                                <span className="text-2xl font-extrabold tracking-tight text-foreground font-mono">
                                    {stat.value}
                                </span>
                            </div>
                            <div className={`size-10 rounded-xl border flex items-center justify-center shrink-0 ${stat.accent}`}>
                                <Icon className="size-5" />
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <AdminSessionsChart />
                <AdminUsersChart />
            </div>
        </div>
    );
};

export default function AdminPage() {
    const { isPending, data, error } = useGetSession();

    if (isPending) {
        return (
            <CustomLoadingState loaderChoice={2} className="size-full flex items-center justify-center gap-2">
                <span className="shimmer shimmer-duration-1000">Loading...</span>
            </CustomLoadingState>
        );
    }

    if (error) {
        return (
            <div className="max-w-4xl mx-auto p-8">
                <div className="rounded-2xl border border-destructive/40 bg-destructive/5 p-6 flex items-center gap-3 text-destructive">
                    <TriangleAlert className="size-5 shrink-0" />
                    <span className="text-sm font-medium">Error: {error.message}</span>
                </div>
            </div>
        );
    }

    return <AdminAnalyticsPanel userSessionData={data?.user} />;
}
