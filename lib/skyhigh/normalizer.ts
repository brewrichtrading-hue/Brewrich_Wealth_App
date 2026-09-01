/**
 * BREWRICH SKY HIGH - DATA NORMALIZATION & VALIDATION ENGINE
 * Robust normalization layer for Indian market data (NSE Bhavcopy, UDiFF, and equity reports).
 */

import { NormalizedRecord, ValidationReport } from './types';

// Supported column name variations in NSE formats across historical versions
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
    'TRADDT',
    'DATE',
    'TRADE DATE',
    'TRADEDATE',
    'BIZDT',
    'TRADE_DATE',
  ],
  open: [
    'OPEN',
    'OPNPRIC',
    'OPEN_PRICE',
    'OPEN PRICE',
    'OPENING_PRICE',
  ],
  high: [
    'HIGH',
    'HGHPRIC',
    'HIGH_PRICE',
    'HIGH PRICE',
  ],
  low: [
    'LOW',
    'LWPRIC',
    'LOW_PRICE',
    'LOW PRICE',
  ],
  close: [
    'CLOSE',
    'CLSPRIC',
    'CLOSE_PRICE',
    'CLOSE PRICE',
    'LAST',
    'LASTPRIC',
    'CLOSING_PRICE',
  ],
  volume: [
    'TOTTRDQTY',
    'TTLTRADGVOL',
    'TOTAL_TRADED_QUANTITY',
    'TOTAL TRADED QUANTITY',
    'VOLUME',
    'VOL',
    'QTY',
    'TRADED_QTY',
    'NO_OF_SHARES',
    'TTLNBROFSHRSTRAD',
  ],
};

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
  const str = raw.trim();

  // Format 1: 01-SEP-2026 or 01-Sep-2026 or 1-SEP-2026
  const regexDdmmyyyy = /^(\d{1,2})[-/ ]([A-Za-z]{3})[-/ ](\d{4})$/;
  const match1 = str.match(regexDdmmyyyy);
  if (match1) {
    const day = match1[1].padStart(2, '0');
    const month = MONTH_MAP[match1[2].toUpperCase()];
    const year = match1[3];
    if (month) return `${year}-${month}-${day}`;
  }

  // Format 2: YYYY-MM-DD or YYYYMMDD
  const regexIso = /^(\d{4})[-/]?(\d{2})[-/]?(\d{2})$/;
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
 * Split CSV line taking quoted commas into account
 */
function splitCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
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
 * Main normalization & validation pipeline
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

  // 1. Detect headers
  const headerTokens = splitCsvLine(lines[0]).map(h => h.toUpperCase().replace(/\s+/g, ' ').trim());

  const columnMap: Record<string, number> = {};
  const missingFields: string[] = [];

  for (const [canonicalKey, candidates] of Object.entries(FIELD_CANDIDATES)) {
    const foundIdx = headerTokens.findIndex(h => candidates.includes(h));
    if (foundIdx !== -1) {
      columnMap[canonicalKey] = foundIdx;
    } else {
      missingFields.push(canonicalKey);
    }
  }

  // Optional SERIES column
  const seriesIdx = headerTokens.findIndex(h => ['SERIES', 'SCTYSRS', 'SEGMENT'].includes(h));

  // If any of the 7 required fields are missing, return validation failure
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
          `Supported headers must contain symbol, date, open, high, low, close, and volume.`,
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
    const series = seriesIdx !== -1 ? cells[seriesIdx] : undefined;

    // Validate Symbol
    if (!rawSymbol || rawSymbol.trim().length === 0) {
      rejectedCount++;
      if (sampleRejections.length < 3) sampleRejections.push(`Row ${lineIdx}: Empty symbol.`);
      continue;
    }
    const symbol = rawSymbol.trim().toUpperCase();

    // Validate Date
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
      series,
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
