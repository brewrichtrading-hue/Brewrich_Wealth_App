import { NextResponse } from 'next/server';
import { fetchAuditLogsFromPython } from '@/lib/brewrich-ai/brokerService';

export async function GET() {
  const logs = await fetchAuditLogsFromPython();
  return NextResponse.json({ success: true, logs });
}

