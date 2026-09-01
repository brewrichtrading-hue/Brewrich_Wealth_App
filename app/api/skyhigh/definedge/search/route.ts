import { NextRequest, NextResponse } from 'next/server';
import { searchDefinedgeSecurities } from '@/lib/skyhigh/definedgeMaster';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const limit = parseInt(searchParams.get('limit') || '10', 10);

    const results = await searchDefinedgeSecurities(query, Math.min(50, limit));
    return NextResponse.json({ results });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Failed to search Definedge securities' },
      { status: 500 }
    );
  }
}
