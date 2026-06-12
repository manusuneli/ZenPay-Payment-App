import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  if(request.nextUrl.pathname.startsWith('/dashboard') || request.nextUrl.pathname.startsWith('/transfer') || 
  request.nextUrl.pathname.startsWith('/trasactions') || request.nextUrl.pathname.startsWith('/p2p') || 
  request.nextUrl.pathname.startsWith('/mpin') || request.nextUrl.pathname.startsWith('/api/mpin') || 
  request.nextUrl.pathname.startsWith('/balance') || request.nextUrl.pathname.startsWith('/profile') || 
  request.nextUrl.pathname.startsWith('/split-bill') || request.nextUrl.pathname.startsWith('/notificationspendings'))
  {
    const token = (request.cookies.get('next-auth.session-token')?.value) || (request.cookies.get('__Secure-next-auth.session-token')?.value)
    // alert("User not Logged in!!")
    if (!token) {
      return NextResponse.redirect(new URL('/auth/signin', request.url));
    }
    return NextResponse.next();
  }
  
  return NextResponse.next();
    
}
// Global Matcher, want to protect website Globally
// export const config = {
//   matcher: '/:path*'
// };
