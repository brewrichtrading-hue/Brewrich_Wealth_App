/**
 * BREWRICH SKY HIGH - DATA NORMALIZATION & VALIDATION ENGINE
 * Robust normalization layer for Indian market data (NSE Bhavcopy, UDiFF, and equity reports).
 */

import { NormalizedRecord, ValidationReport } from './types';

// Supported column name variations in NSE formats across historical and modern versions
const FIELD_CANDIDATES: Record<string, string[]> = {
  symbol: [
    'SYMBOL',
    'TCKRSYMB',
    'SECURITY',
    'TICKER',
    'SCRIP',
    'SECURITY_NAME',
    'FININSTRMID',
    'SYMBOL/SECURITY',
  ],
  date: [
    'TIMESTAMP',
    'DATE1',
    'TRADDT',
    'DATE',
    'TRADE DATE',
    'TRADE_DATE',
    'TRADEDATE',
    'BIZDT',
  ],
  open: [
    'OPEN',
    'OPEN_PRICE',
    'OPNPRIC',
    'OPEN PRICE',
    'OPENING_PRICE',
  ],
  high: [
    'HIGH',
    'HIGH_PRICE',
    'HGHPRIC',
    'HIGH PRICE',
  ],
  low: [
    'LOW',
    'LOW_PRICE',
    'LWPRIC',
    'LOW PRICE',
  ],
  close: [
    'CLOSE',
    'CLOSE_PRICE',
    'CLSPRIC',
    'CLOSE PRICE',
    'CLOSING_PRICE',
    'LAST',
    'LAST_PRICE',
    'LASTPRIC',
  ],
  volume: [
    'TOTTRDQTY',
    'TTL_TRD_QNTY',
    'TTLTRADGVOL',
    'TOTAL_TRADED_QUANTITY',
    'TOTAL TRADED QUANTITY',
    'VOLUME',
    'VOL',
    'QTY',
    'TRADED_QTY',
    'TTL_TRD_QTY',
    'NO_OF_SHARES',
    'TTLNBROFSHRSTRAD',
  ],
};

const SERIES_CANDIDATES = ['SERIES', 'SCTYSRS', 'SEGMENT', 'SERIES/SEGMENT'];

const MONTH_MAP: Record<string, string> = {
  JAN: '01',
  FEB: '02',
  MAR: '03',
  APR: '04',
  MAY: '05',
  JUN: '06',
  JUL: '07',
  AUG: '08',
  SEP: '09',
  OCT: '10',
  NOV: '11',
  DEC: '12',
};

/**
 * Standardize various NSE date formats into YYYY-MM-DD
 */
