/**
 * BREWRICH SKY HIGH - HISTORICAL COVERAGE SERVICE
 * 
 * Computes transparent market-wide historical depth and readiness metrics:
 * - Total Universe Securities
 * - Securities with Historical Data (>= 1 session)
 * - Securities with >= 252 sessions (RS-Eligible)
 * - Securities with >= 1 year (>= 240 sessions), 3 years (>= 720), 5 years (>= 1200)
 * - Earliest and Latest available exchange trading dates
 * - Determines whether the market-wide Blue Sky screen is READY or NOT READY
 */

import { createClient } from '@/lib/supabase/client';
import { HistoricalCoverageMetrics } from './types';
import { getDefinedgeMaster } from './definedgeMaster';

export async function computeHistoricalCoverage(): Promise<HistoricalCoverageMetrics> {
  const supabase = createClient();

  // 1. Get Master universe count
  let totalUniverseSecurities = 7119;
  try {
    const master = await getDefinedgeMaster();
    totalUniverseSecurities = master.allSecurities.filter(s => s.series === 'EQ').length || master.allSecurities.length;
  } catch {
    // Default fallback
  }

  // 2. Query registered trading days
  const { data: days, count: daysCount, error: daysErr } = await supabase
    .from('skyhigh_trading_days')
    .select('trading_date', { count: 'exact' })
    .order('trading_date', { ascending: true });

  const totalTradingSessions = daysCount || (days ? days.length : 0);
  const earliestTradingDate = days && days.length > 0 ? days[0].trading_date : '—';
  const latestTradingDate = days && days.length > 0 ? days[days.length - 1].trading_date : '—';

  // 3. Query total rows in skyhigh_market_data
  const { count: totalMarketRecords } = await supabase
    .from('skyhigh_market_data')
    .select('*', { count: 'exact', head: true });

  // 4. Query symbols and session counts per symbol
  // We fetch symbol and trading_date to aggregate session counts
  const { data: rawRows, error: dataErr } = await supabase
    .from('skyhigh_market_data')
    .select('symbol');

  let securitiesWithHistory = 0;
  let securitiesWith252Sessions = 0;
  let securitiesWith1Year = 0;
  let securitiesWith3Years = 0;
  let securitiesWith5Years = 0;

  if (rawRows && rawRows.length > 0) {
    const symbolCounts: Record<string, number> = {};
    for (const r of rawRows) {
      symbolCounts[r.symbol] = (symbolCounts[r.symbol] || 0) + 1;
    }

    const uniqueSymbols = Object.keys(symbolCounts);
    securitiesWithHistory = uniqueSymbols.length;

    for (const sym of uniqueSymbols) {
      const count = symbolCounts[sym];
      if (count >= 252) securitiesWith252Sessions++;
      if (count >= 240) securitiesWith1Year++;
      if (count >= 720) securitiesWith3Years++;
      if (count >= 1200) securitiesWith5Years++;
    }
  }

  // 5. Determine Screen Readiness Gate
  const isScreenReady = totalTradingSessions >= 252 && securitiesWith252Sessions >= 10;
  let readinessReason = '';

  if (!isScreenReady) {
    if (totalTradingSessions < 252) {
      readinessReason = `Insufficient market-wide historical depth: ${totalTradingSessions} / 252+ required trading sessions. Cross-sectional RS ranking cannot be formed without 252 historical sessions.`;
    } else if (securitiesWith252Sessions < 10) {
      readinessReason = `Insufficient eligible universe: Only ${securitiesWith252Sessions} securities have >= 252 sessions. Cross-sectional ranking requires a representative universe.`;
    }
  } else {
    readinessReason = `Market-wide historical coverage satisfied: ${securitiesWith252Sessions} securities have >= 252 sessions across ${totalTradingSessions} trading sessions.`;
  }

  return {
    totalUniverseSecurities,
    securitiesWithHistory,
    securitiesWith252Sessions,
    securitiesWith1Year,
    securitiesWith3Years,
    securitiesWith5Years,
    earliestTradingDate,
    latestTradingDate,
    totalTradingSessions,
    totalMarketRecords: totalMarketRecords || 0,
    isScreenReady,
    readinessReason,
  };
}
