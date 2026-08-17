import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({
        authenticated: false,
        user: null,
        moduleStatus: null,
      });
    }

    const { data: moduleStatus, error: dbError } = await supabase
      .from('module_status')
      .select('*')
      .or(`user_id.eq.${user.id},email.eq.${user.email}`)
      .order('is_paid', { ascending: false })
      .limit(1)
      .maybeSingle();

    return NextResponse.json({
      authenticated: true,
      user: {
        id: user.id,
        email: user.email,
        user_metadata: user.user_metadata,
      },
      moduleStatus: moduleStatus || {
        is_paid: false,
        quiz_1_unlocked: false,
        quiz_2_unlocked: false,
      },
    });
  } catch (error: any) {
    console.error('Error fetching user status:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch status' },
      { status: 500 }
    );
  }
}
