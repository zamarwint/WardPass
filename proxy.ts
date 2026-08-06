import { NextRequest, NextResponse } from "next/server";
import { betterFetch } from "@better-fetch/fetch"; // ✅ already installed with better-auth
import { BetterAuthSessionType } from "@/lib/types/BetterAuthSessionType";

const PROTECTED = ['/user', '/user/admin'];
const AUTH_PAGES = ['/sign-in', '/sign-up'];

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // betterFetch is just a thin wrapper around native fetch — safe in edge runtime.
    // It calls your /api/auth/get-session route handler, which runs in Node.js
    // and is where Prisma actually does the database lookup.
    const { data: session } = await betterFetch<BetterAuthSessionType>(
        "/api/auth/get-session",
        {
            baseURL: request.nextUrl.origin, // e.g. https://your-site.netlify.app
            headers: {
                // Forward the user's cookies so BetterAuth can find the session token
                cookie: request.headers.get("cookie") ?? "",
            },
        }
    );

    const isAdmin = session?.user.role.toLowerCase() === 'admin';

    // AUTH AND PROTECTED PAGES
    const isProtected = PROTECTED.some((r) => pathname.startsWith(r));
    const isAdminPage = PROTECTED[1].startsWith(pathname);
    const isAuthPage = AUTH_PAGES.some((r) => pathname.startsWith(r));

    // // Clone the headers object to avoid modifying the original
    // const requestHeaders = new Headers(request.headers);

    // // Set custom headers for pathname, search, and full URL
    // requestHeaders.set('x-pathname', request.nextUrl.pathname);

    // CHECKS IF THERE'S A SESSION OR NOT. IF NO SESSION, REDIRECT TO LOGIN OR SIGN UP, IF SESSION, REDIRECT TO USER VAULTS.
    // Unauthenticated user hitting a protected route → send to login
    if (isProtected && !session) {
        return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    // Authenticated user hitting login/signup → send to app
    if (isAuthPage && session) {
        return NextResponse.redirect(new URL("/user/vault", request.url));
    }

    if (isAdminPage && !isAdmin && session) {
        return NextResponse.redirect(new URL("/user/vault", request.url));
    }

    return NextResponse.next();
}

export const config = {
    // The regex pattern /((?!api|_next/static|_next/image|favicon.ico).*)/ is used in Next.js middleware configuration to exclude specific routes from processing.
    // It ensures that requests for API endpoints, static assets, images, and the favicon bypass the middleware logic, improving performance and preventing errors.
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"]
};