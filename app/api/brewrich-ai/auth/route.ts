import { NextResponse, type NextRequest } from 'next/server';
import {
  authenticateOwner,
  getSessionFromRequest,
  attachSessionCookie,
  clearSessionCookie,
} from '@/lib/brewrich-ai/authService';
import { recordAuditEvent } from '@/lib/brewrich-ai/auditService';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    const result = authenticateOwner(email, password);
    if (!result.success || !result.token || !result.session) {
      return NextResponse.json({ success: false, error: result.error || 'Authentication failed' }, { status: 401 });
    }

    const res = NextResponse.json({
      success: true,
      user: result.session,
    });

    attachSessionCookie(res, result.token);
    return res;
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || 'Authentication error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const session = getSessionFromRequest(req);
  return NextResponse.json({
    isAuthenticated: session.isAuthenticated,
    user: session.isAuthenticated ? session : null,
  });
}

export async function DELETE() {
  recordAuditEvent({
    category: 'AUTH',
    action: 'LOGOUT',
    details: 'Owner session terminated via logout.',
    severity: 'INFO',
  });

  const res = NextResponse.json({ success: true, message: 'Logged out successfully.' });
  clearSessionCookie(res);
  return res;
}
