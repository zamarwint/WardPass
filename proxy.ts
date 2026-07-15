import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/utils/auth";

export async function proxy(request: NextRequest) {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    const { pathname } = request.nextUrl;

    // Clone the headers object to avoid modifying the original
    const requestHeaders = new Headers(request.headers);

    // Set custom headers for pathname, search, and full URL
    requestHeaders.set('x-pathname', request.nextUrl.pathname);

    // THE AUTH PAGES
    const isAuthPage = pathname === '/sign-in' || pathname === '/sign-up';

    // CHECKS IF THERE'S A SESSION OR NOT. IF NO SESSION, REDIRECT TO LOGIN OR SIGN UP, IF SESSION, REDIRECT TO USER VAULTS.
    if (isAuthPage && session) {
        return NextResponse.redirect(new URL('/user/vault', request.url));
    }

    if (!session && !isAuthPage) {
        return NextResponse.redirect(new URL('/sign-in', request.url));
    }

    return NextResponse.next({
        request: {
            headers: requestHeaders,
        },
    });
}

export const config = {
    matcher: ['/sign-in', '/sign-up', '/user/:path*'], // Specify the routes the middleware applies to
};