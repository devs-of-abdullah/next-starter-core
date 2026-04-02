import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import * as jose from "jose";
import { checkRateLimit } from "./lib/middleware/rate-limit.middleware";

const intlMiddleware = createMiddleware(routing);

// API routes that need rate limiting — handled before intl middleware runs
const RATE_LIMITED_API_ROUTES: Record<string, "login" | "register" | "reset-password" | "forgot-password"> = {
  "/api/auth/login": "login",
  "/api/auth/register": "register",
  "/api/auth/forgot-password": "forgot-password",
};

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // 1. Rate limiting for auth API routes
  //    Must be checked first and return NextResponse.next() so intl middleware is skipped for API paths.
  const rateLimitAction = RATE_LIMITED_API_ROUTES[pathname];
  if (rateLimitAction) {
    const ip = request.headers.get("x-forwarded-for") ?? "127.0.0.1";
    const limit = await checkRateLimit(ip, rateLimitAction);
    if (!limit.success) {
      return new NextResponse(
        JSON.stringify({ error: "Too many requests. Please try again later." }),
        {
          status: 429,
          headers: {
            "Retry-After": limit.retryAfter?.toString() ?? "900",
            "Content-Type": "application/json",
          },
        },
      );
    }
    // Pass through to the route handler — do NOT run intl middleware on API routes
    return NextResponse.next();
  }

  // 2. Auth checks for page routes
  // Strip locale prefix to check routes correctly
  const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}(\/|$)/, "/");

  const isProtected =
    pathWithoutLocale.startsWith("/dashboard") ||
    pathWithoutLocale.startsWith("/admin") ||
    pathWithoutLocale.startsWith("/profile") ||
    pathWithoutLocale.startsWith("/settings");
  const isAdmin = pathWithoutLocale.startsWith("/admin");

  if (isProtected) {
    const token = request.cookies.get("accessToken")?.value;

    if (!token) {
      const url = request.nextUrl.clone();
      url.pathname = `/${routing.defaultLocale}/login`;
      return NextResponse.redirect(url);
    }

    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      const { payload } = await jose.jwtVerify(token, secret);

      if (isAdmin && payload.role !== "ADMIN") {
        const url = request.nextUrl.clone();
        url.pathname = `/${routing.defaultLocale}/dashboard`;
        return NextResponse.redirect(url);
      }
    } catch {
      // Invalid/expired token — redirect to login
      const url = request.nextUrl.clone();
      url.pathname = `/${routing.defaultLocale}/login`;
      return NextResponse.redirect(url);
    }
  }

  // 3. Internationalization for all page routes
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    // API routes that need rate limiting
    "/api/auth/login",
    "/api/auth/register",
    "/api/auth/forgot-password",
    // All page routes (explicitly excludes _next, _vercel, and static files)
    "/",
    "/(ar|en|tr)/:path*",
    "/((?!_next|_vercel|.*\\..*).*)",
  ],
};
