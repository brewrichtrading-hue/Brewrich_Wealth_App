import { NextResponse } from 'next/server';
import { getDefinedgeMaster } from '@/lib/skyhigh/definedgeMaster';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const master = await getDefinedgeMaster();
    const hasEnvSessionKey = Boolean(process.env.DEFINEDGE_API_SESSION_KEY?.trim());

    const sampleStocks = [
      master.bySymbol.get('RELIANCE'),
      master.bySymbol.get('TCS'),
      master.bySymbol.get('INFY'),
      master.bySymbol.get('HDFCBANK'),
      master.bySymbol.get('ICICIBANK'),
      master.bySymbol.get('TATAMOTORS'),
    ].filter(Boolean);

    return NextResponse.json({
      status: 'ok',
      masterFile: {
        loaded: true,
        totalSymbols: master.bySymbol.size,
        loadedAt: new Date(master.loadedAt).toISOString(),
      },
      hasEnvSessionKey,
      sampleStocks,
    });
  } catch (err: any) {
    console.error('❌ [DEFINEDGE STATUS API ERROR]:', err);
    return NextResponse.json(
      {
        status: 'error',
        message: err?.message || 'Failed to initialize Definedge master file.',
      },
      { status: 500 }
    );
  }
}
