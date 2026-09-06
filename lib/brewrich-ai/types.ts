/**
 * BREWRICH AI — PERSONAL WEALTH COCKPIT
 * Core TypeScript Interfaces & Types
 * 
 * Proprietary to Brewrich Wealth.
 * Governs the Brewrich 400 Wealth Strategy Engine, Paper Execution Layer,
 * Broker Boundaries (Dhan & Firstock), and Cockpit UI Navigation.
 */

// ==============================================================================
// 1. COCKPIT NAVIGATION & AUTHENTICATION
// ==============================================================================

export type CockpitTab =
  | 'dashboard'
  | 'brewrich400'
  | 'backtest'
  | 'paper-trading'
  | 'portfolio'
  | 'orders'
  | 'risk'
  | 'brokers'
  | 'audit'
  | 'live-locked';

export interface BrewrichUserSession {
  isAuthenticated: boolean;
  email?: string;
  name?: string;
  role: 'owner' | 'guest';
  lastLogin?: string;
  twoFactorVerified: boolean;
}

// ==============================================================================
// 2. BREWRICH 400 STRATEGY ENGINE
// ==============================================================================

export interface UniverseStock {
  symbol: string;
  companyName: string;
  sector: string;
  marketCapCr: number;
  currentPrice: number;
  momentumScore: number;
  rsRank: number; // 1 to 99 percentile
  trendStatus: 'Bullish' | 'Neutral' | 'Bearish';
  volumeSurgeRatio: number;
  isEligible: boolean;
}

export interface TargetAllocation {
  symbol: string;
  companyName: string;
  sector: string;
  targetWeightPct: number;
  currentWeightPct: number;
  deviationPct: number;
  recommendedAction: 'HOLD' | 'BUY' | 'SELL' | 'REBALANCE';
  targetShares: number;
  currentShares: number;
  rebalanceDeltaShares: number;
  rebalanceDeltaValue: number;
}

export interface Brewrich400State {
  engineVersion: string;
  status: 'ACTIVE' | 'EVALUATING' | 'IDLE';
  lastEvaluationDate: string;
  nextScheduledEvaluation: string;
  universeSize: number;
  eligibleCount: number;
  targetPortfolioSize: number;
  topRanked: UniverseStock[];
  targetAllocations: TargetAllocation[];
  rebalanceFrequency: 'Weekly' | 'Monthly';
  healthScorePct: number;
}

// ==============================================================================
// 3. BACKTEST PERFORMANCE
// ==============================================================================

export interface BacktestSummaryMetrics {
  period: string;
  startingCapital: number;
  endingCapital: number;
  totalReturnPct: number;
  cagrPct: number;
  maxDrawdownPct: number;
  sharpeRatio: number;
  sortinoRatio: number;
  calmarRatio: number;
  winRatePct: number;
  profitFactor: number;
  totalTrades: number;
  avgHoldingDays: number;
  benchmarkCagrPct: number; // NIFTY 500
  alphaPct: number;
}

export interface EquityCurvePoint {
  date: string;
  portfolioValue: number;
  benchmarkValue: number;
  drawdownPct: number;
}

export interface YearlyReturn {
  year: number;
  strategyReturnPct: number;
  benchmarkReturnPct: number;
  alphaPct: number;
  maxDrawdownPct: number;
}

export interface BacktestDataset {
  datasetName?: string;
  startDate?: string;
  endDate?: string;
  totalTradingSessions?: number;
  benchmarkIndex?: string;
  summary: BacktestSummaryMetrics;
  equityCurve: EquityCurvePoint[];
  yearlyReturns: YearlyReturn[];
  monthlyReturns?: any[];
}

// ==============================================================================
// 4. PAPER TRADING & PERSISTENT PORTFOLIO
// ==============================================================================

export interface PaperPosition {
  symbol: string;
  companyName: string;
  sector: string;
  quantity: number;
  avgBuyPrice: number;
  currentPrice: number;
  investedValue: number;
  currentValue: number;
  unrealizedPnl: number;
  unrealizedPnlPct: number;
  weightPct: number;
  targetWeightPct: number;
  allocationStatus: 'Balanced' | 'Overweight' | 'Underweight';
}

export interface PaperPortfolioState {
  initialCapital: number;
  cashBalance: number;
  investedValue: number;
  totalPortfolioValue: number;
  totalRealizedPnl: number;
  totalUnrealizedPnl: number;
  totalPnlPct: number;
  dayPnl: number;
  dayPnlPct: number;
  positions: PaperPosition[];
  lastUpdated: string;
  executionMode: 'PAPER' | 'PAPER_ONLY';
}

export interface PaperOrder {
  orderId: string;
  symbol: string;
  side: 'BUY' | 'SELL';
  quantity: number;
  price: number;
  orderValue: number;
  timestamp: string;
  reason: string;
  status: 'FILLED' | 'CANCELLED' | 'REJECTED' | 'PAPER_ONLY' | 'EXECUTED';
  executionMode: 'PAPER' | 'PAPER_ONLY';
  brokerContext: string;
  processedEventId: string;
}

// ==============================================================================
// 5. RISK & SAFETY CONTROLS
// ==============================================================================

export interface RiskSafetyMetrics {
  executionMode: 'PAPER';
  liveTradingStatus: 'LOCKED';
  emergencyStopActive: boolean;
  safetyGatePassed: boolean;
  portfolioExposurePct: number;
  cashReservePct: number;
  maxSinglePositionPct: number;
  currentMaxDrawdownPct: number;
  drawdownLimitPct: number;
  lastSuccessfulStrategyRun: string;
  lastSuccessfulPaperExecution: string;
  activeErrorCount: number;
  systemHealth: 'OPTIMAL' | 'WARNING' | 'CRITICAL';
}

// ==============================================================================
// 6. BROKER INTEGRATIONS (DHAN & FIRSTOCK)
// ==============================================================================

export interface BrokerConnectionInfo {
  brokerId: 'dhan' | 'firstock';
  name: string;
  status: 'Connected' | 'Ready' | 'Disconnected' | 'Ready (Paper Only)' | 'READY_PAPER_ONLY';
  lastVerified: string;
  maskedClientId: string;
  authStatus: 'Active Session' | 'API Key Ready' | 'Expired' | 'Server-Side Isolated' | 'Server-Side Configured' | 'Credentials Not Set';
  tradingStatus: 'LOCKED' | 'READ_ONLY';
  rateLimitStatus: 'Normal' | 'Throttled';
}

// ==============================================================================
// 7. AUDIT LOG EVENT
// ==============================================================================

export interface AuditLogEvent {
  id: string;
  timestamp: string;
  category: 'AUTH' | 'STRATEGY' | 'PAPER_EXECUTION' | 'PORTFOLIO' | 'BROKER' | 'SAFETY' | 'SYSTEM';
  action: string;
  details: string;
  severity: 'INFO' | 'SUCCESS' | 'WARNING' | 'CRITICAL';
}

// ==============================================================================
// 8. COCKPIT DASHBOARD AGGREGATE
// ==============================================================================

export interface CockpitDashboardData {
  systemPulse: 'OPERATIONAL' | 'DEGRADED' | 'OFFLINE';
  strategy: Brewrich400State;
  portfolio: PaperPortfolioState;
  recentOrders: PaperOrder[];
  risk: RiskSafetyMetrics;
  brokers: BrokerConnectionInfo[];
  recentAuditLogs: AuditLogEvent[];
  liveStatus: {
    isLocked: boolean;
    reason: string;
  };
}
