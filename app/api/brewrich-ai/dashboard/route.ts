import { NextResponse, type NextRequest } from 'next/server';
import { cockpitService } from '@/lib/brewrich-ai/cockpitService';
import { getSessionFromRequest } from '@/lib/brewrich-ai/authService';

export async function GET(req: NextRequest) {
  const session = getSessionFromRequest(req);
  // For personal cockpit, verify session or serve dashboard with authenticated flag
  const data = await cockpitService.getDashboard();
  return NextResponse.json({
    success: true,
    authenticated: session.isAuthenticated,
    data,
  });
}
