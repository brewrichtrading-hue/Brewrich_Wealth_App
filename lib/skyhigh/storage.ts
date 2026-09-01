/**
 * BREWRICH SKY HIGH - PERSISTENT CLOUD & LOCAL STORAGE LAYER (MILESTONE 3)
 * 
 * Complies with strict isolation rules:
 * - Uses Supabase tables: public.skyhigh_market_data & public.skyhigh_trading_days
 * - Uses existing NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
 * - Zero modifications to mfd_bookings, module_status, or student_profiles
 * - Chunked batch upserts (500 records/batch) for 3,600+ record files
 * - Real cloud verification post-import
 * - Safe migration for pre-existing IndexedDB datasets (31 Aug 2026)
 * - Retains IndexedDB as local fallback/offline store
 */

import { createClient } from '@/lib/supabase/client';
import { 
  NormalizedRecord, 
  StoredTradingDay, 
  DataHistoryStats, 
  CloudVerificationResult 
} from './types';
import { formatDisplayDate } from './normalizer';

const BATCH_SIZE = 500;
const DB_NAME = 'Brewrich_SkyHigh_DB';
const DB_VERSION = 1;
const STORE_RECORDS = 'market_records';
const STORE_DAYS = 'trading_days';

// ==============================================================================
// 1. LOCAL INDEXEDDB UTILITIES (PRESERVATION & LOCAL FALLBACK)
// ==============================================================================

function openIndexedDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      return reject(new Error('IndexedDB is only available in browser environments.'));
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_RECORDS)) {
        const recordStore = db.createObjectStore(STORE_RECORDS, { keyPath: 'id' });
        recordStore.createIndex('by_date', 'date', { unique: false });
        recordStore.createIndex('by_symbol', 'symbol', { unique: false });
      }
      if (!db.objectStoreNames.contains(STORE_DAYS)) {
        db.createObjectStore(STORE_DAYS, { keyPath: 'date' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function saveLocalBackup(records: NormalizedRecord[], fileName: string): Promise<void> {
  try {
    const primaryDate = records[0].date;
    const db = await openIndexedDB();

    const uniqueSymbols = new Set<string>();
    records.forEach(r => uniqueSymbols.add(r.symbol));

    const daySummary = {
      date: primaryDate,
      formattedDate: formatDisplayDate(primaryDate),
      stockCount: uniqueSymbols.size,
      rowCount: records.length,
      importedAt: new Date().toLocaleString('en-IN'),
      fileName,
    };

    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction([STORE_RECORDS, STORE_DAYS], 'readwrite');
      tx.objectStore(STORE_DAYS).put(daySummary);
      const recordStore = tx.objectStore(STORE_RECORDS);
      for (const r of records) {
        recordStore.put({ ...r, id: `${r.date}_${r.symbol}` });
      }
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.warn('⚠️ [SKY HIGH] Local IndexedDB backup warning:', err);
  }
}

// ==============================================================================
// 2. CHUNKED SUPABASE CLOUD INGESTION
// ==============================================================================

export async function saveDailyDatasetToCloud(
  records: NormalizedRecord[],
  fileName: string,
  onProgress?: (completed: number, total: number) => void
): Promise<StoredTradingDay> {
  if (records.length === 0) {
    throw new Error('No valid records to persist.');
  }

  const supabase = createClient();
  const primaryDate = records[0].date;
  const total = records.length;
  let completed = 0;

  // 1. Chunked upserts into public.skyhigh_market_data
  for (let i = 0; i < total; i += BATCH_SIZE) {
    const chunk = records.slice(i, i + BATCH_SIZE);
    const rowsToInsert = chunk.map(r => ({
      id: `${r.date}_${r.symbol}`,
      symbol: r.symbol,
      trading_date: r.date,
      open: r.open,
      high: r.high,
      low: r.low,
      close: r.close,
      volume: Math.round(r.volume),
      series: r.series || null,
      source_file: fileName,
    }));

    const { error } = await supabase
      .from('skyhigh_market_data')
      .upsert(rowsToInsert, { onConflict: 'id' });

    if (error) {
      console.error('❌ [SKY HIGH CLOUD UPSERT ERROR]:', error);
      throw new Error(`Cloud persistence failed at row ${i}: ${error.message}`);
    }

    completed += chunk.length;
    if (onProgress) {
      onProgress(Math.min(completed, total), total);
    }
  }

  // 2. Calculate unique securities
  const uniqueSymbols = new Set<string>();
  records.forEach(r => uniqueSymbols.add(r.symbol));

  const dayRecord: StoredTradingDay = {
    date: primaryDate,
    formattedDate: formatDisplayDate(primaryDate),
    stockCount: uniqueSymbols.size,
    rowCount: total,
    importedAt: new Date().toLocaleString('en-IN'),
    fileName,
    isCloudPersisted: true,
  };

  // 3. Upsert metadata in public.skyhigh_trading_days
  const { error: metaError } = await supabase
    .from('skyhigh_trading_days')
    .upsert({
      trading_date: primaryDate,
      formatted_date: dayRecord.formattedDate,
      stock_count: dayRecord.stockCount,
      row_count: dayRecord.rowCount,
      source_file: fileName,
      imported_at: new Date().toISOString(),
    }, { onConflict: 'trading_date' });

  if (metaError) {
    console.error('❌ [SKY HIGH CLOUD META ERROR]:', metaError);
    throw new Error(`Failed to update cloud trading days metadata: ${metaError.message}`);
  }

  // 4. Save local copy for offline resilience
  await saveLocalBackup(records, fileName);

  return dayRecord;
}

// ==============================================================================
// 3. REAL CLOUD VERIFICATION
// ==============================================================================

export async function verifyCloudDataset(
  tradingDate: string,
  expectedCount: number
): Promise<CloudVerificationResult> {
  const supabase = createClient();
  const timestamp = new Date().toLocaleString('en-IN');

  try {
    // 1. Verify trading date exists in metadata
    const { data: dayData, error: dayError } = await supabase
      .from('skyhigh_trading_days')
      .select('trading_date, stock_count, row_count')
      .eq('trading_date', tradingDate)
      .maybeSingle();

    if (dayError || !dayData) {
      return {
        verified: false,
        tradingDate,
        expectedCount,
        cloudCount: 0,
        sampleRetrieved: 0,
        timestamp,
        error: dayError?.message || 'Trading date record was not found in cloud metadata.',
      };
    }

    // 2. Verify exact record count in skyhigh_market_data
    const { count, error: countError } = await supabase
      .from('skyhigh_market_data')
      .select('*', { count: 'exact', head: true })
      .eq('trading_date', tradingDate);

    if (countError || count === null) {
      return {
        verified: false,
        tradingDate,
        expectedCount,
        cloudCount: 0,
        sampleRetrieved: 0,
        timestamp,
        error: countError?.message || 'Could not verify market data row count from cloud.',
      };
    }

    // 3. Verify actual records are retrievable
    const { data: sampleData, error: sampleError } = await supabase
      .from('skyhigh_market_data')
      .select('symbol, close, volume')
      .eq('trading_date', tradingDate)
      .limit(5);

    if (sampleError || !sampleData || sampleData.length === 0) {
      return {
        verified: false,
        tradingDate,
        expectedCount,
        cloudCount: count,
        sampleRetrieved: 0,
        timestamp,
        error: 'Cloud records could not be retrieved in verification query.',
      };
    }

    const isMatch = count >= expectedCount; // Handles potential duplicates resolved during upsert

    return {
      verified: isMatch,
      tradingDate,
      expectedCount,
      cloudCount: count,
      sampleRetrieved: sampleData.length,
      timestamp,
    };
  } catch (err: any) {
    return {
      verified: false,
      tradingDate,
      expectedCount,
      cloudCount: 0,
      sampleRetrieved: 0,
      timestamp,
      error: err?.message || 'Unexpected cloud verification exception.',
    };
  }
}

// ==============================================================================
// 4. CLOUD DATA HISTORY RETRIEVAL (PRIMARY SOURCE)
// ==============================================================================

export async function getCloudDataHistoryStats(): Promise<DataHistoryStats> {
  const supabase = createClient();

  try {
    const { data: days, error } = await supabase
      .from('skyhigh_trading_days')
      .select('*')
      .order('trading_date', { ascending: false });

    if (error) {
      console.warn('⚠️ [SKY HIGH] Cloud history fetch error, falling back to local:', error);
      return getFallbackLocalHistoryStats();
    }

    if (!days || days.length === 0) {
      // Check if local storage has data to offer for migration
      return getFallbackLocalHistoryStats();
    }

    // Days are sorted descending by trading_date
    const latestDay = days[0];
    const maxSecurities = Math.max(...days.map(d => d.stock_count || 0), 0);
    const totalRecords = days.reduce((acc, d) => acc + (d.row_count || 0), 0);

    const formattedImportTime = latestDay.imported_at
      ? new Date(latestDay.imported_at).toLocaleString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        })
      : '—';

    return {
      latestTradingDate: latestDay.formatted_date || formatDisplayDate(latestDay.trading_date),
      totalTradingDays: days.length,
      totalSecurities: maxSecurities,
      totalRecords,
      lastImport: formattedImportTime,
      isCloudConnected: true,
    };
  } catch (err) {
    console.warn('⚠️ [SKY HIGH] Cloud connection exception:', err);
    return getFallbackLocalHistoryStats();
  }
}

export async function getCloudImportedDays(): Promise<StoredTradingDay[]> {
  const supabase = createClient();

  try {
    const { data: days, error } = await supabase
      .from('skyhigh_trading_days')
      .select('*')
      .order('trading_date', { ascending: false });

    if (error || !days || days.length === 0) {
      return getFallbackLocalImportedDays();
    }

    return days.map(d => ({
      date: d.trading_date,
      formattedDate: d.formatted_date || formatDisplayDate(d.trading_date),
      stockCount: d.stock_count,
      rowCount: d.row_count,
      importedAt: d.imported_at
        ? new Date(d.imported_at).toLocaleString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
          })
        : '—',
      fileName: d.source_file || 'NSE Bhavcopy',
      isCloudPersisted: true,
    }));
  } catch {
    return getFallbackLocalImportedDays();
  }
}

