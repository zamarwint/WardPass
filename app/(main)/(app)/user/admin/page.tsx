"use client";

import { motion } from "motion/react";
import { Field, FieldContent, FieldDescription, FieldGroup, FieldLabel, FieldSeparator } from "@/components/ui/field";
import { useGetSession } from "@/lib/queries/SessionQueries";
import { LoaderIcon, TriangleAlert } from "lucide-react";

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, XAxis } from "recharts";

import { type ChartConfig } from "@/components/ui/chart"
import { useDBListUserSessions, useListUsers } from "@/lib/queries/AdminQueries";
import { useTheme } from "next-themes";

const AdminSessionsChart = () => {
    const { resolvedTheme } = useTheme();
    const { data: allSessionsData } = useDBListUserSessions();

    const sessionChartData = Object.entries(
        (allSessionsData ?? []).reduce((acc, session) => {
            const key = session.ipAddress ?? "Unknown";
            acc[key] = (acc[key] ?? 0) + 1;
            return acc;
        }, {} as Record<string, number>)
    ).map(([ipAddress, count]) => ({ ipAddress, count }));

    const sessionChartConfig = {
        count: { label: "Sessions", color: resolvedTheme === "dark" ? "#ffff00" : "#8c8c00" },
    } satisfies ChartConfig;

    return (
        <ChartContainer config={sessionChartConfig} className="h-full w-full">
            <BarChart accessibilityLayer data={sessionChartData}>
                <XAxis dataKey="ipAddress" />
                <Bar dataKey="count" fill={sessionChartConfig.count.color} />
                <ChartTooltip content={<ChartTooltipContent />} />
            </BarChart>
        </ChartContainer>
    );
};

const AdminUsersChart = () => {
    const { resolvedTheme } = useTheme();
    const { data: allUsersData } = useListUsers({ limit: 10 });

    const userChartData = Object.entries(
        (allUsersData?.users ?? []).reduce((acc, user) => {
            const day = new Date(user.createdAt).toLocaleDateString();
            acc[day] = (acc[day] ?? 0) + 1;
            return acc;
        }, {} as Record<string, number>)
    ).map(([date, count]) => ({ date, count }));

    const userChartConfig = {
        count: { label: "Users", color: resolvedTheme === 'dark' ? "#ffff00" : "#8c8c00" },
    } satisfies ChartConfig;

    return (
        <ChartContainer config={userChartConfig} className="h-full w-full">
            <BarChart accessibilityLayer data={userChartData}>
                <XAxis dataKey="date" />
                <Bar dataKey="count" fill={userChartConfig.count.color} />
                <ChartTooltip content={<ChartTooltipContent />} />
            </BarChart>
        </ChartContainer>
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
                        <FieldLabel>Sessions Chart</FieldLabel>
                        <FieldDescription>All active sessions.</FieldDescription>
                        <FieldContent className="my-[2vh] h-22 w-full">   {/* ← h-52 not min-h-50 */}
                            <AdminSessionsChart />
                        </FieldContent>

                    </Field>
                    <Field>
                        <FieldLabel>Users Chart</FieldLabel>
                        <FieldDescription>All active users.</FieldDescription>
                        <FieldContent className="my-[2vh] h-22 w-full">
                            <AdminUsersChart />
                        </FieldContent>
                    </Field>
                </FieldGroup>
            </FieldContent>
        </Field>
    )
}

export default function GeneralSettingsPage() {
    const { isPending, data, error } = useGetSession();

    return (
        <motion.div className="flex flex-col gap-10 items-start justify-start pt-60 px-10">
            {isPending ? (
                <div className="flex items-center gap-2">
                    <LoaderIcon className="animate-spin" />
                    <span>Loading...</span>
                </div>
            ) : error ? (
                <div className="flex items-center gap-2">
                    <TriangleAlert className="text-red-500" />
                    <span className="text-red-500">Error: {error.message}</span>
                </div>
            ) : (
                <AdminAnalyticsPanel userSessionData={data?.user} />
            )}
        </motion.div>
    )
}