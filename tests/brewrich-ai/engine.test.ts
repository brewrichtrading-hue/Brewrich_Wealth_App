/**
 * INTEGRATION TEST SUITE: BREWRICH AI WEB LAYER ↔ PYTHON STRATEGY ENGINE
 * 
 * Tests:
 * 1. Python API Health & Version metadata.
 * 2. Strategy Summary & authentic VOLAR ranking from Python DataLoader400 + StrategyEngine400.
 * 3. Real 10-Year Backtest metrics from BacktestEngine400 + PerformanceMetrics400.
 * 4. Persistent Paper Portfolio state loaded from canonical data/paper_state.json.
 * 5. Broker status masking (Dhan & Firstock tokens masked server-side).
 * 6. Fail-Closed Live Trading Lock (LIVE_ENABLED=false, PAPER_ONLY=true).
 */

import assert from 'assert';
import { getBrewrich400StateAsync, getBrewrich400BacktestAsync } from '../../lib/brewrich-ai/brewrich400Engine';
import { fetchPaperPortfolioFromPython } from '../../lib/brewrich-ai/paperExecution';
import { LIVE_ENABLED, PAPER_ONLY, fetchBrokerConnectionsFromPython, getRiskSafetyMetrics } from '../../lib/brewrich-ai/brokerService';

export async function runBrewrichAiTests() {
  console.log('================================================================');
  console.log('RUNNING BREWRICH AI ↔ PYTHON STRATEGY ENGINE INTEGRATION SUITE');
  console.log('================================================================\n');

  // TEST 1: Python Bridge Strategy Summary (Real DataLoader400 + StrategyEngine400)
  console.log('TEST 1: Fetching authentic Strategy Summary from Python bridge...');
  const strategy = await getBrewrich400StateAsync();
  assert(strategy.universeSize === 400, 'Universe size must equal 400 equities');
  assert(strategy.eligibleCount > 0, 'Eligible candidate count must be > 0');
  assert(strategy.topRanked.length > 0, 'Top ranked constituents must be returned');
  assert(strategy.engineVersion.includes('Authoritative Python'), 'Engine must report authoritative Python source');
  console.log(`✓ TEST 1 PASSED: Universe=${strategy.universeSize}, Eligible=${strategy.eligibleCount}, Top Ranked=${strategy.topRanked[0]?.symbol} (VOLAR: ${strategy.topRanked[0]?.momentumScore})\n`);

  // TEST 2: Real Backtest Results (BacktestEngine400 + PerformanceMetrics400)
  console.log('TEST 2: Fetching authentic Backtest Results from Python engine...');
  const backtest = await getBrewrich400BacktestAsync();
  assert(backtest.summary.cagrPct > 30.0, 'Authentic CAGR must exceed 30%');
  assert(backtest.summary.totalTrades === 226, 'Total trades on 10-year dataset must equal 226');
  assert(backtest.summary.sharpeRatio > 1.0, 'Sharpe ratio must exceed 1.0');
  assert(backtest.summary.endingCapital > 2500000, 'Ending capital must reflect ₹27.99L+ authentic NAV');
  console.log(`✓ TEST 2 PASSED: Real Backtest Verified -> CAGR: ${backtest.summary.cagrPct}%, Trades: ${backtest.summary.totalTrades}, Sharpe: ${backtest.summary.sharpeRatio}, Final NAV: ₹${backtest.summary.endingCapital.toLocaleString('en-IN')}\n`);

  // TEST 3: Persistent Paper Portfolio (data/paper_state.json)
  console.log('TEST 3: Fetching Paper Portfolio from Python PersistentPaperPortfolio...');
  const portfolio = await fetchPaperPortfolioFromPython();
  assert(portfolio.totalPortfolioValue > 0, 'Portfolio value must be positive');
  assert(portfolio.cashBalance >= 0, 'Cash balance must not be negative');
  console.log(`✓ TEST 3 PASSED: Paper NAV: ₹${portfolio.totalPortfolioValue.toLocaleString('en-IN')}, Cash: ₹${portfolio.cashBalance.toLocaleString('en-IN')}, Positions: ${portfolio.positions.length}\n`);

  // TEST 4: Broker Status Masking & Token Isolation
  console.log('TEST 4: Verifying Broker Status Masking & Token Isolation...');
  const brokers = await fetchBrokerConnectionsFromPython();
  assert(brokers.length === 2, 'Must return metadata for Dhan and Firstock');
  for (const b of brokers) {
    assert(b.tradingStatus === 'LOCKED', `Broker ${b.name} trading status must be LOCKED`);
    assert(!b.maskedClientId.includes('sk_'), 'Tokens must never leak into client ID');
    assert(b.maskedClientId.includes('*'), 'Client ID must be masked');
  }
  console.log('✓ TEST 4 PASSED: Dhan & Firstock metadata masked cleanly. Zero credentials exposed.\n');

  // TEST 5: Fail-Closed Live Trading Lock
  console.log('TEST 5: Verifying Fail-Closed Live Trading Lock...');
  assert(LIVE_ENABLED === false, 'LIVE_ENABLED must be strictly false');
  assert(PAPER_ONLY === true, 'PAPER_ONLY must be strictly true');
  const risk = getRiskSafetyMetrics();
  assert(risk.executionMode === 'PAPER', 'Risk engine must enforce PAPER execution');
  assert(risk.liveTradingStatus === 'LOCKED', 'Live trading status must be LOCKED');
  console.log('✓ TEST 5 PASSED: Live trading gate is 100% fail-closed and locked.\n');

  console.log('================================================================');
  console.log('ALL 5 INTEGRATION SUITE TESTS PASSED (100% SUCCESS)');
  console.log('================================================================\n');
}

// Auto-run if executed directly
if (typeof require !== 'undefined' && require.main === module) {
  runBrewrichAiTests().catch(err => {
    console.error('❌ TEST SUITE FAILED:', err);
    process.exit(1);
  });
}
