import { NextResponse, type NextRequest } from 'next/server';
import { cockpitService } from '@/lib/brewrich-ai/cockpitService';
import { LiveTradingBlockedError } from '@/lib/brewrich-ai/safetyService';

export async function GET() {
  const status = cockpitService.getLiveStatus();
  return NextResponse.json({
    success: true,
    liveStatus: status,
  });
}

export async function POST(req: NextRequest) {
  try {
    cockpitService.assertLiveAllowed('API_LIVE_POST_ROUTE');
  } catch (err: any) {
    if (err instanceof LiveTradingBlockedError || err?.name === 'LiveTradingBlockedError') {
      return NextResponse.json(
        {
          success: false,
          error: 'FORBIDDEN: Live trading execution is hard-locked. LIVE_ENABLED=false, PAPER_ONLY=true.',
          code: 'LIVE_TRADING_LOCKED',
        },
        { status: 403 }
      );
    }
  }
  return NextResponse.json({ success: false, error: 'Live trading unavailable' }, { status: 403 });
}

export async function PUT() {
  return NextResponse.json(
    { success: false, error: 'Live execution is hard-locked.' },
    { status: 403 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { success: false, error: 'Live execution is hard-locked.' },
    { status: 403 }
  );
}
