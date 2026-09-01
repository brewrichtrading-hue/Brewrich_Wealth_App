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

