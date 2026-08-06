"use client";

import { motion } from "motion/react";
import { Field, FieldContent, FieldDescription, FieldGroup, FieldLabel, FieldSeparator } from "@/components/ui/field";
import { useGetSession } from "@/lib/queries/SessionQueries";
import { LoaderIcon, TriangleAlert } from "lucide-react";
import { userData } from "@/lib/types/BetterAuthSessionType";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const AdminSessionsChart = () => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Sessions Chart</CardTitle>
                <CardDescription>Here is the sessions chart.</CardDescription>
            </CardHeader>
            <CardContent>
                <p>Sessions Chart Content</p>
            </CardContent>
            <CardFooter>
                <p>Sessions Chart Footer</p>
            </CardFooter>
        </Card>
    )
}

const AdminUsersChart = () => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Users Chart</CardTitle>
                <CardDescription>Here is the users chart.</CardDescription>
            </CardHeader>
            <CardContent>
                <p>Users Chart Content</p>
            </CardContent>
            <CardFooter>
                <p>Users Chart Footer</p>
            </CardFooter>
        </Card>

    )
}

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
                        <FieldDescription>Here is the sessions chart.</FieldDescription>
                        <FieldContent className="my-[2vh]"><AdminSessionsChart /></FieldContent>
                    </Field>
                    <Field>
                        <FieldLabel>Users Chart</FieldLabel>
                        <FieldDescription>Here is the users chart.</FieldDescription>
                        <FieldContent className="my-[2vh]"><AdminUsersChart /></FieldContent>
                    </Field>
                </FieldGroup>
            </FieldContent>
        </Field>
    )
}

export default function GeneralSettingsPage() {
    const { isPending, data, error } = useGetSession();

    return (
        <motion.div className="flex flex-col gap-10 items-start justify-start py-60 px-10">
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