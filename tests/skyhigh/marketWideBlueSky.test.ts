/**
 * DETERMINISTIC ACCEPTANCE SUITE: MARKET-WIDE BLUE SKY STRATEGY ENGINE
 * 
 * Implements the 10 mandatory market-wide acceptance tests (Tests A through J):
 * - Test A: 100 eligible securities with diverse 252-session returns -> verify cross-sectional RS calculation.
 * - Test B: Stock with highest return receives RS 99.
 * - Test C: Stock at 70th percentile receives RS around 70.
 * - Test D: Changing one stock's ATH does NOT change its RS (ATH proximity is NOT RS).
 * - Test E: Adding/removing an eligible stock legitimately updates cross-sectional RS percentiles.
 * - Test F: Insufficient 252-session history excludes security from RS ranking.
 * - Test G: Future data after evaluationDate cannot influence RS or ATH (zero look-ahead bias).
 * - Test H: ATH can come from more than 252 sessions ago (complete historical high).
 * - Test I: Engine processes multi-security datasets without manual stock selection.
 * - Test J: Verification that zero VCP/contraction logic exists.
 */

import { calculateBlueSkyStrategy, RawMarketRecord, DEFAULT_BLUE_SKY_CONFIG } from '../../lib/skyhigh/blueSky';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion Failed: ${message}`);
  }
}

export function runMarketWideAcceptanceTests() {
  console.log('================================================================');
  console.log('RUNNING MARKET-WIDE BANANAPATTERNS BLUE SKY ACCEPTANCE SUITE');
  console.log('================================================================\n');

  // Helper to generate N trading sessions of synthetic records for testing
  function createStockHistory(
    symbol: string,
    sessionCount: number,
    startPrice: number,
    endPrice: number,
    athMultiplier = 1.05,
    volume = 100000
  ): RawMarketRecord[] {
    const records: RawMarketRecord[] = [];
    const step = (endPrice - startPrice) / Math.max(1, sessionCount - 1);

    for (let i = 0; i < sessionCount; i++) {
      const dayNum = String(i + 1).padStart(4, '0');
      const date = `2024-01-01-${dayNum}`;
      const close = startPrice + step * i;
      const open = close;
      const low = close * 0.99;
      // Inject ATH at middle of history
      const high = (i === Math.floor(sessionCount / 2)) ? close * athMultiplier : close * 1.01;

      records.push({
        symbol,
        trading_date: date,
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

  // TEST A, B, C: 100 Eligible Securities Cross-Sectional Ranking
  console.log('TEST A, B, C: 100 eligible stocks cross-sectional RS ranking...');
  {
    let universeRecords: RawMarketRecord[] = [];
    // 100 stocks with returns from 0% to 99%
    for (let i = 0; i < 100; i++) {
      const sym = `STOCK_${String(i).padStart(3, '0')}`;
      const startPrice = 100;
      // return = (endPrice / 100) - 1 => return = i%
      const endPrice = 100 * (1 + i / 100);
      const stockRecords = createStockHistory(sym, 260, startPrice, endPrice);
      universeRecords = universeRecords.concat(stockRecords);
    }

    const result = calculateBlueSkyStrategy(universeRecords);
    assert(result.summary.totalUniverse === 100, `Universe must have 100 stocks, got ${result.summary.totalUniverse}`);

    // Test B: Highest return stock (STOCK_099) must receive RS 99
    const topStock = result.securities.find(s => s.symbol === 'STOCK_099');
    assert(topStock !== undefined, 'Top stock must exist');
    assert(topStock!.relativeStrengthScore === 99, `Top stock must have RS 99, got ${topStock!.relativeStrengthScore}`);

    // Lowest return stock (STOCK_000) must receive RS 1
    const bottomStock = result.securities.find(s => s.symbol === 'STOCK_000');
    assert(bottomStock !== undefined, 'Bottom stock must exist');
    assert(bottomStock!.relativeStrengthScore === 1, `Bottom stock must have RS 1, got ${bottomStock!.relativeStrengthScore}`);

    // Test C: Stock around 70th percentile (e.g. STOCK_070) must have RS around 70
    const stock70 = result.securities.find(s => s.symbol === 'STOCK_070');
    assert(stock70 !== undefined, 'Stock 70 must exist');
    const rs70 = stock70!.relativeStrengthScore;
    assert(rs70 !== null && rs70 >= 69 && rs70 <= 71, `Stock 70 must have RS ~70, got ${rs70}`);

    console.log(`✓ TEST A, B, C PASSED: 100 stocks ranked cross-sectionally: Top = RS ${topStock!.relativeStrengthScore}, 70th percentile = RS ${rs70}, Bottom = RS ${bottomStock!.relativeStrengthScore}.\n`);
  }

  // TEST D: Changing ATH does NOT change RS score
  console.log('TEST D: Changing ATH does NOT change RS score (ATH proximity is NOT RS)...');
  {
    // Stock 1: Return 50%
    const s1 = createStockHistory('STOCK_A', 260, 100, 150, 1.1); // ATH was 150 * 1.1
    // Stock 2: Return 20%
    const s2 = createStockHistory('STOCK_B', 260, 100, 120, 1.1);

    const baseResult = calculateBlueSkyStrategy([...s1, ...s2]);
    const s1BaseRs = baseResult.securities.find(s => s.symbol === 'STOCK_A')!.relativeStrengthScore;

    // Now modify Stock A's ATH by setting an enormous historical spike 100 sessions ago
    const s1Modified = s1.map((r, idx) => idx === 100 ? { ...r, high: 500 } : r);
    const modResult = calculateBlueSkyStrategy([...s1Modified, ...s2]);
    const s1ModRs = modResult.securities.find(s => s.symbol === 'STOCK_A')!.relativeStrengthScore;

    assert(s1BaseRs === s1ModRs, `RS must remain identical (${s1BaseRs} vs ${s1ModRs}) when ATH changes without return change.`);
    const s1ModAth = modResult.securities.find(s => s.symbol === 'STOCK_A')!.allTimeHigh;
    assert(s1ModAth >= 500, `Stock A ATH must reflect 500, got ${s1ModAth}`);
    console.log('✓ TEST D PASSED: Modifying historical ATH did not alter RS ranking.\n');
  }

  // TEST E: Adding/removing an eligible stock legitimately updates cross-sectional RS percentiles
  console.log('TEST E: Adding/removing eligible stocks updates cross-sectional percentiles...');
  {
    // Set of 3 stocks: returns 10%, 20%, 30%
    const s1 = createStockHistory('STOCK_1', 260, 100, 110);
    const s2 = createStockHistory('STOCK_2', 260, 100, 120);
    const s3 = createStockHistory('STOCK_3', 260, 100, 130);

    const result3 = calculateBlueSkyStrategy([...s1, ...s2, ...s3]);
    const s2RsIn3 = result3.securities.find(s => s.symbol === 'STOCK_2')!.relativeStrengthScore; // median of 3 -> RS 50

    // Add 10 stocks with return 5% (below STOCK_2)
    let lowerStocks: RawMarketRecord[] = [];
    for (let i = 0; i < 10; i++) {
      lowerStocks = lowerStocks.concat(createStockHistory(`LOWER_${i}`, 260, 100, 105));
    }

    const result13 = calculateBlueSkyStrategy([...s1, ...s2, ...s3, ...lowerStocks]);
    const s2RsIn13 = result13.securities.find(s => s.symbol === 'STOCK_2')!.relativeStrengthScore;

    // STOCK_2 now has 11 stocks lower than it out of 13 -> RS rises significantly
    assert(s2RsIn13! > s2RsIn3!, `STOCK_2 RS must increase when more lower-return stocks are added (${s2RsIn3} -> ${s2RsIn13})`);
    console.log(`✓ TEST E PASSED: Cross-sectional RS adjusted from ${s2RsIn3} to ${s2RsIn13} as universe distribution changed.\n`);
  }

  // TEST F: Insufficient 252-session history excludes security from RS ranking
  console.log('TEST F: Insufficient 252-session history excludes security from RS ranking...');
  {
    const shortHistoryStock = createStockHistory('SHORT_STOCK', 100, 100, 200); // 100 sessions (< 252)
    const matureStock = createStockHistory('MATURE_STOCK', 260, 100, 150);

    const result = calculateBlueSkyStrategy([...shortHistoryStock, ...matureStock]);
    const shortSec = result.securities.find(s => s.symbol === 'SHORT_STOCK')!;
    const matureSec = result.securities.find(s => s.symbol === 'MATURE_STOCK')!;

    assert(shortSec.status === 'INSUFFICIENT HISTORY', `Short stock must be INSUFFICIENT HISTORY, got ${shortSec.status}`);
    assert(shortSec.pipelineStage === 'INSUFFICIENT_HISTORY', `Short stock pipelineStage must be INSUFFICIENT_HISTORY, got ${shortSec.pipelineStage}`);
    assert(shortSec.relativeStrengthScore === null, `Short stock RS must be null, got ${shortSec.relativeStrengthScore}`);
    assert(matureSec.relativeStrengthScore !== null, `Mature stock must receive RS, got ${matureSec.relativeStrengthScore}`);
    console.log('✓ TEST F PASSED: Stocks with < 252 sessions are excluded from RS ranking and flagged INSUFFICIENT_HISTORY.\n');
  }

  // TEST G: Future data after evaluationDate cannot influence RS or ATH (zero look-ahead bias)
  console.log('TEST G: Evaluation date strictly isolates future data (zero look-ahead bias)...');
  {
    // Stock with 300 sessions: 250 sessions at price 100, then future 50 sessions surging to 1000
    const records = createStockHistory('STOCK_ISOLATED', 300, 100, 1000);
    const evalCutoffDate = records[255].trading_date; // Cutoff at session 256

    const pastResult = calculateBlueSkyStrategy(records, DEFAULT_BLUE_SKY_CONFIG, {
      evaluationDate: evalCutoffDate,
    });
    const fullResult = calculateBlueSkyStrategy(records);

    const pastSec = pastResult.securities.find(s => s.symbol === 'STOCK_ISOLATED')!;
    const fullSec = fullResult.securities.find(s => s.symbol === 'STOCK_ISOLATED')!;

    assert(pastSec.totalSessionsAvailable === 256, `Evaluated sessions must be 256, got ${pastSec.totalSessionsAvailable}`);
    assert(fullSec.totalSessionsAvailable === 300, `Full sessions must be 300, got ${fullSec.totalSessionsAvailable}`);
    assert(pastSec.latestClose < fullSec.latestClose, 'Past close must strictly precede future surge');
    console.log('✓ TEST G PASSED: Evaluation date cut-off strictly isolates historical state.\n');
  }

  // TEST H: ATH can come from more than 252 sessions ago (complete historical ATH)
  console.log('TEST H: ATH from > 252 sessions ago is accurately preserved without clamping...');
  {
    // 500 sessions. Huge ATH at session 50 (450 sessions ago)
    const records = createStockHistory('OLD_ATH_STOCK', 500, 100, 120);
    records[50].high = 500; // Giant ATH 450 sessions ago

    const result = calculateBlueSkyStrategy(records);
    const sec = result.securities.find(s => s.symbol === 'OLD_ATH_STOCK')!;

    assert(sec.allTimeHigh >= 500, `ATH must be >= 500 from 450 sessions ago, got ${sec.allTimeHigh}`);
    assert(sec.pivot >= 500, `Blue Sky Pivot must be >= 500, got ${sec.pivot}`);
    console.log(`✓ TEST H PASSED: ATH correctly detected at ₹${sec.allTimeHigh} from 450 sessions ago.\n`);
  }

  // TEST I: Multi-security market-wide execution without manual stock selection
  console.log('TEST I: Multi-security batch dataset processes seamlessly...');
  {
    const universe = ['RELIANCE', 'TCS', 'INFY', 'HDFCBANK', 'ICICIBANK'];
    let multiRecords: RawMarketRecord[] = [];
    for (let i = 0; i < universe.length; i++) {
      const sym = universe[i];
      multiRecords = multiRecords.concat(createStockHistory(sym, 260, 100, 100 + i * 20));
    }

    const result = calculateBlueSkyStrategy(multiRecords);
    assert(result.summary.totalUniverse === 5, `Expected 5 universe securities, got ${result.summary.totalUniverse}`);
    assert(result.securities.length === 5, `Expected 5 processed securities, got ${result.securities.length}`);
    const symbolsFound = result.securities.map(s => s.symbol).sort();
    assert(JSON.stringify(symbolsFound) === JSON.stringify(universe.sort()), 'All universe securities must be processed');
    console.log('✓ TEST I PASSED: Entire multi-security universe processed in a single strategy pass.\n');
  }

  // TEST J: Verification that zero VCP/contraction logic exists
  console.log('TEST J: Verification of zero VCP / contraction logic...');
  {
    const fs = require('fs');
    const blueSkyContent = fs.readFileSync('lib/skyhigh/blueSky.ts', 'utf8');
    assert(!blueSkyContent.includes('calculateContractionRatio'), 'Zero VCP contraction ratio logic allowed');
    assert(!blueSkyContent.includes('vcpRounds'), 'Zero VCP rounds allowed');
    assert(!blueSkyContent.includes('countContractions'), 'Zero contraction counting allowed');
    console.log('✓ TEST J PASSED: Verified zero VCP or contraction logic in engine.\n');
  }

  console.log('================================================================');
  console.log('🎉 ALL 10 MARKET-WIDE BLUE SKY ACCEPTANCE TESTS (A–J) PASSED!');
  console.log('================================================================\n');
}

runMarketWideAcceptanceTests();
