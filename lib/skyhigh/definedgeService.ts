/**
 * BREWRICH SKY HIGH - DEFINEDGE HISTORICAL DATA SERVICE (PHASE 4)
 * 
 * Fetches, normalizes, deduplicates, and persists authentic NSE daily historical OHLCV
 * records from Definedge Securities API (https://data.definedgesecurities.com) into
 * public.skyhigh_market_data in Supabase.
 * 
 * Strictly isolated: Zero mock data, server-side credential isolation, preserves manual Bhavcopy data.
 */

import https from 'https';
import { createClient } from '@/lib/supabase/client';
import { lookupDefinedgeSymbol, lookupDefinedgeToken, DefinedgeSecurity } from './definedgeMaster';

export interface DefinedgeHistoricalRequest {
  symbol?: string;
  token?: string;
  fromDate: string; // YYYY-MM-DD
  toDate: string;   // YYYY-MM-DD
  sessionKey?: string;
}

export interface DefinedgeNormalizedBar {
  id: string; // `${trading_date}_${symbol}`
  symbol: string;
  trading_date: string; // YYYY-MM-DD
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  series: string;
  source_file: string; // 'Definedge Historical'
}

export interface DefinedgeIngestionResult {
  success: boolean;
  symbol: string;
  token: string;
  tradingsym: string;
  series: string;
  company: string;
  fromDate: string;
  toDate: string;
  fromFormatted: string;
  toFormatted: string;
  recordsReceived: number;
  recordsInserted: number;
  recordsSkipped: number;
  recordsRejected: number;
  source: string;
  cloudVerification: {
    verified: boolean;
    persistedTotalForSymbol: number;
    sampleDate?: string;
    sampleClose?: number;
  };
  error?: string;
  barsPreview?: Array<{
    trading_date: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
  }>;
}

/**
 * Converts ISO YYYY-MM-DD to Definedge's ddMMyyyyHHmm format.
 */
function toDefinedgeDateString(isoDate: string, isEndOfDay = false): string {
  // e.g. "2024-01-15" -> "150120240000" or "150120241530"
  const parts = isoDate.split('-');
  if (parts.length !== 3) {
    throw new Error(`Invalid date format: ${isoDate}. Expected YYYY-MM-DD.`);
  }
  const [year, month, day] = parts;
  const time = isEndOfDay ? '1530' : '0000';
  return `${day}${month}${year}${time}`;
}

/**
 * Parses Definedge date string into normalized YYYY-MM-DD.
 */
function parseDefinedgeDate(dateStr: string): string | null {
  if (!dateStr) return null;
  const clean = dateStr.trim().split(' ')[0]; // Strip time component if present

  // 1. YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(clean)) {
    return clean;
  }
  // 2. DD-MM-YYYY
  if (/^\d{2}-\d{2}-\d{4}$/.test(clean)) {
    const [d, m, y] = clean.split('-');
    return `${y}-${m}-${d}`;
  }
  // 3. DD/MM/YYYY
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(clean)) {
    const [d, m, y] = clean.split('/');
    return `${y}-${m}-${d}`;
  }
  // 4. DDMMYYYY
  if (/^\d{8}$/.test(clean)) {
    const d = clean.slice(0, 2);
    const m = clean.slice(2, 4);
    const y = clean.slice(4, 8);
    return `${y}-${m}-${d}`;
  }
  return null;
}

/**
 * Executes an authenticated HTTPS GET request to Definedge Historical Data API.
 */
function fetchDefinedgeHistoricalCsv(
  segment: string,
  token: string,
  timeframe: string,
  fromStr: string,
  toStr: string,
  apiKey: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    const path = `/sds/history/${encodeURIComponent(segment)}/${encodeURIComponent(token)}/${encodeURIComponent(timeframe)}/${encodeURIComponent(fromStr)}/${encodeURIComponent(toStr)}`;
    
    const options: https.RequestOptions = {
      hostname: 'data.definedgesecurities.com',
      port: 443,
      path,
      method: 'GET',
      headers: {
        'Authorization': apiKey,
        'Accept': 'text/csv, text/plain, */*',
        'User-Agent': 'BrewrichSkyHigh/1.0',
      },
      timeout: 20000,
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode === 401) {
          return reject(new Error('Definedge Authentication Failed: Invalid or expired API session key (HTTP 401).'));
        }
        if (res.statusCode === 400) {
          return reject(new Error(`Definedge API Error: Bad Request (HTTP 400). Please check token (${token}) or date range.`));
        }
        if (res.statusCode === 404) {
          return reject(new Error(`Definedge API Error: Endpoint or Token not found (HTTP 404).`));
        }
        if (res.statusCode && res.statusCode >= 500) {
          return reject(new Error(`Definedge Server Error: HTTP ${res.statusCode}. Definedge historical servers are currently unavailable.`));
        }
        if (res.statusCode && res.statusCode >= 300) {
          return reject(new Error(`Definedge Error: HTTP ${res.statusCode} - ${data.slice(0, 200)}`));
        }

        resolve(data);
      });
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Definedge Historical Data API request timed out (20s).'));
    });

    req.on('error', (err) => {
      reject(new Error(`Definedge Connection Error: ${err.message}`));
    });

    req.end();
  });
}

