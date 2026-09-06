import { NextResponse, type NextRequest } from 'next/server';
import { cockpitService } from '@/lib/brewrich-ai/cockpitService';
import { getSessionFromRequest } from '@/lib/brewrich-ai/authService';

export async function GET(req: NextRequest) {
  const session = getSessionFromRequest(req);
  const orders = await cockpitService.getPaperOrders();
  return NextResponse.json({
    success: true,
    authenticated: session.isAuthenticated,
    orders,
    total_orders: orders.length,
  });
}
