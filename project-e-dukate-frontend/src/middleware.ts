import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  'http://schemas.microsoft.com/ws/2008/06/identity/claims/role': string;
}

export function middleware(request: NextRequest) {
  const token = request.cookies.get('authToken')?.value;
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/pago') || pathname === '/login') {
    return NextResponse.next();
  }

  if (!token && pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  if (token && pathname === '/login') {
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      const userRole = decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
      
      if (userRole === 'Specialist') {
        return NextResponse.redirect(new URL('/dashboard/pacientes', request.url));
      } else {
        return NextResponse.redirect(new URL('/dashboard/especialidades', request.url));
      }
    } catch {
      return NextResponse.redirect(new URL('/dashboard/especialidades', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/login',
    '/pago/:path*'
  ],
};