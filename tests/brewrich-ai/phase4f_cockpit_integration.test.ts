/**
 * PHASE 4F — PRODUCTION COCKPIT → SUPABASE READ INTEGRATION TEST SUITE
 * 
 * Verifies:
 * 1. Server-Side Supabase Read Pipeline:
 *    - CockpitService reads directly from Supabase via supabaseStore.
 *    - Portfolio: NAV ₹1,00,000, Cash ₹2,261.85, Invested ₹97,738.15.
 *    - Positions: Exactly 10 positions matching migrated baseline.
 *    - Orders: Exactly 10 paper orders in PAPER_ONLY mode.
 *    - Audit Log: Contains AUD_MIGRATION_PAPER_BASELINE and AUD_FOUNDATION_INIT.
 *    - Risk State: liveTradingStatus is LOCKED, emergencyStopActive is true.
 *    - Brokers: Dhan and Firstock are LOCKED, with masked client IDs and zero secrets.
 * 2. API Route & Cockpit Dashboard Payload Integrity:
 *    - getDashboard() returns unified payload with all Supabase records.
 * 3. Graceful Python Worker Isolation:
 *    - System pulse reports DEGRADED cleanly when Python worker is offline.
 *    - All persistent tabs (Portfolio, Orders, Risk, Brokers, Audit) remain 100% functional.
 * 4. Zero Credential Exposure:
 *    - Service-role key is never exposed in responses or client-facing objects.
 * 5. Fail-Closed Safeguards & Authoritative State:
 *    - LIVE_ENABLED=false, PAPER_ONLY=true.
 *    - paper_state.json SHA-256 matches ec2737dd8f8b4e58b08de3cb022246a7ab4a086d52a6cc066b244841f0147a89.
 */

import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import { cockpitService } from '../../lib/brewrich-ai/cockpitService';
import { LIVE_ENABLED, PAPER_ONLY, isLiveTradingAllowed, assertLiveTradingAllowed } from '../../lib/brewrich-ai/safetyService';

// Ensure .env.local is loaded
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx !== -1) {
      const key = trimmed.slice(0, eqIdx).trim();
      const val = trimmed.slice(eqIdx + 1).trim();
      if (!process.env[key]) {
        process.env[key] = val;
      }
    }
  }
}

