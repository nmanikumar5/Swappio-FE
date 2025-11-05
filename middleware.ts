import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Paths that require authentication
const PROTECTED_PATHS = [
    '/',
    '/listing',
    '/post-ad',
    '/dashboard',
    '/favorites',
    '/chat',
];

function requiresAuth(path: string) {
    // exact match or path startsWith for dynamic routes
    return PROTECTED_PATHS.some((p) => path === p || path.startsWith(p + '/'));
}

export function middleware(req: NextRequest) {
    const url = req.nextUrl.clone();
    const { pathname } = req.nextUrl;

    // Allow API, static, and auth pages
    if (pathname.startsWith('/_next') || pathname.startsWith('/api') || pathname.startsWith('/auth')) {
        return NextResponse.next();
    }

    if (!requiresAuth(pathname)) return NextResponse.next();

    const token = req.cookies.get('swappio_token')?.value;
    if (!token) {
        url.pathname = '/auth/signin';
        url.searchParams.set('next', pathname);
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/', '/listing/:path*', '/post-ad/:path*', '/dashboard/:path*', '/favorites/:path*', '/chat/:path*'],
};
