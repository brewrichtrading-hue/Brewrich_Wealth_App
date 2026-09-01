/**
 * BREWRICH SKY HIGH - ISOLATED PERSISTENCE STORAGE LAYER (INDEXEDDB)
 * 
 * Complies with strict isolation requirement:
 * - Does not alter existing Supabase schemas or remote database infrastructure.
 * - Stores multi-day historical NSE data on the client origin.
 * - Supports chronological day-by-day accumulation (Day 1, Day 2, Day 3).
 * - Deduplicates on re-upload of the same trading date (idempotent upsert).
 */

import { NormalizedRecord, StoredTradingDay, DataHistoryStats } from './types';
import { formatDisplayDate } from './normalizer';

const DB_NAME = 'Brewrich_SkyHigh_DB';
const DB_VERSION = 1;

const STORE_RECORDS = 'market_records';
const STORE_DAYS = 'trading_days';

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      return reject(new Error('IndexedDB is only available in browser environments.'));
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      // 1. Store for individual stock market records
      if (!db.objectStoreNames.contains(STORE_RECORDS)) {
        const recordStore = db.createObjectStore(STORE_RECORDS, { keyPath: 'id' });
        recordStore.createIndex('by_date', 'date', { unique: false });
        recordStore.createIndex('by_symbol', 'symbol', { unique: false });
      }

      // 2. Store for summarized trading days
      if (!db.objectStoreNames.contains(STORE_DAYS)) {
        db.createObjectStore(STORE_DAYS, { keyPath: 'date' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Save or update daily records for a given date.
 * Re-uploading the same date replaces that specific date's records without duplicates.
 * Uploading a new date appends to historical accumulation.
 */
export async function saveDailyDataset(
  records: NormalizedRecord[],
  fileName: string
): Promise<StoredTradingDay> {
  if (records.length === 0) {
    throw new Error('No valid records to save.');
  }

  const primaryDate = records[0].date;
  const db = await openDatabase();

  const now = new Date();
  const formattedImportTime = now.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }) + ', ' + now.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  const uniqueSymbols = new Set<string>();
  records.forEach(r => uniqueSymbols.add(r.symbol));

  const daySummary: StoredTradingDay = {
    date: primaryDate,
    formattedDate: formatDisplayDate(primaryDate),
    stockCount: uniqueSymbols.size,
    rowCount: records.length,
    importedAt: formattedImportTime,
    fileName,
  };

  return new Promise((resolve, reject) => {
    const tx = db.transaction([STORE_RECORDS, STORE_DAYS], 'readwrite');
    const recordStore = tx.objectStore(STORE_RECORDS);
    const dayStore = tx.objectStore(STORE_DAYS);

    // Save trading day summary
    dayStore.put(daySummary);

    // Write all records with composite key id = `${date}_${symbol}`
    for (const record of records) {
      const recordWithId = {
        ...record,
        id: `${record.date}_${record.symbol}`,
      };
      recordStore.put(recordWithId);
    }

    tx.oncomplete = () => {
      resolve(daySummary);
    };

    tx.onerror = () => {
      reject(tx.error);
    };
  });
}

/**
 * Retrieve cumulative Data History statistics across all imported sessions
 */
export async function getDataHistoryStats(): Promise<DataHistoryStats> {
  try {
    const db = await openDatabase();

    return new Promise((resolve, reject) => {
      const tx = db.transaction([STORE_DAYS, STORE_RECORDS], 'readonly');
      const dayStore = tx.objectStore(STORE_DAYS);
      const recordStore = tx.objectStore(STORE_RECORDS);

      const daysRequest = dayStore.getAll();
      const countRequest = recordStore.count();

      tx.oncomplete = () => {
        const days = (daysRequest.result as StoredTradingDay[]) || [];
        const totalRecords = countRequest.result || 0;

        if (days.length === 0) {
          return resolve({
            latestTradingDate: '—',
            totalTradingDays: 0,
            totalSecurities: 0,
            totalRecords: 0,
            lastImport: '—',
          });
        }

        // Sort days by ISO date ascending
        days.sort((a, b) => a.date.localeCompare(b.date));
        const latestDay = days[days.length - 1];

        // Find highest stock count or unique securities
        const maxSecurities = Math.max(...days.map(d => d.stockCount), 0);

        resolve({
          latestTradingDate: latestDay.formattedDate,
          totalTradingDays: days.length,
          totalSecurities: maxSecurities,
          totalRecords,
          lastImport: latestDay.importedAt,
        });
      };

      tx.onerror = () => reject(tx.error);
    });
  } catch {
    return {
      latestTradingDate: '—',
      totalTradingDays: 0,
      totalSecurities: 0,
      totalRecords: 0,
      lastImport: '—',
    };
  }
}

/**
 * Get list of all imported trading days
 */
export async function getAllImportedDays(): Promise<StoredTradingDay[]> {
  try {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const tx = db.transaction([STORE_DAYS], 'readonly');
      const store = tx.objectStore(STORE_DAYS);
      const request = store.getAll();

      tx.oncomplete = () => {
        const days = (request.result as StoredTradingDay[]) || [];
        days.sort((a, b) => b.date.localeCompare(a.date)); // Descending by date
        resolve(days);
      };

      tx.onerror = () => reject(tx.error);
    });
  } catch {
    return [];
  }
}

/**
 * Clear all stored Sky High data
 */
export async function clearAllSkyHighStorage(): Promise<void> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction([STORE_RECORDS, STORE_DAYS], 'readwrite');
    tx.objectStore(STORE_RECORDS).clear();
    tx.objectStore(STORE_DAYS).clear();

    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}
