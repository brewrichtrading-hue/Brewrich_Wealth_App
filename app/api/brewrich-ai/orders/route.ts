import { NextResponse } from 'next/server';
import { fetchPaperOrdersFromPython } from '@/lib/brewrich-ai/paperExecution';

export async function GET() {
  const orders = await fetchPaperOrdersFromPython();
  return NextResponse.json({ success: true, orders });
}

