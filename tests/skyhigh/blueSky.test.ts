/**
 * DETERMINISTIC AUTOMATED TEST SUITE: BANANAPATTERNS BLUE SKY STRATEGY
 * 
 * Verifies all 15 boundary cases and specification mandates:
 * 1. Stock with RS 69 -> fails Blue Sky RS condition.
 * 2. Stock with RS 70 -> passes RS threshold.
 * 3. Stock with RS 99 -> strongest-end ranking.
 * 4. ATH calculated from complete available history, not 252 days.
 * 5. RS calculated from exactly the 252-session trailing price-performance measurement.
 * 6. ATH proximity is NOT used to calculate RS.
 * 7. Market Cap < ₹500 Cr -> fails eligibility.
 * 8. Market Cap = ₹500 Cr -> passes threshold.
 * 9. Average Daily Traded Value < ₹5 Cr -> fails liquidity.
 * 10. Average Daily Traded Value = ₹5 Cr -> passes threshold.
 * 11. Price within 20% of pivot -> candidate proximity condition passes.
 * 12. Price > pivot -> breakout condition.
 * 13. Price has not cleared pivot -> NOT breakout.
 * 14. Data after evaluation date cannot affect historical calculations.
 * 15. No VCP/contraction logic is executed anywhere in Blue Sky.
 */

