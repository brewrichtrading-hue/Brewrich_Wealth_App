import { NextResponse } from 'next/server';
import { fetchPaperPortfolioFromPython } from '@/lib/brewrich-ai/paperExecution';

export async function GET() {
  const portfolio = await fetchPaperPortfolioFromPython();
  return NextResponse.json({ success: true, portfolio });
}

