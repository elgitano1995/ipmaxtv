import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const url = request.nextUrl.clone();

    // Check if the hostname starts with 'www.'
    if (url.hostname.startsWith('www.')) {
        // Remove 'www.' from the hostname to enforce non-www (https://ipmaxtv.shop)
        const newHostname = url.hostname.replace(/^www\./, '');
        url.hostname = newHostname;

        // Perform a 301 permanent redirect to the non-www version
        return NextResponse.redirect(url, 301);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico, sitemap.xml, robots.txt (metadata files)
         */
        '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
    ],
};
