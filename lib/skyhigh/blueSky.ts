/**
 * BREWRICH SKY HIGH - BANANAPATTERNS BLUE SKY STRATEGY ENGINE
 * 
 * Strict implementation of the approved BananaPatterns Blue Sky Specification:
 * 1. Historical All-Time High (ATH): Maximum HIGH across complete available historical dataset.
 * 2. Blue Sky Pivot: The historical ATH itself (pivot = ATH).
 * 3. Pre-Breakout Candidate Proximity: Within 20% of pivot (distanceToPivot <= 20.0%).
 * 4. Relative Strength Ranking (RS 1-99):
 *    - TrailingReturn252 = (CurrentPrice / Price252SessionsAgo) - 1.
 *    - Cross-sectional ranking: RS = 1 + 98 * (countLower / (N - 1)), clamped to 1-99.
 *    - Mandatory filter: RS >= 70.
 * 5. Breakout Trigger: Current Close > Pivot (strictly clearing the ATH ceiling).
 * 6. Eligible Universe:
 *    - Market Cap >= ₹500 Cr (marked DATA UNAVAILABLE if shares data absent, never fabricated).
 *    - Average Daily Traded Value >= ₹5 Cr (daily turnover Close * Volume >= 50,000,000).
 * 7. Base Detection: Explicitly exposed as UNRESOLVED (not fabricated).
 * 8. Zero VCP, zero 252-day/52-week rolling high substitution, zero look-ahead bias.
 */

import { createClient } from '@/lib/supabase/client';
import { 
  BlueSkyConfig, 
  SecurityHistoricalMetrics, 
  BlueSkySummary, 
  BlueSkyEngineResult, 
  BreakoutStatus, 
  BlueSkyStatus,
  BaseStatus,
  SecurityPipelineStage
} from './types';
import { formatDisplayDate } from './normalizer';

// ==============================================================================
// 1. APPROVED BLUE SKY CONFIGURATION
// ==============================================================================