export function normalizeDate(raw: string): string | null {
  if (!raw) return null;
  const str = raw.trim().replace(/^["']|["']$/g, '');

  // Format 1: 31-AUG-2026, 31-Aug-2026, 31/AUG/2026, 1-SEP-2026
  const regexDdmmyyyy = /^(\d{1,2})[-/ ]([A-Za-z]{3})[-/ ](\d{4})$/;
  const match1 = str.match(regexDdmmyyyy);
  if (match1) {
    const day = match1[1].padStart(2, '0');
    const month = MONTH_MAP[match1[2].toUpperCase()];
    const year = match1[3];
    if (month) return `${year}-${month}-${day}`;
  }

  // Format 2: ISO with separators YYYY-MM-DD or YYYY/MM/DD
  const regexIso = /^(\d{4})[-/](\d{2})[-/](\d{2})$/;
  const match2 = str.match(regexIso);
  if (match2) {
    return `${match2[1]}-${match2[2]}-${match2[3]}`;
  }

  // Format 3: DD-MM-YYYY or DD/MM/YYYY
  const regexNumeric = /^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/;
  const match3 = str.match(regexNumeric);
  if (match3) {
    const day = match3[1].padStart(2, '0');
    const month = match3[2].padStart(2, '0');
    const year = match3[3];
    return `${year}-${month}-${day}`;
  }

  // Format 4: 8-digit compact date (YYYYMMDD or DDMMYYYY)
  if (/^\d{8}$/.test(str)) {
    const first4 = parseInt(str.substring(0, 4), 10);
    const last4 = parseInt(str.substring(4, 8), 10);
    if (first4 >= 1990 && first4 <= 2100) {
      // YYYYMMDD
      return `${str.substring(0, 4)}-${str.substring(4, 6)}-${str.substring(6, 8)}`;
    } else if (last4 >= 1990 && last4 <= 2100) {
      // DDMMYYYY (standard Indian compact date e.g. 31082026)
      return `${str.substring(4, 8)}-${str.substring(2, 4)}-${str.substring(0, 2)}`;
    }
  }

  // Fallback: Date.parse
  const parsed = new Date(str);
  if (!isNaN(parsed.getTime())) {
    const y = parsed.getFullYear();
    const m = String(parsed.getMonth() + 1).padStart(2, '0');
    const d = String(parsed.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  return null;
}

export function formatDisplayDate(isoDate: string): string {
  if (!isoDate || isoDate === '—') return '—';
  const parts = isoDate.split('-');
  if (parts.length === 3) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthIdx = parseInt(parts[1], 10) - 1;
    if (monthIdx >= 0 && monthIdx < 12) {
      return `${parts[2]} ${months[monthIdx]} ${parts[0]}`;
    }
  }
  return isoDate;
}

/**
 * Split CSV line taking quoted commas and spaces into account
 */
function splitCsvLine(line: string): string[] {
  const cleanLine = line.replace(/^\uFEFF/, '');
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < cleanLine.length; i++) {
    const char = cleanLine[i];
    if (char === '"' || char === "'") {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim().replace(/^["']|["']$/g, ''));
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim().replace(/^["']|["']$/g, ''));
  return result;
}

export interface ParseResult {
  report: ValidationReport;
  records: NormalizedRecord[];
}

/**
 * Main normalization & validation pipeline supporting authentic NSE Bhavcopies,
 * sec_bhavdata_full files, and generic OHLCV files.
 */
export function parseAndValidateNseCsv(csvText: string): ParseResult {
  const lines = csvText.split(/\r\n|\n/).filter(line => line.trim().length > 0);

  if (lines.length === 0) {
    return {
      report: {
        status: 'Failed',
        tradingDate: '—',
        totalRows: 0,
        validRows: 0,
        rejectedRows: 0,
        duplicateRows: 0,
        missingColumns: ['All columns (file is empty)'],
        rejectionReasons: ['Uploaded file contains no data.'],
      },
      records: [],
    };
  }

  // 1. Detect headers with token cleanup and alphanumeric fallback
  const rawHeaders = splitCsvLine(lines[0]);
  const cleanHeaders = rawHeaders.map(h => 
    h.replace(/^\uFEFF/, '').replace(/["']/g, '').replace(/\s+/g, ' ').trim().toUpperCase()
  );
  const alphaHeaders = cleanHeaders.map(h => h.replace(/[^A-Z0-9]/g, ''));

  const columnMap: Record<string, number> = {};
  const missingFields: string[] = [];

  for (const [canonicalKey, candidates] of Object.entries(FIELD_CANDIDATES)) {
    const alphaCandidates = candidates.map(c => c.replace(/[^A-Z0-9]/g, ''));

    // Try exact candidate match first
    let foundIdx = cleanHeaders.findIndex(h => candidates.includes(h));

    // Fallback to alphanumeric match (ignores spaces, underscores, dashes)
    if (foundIdx === -1) {
      foundIdx = alphaHeaders.findIndex(ah => alphaCandidates.includes(ah));
    }

    if (foundIdx !== -1) {
      columnMap[canonicalKey] = foundIdx;
    } else {
      missingFields.push(canonicalKey);
    }
  }

  // Optional SERIES column detection
  let seriesIdx = cleanHeaders.findIndex(h => SERIES_CANDIDATES.includes(h));
  if (seriesIdx === -1) {
    const alphaSeriesCandidates = SERIES_CANDIDATES.map(c => c.replace(/[^A-Z0-9]/g, ''));
    seriesIdx = alphaHeaders.findIndex(ah => alphaSeriesCandidates.includes(ah));
  }

  // If any required field is missing, return detailed validation failure
  if (missingFields.length > 0) {
    return {
      report: {
        status: 'Failed',
        tradingDate: '—',
        totalRows: lines.length - 1,
        validRows: 0,
        rejectedRows: lines.length - 1,
        duplicateRows: 0,
        missingColumns: missingFields,
        rejectionReasons: [
          `Required columns missing from file header: ${missingFields.join(', ')}.`,
          `Supported headers must contain symbol, date (e.g. TIMESTAMP/DATE1), open, high, low, close, and volume (e.g. TOTTRDQTY/TTL_TRD_QNTY).`,
        ],
      },
      records: [],
    };
  }

  // 2. Validate and Normalize Rows
  const totalRows = lines.length - 1;
  let rejectedCount = 0;
  let duplicateCount = 0;
  const validRecords: NormalizedRecord[] = [];
  const seenSymbolDate = new Set<string>();
  const detectedDates = new Set<string>();
  const sampleRejections: string[] = [];

  for (let lineIdx = 1; lineIdx < lines.length; lineIdx++) {
    const rawLine = lines[lineIdx];
    const cells = splitCsvLine(rawLine);

    if (cells.length < Math.max(...Object.values(columnMap)) + 1) {
      rejectedCount++;
      if (sampleRejections.length < 3) {
        sampleRejections.push(`Row ${lineIdx}: Insufficient columns.`);
      }
      continue;
    }

    const rawSymbol = cells[columnMap.symbol];
    const rawDate = cells[columnMap.date];
    const rawOpen = cells[columnMap.open].replace(/,/g, '');
    const rawHigh = cells[columnMap.high].replace(/,/g, '');
    const rawLow = cells[columnMap.low].replace(/,/g, '');
    const rawClose = cells[columnMap.close].replace(/,/g, '');
    const rawVolume = cells[columnMap.volume].replace(/,/g, '');
    const series = seriesIdx !== -1 ? cells[seriesIdx]?.trim() : undefined;

    // Validate Symbol
    if (!rawSymbol || rawSymbol.trim().length === 0) {
      rejectedCount++;
      if (sampleRejections.length < 3) sampleRejections.push(`Row ${lineIdx}: Empty symbol.`);
      continue;
    }
    const symbol = rawSymbol.trim().toUpperCase();

    // Validate Date (maps TIMESTAMP or DATE1 to normalized trading_date)
    const normalizedDt = normalizeDate(rawDate);
    if (!normalizedDt) {
      rejectedCount++;
      if (sampleRejections.length < 3) {
        sampleRejections.push(`Row ${lineIdx}: Invalid date format "${rawDate}".`);
      }
      continue;
    }
    detectedDates.add(normalizedDt);

    // Validate Numerics
    const open = parseFloat(rawOpen);
    const high = parseFloat(rawHigh);
    const low = parseFloat(rawLow);
    const close = parseFloat(rawClose);
    const volume = parseFloat(rawVolume);

    if (
      isNaN(open) || isNaN(high) || isNaN(low) || isNaN(close) || isNaN(volume) ||
      open <= 0 || high <= 0 || low <= 0 || close <= 0 || volume < 0
    ) {
      rejectedCount++;
      if (sampleRejections.length < 3) {
        sampleRejections.push(`Row ${lineIdx}: Invalid or non-positive price/volume data.`);
      }
      continue;
    }

    // Sanity check: high must be >= low
    if (high < low) {
      rejectedCount++;
      if (sampleRejections.length < 3) {
        sampleRejections.push(`Row ${lineIdx}: High price (${high}) is less than Low price (${low}).`);
      }
      continue;
    }

    // Check Duplicates in file
    const uniqueKey = `${symbol}_${normalizedDt}`;
    if (seenSymbolDate.has(uniqueKey)) {
      duplicateCount++;
      continue;
    }
    seenSymbolDate.add(uniqueKey);

    validRecords.push({
      symbol,
      date: normalizedDt,
      open,
      high,
      low,
      close,
      volume,
      series: series || undefined,
    });
  }

  // Determine Primary Trading Date
  let primaryTradingDate = '—';
  if (detectedDates.size > 0) {
    const sortedDates = Array.from(detectedDates).sort();
    const latestIso = sortedDates[sortedDates.length - 1];
    primaryTradingDate = formatDisplayDate(latestIso);
  }

  const isValid = validRecords.length > 0;

  return {
    report: {
      status: isValid ? 'Valid' : 'Failed',
      tradingDate: primaryTradingDate,
      totalRows,
      validRows: validRecords.length,
      rejectedRows: rejectedCount,
      duplicateRows: duplicateCount,
      rejectionReasons: sampleRejections.length > 0 ? sampleRejections : undefined,
    },
    records: validRecords,
  };
}
