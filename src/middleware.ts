import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { verifyRefreshToken } from './utils/jwt';

// Role Schema
const ROLES = {
  USER: 1,
  OWNER: 2,
  ADMIN: 3
};

export async function middleware(request: NextRequest) {
  const refreshToken = request.cookies.get('refreshToken')?.value;
  
  // Redirect home jika tidak punya token
  if (!refreshToken) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  try {
    const user = await verifyRefreshToken(refreshToken);
    const currentPath = request.nextUrl.pathname;

    // Semua route terproteksi
    const protectedRoutes = {
      '/dashboard/admin': [ROLES.ADMIN],
      '/dashboard/owner': [ROLES.OWNER],
      '/dashboard/user': [ROLES.USER],
      '/dashboard/riwayat/admin': [ROLES.ADMIN],
      '/dashboard/riwayat/owner': [ROLES.OWNER],
      '/dashboard/riwayat/user': [ROLES.USER],
      '/dashboard/admin/users': [ROLES.ADMIN],
      '/dashboard/hotel': [ROLES.OWNER, ROLES.ADMIN],
      '/dashboard/kategori': [ROLES.OWNER, ROLES.ADMIN],
      '/dashboard/kamar': [ROLES.OWNER, ROLES.ADMIN],
      '/dashboard/top-up': [ROLES.USER, ROLES.OWNER, ROLES.ADMIN]
    };

    let allowedRoles: number[] = [];
    for (const [route, roles] of Object.entries(protectedRoutes)) {
      if (currentPath.startsWith(route)) {
        allowedRoles = roles;
        break;
      }
    }

    if (allowedRoles.length === 0) {
      return NextResponse.next();
    }

    // Check role
    if (!allowedRoles.includes(user.role)) {
      let redirectPath = '/dashboard/user';
      if (user.role === ROLES.OWNER) redirectPath = '/dashboard/owner';
      if (user.role === ROLES.ADMIN) redirectPath = '/dashboard/admin';
      
      return NextResponse.redirect(new URL(redirectPath, request.url));
    }

    return NextResponse.next();
  } catch (error) {
    return NextResponse.redirect(new URL('/', request.url));
  }
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/dashboard/admin/:path*',
    '/dashboard/owner/:path*',
    '/dashboard/user/:path*',
    '/dashboard/riwayat/:path*'
  ],
};