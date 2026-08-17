import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') || '/dashboard';

  if (code) {
    const supabase = await createClient();
    const { error, data } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data?.user) {
      // Check if user is paid to decide best landing destination
      const { data: moduleStatus } = await supabase
        .from('module_status')
        .select('is_paid')
        .or(`user_id.eq.${data.user.id},email.eq.${data.user.email}`)
        .maybeSingle();

      if (moduleStatus && moduleStatus.is_paid) {
        return NextResponse.redirect(`${requestUrl.origin}/dashboard`);
      } else if (next.includes('miip')) {
        return NextResponse.redirect(`${requestUrl.origin}/miip?checkout=auto`);
      }
    }
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(`${requestUrl.origin}${next}`);
}
