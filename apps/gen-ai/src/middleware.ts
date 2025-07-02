import { NextRequest, NextResponse } from 'next/server';
import { decrypt } from '@/app/lib/session';

const protectedRoutes = ['/chat'];
const publicRoutes = ['/login'];
const isRootPath = (path: string) => path === '/';

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);

  // Use req.cookies to access cookies in middleware
  const cookie = req.cookies.get('session')?.value;
  const session = await decrypt(cookie);

  // Handle root path
  if (isRootPath(path)) {
    if (session?.userId) {
      return NextResponse.redirect(new URL('/chat', req.nextUrl));
    } else {
      return NextResponse.redirect(new URL('/login', req.nextUrl));
    }
  }

  if (isProtectedRoute && !session?.userId) {
    return NextResponse.redirect(new URL('/login', req.nextUrl));
  }

  if (isPublicRoute && session?.userId) {
    return NextResponse.redirect(new URL('/chat', req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
