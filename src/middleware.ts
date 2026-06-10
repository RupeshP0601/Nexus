import { clerkMiddleware } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const clerkHandler = clerkMiddleware(async (auth, request) => {
    // Bypass authentication - all routes are public
});

export default async function middleware(request: NextRequest, event: any) {
    const pubKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
    const secKey = process.env.CLERK_SECRET_KEY;

    const hasValidKeys = pubKey && secKey && 
                         !pubKey.includes('dummy') && 
                         !pubKey.includes('your_clerk') && 
                         !secKey.includes('dummy') && 
                         !secKey.includes('your_clerk');

    if (!hasValidKeys) {
        return NextResponse.next();
    }

    try {
        return await clerkHandler(request, event);
    } catch (err) {
        console.error("Clerk middleware error, passing through:", err);
        return NextResponse.next();
    }
}

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
}
