/**
 * BREWRICH AI — CENTRAL COCKPIT BACKEND SERVICE
 * 
 * Formal Boundary:
 * This service is the single backend interface uniting all cockpit operations.
 * It strictly enforces:
 * - 0 duplicate strategy calculations in TypeScript.
 * - Single source of truth in authoritative Python Strategy Engine (127.0.0.1:8400).
 * - Single source of truth for Paper Portfolio in data/paper_state.json.
 * - Single source of truth for Safety Locks (LIVE_ENABLED=false, PAPER_ONLY=true).
 * - Zero secrets or live execution endpoints.
 */

import {
  CockpitDashboardData,
  Brewrich400State,
  BacktestDataset,
  PaperPortfolioState,
  PaperOrder,
  BrokerConnectionInfo,
  RiskSafetyMetrics,
  AuditLogEvent,
  SystemHealthStatus,
  UniverseStock,
} from './types';

import { getBrewrich400StateAsync, getBrewrich400BacktestAsync } from './brewrich400Engine';
import {
  fetchPaperPortfolioFromPython,
  fetchPaperOrdersFromPython,
  executePaperRebalanceInPython,
} from './paperExecution';
import {
  fetchBrokerConnectionsFromPython,
  fetchAuditLogsFromPython,
} from './brokerService';
import {
  LIVE_ENABLED,
  PAPER_ONLY,
  isLiveTradingAllowed,
  assertLiveTradingAllowed,
  getAuthoritativeRiskSafetyMetrics,
} from './safetyService';
import { recordAuditEvent, getLocalAuditEvents } from './auditService';
import { getSystemHealth } from './healthService';

export class CockpitService {
  /**
   * 1. Aggregated Dashboard Data
   */
  async getDashboard(): Promise<CockpitDashboardData> {
    const [strategy, portfolio, recentOrders, brokers, pythonLogs] = await Promise.all([
      getBrewrich400StateAsync(),
      fetchPaperPortfolioFromPython(),
      fetchPaperOrdersFromPython(),
      fetchBrokerConnectionsFromPython(),
      fetchAuditLogsFromPython(),
    ]);

    const localLogs = getLocalAuditEvents();
    // Merge logs with deduplication by id
    const mergedLogsMap = new Map<string, AuditLogEvent>();
    for (const l of [...localLogs, ...pythonLogs]) {
      if (!mergedLogsMap.has(l.id)) mergedLogsMap.set(l.id, l);
    }
    const recentAuditLogs = Array.from(mergedLogsMap.values()).slice(0, 20);

    const risk = getAuthoritativeRiskSafetyMetrics();

    return {
      systemPulse: strategy.status === 'ACTIVE' ? 'OPERATIONAL' : 'DEGRADED',
      strategy,
      portfolio,
      recentOrders: recentOrders.slice(0, 10),
      risk,
      brokers,
      recentAuditLogs,
      liveStatus: {
        isLocked: true,
        reason: 'Execution mode is strictly PAPER. Live trading is fail-closed locked.',
      },
    };
  }

  /**
   * 2. Strategy Engine Summary (Brewrich 400)
   */
  async getStrategy(): Promise<Brewrich400State> {
    recordAuditEvent({
      category: 'STRATEGY',
      action: 'ENGINE_CHECK',
      details: 'Strategy summary requested from Brewrich 400 engine.',
      severity: 'INFO',
    });
    return getBrewrich400StateAsync();
  }

  /**
   * 3. 400-Stock Universe Rankings & Eligibility
   */
  async getUniverse(): Promise<{ universeSize: number; eligibleCount: number; stocks: UniverseStock[] }> {
    const strategy = await getBrewrich400StateAsync();
    return {
      universeSize: strategy.universeSize,
      eligibleCount: strategy.eligibleCount,
      stocks: strategy.topRanked,
    };
  }

  /**
   * 4. 10-Year Backtest Dataset & Metrics
   */
  async getBacktest(): Promise<BacktestDataset> {
    recordAuditEvent({
      category: 'BACKTEST',
      action: 'BACKTEST_RUN',
      details: 'Historical 10-year backtest dataset loaded.',
      severity: 'INFO',
    });
    return getBrewrich400BacktestAsync();
  }

  /**
   * 5. Canonical Persistent Paper Portfolio
   */
  async getPaperPortfolio(): Promise<PaperPortfolioState> {
    return fetchPaperPortfolioFromPython();
  }

  /**
   * 6. Paper Orders Book
   */
  async getPaperOrders(): Promise<PaperOrder[]> {
    return fetchPaperOrdersFromPython();
  }

  /**
   * 7. Broker Connection Status (Masked & Safe)
   */
  async getBrokerStatus(): Promise<BrokerConnectionInfo[]> {
    recordAuditEvent({
      category: 'BROKER',
      action: 'BROKER_STATUS_CHECK',
      details: 'Dhan & Firstock adapter health check executed.',
      severity: 'INFO',
    });
    return fetchBrokerConnectionsFromPython();
  }

  /**
   * 8. Risk & Safety Guardrails Status
   */
  async getRiskStatus(): Promise<RiskSafetyMetrics> {
    return getAuthoritativeRiskSafetyMetrics();
  }

  /**
   * 9. Immutable Structured Audit Log
   */
  async getAuditLog(): Promise<AuditLogEvent[]> {
    const [pythonLogs] = await Promise.all([fetchAuditLogsFromPython()]);
    const localLogs = getLocalAuditEvents();
    const merged = [...localLogs, ...pythonLogs];
    return merged;
  }

  /**
   * 10. Live Trading Safety Lock Status
   */
  getLiveStatus(): { isLocked: boolean; liveEnabled: false; paperOnly: true; reason: string } {
    return {
      isLocked: true,
      liveEnabled: LIVE_ENABLED,
      paperOnly: PAPER_ONLY,
      reason: 'Live execution is fail-closed and locked. All strategy operations execute in paper simulation.',
    };
  }

  /**
   * 11. System Health & Infrastructure Check
   */
  async getHealth(): Promise<SystemHealthStatus> {
    return getSystemHealth();
  }

  /**
   * 12. Run Deterministic Paper Rebalance
   */
  async runPaperRebalance(): Promise<{ success: boolean; message: string; actions: any[] }> {
    recordAuditEvent({
      category: 'PAPER_EXECUTION',
      action: 'PAPER_RUN',
      details: 'Monthly paper rebalance initiated via PersistentPaperPortfolio.',
      severity: 'INFO',
    });
    const result = await executePaperRebalanceInPython();
    if (result.success) {
      recordAuditEvent({
        category: 'PAPER_EXECUTION',
        action: 'PAPER_RUN',
        details: `Paper rebalance completed. Actions: ${result.actions.length}`,
        severity: 'SUCCESS',
      });
    }
    return result;
  }

  /**
   * Safety lock helper
   */
  isLiveAllowed(): boolean {
    return isLiveTradingAllowed();
  }

  assertLiveAllowed(context?: string): never {
    return assertLiveTradingAllowed(context);
  }
}

export const cockpitService = new CockpitService();
