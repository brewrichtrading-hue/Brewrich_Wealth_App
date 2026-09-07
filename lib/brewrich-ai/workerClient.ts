/**
 * BREWRICH AI — AUTHENTICATED WORKER BRIDGE CLIENT
 *
 * Boundary & Security Invariants:
 * 1. Executes strictly server-side (Node.js/Next.js API route or Server Component).
 * 2. Authenticates with worker.brewrich.in using a server-side Bearer secret (BREWRICH_WORKER_SECRET).
 * 3. NEVER exposes the secret to browser/client JavaScript bundles.
 * 4. Fails closed if invoked from a client/browser environment.
 * 5. Zero live-trading order placement paths.
 */

const IS_BROWSER = typeof window !== 'undefined';

export function getWorkerBaseUrl(): string {
  if (IS_BROWSER) {
    throw new Error('SECURITY VIOLATION: Worker client cannot be instantiated in browser runtime.');
  }
  if (process.env.BREWRICH_WORKER_URL) {
    return process.env.BREWRICH_WORKER_URL.replace(/\/+$/, '');
  }
  if (process.env.BREWRICH_PYTHON_API_URL) {
    return process.env.BREWRICH_PYTHON_API_URL.replace(/\/+$/, '');
  }
  if (process.env.NODE_ENV === 'production') {
    return 'https://worker.brewrich.in';
  }
  return 'http://127.0.0.1:8400';
}

export function getWorkerAuthSecret(): string {
  if (IS_BROWSER) {
    throw new Error('SECURITY VIOLATION: Worker secret cannot be accessed in browser runtime.');
  }
  return process.env.BREWRICH_WORKER_SECRET || process.env.WORKER_SECRET || '';
}

export interface WorkerRequestOptions extends RequestInit {
  timeoutMs?: number;
}

export async function fetchWorker<T = any>(endpoint: string, options: WorkerRequestOptions = {}): Promise<T> {
  if (IS_BROWSER) {
    throw new Error('SECURITY VIOLATION: fetchWorker blocked in browser context.');
  }

  const baseUrl = getWorkerBaseUrl();
  const secret = getWorkerAuthSecret();
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${baseUrl}${cleanEndpoint}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (secret) {
    headers['Authorization'] = `Bearer ${secret}`;
  }

  const timeoutMs = options.timeoutMs || 15000;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      ...options,
      headers,
      signal: controller.signal,
      cache: 'no-store',
    });

    if (!res.ok) {
      const errorBody = await res.text().catch(() => '');
      throw new Error(`Worker HTTP ${res.status}: ${errorBody || res.statusText}`);
    }

    return await res.json() as T;
  } finally {
    clearTimeout(timer);
  }
}

// ---------------------------------------------------------------------------
// Worker Endpoints
// ---------------------------------------------------------------------------

export async function getWorkerHealth(): Promise<any> {
  return fetchWorker('/health');
}

export async function getWorkerStrategySummary(): Promise<any> {
  return fetchWorker('/api/v1/strategy/summary');
}

export async function getWorkerBacktestResults(): Promise<any> {
  return fetchWorker('/api/v1/backtest/results');
}

export async function getWorkerPaperPortfolio(): Promise<any> {
  return fetchWorker('/api/v1/paper/portfolio');
}

export async function executeWorkerPaperRebalance(): Promise<{
  status: string;
  message: string;
  actions_executed: any[];
  active_positions: number;
  cash_balance: number;
}> {
  return fetchWorker('/api/v1/paper/rebalance', {
    method: 'POST',
    body: JSON.stringify({}),
  });
}

export async function getWorkerBrokersStatus(): Promise<any> {
  return fetchWorker('/api/v1/brokers/status');
}

export async function getWorkerAuditLogs(limit: number = 50): Promise<any> {
  return fetchWorker(`/api/v1/audit/logs?limit=${limit}`);
}