import { calculateBlueSkyStrategy, RawMarketRecord, DEFAULT_BLUE_SKY_CONFIG } from '../../lib/skyhigh/blueSky';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion Failed: ${message}`);
  }
}

// Helper to generate N historical sessions
function generateHistory(
  symbol: string, 
  days: number, 
  startPrice: number, 
  endPrice: number, 
  highOverride?: number,
  volume: number = 200000
): RawMarketRecord[] {
  const records: RawMarketRecord[] = [];
  const priceStep = (endPrice - startPrice) / (days - 1 || 1);

  for (let i = 0; i < days; i++) {
    const dateNum = String(1000 + i).padStart(4, '0');
    const trading_date = `2024-01-01-${dateNum}`;
    const close = startPrice + i * priceStep;
    let high = close;
    if (i === days - 1 && highOverride !== undefined) {
      high = highOverride;
    }
    const low = close * 0.99;
    const open = close;

    records.push({
      symbol,
      trading_date,
      open,
      high,
      low,
      close,
      volume,
      series: 'EQ',
    });
  }

  return records;
}

export async function runBlueSkyTests() {
  console.log('================================================================');
  console.log('RUNNING BANANAPATTERNS BLUE SKY DETERMINISTIC ACCEPTANCE SUITE');
  console.log('================================================================\n');

  // ---------------------------------------------------------------------------
  // TEST 4: ATH calculated from complete available history, NOT 252 days
  // Stock has an old ATH 500 days ago (e.g. ₹2000) and recent prices around ₹1500.
  // ---------------------------------------------------------------------------
  console.log('TEST 4: ATH calculated from complete available history, not 252 days...');
  {
    const records = generateHistory('OLDATH_STOCK', 600, 1000, 1500, undefined, 500000);
    // Inject massive ATH 500 days ago (index 100)
    records[100].high = 2500;

    const result = calculateBlueSkyStrategy(records);
    const stock = result.securities.find(s => s.symbol === 'OLDATH_STOCK');

    assert(stock !== undefined, 'Stock must be in result');
    assert(stock!.allTimeHigh === 2500, `Expected ATH 2500 from 500 sessions ago, got ${stock!.allTimeHigh}`);
    assert(stock!.pivot === 2500, `Expected pivot to equal ATH 2500, got ${stock!.pivot}`);
    console.log('✓ TEST 4 PASSED: ATH correctly detected 500 sessions ago without 252-day clamping.\n');
  }

  // ---------------------------------------------------------------------------
  // TEST 5 & 6: RS calculated from exactly the 252-session trailing return
  // and ATH proximity is NOT used to calculate RS.
  // We create a universe of 100 stocks with 255 sessions each.
  // Stock A: Deeply 50% below ATH, but up +300% over past 252 sessions.
  // Stock B: At 0.1% from ATH, but only up +2% over past 252 sessions.
  // ---------------------------------------------------------------------------
  console.log('TEST 5 & 6: RS 252-session return vs ATH proximity independence...');
  {
    let universeRecords: RawMarketRecord[] = [];

    // Create 100 background stocks with trailing returns between 5% and 200%
    for (let s = 1; s <= 100; s++) {
      const sym = `STK_${String(s).padStart(3, '0')}`;
      const mult = 1 + (s / 100); // 1.01 to 2.00
      const recs = generateHistory(sym, 260, 100, 100 * mult, undefined, 500000);
      universeRecords = universeRecords.concat(recs);
    }

    // Stock A: Had old ATH of ₹1000, currently ₹500 (distance = 50% below ATH).
    // But 252 sessions ago was ₹100 -> Return = (500 / 100) - 1 = +400% (Massive RS!).
    const recsA = generateHistory('STOCK_A', 260, 100, 500, undefined, 500000);
    recsA[5].high = 1000; // Old ATH 255 sessions ago
    universeRecords = universeRecords.concat(recsA);

    // Stock B: At ATH ₹105 (0% below ATH), but 252 sessions ago was ₹100 -> Return = +5% (Low RS).
    const recsB = generateHistory('STOCK_B', 260, 100, 105, 105, 500000);
    universeRecords = universeRecords.concat(recsB);

    const result = calculateBlueSkyStrategy(universeRecords);
    const stockA = result.securities.find(s => s.symbol === 'STOCK_A')!;
    const stockB = result.securities.find(s => s.symbol === 'STOCK_B')!;

    assert(stockA.distanceToPivotPercent === 50, `Stock A distance should be 50%, got ${stockA.distanceToPivotPercent}%`);
    assert(stockA.relativeStrengthScore === 99, `Stock A (+400% return) should have RS 99 despite being 50% below ATH, got ${stockA.relativeStrengthScore}`);
    
    assert(stockB.distanceToPivotPercent === 0, `Stock B distance should be 0%, got ${stockB.distanceToPivotPercent}%`);
    assert((stockB.relativeStrengthScore ?? 0) <= 10, `Stock B (+5% return) must have low RS despite being AT ATH, got ${stockB.relativeStrengthScore}`);

    console.log(`✓ TEST 5 & 6 PASSED: Stock A (50% below ATH) has RS ${stockA.relativeStrengthScore}. Stock B (At ATH) has RS ${stockB.relativeStrengthScore}. Proximity is NOT RS.\n`);
  }

  // ---------------------------------------------------------------------------
  // TEST 1, 2, 3: RS Thresholds (RS 69 fails, RS 70 passes, RS 99 strongest)
  // ---------------------------------------------------------------------------
  console.log('TEST 1, 2, 3: RS boundary tests (RS 69, 70, 99)...');
  {
    // Generate universe of 100 stocks to get 1:1 RS percentiles from 1 to 99
    let universeRecords: RawMarketRecord[] = [];
    for (let r = 0; r < 99; r++) {
      const sym = `RANK_${r}`;
      // Return: (100 + r) / 100 - 1
      const recs = generateHistory(sym, 255, 100, 100 + r, 100 + r, 500000);
      universeRecords = universeRecords.concat(recs);
    }

    const result = calculateBlueSkyStrategy(universeRecords);
    
    // Find stock with RS 69
    const stock69 = result.securities.find(s => s.relativeStrengthScore === 69);
    // Find stock with RS 70
    const stock70 = result.securities.find(s => s.relativeStrengthScore === 70);
    // Find stock with RS 99
    const stock99 = result.securities.find(s => s.relativeStrengthScore === 99);

    assert(stock69 !== undefined, 'Stock with RS 69 should exist in 99-stock ranked universe');
    assert(stock70 !== undefined, 'Stock with RS 70 should exist in 99-stock ranked universe');
    assert(stock99 !== undefined, 'Stock with RS 99 should exist in 99-stock ranked universe');

    assert(stock69!.eligibility.rsPass === false, 'Stock with RS 69 must fail RS pass');
    assert(stock69!.status === 'NOT QUALIFIED', 'Stock with RS 69 must be NOT QUALIFIED');

    assert(stock70!.eligibility.rsPass === true, 'Stock with RS 70 must pass RS pass');
    assert(stock70!.status === 'BLUE SKY CANDIDATE' || stock70!.status === 'BLUE SKY BREAKOUT', 'Stock with RS 70 must qualify');

    assert(stock99!.eligibility.rsPass === true, 'Stock with RS 99 must pass RS pass');
    assert(stock99!.relativeStrengthScore === 99, 'Stock with RS 99 is strongest rank');

    console.log(`✓ TEST 1, 2, 3 PASSED: RS 69 -> ${stock69!.status}. RS 70 -> ${stock70!.status}. RS 99 -> Rank ${stock99!.relativeStrengthScore}.\n`);
  }

  // ---------------------------------------------------------------------------
  // TEST 7 & 8: Market Cap (< ₹500 Cr fails, = ₹500 Cr passes)
  // ---------------------------------------------------------------------------
  console.log('TEST 7 & 8: Market Cap thresholds (< ₹500 Cr fails, >= ₹500 Cr passes)...');
  {
    const recs499 = generateHistory('MCAP_499', 260, 100, 200, 200, 500000);
    const recs500 = generateHistory('MCAP_500', 260, 100, 200, 200, 500000);

    const result = calculateBlueSkyStrategy([...recs499, ...recs500], DEFAULT_BLUE_SKY_CONFIG, {
      marketCapMap: {
        'MCAP_499': 499, // ₹499 Cr
        'MCAP_500': 500, // ₹500 Cr
      }
    });

    const stock499 = result.securities.find(s => s.symbol === 'MCAP_499')!;
    const stock500 = result.securities.find(s => s.symbol === 'MCAP_500')!;

    assert(stock499.eligibility.marketCapPass === false, 'Market cap 499 Cr must fail marketCapPass');
    assert(stock499.status === 'NOT QUALIFIED', 'Market cap 499 Cr must be NOT QUALIFIED');

    assert(stock500.eligibility.marketCapPass === true, 'Market cap 500 Cr must pass marketCapPass');
    console.log('✓ TEST 7 & 8 PASSED: ₹499 Cr fails eligibility, ₹500 Cr passes.\n');
  }

  // ---------------------------------------------------------------------------
  // TEST 9 & 10: Average Daily Traded Value (< ₹5 Cr fails, = ₹5 Cr passes)
  // ---------------------------------------------------------------------------
  console.log('TEST 9 & 10: Average Daily Traded Value (< ₹5 Cr fails, >= ₹5 Cr passes)...');
  {
    // Price = ₹100. For ₹4.9 Cr daily traded value: volume = 490,000 shares -> 4.9 Cr
    const recs4_9Cr = generateHistory('TURNOVER_4_9', 260, 100, 100, 100, 490000);
    // Price = ₹100. For ₹5.0 Cr daily traded value: volume = 500,000 shares -> 5.0 Cr
    const recs5_0Cr = generateHistory('TURNOVER_5_0', 260, 100, 100, 100, 500000);

    const result = calculateBlueSkyStrategy([...recs4_9Cr, ...recs5_0Cr]);

    const stock4_9 = result.securities.find(s => s.symbol === 'TURNOVER_4_9')!;
    const stock5_0 = result.securities.find(s => s.symbol === 'TURNOVER_5_0')!;

    assert(stock4_9.avgDailyTradedValueCrores === 4.9, `Expected 4.9 Cr, got ${stock4_9.avgDailyTradedValueCrores}`);
    assert(stock4_9.eligibility.liquidityPass === false, '4.9 Cr must fail liquidityPass');
    assert(stock4_9.status === 'NOT QUALIFIED', '4.9 Cr must be NOT QUALIFIED');

    assert(stock5_0.avgDailyTradedValueCrores === 5.0, `Expected 5.0 Cr, got ${stock5_0.avgDailyTradedValueCrores}`);
    assert(stock5_0.eligibility.liquidityPass === true, '5.0 Cr must pass liquidityPass');
    console.log('✓ TEST 9 & 10 PASSED: ₹4.9 Cr fails liquidity, ₹5.0 Cr passes.\n');
  }

  // ---------------------------------------------------------------------------
  // TEST 11, 12, 13: Price within 20% vs Breakout (Close > Pivot) vs Not Cleared
  // ---------------------------------------------------------------------------
  console.log('TEST 11, 12, 13: Candidate proximity (<= 20%) vs Breakout (Close > Pivot)...');
  {
    // ATH = ₹1000 for all three
    // Stock 1: Price ₹750 (25% below ATH) -> NOT qualified (outside 20%)
    const recs25Below = generateHistory('PROX_25_BELOW', 260, 500, 750, undefined, 600000);
    recs25Below[10].high = 1000;

    // Stock 2: Price ₹800 (20% below ATH) -> BLUE SKY CANDIDATE
    const recs20Below = generateHistory('PROX_20_BELOW', 260, 500, 800, undefined, 600000);
    recs20Below[10].high = 1000;

    // Stock 3: Price ₹996 (0.4% below ATH, exactly at 996 / 1000) -> NOT BREAKOUT! Candidate only!
    const recs0_4Below = generateHistory('PROX_0_4_BELOW', 260, 500, 996, undefined, 600000);
    recs0_4Below[10].high = 1000;

    // Stock 4: Price ₹1001 (Clears ATH 1000) -> BLUE SKY BREAKOUT!
    const recsBreakout = generateHistory('PROX_BREAKOUT', 260, 500, 1001, 1001, 600000);
    recsBreakout[10].high = 1000;

    // Add 10 lower-return background stocks so our test stocks rank with high RS (>= 70)
    let backgroundPool: RawMarketRecord[] = [];
    for (let b = 1; b <= 10; b++) {
      backgroundPool = backgroundPool.concat(generateHistory(`BG_${b}`, 260, 500, 510, undefined, 600000));
    }

    const result = calculateBlueSkyStrategy([
      ...backgroundPool,
      ...recs25Below, 
      ...recs20Below, 
      ...recs0_4Below, 
      ...recsBreakout
    ]);

    const s25 = result.securities.find(s => s.symbol === 'PROX_25_BELOW')!;
    const s20 = result.securities.find(s => s.symbol === 'PROX_20_BELOW')!;
    const s0_4 = result.securities.find(s => s.symbol === 'PROX_0_4_BELOW')!;
    const sBreak = result.securities.find(s => s.symbol === 'PROX_BREAKOUT')!;

    assert(s25.distanceToPivotPercent === 25, `Expected 25% distance, got ${s25.distanceToPivotPercent}%`);
    assert(s25.breakoutStatus === 'Below Pivot (>20%)', 'Must be Below Pivot (>20%)');
    assert(s25.status === 'NOT QUALIFIED', '25% below ATH must be NOT QUALIFIED');

    assert(s20.distanceToPivotPercent === 20, `Expected 20% distance, got ${s20.distanceToPivotPercent}%`);
    assert(s20.breakoutStatus === 'Within 20% Pivot', 'Must be Within 20% Pivot');
    assert(s20.status === 'BLUE SKY CANDIDATE', '20% below ATH must be BLUE SKY CANDIDATE');

    assert(s0_4.distanceToPivotPercent === 0.4, `Expected 0.4% distance, got ${s0_4.distanceToPivotPercent}%`);
    assert(s0_4.breakoutStatus === 'Within 20% Pivot', '0.4% below ATH must NOT be breakout');
    assert(s0_4.status === 'BLUE SKY CANDIDATE', '0.4% below ATH must be BLUE SKY CANDIDATE, not breakout');

    assert(sBreak.breakoutStatus === 'Breakout', 'Close > Pivot must be Breakout');
    assert(sBreak.status === 'BLUE SKY BREAKOUT', 'Must be BLUE SKY BREAKOUT');

    console.log('✓ TEST 11, 12, 13 PASSED: Candidate proximity strictly <= 20%. Breakout strictly Close > Pivot.\n');
  }

  // ---------------------------------------------------------------------------
  // TEST 14: Data after evaluation date cannot affect historical calculations
  // ---------------------------------------------------------------------------
  console.log('TEST 14: No look-ahead bias (evaluation date filtering)...');
  {
    // Generate 300 sessions up to 2024-01-01-1300
    const recs = generateHistory('EVAL_TEST', 300, 100, 300, 300, 500000);
    // At session 299 (last session), price spikes to ₹5000
    recs[299].high = 5000;
    recs[299].close = 5000;

    // Evaluate at session 250 (trading_date = '2024-01-01-1250')
    const evalCutoff = recs[250].trading_date;
    const expectedCloseAtCutoff = recs[250].close;

    const result = calculateBlueSkyStrategy(recs, DEFAULT_BLUE_SKY_CONFIG, {
      evaluationDate: evalCutoff
    });

    const stock = result.securities.find(s => s.symbol === 'EVAL_TEST')!;
    assert(stock.latestClose === expectedCloseAtCutoff, `Close at cutoff should be ${expectedCloseAtCutoff}, got ${stock.latestClose}`);
    assert(stock.allTimeHigh < 5000, `Future ATH (5000) at session 299 must NOT leak into evaluation at session 250! Got ${stock.allTimeHigh}`);
    console.log(`✓ TEST 14 PASSED: Cutoff ${evalCutoff} completely isolates historical state. Zero look-ahead bias.\n`);
  }

  // ---------------------------------------------------------------------------
  // TEST 15: No VCP / Contraction logic is executed anywhere in Blue Sky
  // ---------------------------------------------------------------------------
  console.log('TEST 15: Verification of zero VCP / contraction logic...');
  {
    const result = calculateBlueSkyStrategy(generateHistory('NO_VCP', 260, 100, 200, 200, 500000));
    const stock = result.securities[0];
    
    assert(stock.baseStatus === 'UNRESOLVED (Conceptual Requirement)', 'Base status must be explicitly UNRESOLVED');
    assert((stock as any).vcpStage === undefined, 'No VCP stage property allowed');
    assert((stock as any).contractionCount === undefined, 'No contraction count property allowed');
    assert((stock as any).volatilityContraction === undefined, 'No volatility contraction allowed');
    console.log('✓ TEST 15 PASSED: Zero VCP/contraction logic executed.\n');
  }

  console.log('================================================================');
  console.log('🎉 ALL 15 BANANAPATTERNS BLUE SKY ACCEPTANCE TESTS PASSED!');
  console.log('================================================================\n');
}

runBlueSkyTests().catch(err => {
  console.error('❌ TEST SUITE FAILED:', err);
  process.exit(1);
});
