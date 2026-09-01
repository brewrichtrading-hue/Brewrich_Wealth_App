import { NextRequest, NextResponse } from 'next/server';
import { requestDefinedgeOtp } from '@/lib/skyhigh/definedgeAuth';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { apiToken, apiSecret } = body;

    const result = await requestDefinedgeOtp({
      apiToken,
      apiSecret,
    });

    return NextResponse.json({
      success: true,
      otpToken: result.otpToken,
      message: result.message,
    });
  } catch (err: any) {
    console.error('❌ [DEFINEDGE AUTH STEP 1 ERROR]:', err?.message);
    const message = err?.message || 'Failed to initiate Definedge authentication.';
    
    let statusCode = 400;
    if (message.includes('server unavailable') || message.includes('failed to connect')) {
      statusCode = 502;
    } else if (message.includes('Invalid API Token') || message.includes('Authentication Failed')) {
      statusCode = 401;
    }

    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: statusCode }
    );
  }
}
