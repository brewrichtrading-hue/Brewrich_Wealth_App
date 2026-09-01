import { NextRequest, NextResponse } from 'next/server';
import { checkServerSessionStatus } from '@/lib/skyhigh/definedgeAuth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const cookieValue = request.cookies.get('definedge_session')?.value;
    const status = checkServerSessionStatus(cookieValue);

    return NextResponse.json({
      status: 'ok',
      ...status,
    });
  } catch (err: any) {
    return NextResponse.json(
      { status: 'error', isAuthenticated: false, error: err?.message },
      { status: 500 }
    );
  }
}
