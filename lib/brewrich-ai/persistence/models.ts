/**
 * BREWRICH AI — DATABASE & PERSISTENCE MODELS
 * 
 * Boundary & Integrity Rules:
 * 1. Defines the canonical persistence schemas for the single-user personal cockpit.
 * 2. 100% compatible with existing `data/paper_state.json` (canonical baseline).
 * 3. Zero destructive migrations or table drops.
 */

export interface UserRecord {
  id: string; // UUID
  email: string;
  role: 'owner' | 'guest';
  passwordHash: string;
  twoFactorSecretEncrypted?: string;
  createdAt: string;
  lastLoginAt: string;
}

export interface SessionRecord {
  id: string;
  userId: string;
  tokenHash: string;
  ipAddress?: string;
  userAgent?: string;
  expiresAt: string;
  createdAt: string;
  isRevoked: boolean;
}

export interface BrokerConnectionRecord {
  id: string; // 'dhan' | 'firstock'
  name: string;
  environment: 'PAPER_SIMULATION' | 'LIVE_LOCKED';
  maskedClientId: string;
  credentialsConfiguredServerSide: boolean;
  tradingStatus: 'LOCKED';
  updatedAt: string;
}

export interface PaperPortfolioRecord {
  id: string; // 'canonical_paper_portfolio'
  initialCapital: number;
  cashBalance: number;
  investedValue: number;
  totalNav: number;
  totalRealizedPnl: number;
  totalUnrealizedPnl: number;
  rebalanceCount: number;
  lastRebalanceDate: string;
  updatedAt: string;
}

export interface PaperPositionRecord {
  id: string;
  portfolioId: string;
  symbol: string;
  shares: number;
  entryPrice: number;
  currentPrice: number;
  costBasis: number;
  currentValue: number;
  unrealizedPnl: number;
  unrealizedPnlPct: number;
  weightPct: number;
  updatedAt: string;
}

export interface PaperOrderRecord {
  id: string; // 'ORD_BUY_...'
  portfolioId: string;
  symbol: string;
  side: 'BUY' | 'SELL';
  quantity: number;
  price: number;
  orderValue: number;
  status: 'FILLED' | 'CANCELLED' | 'REJECTED';
  executionMode: 'PAPER_ONLY';
  strategySignal: string;
  brokerContext: string;
  eventId: string; // Unique rebalance event ID preventing duplicates
  timestamp: string;
}

export interface StrategyRunRecord {
  id: string;
  strategyCode: 'BREWRICH_400';
  asOfDate: string;
  universeSize: number;
  eligibleCandidateCount: number;
  topRankedSymbols: string[];
  allocationsJson: Record<string, number>;
  executedAt: string;
}

export interface BacktestRunRecord {
  id: string;
  strategyCode: 'BREWRICH_400';
  period: string;
  startDate: string;
  endDate: string;
  initialCapital: number;
  finalEquity: number;
  cagrPct: number;
  maxDrawdownPct: number;
  sharpeRatio: number;
  totalTrades: number;
  winRatePct: number;
  metricsJson: Record<string, any>;
  createdAt: string;
}

export interface AuditEventRecord {
  id: string; // 'AUD-...'
  timestamp: string;
  category: string;
  action: string;
  details: string;
  severity: 'INFO' | 'SUCCESS' | 'WARNING' | 'CRITICAL';
  metadataJson?: Record<string, any>;
}

export interface SystemHealthRecord {
  id: string;
  timestamp: string;
  overallStatus: 'HEALTHY' | 'DEGRADED' | 'DOWN';
  pythonEngineStatus: 'UP' | 'DOWN';
  paperPortfolioStatus: 'PERSISTED';
  dhanStatus: 'READY_PAPER_ONLY';
  firstockStatus: 'READY_PAPER_ONLY';
  liveTradingLocked: true;
}

/**
 * Direct Schema Mapping for `data/paper_state.json`
 */
export interface CanonicalPaperStateJson {
  portfolio_id: string;
  initial_capital: number;
  cash_balance: number;
  invested_value: number;
  total_nav: number;
  total_pnl: number;
  total_pnl_pct: number;
  rebalance_count: number;
  last_rebalance_date: string;
  positions: Array<{
    symbol: string;
    shares: number;
    entry_price: number;
    current_price: number;
    cost_basis: number;
    current_value: number;
    unrealized_pnl: number;
    unrealized_pnl_pct: number;
    weight_pct: number;
  }>;
  orders: Array<{
    order_id: string;
    symbol: string;
    side: 'BUY' | 'SELL';
    quantity: number;
    price: number;
    value: number;
    timestamp: string;
    strategy_signal: string;
    status: 'FILLED';
    event_id: string;
  }>;
  processed_event_ids: string[];
}
