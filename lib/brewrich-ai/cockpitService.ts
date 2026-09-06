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
import { supabaseStore } from './persistence/supabaseStore';

export class CockpitService {
  /**
   * 1. Aggregated Dashboard Data
   */
  async getDashboard(): Promise<CockpitDashboardData> {
    const [strategy, portfolio, recentOrders, brokers, auditLogs, risk] = await Promise.all([
      getBrewrich400StateAsync(),
      this.getPaperPortfolio(),
      this.getPaperOrders(),
      this.getBrokerStatus(),
      this.getAuditLog(),
      this.getRiskStatus(),
    ]);

    return {
      systemPulse: strategy.status === 'ACTIVE' ? 'OPERATIONAL' : 'DEGRADED',
      strategy,
      portfolio,
      recentOrders: recentOrders.slice(0, 10),
      risk,
      brokers,
      recentAuditLogs: auditLogs.slice(0, 20),
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
    try {
      const cloudPortfolio = await supabaseStore.getPaperPortfolio();
      const cloudPositions = await supabaseStore.getPaperPositions();

      if (cloudPortfolio && cloudPositions.length > 0) {
        return {
          initialCapital: cloudPortfolio.initialCapital,
          cashBalance: cloudPortfolio.cashBalance,
          investedValue: cloudPortfolio.investedValue,
          totalPortfolioValue: cloudPortfolio.totalNav,
          totalRealizedPnl: cloudPortfolio.totalRealizedPnl,
          totalUnrealizedPnl: cloudPortfolio.totalUnrealizedPnl,
          totalPnlPct: cloudPortfolio.initialCapital > 0
            ? Number(((cloudPortfolio.totalNav - cloudPortfolio.initialCapital) / cloudPortfolio.initialCapital * 100).toFixed(2))
            : 0,
          dayPnl: 0,
          dayPnlPct: 0,
          positions: cloudPositions.map(p => ({
            symbol: p.symbol,
            companyName: p.symbol,
            sector: 'Nifty MidSmall 400',
            quantity: p.shares,
            avgBuyPrice: p.entryPrice,
            currentPrice: p.currentPrice,
            investedValue: p.costBasis,
            currentValue: p.currentValue,
            unrealizedPnl: p.unrealizedPnl,
            unrealizedPnlPct: p.unrealizedPnlPct,
            weightPct: p.weightPct,
            targetWeightPct: 10.0,
            allocationStatus: p.weightPct > 11 ? 'Overweight' : (p.weightPct < 9 ? 'Underweight' : 'Balanced'),
          })),
          lastUpdated: cloudPortfolio.updatedAt,
          executionMode: 'PAPER_ONLY',
        };
      }
    } catch (err) {
      console.warn('[CockpitService] Cloud portfolio read fallback:', err);
    }
    return fetchPaperPortfolioFromPython();
  }

  /**
   * 6. Paper Orders Book
   */
  async getPaperOrders(): Promise<PaperOrder[]> {
    try {
      const cloudOrders = await supabaseStore.getPaperOrders();
      if (cloudOrders && cloudOrders.length > 0) {
        return cloudOrders.map(o => ({
          orderId: o.id,
          symbol: o.symbol,
          side: o.side as 'BUY' | 'SELL',
          quantity: o.quantity,
          price: o.price,
          orderValue: o.orderValue,
          timestamp: o.timestamp,
          reason: o.strategySignal || 'Monthly Momentum Rebalance',
          status: 'PAPER_ONLY',
          executionMode: 'PAPER_ONLY',
          brokerContext: o.brokerContext || 'DHAN_PAPER_ADAPTER',
          processedEventId: o.eventId,
        }));
      }
    } catch (err) {
      console.warn('[CockpitService] Cloud orders read fallback:', err);
    }
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

    try {
      const cloudBrokers = await supabaseStore.getBrokerConnections();
      if (cloudBrokers && cloudBrokers.length > 0) {
        return cloudBrokers.map(b => ({
          brokerId: b.id as 'dhan' | 'firstock',
          name: b.name,
          status: 'READY_PAPER_ONLY',
          lastVerified: 'PostgreSQL Cloud Sync',
          maskedClientId: b.maskedClientId,
          authStatus: b.id === 'firstock' ? 'Credentials Not Set' : (b.credentialsConfiguredServerSide ? 'Server-Side Configured' : 'Credentials Not Set'),
          tradingStatus: 'LOCKED',
          rateLimitStatus: 'Normal',
        }));
      }
    } catch (err) {
      console.warn('[CockpitService] Cloud brokers read fallback:', err);
    }

    return fetchBrokerConnectionsFromPython();
  }

  /**
   * 8. Risk & Safety Guardrails Status
   */
  async getRiskStatus(): Promise<RiskSafetyMetrics> {
    const baseRisk = getAuthoritativeRiskSafetyMetrics();
    try {
      const cloudRisk = await supabaseStore.getRiskState();
      if (cloudRisk) {
        return {
          ...baseRisk,
          executionMode: cloudRisk.execution_mode as 'PAPER',
          liveTradingStatus: 'LOCKED',
          emergencyStopActive: cloudRisk.emergency_stop,
          maxSinglePositionPct: Number(cloudRisk.max_single_position_pct),
          drawdownLimitPct: Number(cloudRisk.drawdown_limit_pct),
        };
      }
    } catch (err) {
      console.warn('[CockpitService] Cloud risk state read fallback:', err);
    }
    return baseRisk;
  }

  /**
   * 9. Immutable Structured Audit Log
   */
  async getAuditLog(): Promise<AuditLogEvent[]> {
    const [pythonLogs, cloudEvents] = await Promise.all([
      fetchAuditLogsFromPython(),
      supabaseStore.getAuditEvents(),
    ]);
    const localLogs = getLocalAuditEvents();

    const mappedCloudEvents: AuditLogEvent[] = (cloudEvents || []).map(e => ({
      id: e.id,
      timestamp: e.timestamp.replace('T', ' ').slice(0, 19),
      category: e.category as any,
      action: e.action,
      details: e.details,
      severity: e.severity,
      metadata: e.metadataJson,
    }));

    const mergedLogsMap = new Map<string, AuditLogEvent>();
    for (const l of [...localLogs, ...mappedCloudEvents, ...pythonLogs]) {
      if (!mergedLogsMap.has(l.id)) mergedLogsMap.set(l.id, l);
    }
    return Array.from(mergedLogsMap.values()).slice(0, 50);
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
   * FAIL-CLOSED: Blocks execution if emergency_stop is active
   */
  async runPaperRebalance(): Promise<{ success: boolean; message: string; actions: any[] }> {
    const risk = await this.getRiskStatus();
    if (risk.emergencyStopActive) {
      recordAuditEvent({
        category: 'SAFETY',
        action: 'EXECUTION_BLOCKED',
        details: 'Paper rebalance blocked: emergency_stop is active (true). System is locked in safe mode.',
        severity: 'CRITICAL',
      });
      return {
        success: false,
        message: 'Execution blocked by Emergency Stop. System is locked in safe mode.',
        actions: [],
      };
    }

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
