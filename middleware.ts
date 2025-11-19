import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import createMiddleware from 'next-intl/middleware';

// Admin routes that require admin role
const isAdminRoute = createRouteMatcher(["/admin(.*)"]);

// Prefer ADMIN_USER_IDS from environment in production so lists can differ per deploy.
// Format: ADMIN_USER_IDS="user_xxx,user_yyy"
const ADMIN_USER_IDS_FROM_ENV = process.env.ADMIN_USER_IDS;
const ADMIN_USER_IDS = ADMIN_USER_IDS_FROM_ENV
  ? ADMIN_USER_IDS_FROM_ENV.split(",").map((s) => s.trim()).filter(Boolean)
  : [
      "user_35f7uaMn9wVbfVvKMs0f5qlkggG", // david prod
      "user_34Qbtnh4X9AysmuJ9ExoxjZOESw", // david dev
      "user_35fCFwodslsEUu3aVJEZUVYkXfz", // contact zetta
      "user_35fBxExtXbbKRitefXI7P5CXSM0", // ancuta
      "user_35fIfKmiVCvPYC74Z2rzcQim6y6", // gmail david
    ];

// Create the internationalization middleware
const intlMiddleware = createMiddleware({
  locales: ['ro', 'en'],
  defaultLocale: 'ro',
  localePrefix: 'always' // Both /ro and /en will have explicit prefixes
});

export default clerkMiddleware(async (auth, req) => {
  const pathname = req.nextUrl.pathname;
  
  // Skip internationalization for admin routes, API routes, and static files
  if (isAdminRoute(req) || 
      pathname.startsWith('/api/') || 
      pathname.startsWith('/_next/') ||
      pathname.includes('.')) {
    
    // Handle admin routes
    if (isAdminRoute(req)) {
      // Add temporary debug logging to help diagnose why admin users are rejected
      // auth may provide details about the current session/user
      let authResult: any = {};
      try {
        authResult = await auth();
      } catch (e) {
        // In edge runtime, logging is visible in terminal/edge logs
        console.error('middleware: error calling auth()', e);
      }

      const userId = authResult?.userId;
      // Log the info we care about for debugging (do not leave sensitive logs in production)
      try {
        const cookieHeader = req.headers.get('cookie');
        console.log('middleware: admin route request', { pathname: req.nextUrl.pathname, userId, cookieHeader });
      } catch (e) {
        console.log('middleware: admin route request (failed to read headers)', { pathname: req.nextUrl.pathname, userId });
      }

      // If no user is authenticated, redirect to home
      if (!userId) {
        console.warn('middleware: no userId found for admin route, redirecting to home');
        const homeUrl = new URL('/', req.url);
        return NextResponse.redirect(homeUrl);
      }

      // Log the currently configured admin list (helpful in production)
      try {
        console.log('middleware: ADMIN_USER_IDS', ADMIN_USER_IDS);
      } catch (e) {
        // ignore logging errors
      }

      // If user is authenticated but not an admin, redirect to home (log the mismatch)
      const isAdmin = ADMIN_USER_IDS.includes(userId);
      console.log('middleware: isAdminCheck', { userId, isAdmin });
      if (!isAdmin) {
        console.warn('middleware: authenticated user is not in ADMIN_USER_IDS', { userId });
        const homeUrl = new URL('/', req.url);
        return NextResponse.redirect(homeUrl);
      }
    }
    
    return NextResponse.next();
  }
  
  // Apply internationalization to other routes
  return intlMiddleware(req);
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
