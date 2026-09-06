/**
 * BREWRICH AI — BROKER SERVICE & ADAPTER BOUNDARY
 * 
 * Boundary & Security Rules:
 * 1. Zero broker secrets, passwords, or access tokens are ever returned.
 * 2. Dhan and Firstock are treated as independent server-side adapters.
 * 3. Client IDs are always masked (e.g. 1100****48, FS_*****92).
 * 4. Fail-closed Live Trading Lock (LIVE_ENABLED=false, PAPER_ONLY=true) is strictly enforced.
 * 5. Zero live order execution logic.
 */

import { BrokerConnectionInfo, NormalizedBrokerStatus, AuditLogEvent, RiskSafetyMetrics } from './types';
import { LIVE_ENABLED, PAPER_ONLY, getAuthoritativeRiskSafetyMetrics } from './safetyService';

const PYTHON_API_BASE = process.env.BREWRICH_PYTHON_API_URL || 'http://127.0.0.1:8400';

export { LIVE_ENABLED, PAPER_ONLY };

export function getRiskSafetyMetrics(): RiskSafetyMetrics {
  return getAuthoritativeRiskSafetyMetrics();
}

/**
 * Normalizes a raw broker connection object into a safe, credential-free structure.
 */
export function normalizeBrokerStatus(raw: any, fallbackId: 'dhan' | 'firstock'): NormalizedBrokerStatus {
  return {
    broker: (raw?.id || fallbackId) as 'dhan' | 'firstock',
    name: raw?.name || (fallbackId === 'dhan' ? 'DhanHQ' : 'Firstock'),
    connectionStatus: (raw?.status?.toLowerCase().includes('ready') || raw?.status?.toLowerCase().includes('connect')) ? 'connected' : 'ready',
    tradingStatus: 'LOCKED',
    mode: 'PAPER_SIMULATION',
    maskedClientId: raw?.masked_client_id || (fallbackId === 'dhan' ? '1100****48' : 'FS_*****92'),
    liveOrdersAllowed: false,
  };
}

/**
 * Returns safe status for DhanHQ broker adapter.
 */
export async function getDhanStatus(): Promise<NormalizedBrokerStatus> {
  const brokers = await fetchBrokerConnectionsFromPython();
  const dhan = brokers.find(b => b.brokerId === 'dhan');
  return normalizeBrokerStatus(dhan, 'dhan');
}

/**
 * Returns safe status for Firstock broker adapter.
 */
export async function getFirstockStatus(): Promise<NormalizedBrokerStatus> {
  const brokers = await fetchBrokerConnectionsFromPython();
  const firstock = brokers.find(b => b.brokerId === 'firstock');
  return normalizeBrokerStatus(firstock, 'firstock');
}

/**
 * Fetches all broker adapter statuses from the authoritative Python engine.
 */
export async function fetchBrokerConnectionsFromPython(): Promise<BrokerConnectionInfo[]> {
  try {
    const res = await fetch(`${PYTHON_API_BASE}/api/v1/brokers/status`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      throw new Error(`Python engine returned HTTP ${res.status}`);
    }

    const data = await res.json();
    return (data.brokers || []).map((b: any) => ({
      brokerId: b.id as 'dhan' | 'firstock',
      name: b.name,
      status: b.status,
      lastVerified: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST',
      maskedClientId: b.masked_client_id || (b.id === 'dhan' ? '1100****48' : 'FS_*****92'),
      authStatus: b.token_status === 'CONFIGURED_SERVER_SIDE' ? 'Server-Side Configured' : 'Credentials Not Set',
      tradingStatus: 'LOCKED',
      rateLimitStatus: 'Normal',
    }));
  } catch {
    return getBrokerConnections();
  }
}

/**
 * Fetches safety audit logs from the Python engine.
 */
export async function fetchAuditLogsFromPython(): Promise<AuditLogEvent[]> {
  try {
    const res = await fetch(`${PYTHON_API_BASE}/api/v1/audit/logs`, {
      cache: 'no-store',
    });

    if (!res.ok) return getAuditLogs();
    const data = await res.json();
    return (data.logs || []).map((l: any) => ({
      id: l.id,
      timestamp: l.timestamp,
      category: l.execution_mode === 'PROTECTED' ? 'SAFETY' : 'PAPER_EXECUTION',
      action: l.action,
      details: `${l.symbol} | ${l.reason} | Status: ${l.status}`,
      severity: l.status === 'ENFORCED' ? 'INFO' : 'SUCCESS',
    }));
  } catch {
    return getAuditLogs();
  }
}

/**
 * Safe fallback connection metadata.
 */
export function getBrokerConnections(): BrokerConnectionInfo[] {
  return [
    {
      brokerId: 'dhan',
      name: 'DhanHQ',
      status: 'Ready (Paper Only)',
      lastVerified: 'Live Stream',
      maskedClientId: '1100****48',
      authStatus: 'Server-Side Isolated',
      tradingStatus: 'LOCKED',
      rateLimitStatus: 'Normal',
    },
    {
      brokerId: 'firstock',
      name: 'Firstock',
      status: 'Ready (Paper Only)',
      lastVerified: 'Live Stream',
      maskedClientId: 'FS_*****92',
      authStatus: 'Server-Side Isolated',
      tradingStatus: 'LOCKED',
      rateLimitStatus: 'Normal',
    },
  ];
}

/**
 * Fallback audit logs.
 */
export function getAuditLogs(): AuditLogEvent[] {
  return [
    {
      id: 'AUD_SAFETY_LOCK',
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      category: 'SAFETY',
      action: 'SAFETY_CHECK',
      details: 'Live Trading Hard-Locked (LIVE_ENABLED=false, PAPER_ONLY=true)',
      severity: 'INFO',
    },
  ];
}
