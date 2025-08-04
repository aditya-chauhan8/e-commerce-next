import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './lib/auth';

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value;

  if (!token) return NextResponse.redirect(new URL('/login', req.url));

  try {
    const { role } = await verifyToken(token) as any;

    const path = req.nextUrl.pathname;

    if (role.toLowerCase() === 'admin' && !path.startsWith('/admin')) {
      return NextResponse.redirect(new URL('/admin', req.url));
    }
    if (role.toLowerCase() === 'vendor' && !path.startsWith('/vendor')) {
      return NextResponse.redirect(new URL('/vendor', req.url));
    }
    if (role.toLowerCase() === 'buyer' && !path.startsWith('/dashboard')) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
  } catch (err) {
    console.log('Token verification failed:', err);
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/vendor/:path*', '/dashboard/:path*'],
};