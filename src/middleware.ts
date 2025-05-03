import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import {  verifyRefreshToken } from './utils/jwt';

export async function middleware(request: NextRequest) {
  const getToken = request.cookies.get('refreshToken')?.value;
  if (!getToken) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  try {
    const user = await verifyRefreshToken(getToken);

    const isAdminPath = request.nextUrl.pathname.startsWith('/dashboard/admin');
    const isOwnerPath = request.nextUrl.pathname.startsWith('/dashboard/owner');
    console.log(user.role);
    if ((isAdminPath && user.role !== 3) || (isOwnerPath && user.role !== 2)) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    console.log(user.role != 3 && isAdminPath);
    if(user.role !== 3 && isAdminPath) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return NextResponse.next();
  } catch (error) {
    return NextResponse.redirect(new URL('/', request.url));
  }
}

// Tentukan route mana yang diproteksi
export const config = {
  matcher: ['/dashboard/:path*'],
};
