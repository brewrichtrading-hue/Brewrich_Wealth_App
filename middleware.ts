import { NextResponse, type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

export async function middleware(request: NextRequest) {
  const { supabaseResponse, user, supabase } = await updateSession(request);

  const pathname = request.nextUrl.pathname;

  // Protect /dashboard routes
  if (pathname.startsWith('/dashboard')) {
    // 1. Check if user is authenticated
    if (!user) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = '/';
      redirectUrl.searchParams.set('auth_redirect', 'login_required');
      return NextResponse.redirect(redirectUrl);
    }

    // 2. Check if user has paid access (is_paid === true)
    try {
      const { data: moduleStatus, error } = await supabase
        .from('module_status')
        .select('is_paid')
        .or(`user_id.eq.${user.id},email.eq.${user.email}`)
        .order('is_paid', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Middleware database check error:', error.message);
      }

      // If user is not paid, redirect them to /
      if (!moduleStatus || !moduleStatus.is_paid) {
        const redirectUrl = request.nextUrl.clone();
        redirectUrl.pathname = '/';
        redirectUrl.searchParams.set('access_denied', 'unpaid_member');
        return NextResponse.redirect(redirectUrl);
      }
    } catch (err) {
      console.error('Unexpected error checking payment status in middleware:', err);
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = '/';
      redirectUrl.searchParams.set('access_denied', 'error');
      return NextResponse.redirect(redirectUrl);
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images, icons, manifest
     */
    '/((?!_next/static|_next/image|favicon.ico|manifest.json|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
