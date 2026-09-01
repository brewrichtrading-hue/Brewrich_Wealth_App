import { NextRequest, NextResponse } from 'next/server';
import { ingestDefinedgeHistoricalData } from '@/lib/skyhigh/definedgeService';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { symbol, token, fromDate, toDate, sessionKey } = body;

    if (!symbol && !token) {
      return NextResponse.json(
        { error: 'Invalid Request: Either "symbol" or "token" must be provided.' },
        { status: 400 }
      );
    }

    if (!fromDate || !toDate) {
      return NextResponse.json(
        { error: 'Invalid Request: Both "fromDate" and "toDate" (YYYY-MM-DD) are required.' },
        { status: 400 }
      );
    }

    const result = await ingestDefinedgeHistoricalData({
      symbol,
      token,
      fromDate,
      toDate,
      sessionKey,
    });

    return NextResponse.json(result);
  } catch (err: any) {
    console.error('❌ [DEFINEDGE INGESTION ROUTE ERROR]:', err);
    const message = err?.message || 'Failed to process Definedge historical data request.';
    
    // Status code determination
    let statusCode = 500;
    if (message.includes('Authentication') || message.includes('401')) {
      statusCode = 401;
    } else if (message.includes('Invalid') || message.includes('Symbol Not Found') || message.includes('400')) {
      statusCode = 400;
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
