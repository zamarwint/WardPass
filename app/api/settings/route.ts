// src/app/api/settings/route.ts

import { NextResponse } from "next/server";
import getSettings from "@/app/actions/settings/getSettings";
import { getUserSession } from "@/app/actions/getSession";

export async function GET() {
    try {
        const session = await getUserSession();

        if (!session) {
            throw new Error("No session found");
        }

        const settings = await getSettings();

        return NextResponse.json(settings);
    } catch (error) {
        return NextResponse.json({ error: error }, { status: 500 });
    }
}