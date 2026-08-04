// app/api/admin/checkAdmin/route.ts
import { auth } from "@/utils/auth"
import { headers } from "next/headers"
import { NextResponse } from "next/server"

export async function GET() {
    // Retrieve session using request headers
    const session = await auth.api.getSession({
        headers: await headers(),
    })

    // Check if user is authenticated
    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user has the ADMIN role
    if (session.user.role !== "ADMIN") {
        return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 })
    }

    // Admin-only logic here
    return NextResponse.json({ message: "Secret admin data", user: session.user })
}   