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
import { getActiveServerSessionKey } from './definedgeAuth';
import { formatDisplayDate } from './normalizer';

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
  diagnostic?: {
    statusCode: number;
    contentType: string;
    responseFormat: string;
    itemCount: number;
    topLevelKeys?: string[];
    rawSnippet: string;
    sampleFirstRecord?: any;
    sampleFieldTypes?: Record<string, string>;
    rejectionReasons: string[];
  };
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
 * Handles:
 * - 12-digit Definedge API timestamp: ddMMyyyyHHmm (e.g. "010820260000", "310820261530")
 * - 14-digit timestamp: ddMMyyyyHHmmss or yyyyMMddHHmmss
 * - 8-digit timestamp: ddMMyyyy (e.g. "01082026") or yyyyMMdd (e.g. "20260801")
 * - Standard Indian format: DD-MM-YYYY or DD/MM/YYYY (with or without time)
 * - ISO format: YYYY-MM-DD (with or without time or "T")
 * - Text month format: DD-MMM-YYYY (e.g. "01-AUG-2026", "01-Aug-2026")
 * - Epoch timestamp: 10 digits (seconds) or 13 digits (milliseconds)
 * - Header rejection: returns null for "Date and time", "Date", "TIMESTAMP", etc.
 */
export function parseDefinedgeDate(dateStr: string): string | null {
  if (!dateStr) return null;
  const clean = dateStr.replace(/["']/g, '').trim();

  // If header text or alphabetical labels, reject as non-date
  if (/^[a-zA-Z_\s]+$/.test(clean)) {
    return null;
  }

  // 1. ISO format: YYYY-MM-DD (e.g. 2026-08-01, 2026-08-01T09:15:00, 2026-08-01 15:30:00)
  const isoMatch = clean.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (isoMatch) {
    return `${isoMatch[1]}-${isoMatch[2]}-${isoMatch[3]}`;
  }

  // 2. Standard Indian hyphen format: DD-MM-YYYY (e.g. 01-08-2026, 01-08-2026 15:30:00)
  const dmyHyphen = clean.match(/^(\d{2})-(\d{2})-(\d{4})/);
  if (dmyHyphen) {
    return `${dmyHyphen[3]}-${dmyHyphen[2]}-${dmyHyphen[1]}`;
  }

  // 3. Standard Indian slash format: DD/MM/YYYY (e.g. 01/08/2026, 01/08/2026 15:30:00)
  const dmySlash = clean.match(/^(\d{2})\/(\d{2})\/(\d{4})/);
  if (dmySlash) {
    return `${dmySlash[3]}-${dmySlash[2]}-${dmySlash[1]}`;
  }

  // 4. Text month format: DD-MMM-YYYY (e.g. 01-AUG-2026, 01-Aug-2026)
  const monthMap: Record<string, string> = {
    JAN: '01', FEB: '02', MAR: '03', APR: '04', MAY: '05', JUN: '06',
    JUL: '07', AUG: '08', SEP: '09', OCT: '10', NOV: '11', DEC: '12',
  };
  const textMonthMatch = clean.match(/^(\d{1,2})[-\s/]([A-Za-z]{3})[-\s/](\d{2,4})/);
  if (textMonthMatch) {
    const d = textMonthMatch[1].padStart(2, '0');
    const mStr = textMonthMatch[2].toUpperCase();
    let y = textMonthMatch[3];
    if (y.length === 2) {
      y = parseInt(y, 10) > 70 ? `19${y}` : `20${y}`;
    }
    const m = monthMap[mStr];
    if (m) {
      return `${y}-${m}-${d}`;
    }
  }

  // 5. Definedge 12-digit format: ddMMyyyyHHmm (e.g. 010820260000, 310820261530)
  if (/^\d{12}$/.test(clean)) {
    const d = clean.slice(0, 2);
    const m = clean.slice(2, 4);
    const y = clean.slice(4, 8);
    return `${y}-${m}-${d}`;
  }

  // 6. 14-digit format: ddMMyyyyHHmmss or yyyyMMddHHmmss
  if (/^\d{14}$/.test(clean)) {
    if (/^(19|20)\d{12}$/.test(clean)) {
      return `${clean.slice(0, 4)}-${clean.slice(4, 6)}-${clean.slice(6, 8)}`;
    } else {
      return `${clean.slice(4, 8)}-${clean.slice(2, 4)}-${clean.slice(0, 2)}`;
    }
  }

  // 7. 8-digit format: ddMMyyyy or yyyyMMdd
  if (/^\d{8}$/.test(clean)) {
    if (/^(19|20)\d{6}$/.test(clean)) {
      return `${clean.slice(0, 4)}-${clean.slice(4, 6)}-${clean.slice(6, 8)}`;
    } else {
      return `${clean.slice(4, 8)}-${clean.slice(2, 4)}-${clean.slice(0, 2)}`;
    }
  }

  // 8. Epoch timestamp (10 digits for seconds, 13 digits for milliseconds)
  if (/^\d{10}$/.test(clean)) {
    const date = new Date(parseInt(clean, 10) * 1000);
    if (!isNaN(date.getTime())) {
      return date.toISOString().split('T')[0];
    }
  }
  if (/^\d{13}$/.test(clean)) {
    const date = new Date(parseInt(clean, 10));
    if (!isNaN(date.getTime())) {
      return date.toISOString().split('T')[0];
    }
  }

  return null;
}

/**
 * Executes an authenticated HTTPS GET request to Definedge Historical Data API.
 */
function fetchDefinedgeHistoricalRaw(
  segment: string,
  token: string,
  timeframe: string,
  fromStr: string,
  toStr: string,
  apiKey: string
): Promise<{ data: string; statusCode: number; contentType: string }> {
  return new Promise((resolve, reject) => {
    const path = `/sds/history/${encodeURIComponent(segment)}/${encodeURIComponent(token)}/${encodeURIComponent(timeframe)}/${encodeURIComponent(fromStr)}/${encodeURIComponent(toStr)}`;
    
    const options: https.RequestOptions = {
      hostname: 'data.definedgesecurities.com',
      port: 443,
      path,
      method: 'GET',
      headers: {
        'Authorization': apiKey,
        'Accept': 'text/csv, application/json, text/plain, */*',
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

        resolve({
          data,
          statusCode: res.statusCode || 200,
          contentType: res.headers['content-type'] || 'unknown',
        });
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

  // 1. Validate Session Key (Provided key, active server 2FA session, or server environment)
  const apiKey = providedKey?.trim() || getActiveServerSessionKey() || process.env.DEFINEDGE_API_SESSION_KEY?.trim();
  if (!apiKey) {
    throw new Error(
      'Authentication Error: No active Definedge API Session Key found. Please complete the 2-Factor Authentication step above or set DEFINEDGE_API_SESSION_KEY in your server environment.'
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
  const { data: rawResponse, statusCode, contentType } = await fetchDefinedgeHistoricalRaw(segment, token, 'day', fromStr, toStr, apiKey);

  // SAFE DIAGNOSTIC ANALYSIS
  let isJson = false;
  let parsedJson: any = null;
  try {
    parsedJson = JSON.parse(rawResponse);
    isJson = true;
  } catch {
    isJson = false;
  }

  console.log('\n================== [DEFINEDGE DIAGNOSTIC LOG START] ==================');
  console.log(`[DEFINEDGE DIAGNOSTIC] HTTP Status: ${statusCode}`);
  console.log(`[DEFINEDGE DIAGNOSTIC] Content-Type: ${contentType}`);
  console.log(`[DEFINEDGE DIAGNOSTIC] Response Shape: ${isJson ? (Array.isArray(parsedJson) ? 'JSON Array' : 'JSON Object') : 'CSV / Plain Text'}`);
  console.log(`[DEFINEDGE DIAGNOSTIC] Raw Response Length: ${rawResponse.length} chars`);
  console.log(`[DEFINEDGE DIAGNOSTIC] First 300 chars:`, rawResponse.slice(0, 300));

  if (isJson) {
    if (Array.isArray(parsedJson)) {
      console.log(`[DEFINEDGE DIAGNOSTIC] JSON Array Length: ${parsedJson.length}`);
      if (parsedJson.length > 0) {
        console.log(`[DEFINEDGE DIAGNOSTIC] Sample First Item:`, JSON.stringify(parsedJson[0]));
        if (typeof parsedJson[0] === 'object' && parsedJson[0] !== null) {
          console.log(`[DEFINEDGE DIAGNOSTIC] First Item Keys:`, Object.keys(parsedJson[0]));
          console.log(`[DEFINEDGE DIAGNOSTIC] First Item Types:`, Object.fromEntries(Object.entries(parsedJson[0]).map(([k, v]) => [k, typeof v])));
        }
      }
    } else if (typeof parsedJson === 'object' && parsedJson !== null) {
      console.log(`[DEFINEDGE DIAGNOSTIC] Top-level Object Keys:`, Object.keys(parsedJson));
      for (const k of Object.keys(parsedJson)) {
        if (Array.isArray(parsedJson[k])) {
          console.log(`[DEFINEDGE DIAGNOSTIC] Key "${k}" is Array of length: ${parsedJson[k].length}`);
          if (parsedJson[k].length > 0) {
            console.log(`[DEFINEDGE DIAGNOSTIC] First item of "${k}":`, JSON.stringify(parsedJson[k][0]));
          }
        }
      }
    }
  } else {
    const rawLines = rawResponse.split('\n');
    console.log(`[DEFINEDGE DIAGNOSTIC] CSV Line Count: ${rawLines.length}`);
    for (let i = 0; i < Math.min(5, rawLines.length); i++) {
      console.log(`[DEFINEDGE DIAGNOSTIC] Line ${i}: "${rawLines[i]}"`);
    }
  }

  if (!rawResponse || !rawResponse.trim()) {
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

  // 6. Parse and Normalize Rows (Universal JSON / CSV parser)
  const validBars: DefinedgeNormalizedBar[] = [];
  const sampleRejectionReasons: string[] = [];
  let recordsRejected = 0;

  if (isJson) {
    let rawItems: any[] = [];
    if (Array.isArray(parsedJson)) {
      rawItems = parsedJson;
    } else if (typeof parsedJson === 'object' && parsedJson !== null) {
      for (const key of ['data', 'candles', 'history', 'records', 'result', 'bars']) {
        if (Array.isArray(parsedJson[key])) {
          rawItems = parsedJson[key];
          break;
        }
      }
    }

    for (let idx = 0; idx < rawItems.length; idx++) {
      const item = rawItems[idx];
      if (!item) continue;

      let rawDate: any;
      let openVal: any, highVal: any, lowVal: any, closeVal: any, volVal: any;

      if (Array.isArray(item)) {
        rawDate = item[0];
        openVal = item[1];
        highVal = item[2];
        lowVal = item[3];
        closeVal = item[4];
        volVal = item[5];
      } else if (typeof item === 'object') {
        rawDate = item.Dateandtime ?? item.datetime ?? item.date ?? item.Date ?? item.time ?? item.timestamp;
        openVal = item.open ?? item.Open ?? item.o ?? item['Open Price'];
        highVal = item.high ?? item.High ?? item.h ?? item['High Price'];
        lowVal = item.low ?? item.Low ?? item.l ?? item['Low Price'];
        closeVal = item.close ?? item.Close ?? item.c ?? item['Close Price'] ?? item.ltp;
        volVal = item.volume ?? item.Volume ?? item.vol ?? item.v ?? item.qty;
      }

      const trading_date = parseDefinedgeDate(String(rawDate || ''));
      const open = parseFloat(String(openVal));
      const high = parseFloat(String(highVal));
      const low = parseFloat(String(lowVal));
      const close = parseFloat(String(closeVal));
      const volume = parseInt(String(volVal || 0), 10);

      if (!trading_date || isNaN(open) || isNaN(high) || isNaN(low) || isNaN(close) || open <= 0 || close <= 0) {
        recordsRejected++;
        if (sampleRejectionReasons.length < 5) {
          sampleRejectionReasons.push(`JSON item ${idx}: Invalid OHLCV or date (${trading_date || rawDate})`);
        }
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
  } else {
    // CSV / Plain text parser
    const lines = rawResponse.split('\n');
    const firstLine = lines[0]?.trim();
    // Skip header line if detected
    const isHeader = firstLine && /date|open|high|close/i.test(firstLine);
    const startIdx = isHeader ? 1 : 0;

    for (let lineIdx = startIdx; lineIdx < lines.length; lineIdx++) {
      const line = lines[lineIdx];
      const trimmed = line.trim();
      if (!trimmed) continue;

      const parts = trimmed.split(',').map(p => p.replace(/["']/g, '').trim());
      if (parts.length < 5) {
        recordsRejected++;
        if (sampleRejectionReasons.length < 5) {
          sampleRejectionReasons.push(`Line ${lineIdx}: parts.length (${parts.length}) < 5. Content: "${trimmed.slice(0, 80)}"`);
        }
        continue;
      }

      const rawDate = parts[0];
      const trading_date = parseDefinedgeDate(rawDate);
      const open = parseFloat(parts[1]);
      const high = parseFloat(parts[2]);
      const low = parseFloat(parts[3]);
      const close = parseFloat(parts[4]);
      const volume = parts[5] ? parseInt(parts[5], 10) : 0;

      if (!trading_date || isNaN(open) || isNaN(high) || isNaN(low) || isNaN(close) || open <= 0 || close <= 0) {
        recordsRejected++;
        if (sampleRejectionReasons.length < 5) {
          const failureDetails = [
            !trading_date ? `Invalid date "${rawDate}"` : null,
            isNaN(open) || open <= 0 ? `Open invalid ("${parts[1]}")` : null,
            isNaN(high) || high <= 0 ? `High invalid ("${parts[2]}")` : null,
            isNaN(low) || low <= 0 ? `Low invalid ("${parts[3]}")` : null,
            isNaN(close) || close <= 0 ? `Close invalid ("${parts[4]}")` : null,
          ].filter(Boolean).join(', ');
          sampleRejectionReasons.push(`Line ${lineIdx}: ${failureDetails}. Raw: "${trimmed.slice(0, 80)}"`);
        }
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
  }

  if (sampleRejectionReasons.length > 0) {
    console.log(`[DEFINEDGE DIAGNOSTIC] Sample Rejection Reasons (Total Rejected: ${recordsRejected}):`);
    sampleRejectionReasons.forEach(r => console.log(`  - ${r}`));
  }
  console.log(`================== [DEFINEDGE DIAGNOSTIC LOG END] ==================\n`);

  const diagnostic = {
    statusCode,
    contentType,
    responseFormat: isJson ? (Array.isArray(parsedJson) ? 'json-array' : 'json-object') : 'csv-text',
    itemCount: isJson ? (Array.isArray(parsedJson) ? parsedJson.length : (parsedJson.data?.length ?? 0)) : rawResponse.split('\n').filter(l => l.trim()).length,
    topLevelKeys: isJson && !Array.isArray(parsedJson) && parsedJson ? Object.keys(parsedJson) : undefined,
    rawSnippet: rawResponse.slice(0, 300),
    sampleFirstRecord: isJson ? (Array.isArray(parsedJson) ? parsedJson[0] : (parsedJson.data?.[0] ?? null)) : (rawResponse.split('\n')[0] || ''),
    sampleFieldTypes: isJson && Array.isArray(parsedJson) && parsedJson[0] && typeof parsedJson[0] === 'object'
      ? Object.fromEntries(Object.entries(parsedJson[0]).map(([k, v]) => [k, typeof v]))
      : undefined,
    rejectionReasons: sampleRejectionReasons,
  };

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
      diagnostic,
      cloudVerification: {
        verified: true,
        persistedTotalForSymbol: 0,
      },
      barsPreview: [],
    };
  }

  // 7. Check for Existing Records in Supabase (Batch Deduplication)
  const supabase = createClient();
  const allIds = validBars.map(b => b.id);
  const existingIdSet = new Set<string>();

  const LOOKUP_CHUNK = 500;
  for (let i = 0; i < allIds.length; i += LOOKUP_CHUNK) {
    const idSlice = allIds.slice(i, i + LOOKUP_CHUNK);
    const { data: existingRows, error: fetchErr } = await supabase
      .from('skyhigh_market_data')
      .select('id')
      .in('id', idSlice);

    if (fetchErr) {
      console.warn('⚠️ [DEFINEDGE DEDUP WARNING]:', fetchErr.message);
    } else if (existingRows) {
      existingRows.forEach(r => existingIdSet.add(r.id));
    }
  }

  const newBarsToInsert = validBars.filter(b => !existingIdSet.has(b.id));
  const recordsSkipped = validBars.length - newBarsToInsert.length;

  // 8. Chunked Batch Persistence into Supabase
  let recordsInserted = 0;
  const CHUNK_SIZE = 500;

  for (let i = 0; i < newBarsToInsert.length; i += CHUNK_SIZE) {
    const chunk = newBarsToInsert.slice(i, i + CHUNK_SIZE);
    const { error: insertErr } = await supabase
      .from('skyhigh_market_data')
      .upsert(chunk, { onConflict: 'id' });

    if (insertErr) {
      console.error('❌ [DEFINEDGE UPSERT ERROR]:', insertErr);
      throw new Error(`Failed to persist Definedge records to Supabase: ${insertErr.message}`);
    }

    recordsInserted += chunk.length;
  }

  // 9. Register/Update Distinct Trading Days in skyhigh_trading_days
  try {
    const distinctDates = Array.from(new Set(validBars.map(b => b.trading_date)));
    const existingDaysSet = new Set<string>();

    for (let i = 0; i < distinctDates.length; i += 500) {
      const slice = distinctDates.slice(i, i + 500);
      const { data: existingDays } = await supabase
        .from('skyhigh_trading_days')
        .select('trading_date')
        .in('trading_date', slice);

      if (existingDays) {
        existingDays.forEach(d => existingDaysSet.add(d.trading_date));
      }
    }

    const newDays = distinctDates.filter(d => !existingDaysSet.has(d));

    if (newDays.length > 0) {
      const dayInserts = newDays.map(d => ({
        trading_date: d,
        formatted_date: formatDisplayDate(d),
        stock_count: 1,
        row_count: 1,
        source_file: 'Definedge Historical',
        imported_at: new Date().toISOString(),
      }));

      for (let i = 0; i < dayInserts.length; i += 500) {
        const chunk = dayInserts.slice(i, i + 500);
        await supabase
          .from('skyhigh_trading_days')
          .upsert(chunk, { onConflict: 'trading_date' });
      }
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
    diagnostic,
    cloudVerification: {
      verified,
      persistedTotalForSymbol: totalSymbolCount || recordsInserted,
      sampleDate: sampleRow?.[0]?.trading_date,
      sampleClose: sampleRow?.[0]?.close,
    },
    barsPreview,
  };
}
