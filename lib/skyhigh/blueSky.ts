/**
 * BREWRICH SKY HIGH - BLUE SKY STRATEGY ENGINE (MILESTONE 4)
 * 
 * Quantitative momentum and breakout screening engine operating exclusively
 * on verified records from public.skyhigh_market_data in Supabase.
 * 
 * Complies with strict Zero-Mock and Data-Integrity principles:
 * - Operates entirely on actual historical records.
 * - Distinguishes between 1-day and multi-day observation datasets.
 * - Uses explicitly declared, configurable parameters with documented defaults.
 * - No synthetic stocks, fabricated CAGR, or imaginary signals.
 */

import { createClient } from '@/lib/supabase/client';
import { 
  BlueSkyConfig, 
  SecurityHistoricalMetrics, 
  BlueSkySummary, 
  BlueSkyEngineResult, 
  BreakoutStatus, 
  BlueSkyStatus 
} from './types';
import { formatDisplayDate } from './normalizer';

// ==============================================================================
// 1. DEFAULT ENGINE CONFIGURATION
// (Explicitly adjustable screening parameters — not hardcoded trading dogma)
// ==============================================================================

export const DEFAULT_BLUE_SKY_CONFIG: BlueSkyConfig = {
  // Proximity percentage from highest high to qualify as active breakout (e.g. within 0.5%)
  breakoutTolerancePercent: 0.5,

  // Proximity percentage from highest high to qualify for the watchlist (e.g. within 3.0%)
  watchlistProximityPercent: 3.0,

  // Minimum volume threshold to filter out illiquid securities (e.g. 10,000 shares)
  minVolume: 10000,

  // Minimum stock price to filter out extreme micro-penny instruments (e.g. ₹10.00)
  minPrice: 10.0,

  // Standard equity series permitted for primary strategy execution
  allowedSeries: ['EQ', 'BE', 'SM'],
};

// ==============================================================================
// 2. SUPABASE HISTORICAL DATA FETCHER (PAGINATED & SCALABLE)
// ==============================================================================

export interface RawMarketRecord {
  symbol: string;
  trading_date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  series?: string | null;
}

export async function fetchAllMarketDataFromCloud(
  onProgress?: (loadedCount: number) => void
): Promise<RawMarketRecord[]> {
  const supabase = createClient();
  const PAGE_SIZE = 1000;
  let allRecords: RawMarketRecord[] = [];
  let from = 0;

  while (true) {
    const { data, error } = await supabase
      .from('skyhigh_market_data')
      .select('symbol, trading_date, open, high, low, close, volume, series')
      .order('trading_date', { ascending: true })
      .range(from, from + PAGE_SIZE - 1);

    if (error) {
      console.error('❌ [BLUE SKY DATA FETCH ERROR]:', error);
      throw new Error(`Failed to retrieve market records from Supabase: ${error.message}`);
    }

    if (!data || data.length === 0) {
      break;
    }

    allRecords = allRecords.concat(data as RawMarketRecord[]);
    if (onProgress) {
      onProgress(allRecords.length);
    }

    if (data.length < PAGE_SIZE) {
      break;
    }

    from += PAGE_SIZE;
  }

  return allRecords;
}

// ==============================================================================
// 3. DETERMINISTIC BLUE SKY STRATEGY CALCULATION ENGINE
// ==============================================================================

