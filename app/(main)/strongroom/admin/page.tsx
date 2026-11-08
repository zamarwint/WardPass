"use client";

import { motion } from "motion/react";
import { Field, FieldContent, FieldDescription, FieldGroup, FieldLabel, FieldSeparator } from "@/components/ui/field";
import { useGetSession } from "@/lib/queries/SessionQueries";
import { TriangleAlert } from "lucide-react";

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, LabelList } from "recharts";

import { type ChartConfig } from "@/components/ui/chart"
import { useDBListUserSessions, useListUsers } from "@/lib/queries/AdminQueries";
import { useTheme } from "next-themes";
import { CustomLoadingState } from "@/components/LoadingStates";
import { useMemo } from "react";

const AdminSessionsChart = () => {
    const { resolvedTheme } = useTheme();
    const { data: allSessionsData } = useDBListUserSessions();
    const { data: allUsersData } = useListUsers({});

    // Build a userId → name lookup from the users list
    const userNameMap = useMemo(() => {
        const map: Record<string, string> = {};
        for (const user of allUsersData?.users ?? []) {
            map[user.id] = user.name;
        }
        return map;
    }, [allUsersData]);

    // Filter to only active (non-expired) sessions, then group by user name
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
        activeSessions: { label: "Active Sessions", color: resolvedTheme === "dark" ? "#F7C873" : "#434343" },
    } satisfies ChartConfig;

    return (
        <div className="flex flex-col gap-2">
            <p className="text-sm text-muted-foreground">
                <span className="text-foreground font-semibold text-lg">{totalActiveSessions}</span> active session{totalActiveSessions !== 1 ? "s" : ""} across{" "}
                <span className="text-foreground font-semibold text-lg">{sessionChartData.length}</span> user{sessionChartData.length !== 1 ? "s" : ""}
            </p>
            {sessionChartData.length > 0 ? (
                <ChartContainer config={sessionChartConfig} className="h-full w-full">
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
                        <YAxis
                            allowDecimals={false}
                            tickLine={false}
                            axisLine={false}
                            width={30}
                        />
                        <Bar dataKey="activeSessions" fill={sessionChartConfig.activeSessions.color} radius={[4, 4, 0, 0]}>
                            <LabelList dataKey="activeSessions" position="top" className="fill-foreground text-xs" />
                        </Bar>
                        <ChartTooltip
                            content={
                                <ChartTooltipContent
                                    labelKey="userName"
                                    nameKey="activeSessions"
                                />
                            }
                        />
                    </BarChart>
                </ChartContainer>
            ) : (
                <p className="text-sm text-muted-foreground italic">No active sessions found.</p>
            )}
        </div>
    );
};

const AdminUsersChart = () => {
    const { resolvedTheme } = useTheme();
    const { data: allUsersData } = useListUsers({});

    // Separate active vs banned users, then show a per-user status bar chart
    const userChartData = useMemo(() => {
        const users = allUsersData?.users ?? [];

        // Group users by their creation month for a sign-up trend view
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

        // Sort chronologically
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
        <div className="flex flex-col gap-2">
            <p className="text-sm text-muted-foreground">
                <span className="text-foreground font-semibold text-lg">{activeUsers}</span> active user{activeUsers !== 1 ? "s" : ""}
                {bannedUsers > 0 && (
                    <> · <span className="text-destructive font-semibold text-lg">{bannedUsers}</span> banned</>
                )}
                {" "}· <span className="text-foreground font-semibold text-lg">{totalUsers}</span> total
            </p>
            {userChartData.length > 0 ? (
                <ChartContainer config={userChartConfig} className="h-full w-full">
                    <BarChart accessibilityLayer data={userChartData}>
                        <CartesianGrid vertical={false} strokeDasharray="3 3" />
                        <XAxis
                            dataKey="month"
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            allowDecimals={false}
                            tickLine={false}
                            axisLine={false}
                            width={30}
                        />
                        <Bar dataKey="activeUsers" fill={userChartConfig.activeUsers.color} stackId="users" radius={[0, 0, 0, 0]}>
                            <LabelList dataKey="activeUsers" position="center" className="fill-white text-xs font-medium" />
                        </Bar>
                        <Bar dataKey="bannedUsers" fill={userChartConfig.bannedUsers.color} stackId="users" radius={[4, 4, 0, 0]}>
                            <LabelList
                                dataKey="bannedUsers"
                                position="center"
                                className="fill-white text-xs font-medium"
                                formatter={(value: number) => (value > 0 ? value : "")}
                            />
                        </Bar>
                        <ChartTooltip content={<ChartTooltipContent />} />
                    </BarChart>
                </ChartContainer>
            ) : (
                <p className="text-sm text-muted-foreground italic">No users found.</p>
            )}
        </div>
    );
};

const AdminAnalyticsPanel = ({ userSessionData }: { userSessionData: any }) => {
    return (
        <Field className="flex flex-col gap-10">
            <FieldContent>
                <FieldGroup>
                    <Field>
                        <FieldLabel className="text-xl">Welcome {userSessionData?.name}!</FieldLabel>
                        <FieldDescription>Here is your admin panel. If you need help, please contact support.</FieldDescription>
                    </Field>
                </FieldGroup>
                <FieldGroup className="py-2 space-y-2">
                    <FieldSeparator />
                    <Field>
                        <FieldLabel>Active Sessions</FieldLabel>
                        <FieldDescription>Active sessions per user (expired sessions are excluded).</FieldDescription>
                        <FieldContent className="my-[2vh] min-h-52 w-full">
                            <AdminSessionsChart />
                        </FieldContent>

                    </Field>
                    <Field>
                        <FieldLabel>User Registrations</FieldLabel>
                        <FieldDescription>Users registered per month (active vs banned).</FieldDescription>
                        <FieldContent className="my-[2vh] min-h-52 w-full">
                            <AdminUsersChart />
                        </FieldContent>
                    </Field>
                </FieldGroup>
            </FieldContent>
        </Field>
    )
}

export default function GeneralAdminPage() {
    const { isPending, data, error } = useGetSession();

    return (
        <motion.div className="flex flex-col gap-10 items-start justify-start pt-5 px-10">
            {isPending ? (
                <CustomLoadingState loaderChoice={2} className="size-full flex items-center justify-center gap-2">
                    <span className="shimmer shimmer-duration-1000"> Loading... </span>
                </CustomLoadingState>
            ) : error ? (
                <div className="flex items-center gap-2">
                    <TriangleAlert className="text-destructive" />
                    <span className="text-destructive">Error: {error.message}</span>
                </div>
            ) : (
                <AdminAnalyticsPanel userSessionData={data?.user} />
            )}
        </motion.div>
    )
}
