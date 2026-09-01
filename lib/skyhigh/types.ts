/**
 * BREWRICH SKY HIGH - DATA TYPES & SCHEMAS (MILESTONE 4)
 * Isolated type definitions for Sky High market data ingestion, cloud storage,
 * and the Blue Sky Strategy Engine.
 */

export interface NormalizedRecord {
  symbol: string;
  date: string; // Normalized YYYY-MM-DD
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  series?: string;
}

export type ProcessingStage = 
  | 'idle'
  | 'uploading'
  | 'reading'
  | 'validating'
  | 'normalizing'
  | 'persisting'
  | 'verifying'
  | 'complete'
  | 'failed';

export interface ValidationReport {
  status: 'Valid' | 'Failed';
  tradingDate: string;
  totalRows: number;
  validRows: number;
  rejectedRows: number;
  duplicateRows: number;
  missingColumns?: string[];
  rejectionReasons?: string[];
}

export interface StoredTradingDay {
  date: string; // YYYY-MM-DD
  formattedDate: string;
  stockCount: number;
  rowCount: number;
  importedAt: string;
  fileName: string;
  isCloudPersisted?: boolean;
}

export interface DataHistoryStats {
  latestTradingDate: string;
  totalTradingDays: number;
  totalSecurities: number;
  totalRecords: number;
  lastImport: string;
  isCloudConnected: boolean;
}

export interface CloudVerificationResult {
  verified: boolean;
  tradingDate: string;
  expectedCount: number;
  cloudCount: number;
  sampleRetrieved: number;
  timestamp: string;
  error?: string;
}

// ==============================================================================
// MILESTONE 4: BLUE SKY STRATEGY ENGINE TYPES
// ==============================================================================

export type BlueSkyStatus = 'Qualified' | 'Watchlist' | 'No Signal' | 'Insufficient History';
export type BreakoutStatus = 'Breakout' | 'Near Breakout' | 'Below High';

export interface BlueSkyConfig {
  breakoutTolerancePercent: number; // e.g. 0.5% (close within 0.5% of high considered at breakout level)
  watchlistProximityPercent: number; // e.g. 3.0% (close within 3.0% considered near breakout)
  minVolume: number; // e.g. 10,000 shares
  minPrice: number; // e.g. ₹10.00
  allowedSeries: string[]; // e.g. ['EQ', 'BE', 'SM']
}

export interface SecurityHistoricalMetrics {
  symbol: string;
  series?: string;
  latestTradingDate: string;
  latestClose: number;
  latestOpen: number;
  latestHigh: number;
  latestLow: number;
  latestVolume: number;
  historicalHighestClose: number;
  historicalHighestHigh: number;
  distanceToHighPercent: number; // ((high - close) / high) * 100
  recentMomentumPercent: number | null; // null if only 1 day available
  intradayReturnPercent: number; // ((close - open) / open) * 100
  tradingDaysCount: number;
  breakoutStatus: BreakoutStatus;
  relativeStrengthPercentile: number | null; // 0 - 100 percentile rank vs universe
  status: BlueSkyStatus;
  reasons: string[];
}

export interface BlueSkySummary {
  tradingDate: string;
  totalUniverse: number;
  qualifiedCount: number;
  watchlistCount: number;
  noSignalCount: number;
  insufficientHistoryCount: number;
  isSingleDayDataset: boolean;
  totalHistoricalDays: number;
  calculatedAt: string;
}

export interface BlueSkyEngineResult {
  summary: BlueSkySummary;
  securities: SecurityHistoricalMetrics[];
  config: BlueSkyConfig;
}
