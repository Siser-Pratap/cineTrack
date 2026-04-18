import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const authCookie = request.cookies.get('auth-token');
  const url = request.nextUrl.clone();
  const isAuthenticated = authCookie?.value === 'authenticated';
  
  // Protect dashboard routes
  if (url.pathname.startsWith('/dashboard')) {
    if (!isAuthenticated) {
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }
  }
  
  // Redirect away from login if already authenticated
  if (url.pathname === '/login') {
    if (isAuthenticated) {
      url.pathname = '/dashboard';
      return NextResponse.redirect(url);
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/login'],
};