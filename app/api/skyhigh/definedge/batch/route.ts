import { NextRequest, NextResponse } from 'next/server';
import { executeMarketWideHistoricalIngestion, UniversePreset } from '@/lib/skyhigh/definedgeBatchService';
import { getActiveServerSessionKey } from '@/lib/skyhigh/definedgeAuth';

export const dynamic = 'force-dynamic';
export const maxDuration = 300; // Allow long-running batch ingestion up to 5 minutes on pro / server

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      universePreset = 'NIFTY_50', 
      customSymbols, 
      fromDate, 
      toDate, 
      sessionKey, 
      delayMsBetweenRequests = 200 
    } = body;

    if (!fromDate || !toDate) {
      return NextResponse.json(
        { error: 'Invalid Request: Both "fromDate" and "toDate" (YYYY-MM-DD) are required.' },
        { status: 400 }
      );
    }

    // Resolve session key from request body, server session, or HttpOnly cookie
    const cookieValue = request.cookies.get('definedge_session')?.value;
    const resolvedSessionKey = sessionKey?.trim() || getActiveServerSessionKey(cookieValue) || undefined;

    if (!resolvedSessionKey) {
      return NextResponse.json(
        { error: 'Authentication Required: Please complete Definedge 2FA authentication first.' },
        { status: 401 }
      );
    }

    const report = await executeMarketWideHistoricalIngestion({
      universePreset: universePreset as UniversePreset,
      customSymbols,
      fromDate,
      toDate,
      sessionKey: resolvedSessionKey,
      delayMsBetweenRequests,
    });

    return NextResponse.json({
      success: true,
      report,
    });
  } catch (err: any) {
    console.error('❌ [DEFINEDGE BATCH INGESTION ROUTE ERROR]:', err);
    return NextResponse.json(
      {
        success: false,
        error: err?.message || 'Failed to process batch historical data ingestion.',
      },
      { status: 500 }
    );
  }
}
