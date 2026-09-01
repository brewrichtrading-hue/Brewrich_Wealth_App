/**
 * BREWRICH SKY HIGH - DATA TYPES & SCHEMAS (MILESTONE 2)
 * Isolated type definitions for Sky High market data ingestion, validation, and storage.
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
  | 'importing'
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
}

export interface DataHistoryStats {
  latestTradingDate: string;
  totalTradingDays: number;
  totalSecurities: number;
  totalRecords: number;
  lastImport: string;
}
