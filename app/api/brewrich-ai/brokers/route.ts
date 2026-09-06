import { NextResponse } from 'next/server';
import { fetchBrokerConnectionsFromPython } from '@/lib/brewrich-ai/brokerService';

export async function GET() {
  const brokers = await fetchBrokerConnectionsFromPython();
  return NextResponse.json({ success: true, brokers });
}

