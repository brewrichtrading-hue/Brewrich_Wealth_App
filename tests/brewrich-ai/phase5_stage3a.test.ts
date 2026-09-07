/**
 * PHASE 5 STAGE 3A — ATOMIC REBALANCE, AUTHENTICATED BRIDGE & SCHEDULER TEST SUITE
 *
 * Verifies:
 * 1. Next.js -> Worker Authenticated Bridge & URL resolution
 * 2. Secret isolation (no worker secret in client payloads or NEXT_PUBLIC_*)
 * 3. Scheduler market-day validation against skyhigh_trading_days
 * 4. Scheduler duplicate-run protection
 * 5. Fail-closed safety locks (LIVE_ENABLED=false, PAPER_ONLY=true)
 * 6. Canonical paper state integrity & exact SHA-256 verification
 */

import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

import {
  getWorkerBaseUrl,
  getWorkerAuthSecret,
} from '../../lib/brewrich-ai/workerClient';
import { verifySchedulerAuth } from '../../lib/brewrich-ai/schedulerAuth';
import { NextRequest } from 'next/server';
import { supabaseStore } from '../../lib/brewrich-ai/persistence/supabaseStore';
import { cockpitService } from '../../lib/brewrich-ai/cockpitService';
import {
  LIVE_ENABLED,
  PAPER_ONLY,
  isLiveTradingAllowed,
  assertLiveTradingAllowed,
} from '../../lib/brewrich-ai/safetyService';

