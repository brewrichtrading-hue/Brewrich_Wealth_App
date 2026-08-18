import { NextResponse, type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

export async function middleware(req: NextRequest) {
  const { supabaseResponse, user } = await updateSession(req);
  const url = req.nextUrl;

  // Protect student and admin routes
  if (url.pathname.startsWith('/student') || url.pathname.startsWith('/admin')) {
    if (!user) {
      return NextResponse.redirect(new URL('/mip', req.url));
    }

    // INSTANT TESTING BYPASS: Whitelist your admin email
    const adminEmail = 'brewrichtrading@gmail.com';
    if (user.email === adminEmail) {
      return supabaseResponse; // Grants immediate access to test everything!
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: ['/student/:path*', '/admin/:path*'],
};
