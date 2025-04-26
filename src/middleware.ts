import { auth } from '@/auth';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const session = await auth();

  const publicRoutes = ['/login', '/signup', '/api/auth'];
  const isPublic = publicRoutes.some((path) => req.nextUrl.pathname.startsWith(path));

  // ⛔ If not logged in and trying to access a protected route → redirect to login
  if (!session && !isPublic) {
    const loginUrl = new URL('/login', req.url);
    return NextResponse.redirect(loginUrl);
  }

  // ✅ If already logged in and tries to visit login/signup → redirect to home
  if (session && isPublic) {
    const homeUrl = new URL('/', req.url);
    return NextResponse.redirect(homeUrl);
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

// export { auth as middleware } from '@/auth';
