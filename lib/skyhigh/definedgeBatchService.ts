/**
 * BREWRICH SKY HIGH - DEFINEDGE UNIVERSE BATCH HISTORICAL INGESTION (PHASE 4C)
 * 
 * Scalable market-wide historical ingestion:
 * - Supports benchmark universe presets (Nifty 50, Nifty 100, Active EQ, custom)
 * - Resolves symbols -> tokens dynamically via Definedge Master
 * - Batched, rate-limit friendly execution with progress reporting
 * - Per-security error isolation (failures do not halt the entire job)
 * - Safe server-side credential isolation (HttpOnly / server memory)
 * - Cumulative Supabase persistence with deduplication
 */

import { getDefinedgeMaster, DefinedgeSecurity } from './definedgeMaster';
import { ingestDefinedgeHistoricalData, DefinedgeIngestionResult } from './definedgeService';

export type UniversePreset = 'NIFTY_50' | 'NIFTY_100' | 'ACTIVE_EQ' | 'CUSTOM';

export const NIFTY_50_SYMBOLS = [
  'RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'ICICIBANK',
  'BHARTIARTL', 'ITC', 'SBIN', 'LICI', 'HINDUNILVR',
  'LT', 'BAJFINANCE', 'HCLTECH', 'MARUTI', 'SUNPHARMA',
  'ADANIENT', 'TATAMOTORS', 'KOTAKBANK', 'ONGC', 'NTPC',
  'AXISBANK', 'TITAN', 'POWERGRID', 'ADANIPORTS', 'COALINDIA',
  'TATASTEEL', 'ULTRACEMCO', 'BAJAJFINSV', 'M&M', 'ASIANPAINT',
  'SIEMENS', 'IOC', 'DLF', 'BEL', 'VBL',
  'HAL', 'ZOMATO', 'TRENT', 'PIDILITIND', 'GRASIM',
  'JSWSTEEL', 'TECHM', 'INDUSINDBK', 'CIPLA', 'NESTLEIND',
  'SHREECEM', 'DRREDDY', 'EICHERMOT', 'BPCL', 'HEROMOTOCO'
];

export const NIFTY_NEXT_50_SYMBOLS = [
  'ABB', 'ADANIGREEN', 'ADANIPOWER', 'AMBUJACEM', 'APOLLOHOSP',
  'BAJAJHLDNG', 'BANKBARODA', 'BERGEPAINT', 'BOSCHLTD', 'CANBK',
  'CHOLAFIN', 'COLPAL', 'CONCOR', 'DABUR', 'DIVISLAB',
  'GAIL', 'GODREJCP', 'HAVELLS', 'HDFCLIFE', 'ICICIGI',
  'ICICIPRULI', 'INDIGO', 'INDUSTOWER', 'IRCTC', 'JINDALSTEL',
  'JSWENERGY', 'LTIM', 'LUPIN', 'MARICO', 'MAXHEALTH',
  'MOTHERSON', 'NAUKRI', 'NHPC', 'PAGEIND', 'PFC',
  'PNB', 'POLYCAB', 'RECLTD', 'SBICARD', 'SBILIFE',
  'SRF', 'TATACONSUM', 'TATAPOWER', 'TVSMOTOR', 'UNITDSPR',
  'VEDL', 'VOLTAS', 'WIPRO', 'YESBANK', 'ZYDUSLIFE'
];

export const NIFTY_100_SYMBOLS = [...NIFTY_50_SYMBOLS, ...NIFTY_NEXT_50_SYMBOLS];

export interface BatchIngestionProgress {
  currentIndex: number;
  totalSecurities: number;
  currentSymbol: string;
  percentComplete: number;
  lastResult?: DefinedgeIngestionResult;
  lastError?: string;
}

export interface SecurityBatchResult {
  symbol: string;
  token: string;
  success: boolean;
  rowsReceived: number;
  rowsInserted: number;
  duplicatesSkipped: number;
  rowsRejected: number;
  error?: string;
}

export interface BatchIngestionReport {
  universePreset: UniversePreset;
  fromDate: string;
  toDate: string;
  totalSecurities: number;
  processedSecurities: number;
  succeededSecurities: number;
  failedSecurities: number;
  totalRowsReceived: number;
  totalRowsInserted: number;
  totalDuplicatesSkipped: number;
  totalRowsRejected: number;
  startedAt: string;
  completedAt: string;
  results: SecurityBatchResult[];
}

export interface BatchIngestionOptions {
  universePreset?: UniversePreset;
  customSymbols?: string[];
  fromDate: string;
  toDate: string;
  sessionKey?: string;
  delayMsBetweenRequests?: number;
  onProgress?: (progress: BatchIngestionProgress) => void;
}

/**
 * Resolves list of securities to ingest based on chosen preset or custom list.
 */
