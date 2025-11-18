import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import createMiddleware from 'next-intl/middleware';

// Admin routes that require admin role
// We need to support locale-prefixed paths (e.g. /ro/admin, /en/admin).
const LOCALES = ['ro', 'en'];
const isAdminPath = (pathname: string) => {
  if (!pathname || typeof pathname !== 'string') return false;
  // Match /admin or /<locale>/admin and their subpaths
  // Examples matched: /admin, /admin/, /admin/foo, /ro/admin, /ro/admin/foo
  const re = new RegExp(`^\\/(?:${LOCALES.join('|')}\\/)?admin(?:$|\\/|\\?.*)`);
  return re.test(pathname);
};

const ADMIN_USER_IDS = [
  //"user_35f7uaMn9wVbfVvKMs0f5qlkggG", // david prod
  "user_34Qbtnh4X9AysmuJ9ExoxjZOESw", // david dev
  "user_35fCFwodslsEUu3aVJEZUVYkXfz", // contact zetta 
  "user_35fBxExtXbbKRitefXI7P5CXSM0", // ancuta 
  "user_35fIfKmiVCvPYC74Z2rzcQim6y6" //gmail david
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
  if (isAdminPath(pathname) || 
    pathname.startsWith('/api/') || 
    pathname.startsWith('/_next/') ||
    pathname.includes('.')) {
    
    // Handle admin routes
  if (isAdminPath(pathname)) {
      const { userId } = await auth();
      
      // If no user is authenticated, redirect to sign-in
      if (!userId) {
        const homeUrl = new URL("/", req.url);
        return NextResponse.redirect(homeUrl);
      }
      
      // If user is authenticated but not an admin, redirect to home
      if (!ADMIN_USER_IDS.includes(userId)) {
        const homeUrl = new URL("/", req.url);
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