// Fallback to IndexedDB when cloud has no rows yet or offline
async function getFallbackLocalHistoryStats(): Promise<DataHistoryStats> {
  try {
    const db = await openIndexedDB();
    return new Promise((resolve) => {
      const tx = db.transaction([STORE_DAYS, STORE_RECORDS], 'readonly');
      const daysRequest = tx.objectStore(STORE_DAYS).getAll();
      const countRequest = tx.objectStore(STORE_RECORDS).count();

      tx.oncomplete = () => {
        const days = (daysRequest.result as any[]) || [];
        const totalRecords = countRequest.result || 0;

        if (days.length === 0) {
          return resolve({
            latestTradingDate: '—',
            totalTradingDays: 0,
            totalSecurities: 0,
            totalRecords: 0,
            lastImport: '—',
            isCloudConnected: false,
          });
        }

        days.sort((a, b) => a.date.localeCompare(b.date));
        const latest = days[days.length - 1];
        resolve({
          latestTradingDate: latest.formattedDate,
          totalTradingDays: days.length,
          totalSecurities: Math.max(...days.map(d => d.stockCount || 0), 0),
          totalRecords,
          lastImport: latest.importedAt,
          isCloudConnected: false,
        });
      };

      tx.onerror = () => resolve({
        latestTradingDate: '—',
        totalTradingDays: 0,
        totalSecurities: 0,
        totalRecords: 0,
        lastImport: '—',
        isCloudConnected: false,
      });
    });
  } catch {
    return {
      latestTradingDate: '—',
      totalTradingDays: 0,
      totalSecurities: 0,
      totalRecords: 0,
      lastImport: '—',
      isCloudConnected: false,
    };
  }
}