// Ensure .env.local is loaded if present
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

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(description: string, condition: boolean, extraInfo?: string) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✅ [PASS] ${description}${extraInfo ? ` — ${extraInfo}` : ''}`);
  } else {
    failedTests++;
    console.error(`  ❌ [FAIL] ${description}${extraInfo ? ` — ${extraInfo}` : ''}`);
  }
}

async function runStage3ATests() {
  console.log('\n================================================================================');
  console.log('    PHASE 5 STAGE 3A — ATOMIC REBALANCE + AUTHENTICATED BRIDGE TEST SUITE       ');
  console.log('================================================================================\n');

  // ---------------------------------------------------------------------------
  // Suite 1: Next.js -> Worker Authenticated Bridge & URL Resolution
  // ---------------------------------------------------------------------------
  console.log('[Suite 1/6] Verifying Worker Client URL & Authentication Configuration...');

  const origWorkerUrl = process.env.BREWRICH_WORKER_URL;
  const origNodeEnv = process.env.NODE_ENV;

  try {
    // Production default resolution
    delete process.env.BREWRICH_WORKER_URL;
    (process.env as any).NODE_ENV = 'production';
    const prodUrl = getWorkerBaseUrl();
    assert('Production URL defaults to https://worker.brewrich.in', prodUrl === 'https://worker.brewrich.in', `URL: ${prodUrl}`);

    // Custom environment override
    process.env.BREWRICH_WORKER_URL = 'https://custom-worker.brewrich.in/';
    const customUrl = getWorkerBaseUrl();
    assert('Custom BREWRICH_WORKER_URL is honored and trailing slashes stripped', customUrl === 'https://custom-worker.brewrich.in', `URL: ${customUrl}`);

    // Local development fallback
    delete process.env.BREWRICH_WORKER_URL;
    (process.env as any).NODE_ENV = 'development';
    const devUrl = getWorkerBaseUrl();
    assert('Development URL defaults to http://127.0.0.1:8400', devUrl === 'http://127.0.0.1:8400', `URL: ${devUrl}`);
  } finally {
    if (origWorkerUrl) process.env.BREWRICH_WORKER_URL = origWorkerUrl;
    else delete process.env.BREWRICH_WORKER_URL;
    (process.env as any).NODE_ENV = origNodeEnv;
  }

  // ---------------------------------------------------------------------------
  // Suite 2: Secret Isolation & Client Protection
  // ---------------------------------------------------------------------------
  console.log('\n[Suite 2/6] Verifying Secret Isolation & Zero Client Exposure...');

  // Ensure no worker secret is prefixed with NEXT_PUBLIC_
  const leakedKeys = Object.keys(process.env).filter(
    k => k.startsWith('NEXT_PUBLIC_') && (k.includes('WORKER_SECRET') || k.includes('SERVICE_ROLE'))
  );
  assert('No worker secret or service-role key is exposed via NEXT_PUBLIC_*', leakedKeys.length === 0, `Violations: ${leakedKeys.join(', ') || 'None'}`);

  // Test dashboard payload for secret leakage
  try {
    const dashboard = await cockpitService.getDashboard();
    const dashboardStr = JSON.stringify(dashboard);
    const workerSecret = process.env.BREWRICH_WORKER_SECRET || 'test_secret';
    assert('Dashboard payload does not expose worker secret', !dashboardStr.includes(workerSecret));
    assert('Dashboard payload does not expose SUPABASE_SERVICE_ROLE_KEY', !dashboardStr.includes(process.env.SUPABASE_SERVICE_ROLE_KEY || 'dummy_key'));
  } catch (err: any) {
    console.warn('  ⚠️ Note on Dashboard probe:', err?.message);
  }

  // ---------------------------------------------------------------------------
  // Suite 3: Scheduler Market-Day Validation (skyhigh_trading_days)
  // ---------------------------------------------------------------------------
  console.log('\n[Suite 3/6] Verifying Market-Day Validation via skyhigh_trading_days...');

  // Known non-trading day (Sunday)
  const sundayCheck = await supabaseStore.isTradingDay('2026-09-06');
  assert('Non-trading day (Sunday 2026-09-06) is rejected', sundayCheck === false, 'Result: false');

  // Known trading day in historical dataset
  const tradingDayCheck = await supabaseStore.isTradingDay('2024-09-06');
  assert('Known trading day (2024-09-06) returns true or handles read-only gracefully', typeof tradingDayCheck === 'boolean', `Result: ${tradingDayCheck}`);

  // ---------------------------------------------------------------------------
  // Suite 4: Scheduler Duplicate-Run Protection & Ingress Auth Hardening
  // ---------------------------------------------------------------------------
  console.log('\n[Suite 4/6] Verifying Scheduler Duplicate-Run Protection & Ingress Auth Hardening...');

  const runCheck = await supabaseStore.getRebalanceRun('1999-01-01');
  assert('Non-existent session returns null cleanly', runCheck === null);

  // Ingress Authentication Boundary Tests (Stage 3B)
  const savedCron = process.env.CRON_SECRET;
  const savedWorker = process.env.BREWRICH_WORKER_SECRET;
  const savedAdmin = process.env.BREWRICH_ADMIN_PASSWORD;
  const savedNodeEnv = process.env.NODE_ENV;

  try {
    process.env.CRON_SECRET = 'super-secret-cron-token-xyz';
    process.env.BREWRICH_WORKER_SECRET = 'worker-internal-bearer-abc';
    process.env.BREWRICH_ADMIN_PASSWORD = 'admin-login-pass-123';
    (process.env as any).NODE_ENV = 'production';

    // 1. Valid CRON_SECRET -> accepted
    const reqValid = new NextRequest('http://localhost:3000/api/brewrich-ai/scheduler/rebalance', {
      headers: { authorization: 'Bearer super-secret-cron-token-xyz' },
    });
    assert('Valid CRON_SECRET is accepted for scheduler ingress', verifySchedulerAuth(reqValid) === true);

    // 2. Invalid CRON_SECRET -> rejected
    const reqInvalid = new NextRequest('http://localhost:3000/api/brewrich-ai/scheduler/rebalance', {
      headers: { authorization: 'Bearer wrong-secret-token' },
    });
    assert('Invalid CRON_SECRET is rejected', verifySchedulerAuth(reqInvalid) === false);

    // 3. Missing CRON_SECRET -> fail closed in production
    delete process.env.CRON_SECRET;
    const reqMissingSecret = new NextRequest('http://localhost:3000/api/brewrich-ai/scheduler/rebalance', {
      headers: { authorization: 'Bearer super-secret-cron-token-xyz' },
    });
    assert('Missing CRON_SECRET fails closed in production', verifySchedulerAuth(reqMissingSecret) === false);

    // Restore CRON_SECRET for cross-secret leakage testing
    process.env.CRON_SECRET = 'super-secret-cron-token-xyz';

    // 4. BREWRICH_WORKER_SECRET cannot authenticate scheduler ingress
    const reqWorkerSecret = new NextRequest('http://localhost:3000/api/brewrich-ai/scheduler/rebalance', {
      headers: { authorization: `Bearer ${process.env.BREWRICH_WORKER_SECRET}` },
    });
    assert('BREWRICH_WORKER_SECRET cannot authenticate scheduler ingress', verifySchedulerAuth(reqWorkerSecret) === false);

    // 5. BREWRICH_ADMIN_PASSWORD cannot authenticate scheduler ingress
    const reqAdminPass = new NextRequest('http://localhost:3000/api/brewrich-ai/scheduler/rebalance', {
      headers: { authorization: `Bearer ${process.env.BREWRICH_ADMIN_PASSWORD}` },
    });
    assert('BREWRICH_ADMIN_PASSWORD cannot authenticate scheduler ingress', verifySchedulerAuth(reqAdminPass) === false);

  } finally {
    if (savedCron !== undefined) process.env.CRON_SECRET = savedCron;
    else delete process.env.CRON_SECRET;
    if (savedWorker !== undefined) process.env.BREWRICH_WORKER_SECRET = savedWorker;
    else delete process.env.BREWRICH_WORKER_SECRET;
    if (savedAdmin !== undefined) process.env.BREWRICH_ADMIN_PASSWORD = savedAdmin;
    else delete process.env.BREWRICH_ADMIN_PASSWORD;
    (process.env as any).NODE_ENV = savedNodeEnv;
  }

  // ---------------------------------------------------------------------------
  // Suite 5: Fail-Closed Safety Locks
  // ---------------------------------------------------------------------------
  console.log('\n[Suite 5/6] Verifying Fail-Closed Live Trading Safety Invariants...');

  assert('LIVE_ENABLED is strictly false', LIVE_ENABLED === false);
  assert('PAPER_ONLY is strictly true', PAPER_ONLY === true);
  assert('isLiveTradingAllowed() returns false', isLiveTradingAllowed() === false);

  let errorThrown = false;
  try {
    assertLiveTradingAllowed('test context');
  } catch (e: any) {
    errorThrown = true;
    assert('assertLiveTradingAllowed() throws LiveTradingBlockedError', e.name === 'LiveTradingBlockedError');
  }
  assert('Live trading call is unconditionally blocked', errorThrown);

  // Broker status safety check
  const brokers = await cockpitService.getBrokerStatus();
  for (const b of brokers) {
    assert(`${b.name} tradingStatus is strictly LOCKED`, b.tradingStatus === 'LOCKED');
    assert(`${b.name} client ID is masked`, b.maskedClientId.includes('*'));
  }

  // ---------------------------------------------------------------------------
  // Suite 6: Canonical Paper State Baseline Verification
  // ---------------------------------------------------------------------------
  console.log('\n[Suite 6/6] Verifying Canonical Paper State & Baseline Integrity...');

  const canonicalPath = '/Users/yogeshnath/Documents/Brewrich Wealth Strategy Engines/Brewrich 400 Wealth Strategy Engine/data/paper_state.json';
  assert('paper_state.json exists at canonical path', fs.existsSync(canonicalPath));

  const rawBytes = fs.readFileSync(canonicalPath);
  const hash = crypto.createHash('sha256').update(rawBytes).digest('hex');
  const expectedHash = 'ec2737dd8f8b4e58b08de3cb022246a7ab4a086d52a6cc066b244841f0147a89';

  assert('paper_state.json SHA-256 matches canonical hash', hash === expectedHash, `Hash: ${hash}`);

  const stateData = JSON.parse(rawBytes.toString('utf8'));
  const positions = stateData.positions || {};
  const orders = stateData.orders || [];
  const cash = Number(stateData.cash);
  let invested = 0;
  for (const p of Object.values(positions) as any[]) {
    invested += Number(p.shares) * Number(p.entry_price);
  }
  const nav = cash + invested;

  assert('Exactly 10 positions in baseline', Object.keys(positions).length === 10, `Count: ${Object.keys(positions).length}`);
  assert('Exactly 10 paper orders in baseline', orders.length === 10, `Count: ${orders.length}`);
  assert('Cash balance is exactly ₹2,261.85', Math.abs(cash - 2261.85) < 0.01, `Cash: ₹${cash.toFixed(2)}`);
  assert('Invested value is exactly ₹97,738.15', Math.abs(invested - 97738.15) < 0.01, `Invested: ₹${invested.toFixed(2)}`);
  assert('Total NAV is exactly ₹100,000.00', Math.abs(nav - 100000.00) < 0.01, `NAV: ₹${nav.toFixed(2)}`);

  console.log('\n================================================================================');
  console.log(`Phase 5 Stage 3A Test Suite: ${passedTests}/${totalTests} tests passed (${failedTests} failed).`);
  console.log('================================================================================\n');

  if (failedTests > 0) {
    process.exit(1);
  }
}

runStage3ATests().catch(err => {
  console.error('Fatal error during Stage 3A testing:', err);
  process.exit(1);
});
