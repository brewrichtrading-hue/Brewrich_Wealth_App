import { NextResponse, type NextRequest } from 'next/server';
import { fetchPaperPortfolioFromPython, executePaperRebalanceInPython } from '@/lib/brewrich-ai/paperExecution';

export async function GET() {
  const portfolio = await fetchPaperPortfolioFromPython();
  return NextResponse.json({ success: true, portfolio });
}

export async function POST(req: NextRequest) {
  try {
    const result = await executePaperRebalanceInPython();
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || 'Paper execution error.' }, { status: 500 });
  }
}

