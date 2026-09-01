import { NextRequest, NextResponse } from 'next/server';
import { verifyDefinedgeOtp } from '@/lib/skyhigh/definedgeAuth';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { otpToken, otp } = body;

    if (!otpToken) {
      return NextResponse.json(
        { success: false, error: 'Missing otp_token. Please request an OTP first.' },
        { status: 400 }
      );
    }

    if (!otp || !otp.trim()) {
      return NextResponse.json(
        { success: false, error: 'Please enter the 6-digit OTP received on your mobile or email.' },
        { status: 400 }
      );
    }

    const result = await verifyDefinedgeOtp({
      otpToken,
      otp,
    });

    // Create JSON response
    const response = NextResponse.json({
      success: true,
      message: result.message,
      username: result.username,
    });

    // Set HttpOnly secure cookie for stateless session persistence
    response.cookies.set({
      name: 'definedge_session',
      value: result.cookieToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24, // 24 hours
    });

    return response;
  } catch (err: any) {
    console.error('❌ [DEFINEDGE AUTH STEP 2 ERROR]:', err?.message);
    const message = err?.message || 'Failed to verify Definedge OTP.';
    
    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: 401 }
    );
  }
}
