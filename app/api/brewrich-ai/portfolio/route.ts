import { NextResponse, type NextRequest } from 'next/server';
import { cockpitService } from '@/lib/brewrich-ai/cockpitService';
import { getSessionFromRequest } from '@/lib/brewrich-ai/authService';

export async function GET(req: NextRequest) {
  const session = getSessionFromRequest(req);
  const portfolio = await cockpitService.getPaperPortfolio();
  return NextResponse.json({
    success: true,
    authenticated: session.isAuthenticated,
    portfolio,
  });
}