/**
 * Main Historical Ingestion Pipeline:
 * Resolves token, fetches historical daily OHLCV from Definedge, normalizes records,
 * skips duplicates, chunk-persists into Supabase, and performs cloud verification.
 */
export async function ingestDefinedgeHistoricalData(
  params: DefinedgeHistoricalRequest
): Promise<DefinedgeIngestionResult> {
  const { symbol: rawSymbol, token: rawToken, fromDate, toDate, sessionKey: providedKey } = params;

  // 1. Validate Session Key (Server-side environment or provided session key)
  const apiKey = providedKey?.trim() || process.env.DEFINEDGE_API_SESSION_KEY?.trim();
  if (!apiKey) {
    throw new Error(
      'Authentication Error: Definedge API Session Key is required. Please set DEFINEDGE_API_SESSION_KEY in your server environment or provide an active session key.'
    );
  }

  // 2. Validate Dates
  if (!fromDate || !toDate) {
    throw new Error('Invalid Parameters: Both "fromDate" and "toDate" (YYYY-MM-DD) are required.');
  }
  if (fromDate > toDate) {
    throw new Error(`Invalid Date Range: "fromDate" (${fromDate}) cannot be after "toDate" (${toDate}).`);
  }

  // 3. Resolve Security Metadata via Master File
  let security: DefinedgeSecurity | null = null;
  if (rawSymbol) {
    security = await lookupDefinedgeSymbol(rawSymbol);
  } else if (rawToken) {
    security = await lookupDefinedgeToken(rawToken);
  }

  if (!security) {
    const identifier = rawSymbol || rawToken || 'Unknown';
    throw new Error(`Symbol Not Found: "${identifier}" was not found in Definedge NSE Cash master file.`);
  }

  const { symbol, token, tradingsym, series, company, segment } = security;

  // 4. Format Dates for Definedge API
  const fromStr = toDefinedgeDateString(fromDate, false);
  const toStr = toDefinedgeDateString(toDate, true);

  // 5. Fetch Historical Data from Definedge
  const csvData = await fetchDefinedgeHistoricalCsv(segment, token, 'day', fromStr, toStr, apiKey);

  if (!csvData || !csvData.trim()) {
    return {
      success: true,
      symbol,
      token,
      tradingsym,
      series,
      company,
      fromDate,
      toDate,
      fromFormatted: fromDate,
      toFormatted: toDate,
      recordsReceived: 0,
      recordsInserted: 0,
      recordsSkipped: 0,
      recordsRejected: 0,
      source: 'Definedge Historical',
      cloudVerification: {
        verified: true,
        persistedTotalForSymbol: 0,
      },
      barsPreview: [],
    };
  }

  // 6. Parse and Normalize CSV Rows
  // Definedge Day format: Dateandtime, Open Price, High Price, Low Price, Close, Volume, Open Interest
  const lines = csvData.split('\n');
  const validBars: DefinedgeNormalizedBar[] = [];
  let recordsRejected = 0;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    const parts = trimmed.split(',');
    if (parts.length < 5) {
      recordsRejected++;
      continue;
    }

    const rawDate = parts[0]?.trim();
    const trading_date = parseDefinedgeDate(rawDate);
    const open = parseFloat(parts[1]?.trim());
    const high = parseFloat(parts[2]?.trim());
    const low = parseFloat(parts[3]?.trim());
    const close = parseFloat(parts[4]?.trim());
    const volume = parts[5] ? parseInt(parts[5].trim(), 10) : 0;

    if (!trading_date || isNaN(open) || isNaN(high) || isNaN(low) || isNaN(close)) {
      recordsRejected++;
      continue;
    }

    validBars.push({
      id: `${trading_date}_${symbol}`,
      symbol,
      trading_date,
      open,
      high,
      low,
      close,
      volume: isNaN(volume) ? 0 : volume,
      series: series || 'EQ',
      source_file: 'Definedge Historical',
    });
  }

  const recordsReceived = validBars.length;
  if (recordsReceived === 0) {
    return {
      success: true,
      symbol,
      token,
      tradingsym,
      series,
      company,
      fromDate,
      toDate,
      fromFormatted: fromDate,
      toFormatted: toDate,
      recordsReceived: 0,
      recordsInserted: 0,
      recordsSkipped: 0,
      recordsRejected,
      source: 'Definedge Historical',
      cloudVerification: {
        verified: true,
        persistedTotalForSymbol: 0,
      },
      barsPreview: [],
    };
  }

  // 7. Check for Existing Records in Supabase (Deduplication)
  const supabase = createClient();
  const tradingDates = validBars.map(b => b.trading_date);

  // Query existing dates for this symbol
  const { data: existingRows, error: fetchErr } = await supabase
    .from('skyhigh_market_data')
    .select('trading_date')
    .eq('symbol', symbol)
    .in('trading_date', tradingDates);

  if (fetchErr) {
    console.warn('⚠️ [DEFINEDGE DEDUP WARNING]:', fetchErr.message);
  }

  const existingDateSet = new Set((existingRows || []).map(r => r.trading_date));
  const newBarsToInsert = validBars.filter(b => !existingDateSet.has(b.trading_date));
  const recordsSkipped = validBars.length - newBarsToInsert.length;

  // 8. Chunked Batch Persistence into Supabase
  let recordsInserted = 0;
  const CHUNK_SIZE = 500;

  for (let i = 0; i < newBarsToInsert.length; i += CHUNK_SIZE) {
    const chunk = newBarsToInsert.slice(i, i + CHUNK_SIZE);
    const { error: insertErr } = await supabase
      .from('skyhigh_market_data')
      .upsert(chunk, { onConflict: 'symbol,trading_date' });

    if (insertErr) {
      console.error('❌ [DEFINEDGE UPSERT ERROR]:', insertErr);
      throw new Error(`Failed to persist Definedge records to Supabase: ${insertErr.message}`);
    }

    recordsInserted += chunk.length;
  }

  // 9. Register/Update Distinct Trading Days in skyhigh_trading_days
  try {
    const distinctDates = Array.from(new Set(validBars.map(b => b.trading_date)));
    const { data: existingDays } = await supabase
      .from('skyhigh_trading_days')
      .select('trading_date')
      .in('trading_date', distinctDates);

    const existingDaysSet = new Set((existingDays || []).map(d => d.trading_date));
    const newDays = distinctDates.filter(d => !existingDaysSet.has(d));

    if (newDays.length > 0) {
      const dayInserts = newDays.map(d => ({
        trading_date: d,
        formatted_date: d,
        stock_count: 1,
        row_count: 1,
        source_file: 'Definedge Historical',
        imported_at: new Date().toISOString(),
      }));

      await supabase
        .from('skyhigh_trading_days')
        .upsert(dayInserts, { onConflict: 'trading_date' });
    }
  } catch (dayErr) {
    console.warn('⚠️ [DEFINEDGE TRADING DAYS LOG WARNING]:', dayErr);
  }

  // 10. Multi-tier Cloud Verification
  const { count: totalSymbolCount, error: countErr } = await supabase
    .from('skyhigh_market_data')
    .select('*', { count: 'exact', head: true })
    .eq('symbol', symbol);

  const { data: sampleRow } = await supabase
    .from('skyhigh_market_data')
    .select('trading_date, close')
    .eq('symbol', symbol)
    .order('trading_date', { ascending: false })
    .limit(1);

  const verified = !countErr && typeof totalSymbolCount === 'number' && totalSymbolCount >= recordsInserted;

  // Prepare recent bars preview
  const barsPreview = validBars.slice(-10).map(b => ({
    trading_date: b.trading_date,
    open: b.open,
    high: b.high,
    low: b.low,
    close: b.close,
    volume: b.volume,
  }));

  return {
    success: true,
    symbol,
    token,
    tradingsym,
    series,
    company,
    fromDate,
    toDate,
    fromFormatted: fromDate,
    toFormatted: toDate,
    recordsReceived,
    recordsInserted,
    recordsSkipped,
    recordsRejected,
    source: 'Definedge Historical',
    cloudVerification: {
      verified,
      persistedTotalForSymbol: totalSymbolCount || recordsInserted,
      sampleDate: sampleRow?.[0]?.trading_date,
      sampleClose: sampleRow?.[0]?.close,
    },
    barsPreview,
  };
}