export function calculateBlueSkyStrategy(
  records: RawMarketRecord[],
  config: BlueSkyConfig = DEFAULT_BLUE_SKY_CONFIG
): BlueSkyEngineResult {
  if (!records || records.length === 0) {
    return {
      summary: {
        tradingDate: '—',
        totalUniverse: 0,
        qualifiedCount: 0,
        watchlistCount: 0,
        noSignalCount: 0,
        insufficientHistoryCount: 0,
        isSingleDayDataset: true,
        totalHistoricalDays: 0,
        calculatedAt: new Date().toLocaleString('en-IN'),
      },
      securities: [],
      config,
    };
  }

  // 1. Identify distinct historical dates
  const distinctDates = Array.from(new Set(records.map(r => r.trading_date))).sort();
  const totalHistoricalDays = distinctDates.length;
  const isSingleDayDataset = totalHistoricalDays <= 1;
  const latestDateIso = distinctDates[distinctDates.length - 1];
  const displayTradingDate = formatDisplayDate(latestDateIso);

  // 2. Group records by security symbol
  const bySymbol: Record<string, RawMarketRecord[]> = {};
  for (const r of records) {
    const sym = r.symbol.trim().toUpperCase();
    if (!bySymbol[sym]) {
      bySymbol[sym] = [];
    }
    bySymbol[sym].push(r);
  }

  const rawMetricsList: SecurityHistoricalMetrics[] = [];
  const symbols = Object.keys(bySymbol);

  let qualifiedCount = 0;
  let watchlistCount = 0;
  let noSignalCount = 0;
  let insufficientHistoryCount = 0;

  // 3. Calculate per-security metrics
  for (const sym of symbols) {
    const history = bySymbol[sym];
    history.sort((a, b) => a.trading_date.localeCompare(b.trading_date));

    const latest = history[history.length - 1];
    const latestClose = Number(latest.close);
    const latestOpen = Number(latest.open);
    const latestHigh = Number(latest.high);
    const latestLow = Number(latest.low);
    const latestVolume = Number(latest.volume);
    const series = latest.series?.trim().toUpperCase() || undefined;

    // Highest high & highest close across all available historical days
    const historicalHighestHigh = Math.max(...history.map(h => Number(h.high)));
    const historicalHighestClose = Math.max(...history.map(h => Number(h.close)));

    // Distance to high percentage: ((Highest High - Latest Close) / Highest High) * 100
    const rawDistance = historicalHighestHigh > 0
      ? ((historicalHighestHigh - latestClose) / historicalHighestHigh) * 100
      : 0;
    const distanceToHighPercent = Math.max(0, parseFloat(rawDistance.toFixed(2)));

    // Multi-day momentum (requires >= 2 days of historical observations)
    let recentMomentumPercent: number | null = null;
    if (history.length >= 2) {
      const priorClose = Number(history[history.length - 2].close);
      if (priorClose > 0) {
        recentMomentumPercent = parseFloat((((latestClose - priorClose) / priorClose) * 100).toFixed(2));
      }
    }

    // Intraday return: ((Close - Open) / Open) * 100
    const intradayReturnPercent = latestOpen > 0
      ? parseFloat((((latestClose - latestOpen) / latestOpen) * 100).toFixed(2))
      : 0;

    // Determine Breakout Status
    let breakoutStatus: BreakoutStatus = 'Below High';
    if (distanceToHighPercent <= config.breakoutTolerancePercent) {
      breakoutStatus = 'Breakout';
    } else if (distanceToHighPercent <= config.watchlistProximityPercent) {
      breakoutStatus = 'Near Breakout';
    }

    // Filter validations
    const reasons: string[] = [];
    const isAllowedSeries = !series || config.allowedSeries.includes(series);
    if (!isAllowedSeries) {
      reasons.push(`Series "${series}" not in allowed equity segments (${config.allowedSeries.join(', ')})`);
    }

    const isLiquid = latestVolume >= config.minVolume;
    if (!isLiquid) {
      reasons.push(`Volume (${latestVolume.toLocaleString('en-IN')}) below minimum (${config.minVolume.toLocaleString('en-IN')})`);
    }

    const isPriceValid = latestClose >= config.minPrice;
    if (!isPriceValid) {
      reasons.push(`Price (₹${latestClose}) below ₹${config.minPrice}`);
    }

    // Determine Final Blue Sky Qualification Status
    let status: BlueSkyStatus = 'No Signal';

    if (breakoutStatus === 'Breakout') {
      if (isAllowedSeries && isLiquid && isPriceValid) {
        status = 'Qualified';
        reasons.push('Trading within breakout tolerance of historical high with verified volume.');
        qualifiedCount++;
      } else {
        status = 'Watchlist';
        watchlistCount++;
      }
    } else if (breakoutStatus === 'Near Breakout') {
      if (isAllowedSeries && isLiquid && isPriceValid) {
        status = 'Watchlist';
        reasons.push('Within proximity of high (watchlist setup).');
        watchlistCount++;
      } else {
        status = 'No Signal';
        noSignalCount++;
      }
    } else {
      status = 'No Signal';
      noSignalCount++;
    }

    rawMetricsList.push({
      symbol: sym,
      series,
      latestTradingDate: latest.trading_date,
      latestClose,
      latestOpen,
      latestHigh,
      latestLow,
      latestVolume,
      historicalHighestClose,
      historicalHighestHigh,
      distanceToHighPercent,
      recentMomentumPercent,
      intradayReturnPercent,
      tradingDaysCount: history.length,
      breakoutStatus,
      relativeStrengthPercentile: null, // Computed below across universe
      status,
      reasons,
    });
  }

  // 4. Calculate Universe Relative Strength Percentiles (0 to 100)
  // Ranked by proximity to high (lowest distance to high gets highest RS percentile)
  const sortedForRs = [...rawMetricsList].sort((a, b) => a.distanceToHighPercent - b.distanceToHighPercent);
  const totalCount = sortedForRs.length;

  for (let i = 0; i < totalCount; i++) {
    // Percentile rank: top proximity = 99th-100th percentile
    const percentile = Math.round(((totalCount - 1 - i) / (totalCount - 1 || 1)) * 100);
    sortedForRs[i].relativeStrengthPercentile = percentile;
  }

  // 5. Sort final results: Qualified first, then Watchlist, then No Signal
  const statusPriority: Record<BlueSkyStatus, number> = {
    'Qualified': 1,
    'Watchlist': 2,
    'Insufficient History': 3,
    'No Signal': 4,
  };

  rawMetricsList.sort((a, b) => {
    if (statusPriority[a.status] !== statusPriority[b.status]) {
      return statusPriority[a.status] - statusPriority[b.status];
    }
    // Secondary sort: closest distance to high first
    if (a.distanceToHighPercent !== b.distanceToHighPercent) {
      return a.distanceToHighPercent - b.distanceToHighPercent;
    }
    // Tertiary sort: highest volume first
    return b.latestVolume - a.latestVolume;
  });

  return {
    summary: {
      tradingDate: displayTradingDate,
      totalUniverse: symbols.length,
      qualifiedCount,
      watchlistCount,
      noSignalCount,
      insufficientHistoryCount,
      isSingleDayDataset,
      totalHistoricalDays,
      calculatedAt: new Date().toLocaleString('en-IN'),
    },
    securities: rawMetricsList,
    config,
  };
}
