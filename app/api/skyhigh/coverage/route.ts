import { NextResponse } from 'next/server';
import { computeHistoricalCoverage } from '@/lib/skyhigh/coverageService';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const coverage = await computeHistoricalCoverage();
    return NextResponse.json({
      success: true,
      coverage,
    });
  } catch (err: any) {
    console.error('❌ [COVERAGE API ERROR]:', err);
    return NextResponse.json(
      {
        success: false,
        error: err?.message || 'Failed to compute historical coverage metrics.',
      },
      { status: 500 }
    );
  }
}
