import { Field, FieldContent, FieldDescription, FieldLegend, FieldSet } from "@/components/ui/field";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useDBListUserImpersonations } from "@/lib/queries/AdminQueries";

export function UserImpersonation() {
    const dbImpersonationList = useDBListUserImpersonations();

    return (
        <FieldSet>
            <Field>
                <FieldLegend>User Impersonation</FieldLegend>
                <FieldDescription>Impersonate users to help them with their issues.</FieldDescription>
                <FieldDescription>Here is a list of current impersonated sessions.</FieldDescription>
                <FieldContent className="mt-2">
                    <Table className="border border-border rounded-xl p-10">
                        <TableCaption>Impersonated Sessions</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Admin Name</TableHead>
                                <TableHead>User ID</TableHead>
                                <TableHead>Impersonation Start Time</TableHead>
                                <TableHead>Impersonation End Time</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {!dbImpersonationList.data?.length ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center">
                                        No impersonated sessions found.
                                    </TableCell>
                                </TableRow>
                            ) : dbImpersonationList.data?.map((session) => (
                                <TableRow key={session.id}>
                                    <TableCell>{session.impersonatedBy}</TableCell>
                                    <TableCell>{session.id}</TableCell>
                                    <TableCell>{session.createdAt.toISOString()}</TableCell>
                                    <TableCell>{session.expiresAt.toISOString()}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </FieldContent>
            </Field>
        </FieldSet>
    )
}