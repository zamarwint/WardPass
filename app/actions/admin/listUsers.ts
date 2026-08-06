'use server'

import { auth } from "@/utils/auth"
import { headers } from "next/headers";

export async function listUsers({
    searchValue,
    limit,
    offset,
    sortBy,
    filterField,
    filterValue,
}: {
    searchValue?: string,
    limit?: number,
    offset?: number,
    sortBy?: string,
    filterField?: string,
    filterValue?: string,
}) {
    const users = await auth.api.listUsers({
        query: {
            searchValue: searchValue || "",
            searchField: 'name',
            searchOperator: "contains",
            limit: limit || 10,
            offset: offset || 0,
            sortBy: sortBy || "name",
            sortDirection: "desc",
            filterField: filterField || "email",
            filterValue: filterValue || "hello@example.com",
            filterOperator: "eq",
        },
        // This endpoint requires session cookies.
        headers: await headers(),
    });

    return users;
}