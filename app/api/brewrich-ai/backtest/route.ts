import { NextResponse } from 'next/server';
import { getBrewrich400BacktestAsync } from '@/lib/brewrich-ai/brewrich400Engine';

export async function GET() {
  const backtest = await getBrewrich400BacktestAsync();
  return NextResponse.json({ success: true, backtest });
}

