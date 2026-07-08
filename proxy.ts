import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/utils/auth";

export async function proxy(request: NextRequest) {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    const { pathname } = request.nextUrl;

    // THE AUTH PAGES
    const isAuthPage = pathname === '/sign-in' || pathname === '/sign-up' || pathname === '/verify-email'

    // CHECKS IF THERE'S A SESSION OR NOT. IF NO SESSION, REDIRECT TO LOGIN OR SIGN UP, IF SESSION, REDIRECT TO DASHBOARD.
    if (isAuthPage && session) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    if (!session && !isAuthPage) {
        return NextResponse.redirect(new URL('/sign-in', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/sign-in', '/sign-up', '/verify-email', '/dashboard', '/dashboard/logins', '/dashboard/notes', '/dashboard/cards', '/dashboard/ids', '/dashboard/settings'], // Specify the routes the middleware applies to
};