import { NextResponse } from 'next/server';
import { getRiskSafetyMetrics } from '@/lib/brewrich-ai/brokerService';

export async function GET() {
  const risk = getRiskSafetyMetrics();
  return NextResponse.json({ success: true, risk });
}
