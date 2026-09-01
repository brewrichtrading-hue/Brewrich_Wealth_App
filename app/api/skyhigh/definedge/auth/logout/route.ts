import { NextResponse } from 'next/server';
import { clearServerSession } from '@/lib/skyhigh/definedgeAuth';

export const dynamic = 'force-dynamic';

export async function POST() {
  clearServerSession();

  const response = NextResponse.json({
    success: true,
    message: 'Definedge session terminated.',
  });

  response.cookies.set({
    name: 'definedge_session',
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });

  return response;
}
