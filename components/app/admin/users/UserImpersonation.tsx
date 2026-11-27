"use client";

import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useDBListUserImpersonations } from "@/lib/queries/AdminQueries";

const formatTimestamp = (value: Date | string) => new Date(value).toLocaleString();

export function UserImpersonation() {
    const dbImpersonationList = useDBListUserImpersonations();

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-0.5">
                <h3 className="text-base font-semibold text-foreground">Impersonated Sessions</h3>
                <p className="text-xs text-muted-foreground">
                    Audit log of active and historical admin impersonation sessions.
                </p>
            </div>

            <div className="rounded-xl border border-border/60 overflow-hidden bg-background/60">
                <Table>
                    <TableCaption className="pb-3">Impersonated Sessions</TableCaption>
                    <TableHeader className="bg-muted/40">
                        <TableRow>
                            <TableHead>Admin ID / Name</TableHead>
                            <TableHead>Session ID</TableHead>
                            <TableHead>Start Time</TableHead>
                            <TableHead>End Time</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {!dbImpersonationList.data?.length ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground text-sm">
                                    No impersonated sessions found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            dbImpersonationList.data.map((session) => (
                                <TableRow key={session.id}>
                                    <TableCell className="font-medium">{session.impersonatedBy}</TableCell>
                                    <TableCell className="font-mono text-xs text-muted-foreground">{session.id}</TableCell>
                                    <TableCell className="text-xs">{formatTimestamp(session.createdAt)}</TableCell>
                                    <TableCell className="text-xs">{formatTimestamp(session.expiresAt)}</TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
