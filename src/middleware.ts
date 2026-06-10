import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

// Make all routes public for development
const isPublicRoute = createRouteMatcher(['(.*)'])

export default clerkMiddleware(async (auth, request) => {
    // Bypass authentication - all routes are public
    // if (!isPublicRoute(request)) {
    //   await auth.protect()
    // }
})

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
}
