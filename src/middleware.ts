import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Check if the request is for an admin route
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Check if user is authenticated (this will be checked client-side)
    // For now, just allow the request to proceed
    // The actual authentication check happens in the component
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
  ]
};