import { NextResponse, type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

export async function middleware(req: NextRequest) {
  const { supabaseResponse, user } = await updateSession(req);
  const url = req.nextUrl;

  // Protect student routes only
  if (url.pathname.startsWith('/student')) {
    if (!user) {
      return NextResponse.redirect(new URL('/miip', req.url));
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: ['/student/:path*'],
};
