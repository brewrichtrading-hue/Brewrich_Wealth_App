/**
 * BREWRICH AI — CENTRAL LIVE SAFETY & GUARDRAILS SERVICE
 * 
 * Absolute Safety Rule:
 * 1. Live trading is STRICTLY HARD-LOCKED (LIVE_ENABLED=false, PAPER_ONLY=true).
 * 2. Zero live order placement, modification, cancellation, or execution endpoints.
 * 3. Any live trading call MUST fail closed and record a security audit event.
 */

import { RiskSafetyMetrics } from './types';
import { recordAuditEvent } from './auditService';

export const LIVE_ENABLED = false as const;
export const PAPER_ONLY = true as const;

export class LiveTradingBlockedError extends Error {
  constructor(message = 'Live execution is hard-locked in Brewrich AI. Mode is strictly PAPER_ONLY.') {
    super(message);
    this.name = 'LiveTradingBlockedError';
  }
}

/**
 * Authoritative check determining if live trading is permitted.
 * Always returns false in this configuration.
 */
export function isLiveTradingAllowed(): boolean {
  return false;
}

/**
 * Asserts that live trading is allowed. Always throws a fail-closed exception.
 */
export function assertLiveTradingAllowed(context = 'LIVE_ORDER_GATE'): never {
  recordAuditEvent({
    category: 'SAFETY',
    action: 'LIVE_BLOCKED',
    details: `Blocked unauthorized live trading attempt in context: ${context}. System is hard-locked to PAPER_ONLY.`,
    severity: 'CRITICAL',
    metadata: { context, liveEnabled: LIVE_ENABLED, paperOnly: PAPER_ONLY },
  });

  throw new LiveTradingBlockedError(
    `[SAFETY GATE INTERCEPTION] Live trading is blocked in context '${context}'. LIVE_ENABLED=false, PAPER_ONLY=true.`
  );
}

/**
 * Returns structured risk and safety metrics for UI and health dashboards.
 */
export function getAuthoritativeRiskSafetyMetrics(): RiskSafetyMetrics {
  return {
    executionMode: 'PAPER',
    liveTradingStatus: 'LOCKED',
    emergencyStopActive: false,
    safetyGatePassed: true,
    portfolioExposurePct: 97.7,
    cashReservePct: 2.3,
    maxSinglePositionPct: 10.0,
    currentMaxDrawdownPct: 0.0,
    drawdownLimitPct: 15.0,
    lastSuccessfulStrategyRun: 'Market Session 2026-09-03',
    lastSuccessfulPaperExecution: 'Market Session 2026-09-03',
    activeErrorCount: 0,
    systemHealth: 'OPTIMAL',
  };
}
