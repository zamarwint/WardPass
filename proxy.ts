import { NextRequest, NextResponse } from "next/server";
import { betterFetch } from "@better-fetch/fetch"; // already installed with better-auth
import { BetterAuthSessionType } from "@/lib/types/BetterAuthSessionType";

const APP_HOME = "/strongroom";
const ADMIN_PATH = "/admin";
const SETTINGS_PATH = "/settings";
const AUTH_PAGES = ["/sign-in", "/sign-up"];

// MATCHES THE PATH ITSELF OR ANYTHING UNDER IT: "/strongroom" AND "/strongroom/abc", BUT NOT "/strongroomfoo"
const isUnder = (pathname: string, base: string) =>
  pathname === base || pathname.startsWith(`${base}/`);

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = isUnder(pathname, APP_HOME); // includes the admin pages
  const isAdminPage = isUnder(pathname, ADMIN_PATH);
  const isSettingsPage = isUnder(pathname, SETTINGS_PATH);
  const isAuthPage = AUTH_PAGES.some((page) => isUnder(pathname, page));

  // NOT A PAGE WE GUARD: SKIP THE SESSION LOOKUP ENTIRELY
  if (!isProtected && !isAuthPage && !isSettingsPage)
    return NextResponse.next();

  // betterFetch is a thin wrapper around native fetch, so it is safe here.
  // It calls the /api/auth/get-session route handler, which runs in Node.js and does the database lookup.
  const { data: session } = await betterFetch<BetterAuthSessionType>(
    "/api/auth/get-session",
    {
      baseURL: request.nextUrl.origin,
      headers: {
        // Forward the user's cookies so Better Auth can find the session token
        cookie: request.headers.get("cookie") ?? "",
      },
    },
  );

  // Unauthenticated user hitting a protected route: send to sign in
  if (isProtected && !session) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (isSettingsPage && !session) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  // Authenticated user hitting sign in / sign up: send to the app
  if (isAuthPage && session) {
    return NextResponse.redirect(new URL(APP_HOME, request.url));
  }

  // Non-admin hitting an admin page: send to the app (role can be null on older accounts, so it is guarded)
  if (isAdminPage && session?.user.role?.toLowerCase() !== "admin") {
    return NextResponse.redirect(new URL(APP_HOME, request.url));
  }

  return NextResponse.next();
}

export const config = {
  // ONLY RUN ON THE PAGES THAT NEED A SESSION CHECK.
  // THE OLD "EVERYTHING EXCEPT /api AND _next" MATCHER ALSO RAN (AND CALLED get-session) FOR EVERY IMAGE, FONT AND ICON.
  matcher: [
    "/strongroom/:path*",
    "/settings/:path*",
    "/sign-in/:path*",
    "/sign-up/:path*",
  ],
};
