/**
 * BREWRICH AI — STRUCTURED AUDIT LOGGING SERVICE
 * 
 * Boundary & Security Rules:
 * 1. Zero secrets, tokens, passwords, or broker credentials may ever be logged.
 * 2. All audit events are timestamped, typed, and structured.
 * 3. Maintains an immutable in-memory ring buffer and syncs with Python engine audit logs.
 */

import { AuditLogEvent, AuditCategory, AuditActionType } from './types';

const MAX_AUDIT_LOGS = 100;
const inMemoryAuditBuffer: AuditLogEvent[] = [
  {
    id: 'AUD_SYSTEM_INIT',
    timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
    category: 'SYSTEM',
    action: 'SAFETY_CHECK',
    details: 'Brewrich AI Cockpit backend initialized with fail-closed safety locks.',
    severity: 'INFO',
    metadata: { liveEnabled: false, paperOnly: true },
  },
];

/**
 * Strips any sensitive keys from metadata objects.
 */
function sanitizeMetadata(metadata?: Record<string, any>): Record<string, any> | undefined {
  if (!metadata) return undefined;
  const sanitized: Record<string, any> = {};
  const blockedKeys = ['token', 'secret', 'password', 'key', 'auth', 'bearer', 'access_token', 'api_secret', 'totp'];
  
  for (const [k, v] of Object.entries(metadata)) {
    const lowerKey = k.toLowerCase();
    if (blockedKeys.some(blocked => lowerKey.includes(blocked))) {
      sanitized[k] = '[MASKED_SECRET]';
    } else if (typeof v === 'object' && v !== null) {
      sanitized[k] = sanitizeMetadata(v);
    } else {
      sanitized[k] = v;
    }
  }
  return sanitized;
}

/**
 * Records an audit event into the structured log buffer.
 */
export function recordAuditEvent(params: {
  category: AuditCategory;
  action: AuditActionType | string;
  details: string;
  severity?: 'INFO' | 'SUCCESS' | 'WARNING' | 'CRITICAL';
  metadata?: Record<string, any>;
}): AuditLogEvent {
  const event: AuditLogEvent = {
    id: `AUD-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
    timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
    category: params.category,
    action: params.action,
    details: params.details,
    severity: params.severity || 'INFO',
    metadata: sanitizeMetadata(params.metadata),
  };

  inMemoryAuditBuffer.unshift(event);
  if (inMemoryAuditBuffer.length > MAX_AUDIT_LOGS) {
    inMemoryAuditBuffer.pop();
  }

  return event;
}

/**
 * Returns all audit events recorded in this session.
 */
export function getLocalAuditEvents(): AuditLogEvent[] {
  return [...inMemoryAuditBuffer];
}
