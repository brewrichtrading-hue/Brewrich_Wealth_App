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
// MILESTONE 4: APPROVED BANANAPATTERNS BLUE SKY STRATEGY TYPES
// ==============================================================================

export type BlueSkyStatus = 
  | 'BLUE SKY BREAKOUT' 
  | 'BLUE SKY CANDIDATE' 
  | 'NOT QUALIFIED' 
  | 'INSUFFICIENT HISTORY';

export type BreakoutStatus = 
  | 'Breakout'          // Current Close > Pivot
  | 'Within 20% Pivot'  // distanceToPivot <= 20% and Close <= Pivot
  | 'Below Pivot (>20%)'; // distanceToPivot > 20%

export type BaseStatus = 'UNRESOLVED (Conceptual Requirement)';

export interface BlueSkyConfig {
  proximityThresholdPercent: number;    // approved 20.0%
  minRelativeStrength: number;          // approved 70 (RS 70-99)
  minMarketCapCrores: number;           // approved ₹500 Cr
  minAvgDailyTradedValueCrores: number; // approved ₹5 Cr daily traded value
  minTradingSessionsForRS: number;      // approved 252 trading sessions
  allowedSeries: string[];              // ['EQ', 'BE', 'SM']
}

export interface SecurityHistoricalMetrics {
  symbol: string;
  company?: string;
  series?: string;
  evaluationDate: string;
  latestClose: number;
  latestOpen: number;
  latestHigh: number;
  latestLow: number;
  latestVolume: number;
  
  // ATH & Pivot (Pivot is the Historical ATH itself)
  allTimeHigh: number;                  // Maximum high observed in complete available history up to evaluationDate
  pivot: number;                        // Historical All-Time High itself
  distanceToPivotPercent: number;       // ((pivot - latestClose) / pivot) * 100 for close <= pivot, 0 if close > pivot
  
  // Relative Strength Ranking (1-99 from 252-session Trailing Return)
  trailingReturn252: number | null;     // (CurrentPrice / Price252SessionsAgo) - 1
  relativeStrengthScore: number | null; // 1 to 99 integer percentile rank across universe
  
  // Eligible Universe / Liquidity
  marketCapCrores: number | null;       // null / DATA UNAVAILABLE if not present in dataset
  avgDailyTradedValueCrores: number;    // Average daily traded turnover (Close * Volume) in ₹ Crores
  totalSessionsAvailable: number;       // Count of historical trading sessions available up to evaluationDate
  
  // Statuses
  baseStatus: BaseStatus;               // Explicitly exposed as UNRESOLVED
  breakoutStatus: BreakoutStatus;
  status: BlueSkyStatus;
  
  // Explainability & Gate Details
  reasons: string[];
  eligibility: {
    marketCapPass: boolean | 'UNAVAILABLE';
    liquidityPass: boolean;
    historyLengthPass: boolean;
    rsPass: boolean;
    proximityPass: boolean;
    breakoutPass: boolean;
  };
}

export interface BlueSkySummary {
  tradingDate: string;
  totalUniverse: number;
  breakoutCount: number;
  candidateCount: number;
  notQualifiedCount: number;
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