export const DEFAULT_BLUE_SKY_CONFIG: BlueSkyConfig = {
  proximityThresholdPercent: 20.0,    // Approved 20.0% candidate proximity to pivot
  minRelativeStrength: 70,           // Approved mandatory RS >= 70 (scale 1-99)
  minMarketCapCrores: 500,           // Approved ₹500 Cr Market Cap floor
  minAvgDailyTradedValueCrores: 5,   // Approved ₹5 Cr Average Daily Traded Value floor
  minTradingSessionsForRS: 252,      // Approved 252 trading sessions lookback for RS
  allowedSeries: ['EQ', 'BE', 'SM'], // Standard NSE primary equity series
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

export interface StrategyCalculationOptions {
  evaluationDate?: string;               // Evaluation date cut-off (prevents look-ahead bias)
  marketCapMap?: Record<string, number>; // Optional known market caps in ₹ Crores
  companyMap?: Record<string, string>;   // Optional security company names
}

export function calculateBlueSkyStrategy(
  records: RawMarketRecord[],
  config: BlueSkyConfig = DEFAULT_BLUE_SKY_CONFIG,
  options?: StrategyCalculationOptions
): BlueSkyEngineResult {
  if (!records || records.length === 0) {
    return {
      summary: {
        tradingDate: '—',
        totalUniverse: 0,
        breakoutCount: 0,
        candidateCount: 0,
        notQualifiedCount: 0,
        insufficientHistoryCount: 0,
        isSingleDayDataset: true,
        isScreenReady: false,
        totalHistoricalDays: 0,
        calculatedAt: new Date().toLocaleString('en-IN'),
      },
      securities: [],
      config,
    };
  }

  // 1. Apply Evaluation Date Filtering (Data-history awareness — NO look-ahead bias)
  const evalDate = options?.evaluationDate;
  const filteredRecords = evalDate
    ? records.filter(r => r.trading_date <= evalDate)
    : records;

  if (filteredRecords.length === 0) {
    return {
      summary: {
        tradingDate: evalDate || '—',
        totalUniverse: 0,
        breakoutCount: 0,
        candidateCount: 0,
        notQualifiedCount: 0,
        insufficientHistoryCount: 0,
        isSingleDayDataset: true,
        isScreenReady: false,
        totalHistoricalDays: 0,
        calculatedAt: new Date().toLocaleString('en-IN'),
      },
      securities: [],
      config,
    };
  }

  // 2. Identify distinct trading dates up to evaluation date
  const distinctDates = Array.from(new Set(filteredRecords.map(r => r.trading_date))).sort();
  const totalHistoricalDays = distinctDates.length;
  const isSingleDayDataset = totalHistoricalDays <= 1;
  const latestDateIso = distinctDates[distinctDates.length - 1];
  const displayTradingDate = formatDisplayDate(latestDateIso);

  // 3. Group records by security symbol
  const bySymbol: Record<string, RawMarketRecord[]> = {};
  for (const r of filteredRecords) {
    const sym = r.symbol.trim().toUpperCase();
    if (!bySymbol[sym]) {
      bySymbol[sym] = [];
    }
    bySymbol[sym].push(r);
  }

  const symbols = Object.keys(bySymbol);

  // Intermediate candidate metrics per symbol
  interface IntermediateMetrics {
    symbol: string;
    company?: string;
    series?: string;
    evaluationDate: string;
    latestClose: number;
    latestOpen: number;
    latestHigh: number;
    latestLow: number;
    latestVolume: number;
    allTimeHigh: number;
    pivot: number;
    distanceToPivotPercent: number;
    trailingReturn252: number | null;
    marketCapCrores: number | null;
    avgDailyTradedValueCrores: number;
    totalSessionsAvailable: number;
    isSeriesAllowed: boolean;
    isLiquid: boolean;
    isMarketCapValid: boolean | 'UNAVAILABLE';
  }

  const intermediateList: IntermediateMetrics[] = [];

  for (const sym of symbols) {
    const history = bySymbol[sym];
    // Sort strictly chronological ascending
    history.sort((a, b) => a.trading_date.localeCompare(b.trading_date));

    const totalSessions = history.length;
    const latest = history[totalSessions - 1];
    const latestClose = Number(latest.close);
    const latestOpen = Number(latest.open);
    const latestHigh = Number(latest.high);
    const latestLow = Number(latest.low);
    const latestVolume = Number(latest.volume);
    const series = latest.series?.trim().toUpperCase() || undefined;

    // Rule 1 & Rule 3: ATH = maximum high across COMPLETE available history up to evaluationDate
    // NOT rolling 252-day or 52-week
    const allTimeHigh = Math.max(...history.map(h => Number(h.high)));

    // Rule 2: Blue Sky Pivot IS the Historical ATH ceiling to clear.
    // If multiple sessions exist, the pivot ceiling being cleared/tested is the prior ATH
    // (or allTimeHigh if price has not yet cleared it).
    const priorHistory = history.slice(0, totalSessions - 1);
    const priorAth = priorHistory.length > 0
      ? Math.max(...priorHistory.map(h => Number(h.high)))
      : allTimeHigh;

    const pivot = (latestClose > priorAth && priorAth > 0) ? priorAth : allTimeHigh;

    // Rule 5: 20% Proximity Rule: distanceToPivotPercent = ((pivot - latestClose) / pivot) * 100
    // If latestClose > pivot (breakout), distance is 0.0%
    const rawDistance = pivot > 0 && latestClose <= pivot
      ? ((pivot - latestClose) / pivot) * 100
      : 0;
    const distanceToPivotPercent = Math.max(0, parseFloat(rawDistance.toFixed(2)));

    // Rule 1 & 6: Eligible Universe & Average Daily Traded Value
    // Average daily traded turnover (Close * Volume) in ₹ Crores
    let totalTradedValue = 0;
    for (const h of history) {
      totalTradedValue += Number(h.close) * Number(h.volume);
    }
    const avgDailyTradedValueRupees = totalSessions > 0 ? totalTradedValue / totalSessions : 0;
    const avgDailyTradedValueCrores = parseFloat((avgDailyTradedValueRupees / 10000000).toFixed(2));

    // Rule 1: Market Cap
    const marketCapCrores = options?.marketCapMap?.[sym] ?? null;
    let isMarketCapValid: boolean | 'UNAVAILABLE' = 'UNAVAILABLE';
    if (marketCapCrores !== null) {
      isMarketCapValid = marketCapCrores >= config.minMarketCapCrores;
    }

    const isSeriesAllowed = !series || config.allowedSeries.includes(series);
    const isLiquid = avgDailyTradedValueCrores >= config.minAvgDailyTradedValueCrores;

    // Rule 2: Trailing 252-Session Return calculation
    // TrailingReturn252 = (CurrentPrice / Price252SessionsAgo) - 1
    let trailingReturn252: number | null = null;
    if (totalSessions >= config.minTradingSessionsForRS) {
      // Find session 252 sessions prior
      const priorIndex = totalSessions - 1 - config.minTradingSessionsForRS;
      const priorSession = history[Math.max(0, priorIndex)];
      const priorClose = Number(priorSession.close);
      if (priorClose > 0) {
        trailingReturn252 = (latestClose / priorClose) - 1;
      }
    }

    const company = options?.companyMap?.[sym] || undefined;

    intermediateList.push({
      symbol: sym,
      company,
      series,
      evaluationDate: latest.trading_date,
      latestClose,
      latestOpen,
      latestHigh,
      latestLow,
      latestVolume,
      allTimeHigh,
      pivot,
      distanceToPivotPercent,
      trailingReturn252,
      marketCapCrores,
      avgDailyTradedValueCrores,
      totalSessionsAvailable: totalSessions,
      isSeriesAllowed,
      isLiquid,
      isMarketCapValid,
    });
  }

  // ==============================================================================
  // 4. CROSS-SECTIONAL RELATIVE STRENGTH (RS) RANKING (1 TO 99)
  // ==============================================================================
  // Only stocks with at least 252 sessions participate in cross-sectional ranking
  const rsEligible = intermediateList.filter(item => item.trailingReturn252 !== null);
  const N = rsEligible.length;

  const rsScoreMap: Record<string, number> = {};

  if (N > 0) {
    // Extract all trailing returns
    const allReturns = rsEligible.map(item => item.trailingReturn252 as number);

    for (const item of rsEligible) {
      const ret = item.trailingReturn252 as number;
      // count of eligible stocks with lower trailing return
      let countLower = 0;
      for (const otherRet of allReturns) {
        if (otherRet < ret) {
          countLower++;
        }
      }

      let score: number;
      if (N === 1) {
        score = 99;
      } else {
        // RS ≈ 1 + 98 * (countLower / (N - 1))
        score = 1 + Math.round((98 * countLower) / (N - 1));
      }

      // Clamp between 1 and 99
      rsScoreMap[item.symbol] = Math.min(99, Math.max(1, score));
    }
  }

  // ==============================================================================
  // 5. QUALIFICATION & BREAKOUT EVALUATION
  // ==============================================================================
  const finalSecurities: SecurityHistoricalMetrics[] = [];

  let breakoutCount = 0;
  let candidateCount = 0;
  let notQualifiedCount = 0;
  let insufficientHistoryCount = 0;

  for (const item of intermediateList) {
    const rs = rsScoreMap[item.symbol] ?? null;
    const reasons: string[] = [];

    // Eligible universe verification
    const historyLengthPass = item.totalSessionsAvailable >= config.minTradingSessionsForRS;
    if (!historyLengthPass) {
      reasons.push(`Insufficient history: ${item.totalSessionsAvailable} sessions available (< ${config.minTradingSessionsForRS} required for RS ranking).`);
    }

    const liquidityPass = item.isLiquid;
    if (!liquidityPass) {
      reasons.push(`Average daily traded value (₹${item.avgDailyTradedValueCrores} Cr) below ₹${config.minAvgDailyTradedValueCrores} Cr floor.`);
    }

    const seriesPass = item.isSeriesAllowed;
    if (!seriesPass) {
      reasons.push(`Series "${item.series}" not in allowed equity segments (${config.allowedSeries.join(', ')}).`);
    }

    let marketCapPass = item.isMarketCapValid;
    if (marketCapPass === false) {
      reasons.push(`Market Cap (₹${item.marketCapCrores} Cr) below ₹${config.minMarketCapCrores} Cr floor.`);
    } else if (marketCapPass === 'UNAVAILABLE') {
      reasons.push('Market Cap data not present in daily OHLCV dataset (unresolved).');
    }

    const rsPass = rs !== null && rs >= config.minRelativeStrength;
    if (rs !== null && !rsPass) {
      reasons.push(`Relative Strength (${rs}) below mandatory threshold (${config.minRelativeStrength}).`);
    }

    // Breakout condition: Current Close > Pivot (clearing the pivot)
    const isBreakout = item.latestClose > item.pivot;

    // Candidate proximity condition: within 20% of pivot
    const isWithin20Percent = item.distanceToPivotPercent <= config.proximityThresholdPercent;

    let breakoutStatus: BreakoutStatus;
    if (isBreakout) {
      breakoutStatus = 'Breakout';
    } else if (isWithin20Percent) {
      breakoutStatus = 'Within 20% Pivot';
    } else {
      breakoutStatus = 'Below Pivot (>20%)';
      reasons.push(`Distance to pivot (${item.distanceToPivotPercent}%) exceeds 20.0% candidate window.`);
    }

    // Base detection status is explicitly exposed as UNRESOLVED
    const baseStatus: BaseStatus = 'UNRESOLVED (Conceptual Requirement)';

    // Overall Blue Sky status
    let status: BlueSkyStatus;

    const passesUniverseAndLiquidity = seriesPass && liquidityPass && marketCapPass !== false;

    if (!historyLengthPass) {
      status = 'INSUFFICIENT HISTORY';
      insufficientHistoryCount++;
    } else if (isBreakout && rsPass && passesUniverseAndLiquidity) {
      status = 'BLUE SKY BREAKOUT';
      reasons.push('Price cleared the All-Time High pivot with Relative Strength >= 70.');
      breakoutCount++;
    } else if (isWithin20Percent && rsPass && passesUniverseAndLiquidity) {
      status = 'BLUE SKY CANDIDATE';
      reasons.push('Within 20% candidate proximity of ATH pivot with Relative Strength >= 70.');
      candidateCount++;
    } else {
      status = 'NOT QUALIFIED';
      notQualifiedCount++;
    }

    // Explicit Data Pipeline Stage determination
    let pipelineStage: SecurityPipelineStage = 'UNIVERSE';
    if (!historyLengthPass) {
      pipelineStage = 'INSUFFICIENT_HISTORY';
    } else if (!passesUniverseAndLiquidity) {
      pipelineStage = 'NOT_QUALIFIED';
    } else if (rs === null) {
      pipelineStage = 'RS_ELIGIBLE';
    } else if (rs < config.minRelativeStrength) {
      pipelineStage = 'NOT_QUALIFIED';
    } else if (status === 'BLUE SKY BREAKOUT') {
      pipelineStage = 'BLUE_SKY_BREAKOUT';
    } else if (status === 'BLUE SKY CANDIDATE') {
      pipelineStage = 'BLUE_SKY_CANDIDATE';
    } else {
      pipelineStage = 'RS_PASS';
    }

    finalSecurities.push({
      symbol: item.symbol,
      company: item.company,
      series: item.series,
      evaluationDate: item.evaluationDate,
      latestClose: item.latestClose,
      latestOpen: item.latestOpen,
      latestHigh: item.latestHigh,
      latestLow: item.latestLow,
      latestVolume: item.latestVolume,
      allTimeHigh: item.allTimeHigh,
      pivot: item.pivot,
      distanceToPivotPercent: item.distanceToPivotPercent,
      trailingReturn252: item.trailingReturn252 !== null ? parseFloat((item.trailingReturn252 * 100).toFixed(2)) : null,
      relativeStrengthScore: rs,
      marketCapCrores: item.marketCapCrores,
      avgDailyTradedValueCrores: item.avgDailyTradedValueCrores,
      totalSessionsAvailable: item.totalSessionsAvailable,
      pipelineStage,
      baseStatus,
      breakoutStatus,
      status,
      reasons,
      eligibility: {
        marketCapPass,
        liquidityPass,
        historyLengthPass,
        rsPass,
        proximityPass: isWithin20Percent,
        breakoutPass: isBreakout,
      },
    });
  }

  // ==============================================================================
  // 6. SORT RESULTS DETERMINISTICALLY
  // ==============================================================================
  // Priority: BLUE SKY BREAKOUT -> BLUE SKY CANDIDATE -> NOT QUALIFIED -> INSUFFICIENT HISTORY
  const statusPriority: Record<BlueSkyStatus, number> = {
    'BLUE SKY BREAKOUT': 1,
    'BLUE SKY CANDIDATE': 2,
    'NOT QUALIFIED': 3,
    'INSUFFICIENT HISTORY': 4,
  };

  finalSecurities.sort((a, b) => {
    if (statusPriority[a.status] !== statusPriority[b.status]) {
      return statusPriority[a.status] - statusPriority[b.status];
    }
    // Secondary sort: highest RS first
    const rsA = a.relativeStrengthScore ?? -1;
    const rsB = b.relativeStrengthScore ?? -1;
    if (rsA !== rsB) {
      return rsB - rsA;
    }
    // Tertiary sort: closest distance to pivot first
    if (a.distanceToPivotPercent !== b.distanceToPivotPercent) {
      return a.distanceToPivotPercent - b.distanceToPivotPercent;
    }
    // Quaternary sort: highest average daily turnover
    return b.avgDailyTradedValueCrores - a.avgDailyTradedValueCrores;
  });

  const isScreenReady = totalHistoricalDays >= config.minTradingSessionsForRS && N >= 10;

  return {
    summary: {
      tradingDate: displayTradingDate,
      totalUniverse: symbols.length,
      breakoutCount,
      candidateCount,
      notQualifiedCount,
      insufficientHistoryCount,
      isSingleDayDataset,
      isScreenReady,
      totalHistoricalDays,
      calculatedAt: new Date().toLocaleString('en-IN'),
    },
    securities: finalSecurities,
    config,
  };
}