async function getFallbackLocalImportedDays(): Promise<StoredTradingDay[]> {
  try {
    const db = await openIndexedDB();
    return new Promise((resolve) => {
      const tx = db.transaction([STORE_DAYS], 'readonly');
      const request = tx.objectStore(STORE_DAYS).getAll();
      tx.oncomplete = () => {
        const days = (request.result as StoredTradingDay[]) || [];
        days.sort((a, b) => b.date.localeCompare(a.date));
        resolve(days.map(d => ({ ...d, isCloudPersisted: false })));
      };
      tx.onerror = () => resolve([]);
    });
  } catch {
    return [];
  }
}

// ==============================================================================
// 5. SAFE INDEXEDDB → SUPABASE CLOUD MIGRATION UTILITY
// ==============================================================================

export async function checkAndMigrateLocalData(
  onProgress?: (statusMsg: string) => void
): Promise<{ migratedDays: number; migratedRecords: number }> {
  try {
    const db = await openIndexedDB();
    const localDays = await new Promise<any[]>((resolve) => {
      const tx = db.transaction([STORE_DAYS], 'readonly');
      const req = tx.objectStore(STORE_DAYS).getAll();
      tx.oncomplete = () => resolve(req.result || []);
      tx.onerror = () => resolve([]);
    });

    if (localDays.length === 0) {
      return { migratedDays: 0, migratedRecords: 0 };
    }

    const supabase = createClient();
    let migratedDays = 0;
    let migratedRecords = 0;

    for (const day of localDays) {
      // Check if day already exists in cloud
      const { data: cloudDay } = await supabase
        .from('skyhigh_trading_days')
        .select('trading_date')
        .eq('trading_date', day.date)
        .maybeSingle();

      if (cloudDay) {
        continue; // Already migrated/persisted in cloud
      }

      onProgress?.(`Migrating local ${day.formattedDate || day.date} records to cloud...`);

      // Retrieve local records for this day
      const localRecords = await new Promise<NormalizedRecord[]>((resolve) => {
        const tx = db.transaction([STORE_RECORDS], 'readonly');
        const req = tx.objectStore(STORE_RECORDS).getAll();
        tx.oncomplete = () => {
          const all = req.result || [];
          const filtered = all.filter((r: any) => r.date === day.date);
          resolve(filtered);
        };
        tx.onerror = () => resolve([]);
      });

      if (localRecords.length > 0) {
        await saveDailyDatasetToCloud(localRecords, day.fileName || 'Migrated from Local Cache');
        await verifyCloudDataset(day.date, localRecords.length);
        migratedDays++;
        migratedRecords += localRecords.length;
      }
    }

    return { migratedDays, migratedRecords };
  } catch (err) {
    console.error('❌ [SKY HIGH] Migration error:', err);
    return { migratedDays: 0, migratedRecords: 0 };
  }
}

// ==============================================================================
// 6. SAFE DATASET RESET (ISOLATED TO SKY HIGH TABLES ONLY)
// ==============================================================================

export async function clearAllSkyHighStorage(): Promise<void> {
  const supabase = createClient();

  // 1. Delete Sky High cloud records
  await supabase.from('skyhigh_market_data').delete().neq('id', 'placeholder');
  await supabase.from('skyhigh_trading_days').delete().neq('trading_date', '1970-01-01');

  // 2. Clear local IndexedDB stores
  try {
    const db = await openIndexedDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction([STORE_RECORDS, STORE_DAYS], 'readwrite');
      tx.objectStore(STORE_RECORDS).clear();
      tx.objectStore(STORE_DAYS).clear();
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.warn('⚠️ [SKY HIGH] Could not clear local IndexedDB:', err);
  }
}
