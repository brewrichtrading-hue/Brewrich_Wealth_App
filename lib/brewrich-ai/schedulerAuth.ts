import { NextRequest } from 'next/server';

/**
 * BREWRICH AI — SCHEDULER INGRESS AUTHENTICATION
 *
 * Boundary & Security Invariants:
 * 1. Accepts exclusively process.env.CRON_SECRET for scheduler ingress.
 * 2. Unconditionally rejects BREWRICH_WORKER_SECRET, WORKER_SECRET, and BREWRICH_ADMIN_PASSWORD.
 * 3. Fails closed in production if CRON_SECRET is not configured or token is missing.
 * 4. Strictly decoupled from the outbound Next.js -> Python Worker secret (BREWRICH_WORKER_SECRET).
 */
export function verifySchedulerAuth(req: NextRequest): boolean {
  const authHeader = req.headers.get('authorization') || '';
  const token = authHeader.replace(/^Bearer\s+/i, '').trim();
  const cronSecret = process.env.CRON_SECRET?.trim();

  // Fail-closed if token is empty
  if (!token) {
    return false;
  }

  // If CRON_SECRET is not configured
  if (!cronSecret) {
    // Unconditionally fail-closed in production
    if (process.env.NODE_ENV === 'production') {
      return false;
    }
    // In development only, allow explicit 'dev-cron-secret' for local testing
    return token === 'dev-cron-secret';
  }

  // Strictly enforce equality with CRON_SECRET only
  // Zero fallback to BREWRICH_WORKER_SECRET, WORKER_SECRET, or BREWRICH_ADMIN_PASSWORD
  return token === cronSecret;
}
