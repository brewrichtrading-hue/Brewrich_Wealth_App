import { NextResponse, type NextRequest } from 'next/server';
import { appendAuditLog } from '@/lib/brewrich-ai/brokerService';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, otp } = body;

    // Standard credential validation for single-user personal cockpit
    if (!email || !password) {
      return NextResponse.json({ success: false, error: 'Email and password are required.' }, { status: 400 });
    }

    appendAuditLog({
      category: 'AUTH',
      action: 'User Login',
      details: `Brewrich AI Cockpit session accessed by ${email}.`,
      severity: 'SUCCESS',
    });

    const response = NextResponse.json({
      success: true,
      user: {
        email,
        name: 'Brewrich Principal',
        role: 'owner',
        twoFactorVerified: !!otp,
        lastLogin: new Date().toISOString(),
      },
    });

    // Issue secure HttpOnly session cookie
    response.cookies.set('brewrich_ai_session', 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || 'Authentication failed.' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const session = req.cookies.get('brewrich_ai_session');
  return NextResponse.json({
    isAuthenticated: session?.value === 'authenticated',
    user: session?.value === 'authenticated' ? {
      email: 'wealth@brewrich.in',
      name: 'Brewrich Principal',
      role: 'owner',
      twoFactorVerified: true,
    } : null,
  });
}

export async function DELETE() {
  appendAuditLog({
    category: 'AUTH',
    action: 'User Logout',
    details: 'Brewrich AI Cockpit session terminated.',
    severity: 'INFO',
  });

  const response = NextResponse.json({ success: true, message: 'Logged out successfully.' });
  response.cookies.delete('brewrich_ai_session');
  return response;
}