export async function resolveUniverseSecurities(
  preset: UniversePreset,
  customSymbols?: string[]
): Promise<DefinedgeSecurity[]> {
  const master = await getDefinedgeMaster();

  if (preset === 'NIFTY_50') {
    return NIFTY_50_SYMBOLS
      .map(sym => master.bySymbol.get(sym))
      .filter((s): s is DefinedgeSecurity => s !== undefined);
  }

  if (preset === 'NIFTY_100') {
    return NIFTY_100_SYMBOLS
      .map(sym => master.bySymbol.get(sym))
      .filter((s): s is DefinedgeSecurity => s !== undefined);
  }

  if (preset === 'CUSTOM' && customSymbols && customSymbols.length > 0) {
    return customSymbols
      .map(sym => master.bySymbol.get(sym.trim().toUpperCase()))
      .filter((s): s is DefinedgeSecurity => s !== undefined);
  }

  if (preset === 'ACTIVE_EQ') {
    // All NSE cash primary equity instruments (EQ series)
    return master.allSecurities.filter(s => s.series === 'EQ');
  }

  // Default fallback to Nifty 50
  return NIFTY_50_SYMBOLS
    .map(sym => master.bySymbol.get(sym))
    .filter((s): s is DefinedgeSecurity => s !== undefined);
}

/**
 * Executes market-wide batch historical data ingestion across selected universe.
 */
export async function executeMarketWideHistoricalIngestion(
  options: BatchIngestionOptions
): Promise<BatchIngestionReport> {
  const {
    universePreset = 'NIFTY_50',
    customSymbols,
    fromDate,
    toDate,
    sessionKey,
    delayMsBetweenRequests = 250,
    onProgress
  } = options;

  const startedAt = new Date().toISOString();
  const securities = await resolveUniverseSecurities(universePreset, customSymbols);
  const total = securities.length;

  const results: SecurityBatchResult[] = [];
  let totalRowsReceived = 0;
  let totalRowsInserted = 0;
  let totalDuplicatesSkipped = 0;
  let totalRowsRejected = 0;
  let succeededCount = 0;
  let failedCount = 0;

  for (let i = 0; i < total; i++) {
    const sec = securities[i];

    if (onProgress) {
      onProgress({
        currentIndex: i + 1,
        totalSecurities: total,
        currentSymbol: sec.symbol,
        percentComplete: Math.round(((i + 1) / total) * 100),
      });
    }

    try {
      const res = await ingestDefinedgeHistoricalData({
        symbol: sec.symbol,
        token: sec.token,
        fromDate,
        toDate,
        sessionKey,
      });

      totalRowsReceived += res.recordsReceived;
      totalRowsInserted += res.recordsInserted;
      totalDuplicatesSkipped += res.recordsSkipped;
      totalRowsRejected += res.recordsRejected;
      succeededCount++;

      results.push({
        symbol: sec.symbol,
        token: sec.token,
        success: true,
        rowsReceived: res.recordsReceived,
        rowsInserted: res.recordsInserted,
        duplicatesSkipped: res.recordsSkipped,
        rowsRejected: res.recordsRejected,
      });

      if (onProgress) {
        onProgress({
          currentIndex: i + 1,
          totalSecurities: total,
          currentSymbol: sec.symbol,
          percentComplete: Math.round(((i + 1) / total) * 100),
          lastResult: res,
        });
      }
    } catch (err: any) {
      failedCount++;
      const errMsg = err?.message || 'Ingestion failed';
      console.warn(`⚠️ [BATCH INGESTION] Error on ${sec.symbol} (${sec.token}):`, errMsg);

      results.push({
        symbol: sec.symbol,
        token: sec.token,
        success: false,
        rowsReceived: 0,
        rowsInserted: 0,
        duplicatesSkipped: 0,
        rowsRejected: 0,
        error: errMsg,
      });

      if (onProgress) {
        onProgress({
          currentIndex: i + 1,
          totalSecurities: total,
          currentSymbol: sec.symbol,
          percentComplete: Math.round(((i + 1) / total) * 100),
          lastError: errMsg,
        });
      }
    }

    // Rate-limit friendly pacing
    if (i < total - 1 && delayMsBetweenRequests > 0) {
      await new Promise(resolve => setTimeout(resolve, delayMsBetweenRequests));
    }
  }

  const completedAt = new Date().toISOString();

  return {
    universePreset,
    fromDate,
    toDate,
    totalSecurities: total,
    processedSecurities: total,
    succeededSecurities: succeededCount,
    failedSecurities: failedCount,
    totalRowsReceived,
    totalRowsInserted,
    totalDuplicatesSkipped,
    totalRowsRejected,
    startedAt,
    completedAt,
    results,
  };
}
