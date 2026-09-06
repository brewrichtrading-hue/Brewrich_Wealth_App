import { NextResponse } from 'next/server';
import { getBrewrich400StateAsync } from '@/lib/brewrich-ai/brewrich400Engine';

export async function GET() {
  const strategy = await getBrewrich400StateAsync();
  return NextResponse.json({ success: true, strategy });
}