async function runPhase4FTests() {
  console.log('================================================================================');
  console.log('    PHASE 4F — PRODUCTION COCKPIT → SUPABASE READ INTEGRATION SUITE             ');
  console.log('================================================================================\n');

  let totalTests = 0;
  let passedTests = 0;
  let failedTests = 0;

  function assert(name: string, condition: boolean, details?: string) {
    totalTests++;
    if (condition) {
      passedTests++;
      console.log(`  ✅ [PASS] ${name}${details ? ' — ' + details : ''}`);
    } else {
      failedTests++;
      console.error(`  ❌ [FAIL] ${name}${details ? ' — ' + details : ''}`);
    }
  }

  // ---------------------------------------------------------------------------
  // Suite 1: CockpitService Paper Portfolio Reads from Supabase
  // ---------------------------------------------------------------------------
  console.log('[Suite 1/7] Verifying Supabase Paper Portfolio via CockpitService...');
  const portfolio = await cockpitService.getPaperPortfolio();

  assert('Portfolio NAV is ₹100,000.00', portfolio.totalPortfolioValue === 100000.0, `Found: ₹${portfolio.totalPortfolioValue}`);
  assert('Free cash balance is ₹2,261.85', portfolio.cashBalance === 2261.85, `Found: ₹${portfolio.cashBalance}`);
  assert('Invested value is ₹97,738.15', portfolio.investedValue === 97738.15, `Found: ₹${portfolio.investedValue}`);
  assert('Positions array has exactly 10 items', portfolio.positions.length === 10, `Found: ${portfolio.positions.length}`);

  const expectedSymbols = [
    'BHEL', 'FEDERALBNK', 'GRANULES', 'HFCL', 'HINDCOPPER',
    'HONASA', 'IDEA', 'NATIONALUM', 'RBLBANK', 'SONACOMS'
  ];
  const portfolioSymbols = portfolio.positions.map(p => p.symbol).sort();
  assert('All 10 expected symbols present in portfolio', JSON.stringify(portfolioSymbols) === JSON.stringify(expectedSymbols.sort()));

  const totalPositionsCost = portfolio.positions.reduce((acc, p) => acc + (p.avgBuyPrice * p.quantity), 0);
  assert('Total positions cost matches invested value (₹97,738.15)', Math.abs(totalPositionsCost - 97738.15) < 0.05, `Cost: ₹${totalPositionsCost.toFixed(2)}`);

  // ---------------------------------------------------------------------------
  // Suite 2: CockpitService Paper Orders Reads from Supabase
  // ---------------------------------------------------------------------------
  console.log('\n[Suite 2/7] Verifying Supabase Paper Orders via CockpitService...');
  const orders = await cockpitService.getPaperOrders();

  assert('Orders array has exactly 10 orders', orders.length === 10, `Found: ${orders.length}`);
  const allPaperOnly = orders.every(o => o.status === 'PAPER_ONLY');
  assert('All 10 orders have status PAPER_ONLY', allPaperOnly);

  const orderSymbols = orders.map(o => o.symbol).sort();
  assert('All 10 order symbols match portfolio holdings', JSON.stringify(orderSymbols) === JSON.stringify(expectedSymbols.sort()));

  const allHaveOrderIds = orders.every(o => o.orderId.startsWith('ORD'));
  assert('All orders have valid ORD* identifiers', allHaveOrderIds);

  // ---------------------------------------------------------------------------
  // Suite 3: CockpitService Risk & Safeguards Reads from Supabase
  // ---------------------------------------------------------------------------
  console.log('\n[Suite 3/7] Verifying Supabase Risk State via CockpitService...');
  const risk = await cockpitService.getRiskStatus();

  assert('liveTradingStatus is strictly LOCKED', risk.liveTradingStatus === 'LOCKED');
  assert('emergencyStopActive is true (fail-closed from Supabase)', risk.emergencyStopActive === true);
  assert('cashReservePct is present and positive', risk.cashReservePct > 0, `Found: ${risk.cashReservePct}%`);
  assert('portfolioExposurePct is 97.7%', risk.portfolioExposurePct === 97.7, `Found: ${risk.portfolioExposurePct}%`);
  assert('maxSinglePositionPct is 10%', risk.maxSinglePositionPct === 10.0, `Found: ${risk.maxSinglePositionPct}%`);
  assert('drawdownLimitPct is 15%', risk.drawdownLimitPct === 15.0, `Found: ${risk.drawdownLimitPct}%`);

  // ---------------------------------------------------------------------------
  // Suite 4: CockpitService Broker Status Reads from Supabase
  // ---------------------------------------------------------------------------
  console.log('\n[Suite 4/7] Verifying Supabase Broker Connections via CockpitService...');
  const brokers = await cockpitService.getBrokerStatus();

  assert('Exactly 2 broker connections configured (Dhan & Firstock)', brokers.length === 2, `Found: ${brokers.length}`);
  const dhan = brokers.find(b => b.brokerId === 'dhan');
  assert('Dhan broker status exists', !!dhan);
  assert('Dhan tradingStatus is strictly LOCKED', dhan?.tradingStatus === 'LOCKED');
  assert('Dhan clientId is properly masked', dhan?.maskedClientId.includes('****') === true, `Masked: ${dhan?.maskedClientId}`);

  const firstock = brokers.find(b => b.brokerId === 'firstock');
  assert('Firstock broker status exists', !!firstock);
  assert('Firstock tradingStatus is strictly LOCKED', firstock?.tradingStatus === 'LOCKED');
  assert('Firstock clientId is properly masked', firstock?.maskedClientId.includes('*****') === true, `Masked: ${firstock?.maskedClientId}`);

  // ---------------------------------------------------------------------------
  // Suite 5: CockpitService Audit Log Reads from Supabase
  // ---------------------------------------------------------------------------
  console.log('\n[Suite 5/7] Verifying Supabase Audit Log via CockpitService...');
  const auditLogs = await cockpitService.getAuditLog();

  assert('Audit logs contains at least 2 events', auditLogs.length >= 2, `Found: ${auditLogs.length}`);
  const migrationEvent = auditLogs.find(l => l.id === 'AUD_MIGRATION_PAPER_BASELINE');
  assert('AUD_MIGRATION_PAPER_BASELINE event is present', !!migrationEvent);
  assert('Migration event details mention 10 positions & 10 orders', 
    Boolean(migrationEvent?.details.includes('10 positions') && migrationEvent?.details.includes('10 orders')),
    `Details: ${migrationEvent?.details}`
  );

  const initEvent = auditLogs.find(l => l.id === 'AUD_FOUNDATION_INIT');
  assert('AUD_FOUNDATION_INIT event is present', !!initEvent);

  // ---------------------------------------------------------------------------
  // Suite 6: Cockpit Dashboard Unified Overview & Engine Worker Isolation
  // ---------------------------------------------------------------------------
  console.log('\n[Suite 6/7] Verifying Cockpit Dashboard Unified Overview & Engine Isolation...');
  const dashboard = await cockpitService.getDashboard();

  assert('Dashboard data is returned', !!dashboard);
  assert('Dashboard portfolio NAV matches ₹100,000.00', dashboard.portfolio.totalPortfolioValue === 100000.0);
  assert('Dashboard portfolio has 10 positions', dashboard.portfolio.positions.length === 10);
  assert('Dashboard recentOrders contains 10 orders', dashboard.recentOrders.length === 10);
  assert('Dashboard recentAuditLogs contains at least 2 events', dashboard.recentAuditLogs.length >= 2);
  assert('Dashboard brokers count is 2', dashboard.brokers.length === 2);
  assert('Dashboard risk liveTradingStatus is LOCKED', dashboard.risk.liveTradingStatus === 'LOCKED');

  // Verify graceful degradation when Python engine worker is offline
  assert(
    'System pulse reports DEGRADED or OPERATIONAL gracefully without crashing',
    ['OPERATIONAL', 'DEGRADED'].includes(dashboard.systemPulse),
    `Pulse: ${dashboard.systemPulse}`
  );
  assert('Strategy status is reported without crashing', typeof dashboard.strategy.status === 'string');

  // ---------------------------------------------------------------------------
  // Suite 7: Fail-Closed Guardrails, Zero Secret Leakage & File Integrity
  // ---------------------------------------------------------------------------
  console.log('\n[Suite 7/7] Verifying Fail-Closed Invariants & Zero Secret Leakage...');
  assert('LIVE_ENABLED is strictly false', LIVE_ENABLED === false);
  assert('PAPER_ONLY is strictly true', PAPER_ONLY === true);
  assert('isLiveTradingAllowed() returns false', isLiveTradingAllowed() === false);

  let blockedThrown = false;
  try {
    assertLiveTradingAllowed('ORDER_GATE');
  } catch (err: any) {
    if (err.name === 'LiveTradingBlockedError') blockedThrown = true;
  }
  assert('assertLiveTradingAllowed() throws LiveTradingBlockedError', blockedThrown);

  // Check that no secret keys are in cockpit dashboard output
  const jsonStr = JSON.stringify(dashboard);
  assert('Dashboard JSON does not contain SUPABASE_SERVICE_ROLE_KEY', !jsonStr.includes(process.env.SUPABASE_SERVICE_ROLE_KEY || '___NO_KEY___'));
  assert('Dashboard JSON does not contain live broker access tokens', !jsonStr.includes('dhan_live_token') && !jsonStr.includes('fs_live_token'));

  // Authoritative paper_state.json integrity check
  const authoritativePath = '/Users/yogeshnath/Documents/Brewrich Wealth Strategy Engines/Brewrich 400 Wealth Strategy Engine/data/paper_state.json';
  assert('paper_state.json exists at canonical path', fs.existsSync(authoritativePath));
  const rawBytes = fs.readFileSync(authoritativePath);
  const hash = crypto.createHash('sha256').update(rawBytes).digest('hex');
  const expectedHash = 'ec2737dd8f8b4e58b08de3cb022246a7ab4a086d52a6cc066b244841f0147a89';
  assert(
    'paper_state.json SHA-256 hash is unchanged',
    hash === expectedHash,
    `Hash: ${hash}`
  );

  console.log('\n================================================================================');
  console.log(`Phase 4F Integration Suite Complete: ${passedTests}/${totalTests} tests passed (${failedTests} failed).`);
  console.log('================================================================================\n');

  if (failedTests > 0) {
    process.exit(1);
  }
}

runPhase4FTests().catch(err => {
  console.error('Fatal error during Phase 4F testing:', err);
  process.exit(1);
});
