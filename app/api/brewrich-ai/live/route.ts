import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    success: true,
    liveTrading: {
      status: 'LOCKED',
      isEnabled: false,
      paperOnly: true,
      reason: 'Live execution is fail-closed locked in production configuration. Paper mode is active.',
      activeProtections: [
        'Zero live broker endpoints',
        'Zero order dispatch authorizations',
        'Fail-closed API boundary',
        'Paper execution sandbox active',
      ],
    },
  });
}
