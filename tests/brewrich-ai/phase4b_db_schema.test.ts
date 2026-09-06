/**
 * PHASE 4B — SECURITY HARDENING & DATABASE PLATFORM INTEGRITY VERIFICATION
 * 
 * Verifies:
 * 1. Static Security Analysis of SQL migration:
 *    - ZERO policies granting 'anon' access
 *    - ZERO policies granting 'authenticated' access
 *    - ONLY 'service_role' has backend access
 *    - ZERO DROP / TRUNCATE / DELETE statements
 *    - ZERO touches on existing platform tables
 *    - ZERO broker or database secrets
 * 2. Live Supabase verification:
 *    - Existing platform tables (mfd_bookings, module_status) verified active and untouched.
 *    - Anonymous access to private brewrich_* tables is blocked/unavailable.
 * 3. Authoritative local paper state baseline (data/paper_state.json) verified untouched.
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// Load environment variables from .env.local
const envPath = path.resolve(process.cwd(), '.env.local');
if (!fs.existsSync(envPath)) {
  console.error('❌ .env.local not found');
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf8');
const urlMatch = envContent.match(/NEXT_PUBLIC_SUPABASE_URL=([^\s]+)/);
const keyMatch = envContent.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=([^\s]+)/);

if (!urlMatch || !keyMatch) {
  console.error('❌ Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local');
  process.exit(1);
}

const supabaseUrl = urlMatch[1];
const supabaseKey = keyMatch[1];
const supabase = createClient(supabaseUrl, supabaseKey);

const BREWRICH_TABLES = [
  'brewrich_users',
  'brewrich_sessions',
  'brewrich_paper_portfolio',
  'brewrich_paper_positions',
  'brewrich_paper_orders',
  'brewrich_rebalance_runs',
  'brewrich_strategy_runs',
  'brewrich_backtest_runs',
  'brewrich_broker_connections',
  'brewrich_risk_state',
  'brewrich_scheduler_jobs',
  'brewrich_audit_events'
];

async function runVerification() {
  console.log('================================================================================');
  console.log('    PHASE 4B — BREWRICH AI SECURITY HARDENING & SCHEMA VERIFICATION SUITE       ');
  console.log('================================================================================\n');

  console.log(`[Target] Supabase URL: ${new URL(supabaseUrl).host}`);
  console.log(`[Timestamp] ${new Date().toISOString()}\n`);

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
  // 1. Static Security Analysis of SQL Migration
  // ---------------------------------------------------------------------------
  console.log('[Suite 1/5] Static Security Analysis of SQL Migration File...');
  const migrationPath = path.resolve(process.cwd(), 'supabase/migrations/20260906_brewrich_ai_schema.sql');
  assert('Migration file exists', fs.existsSync(migrationPath), migrationPath);
  const sql = fs.readFileSync(migrationPath, 'utf8');

  // Check that anon is NEVER granted in any policy
  const anonPolicyMatches = sql.match(/CREATE\s+POLICY[\s\S]*?TO\s+[^;]*?\banon\b/gi);
  assert(
    'Zero RLS policies grant access to "anon"',
    !anonPolicyMatches || anonPolicyMatches.length === 0,
    anonPolicyMatches ? `Found: ${anonPolicyMatches.join(', ')}` : 'Zero anon policies confirmed'
  );

  // Check that authenticated is NEVER granted in any policy
  const authPolicyMatches = sql.match(/CREATE\s+POLICY[\s\S]*?TO\s+[^;]*?\bauthenticated\b/gi);
  assert(
    'Zero RLS policies grant access to "authenticated"',
    !authPolicyMatches || authPolicyMatches.length === 0,
    authPolicyMatches ? `Found: ${authPolicyMatches.join(', ')}` : 'Zero authenticated policies confirmed'
  );

  // Check that only service_role is granted in policies
  const allPolicies = sql.match(/CREATE\s+POLICY[^\n]+/gi) || [];
  const nonServiceRolePolicies = allPolicies.filter(p => !p.includes('service_role'));
  assert(
    'All RLS policies exclusively target service_role',
    nonServiceRolePolicies.length === 0,
    `Total policies: ${allPolicies.length}, non-service-role: ${nonServiceRolePolicies.length}`
  );

  // Check that all 12 tables have ENABLE ROW LEVEL SECURITY
  let allRlsEnabled = true;
  for (const table of BREWRICH_TABLES) {
    if (!sql.includes(`ALTER TABLE public.${table} ENABLE ROW LEVEL SECURITY;`)) {
      allRlsEnabled = false;
      console.error(`Missing RLS enablement for table: ${table}`);
    }
  }
  assert('RLS explicitly enabled on all 12 Brewrich AI tables', allRlsEnabled);

  // Check for destructive statements
  const dropMatches = sql.match(/\bDROP\s+(TABLE|DATABASE|SCHEMA)\b/gi);
  assert('Zero DROP TABLE statements in migration', !dropMatches);
  const truncateMatches = sql.match(/\bTRUNCATE\b/gi);
  assert('Zero TRUNCATE statements in migration', !truncateMatches);
  const deleteMatches = sql.match(/^\s*DELETE\s+FROM/gmi);
  assert('Zero DELETE statements in migration', !deleteMatches);

  // Check that no existing platform tables are touched
  const foreignTables = ['mfd_bookings', 'module_status', 'skyhigh_market_data', 'skyhigh_trading_days'];
  let foreignTableTouched = false;
  for (const ft of foreignTables) {
    // Regex matching ALTER TABLE <ft> or DROP TABLE <ft> or INSERT INTO <ft> or UPDATE <ft>
    const re = new RegExp(`\\b(ALTER|DROP|INSERT\\s+INTO|UPDATE|DELETE\\s+FROM)\\s+.*\\b${ft}\\b`, 'i');
    if (re.test(sql)) {
      foreignTableTouched = true;
      console.error(`Foreign table touched: ${ft}`);
    }
  }
  assert('Zero existing platform tables touched or modified', !foreignTableTouched);

  // Check for hardcoded secrets
  const blockedTokens = ['DHAN_ACCESS_TOKEN', 'DHAN_CLIENT_SECRET', 'FIRSTOCK_PASSWORD', 'FIRSTOCK_TOTP_SECRET'];
  let secretFound = false;
  for (const token of blockedTokens) {
    if (sql.includes(token)) secretFound = true;
  }
  assert('Zero broker secrets in migration SQL', !secretFound);

  // ---------------------------------------------------------------------------
  // 2. Existing Platform Tables Live Integrity
  // ---------------------------------------------------------------------------
  console.log('\n[Suite 2/5] Verifying Protected Platform Tables (Must Be Untouched)...');
  
  const { data: mfdData, count: mfdCount, error: mfdError } = await supabase
    .from('mfd_bookings')
    .select('*', { count: 'exact', head: true });
  
  assert(
    'mfd_bookings table exists and is readable',
    !mfdError,
    mfdError ? mfdError.message : `Row count: ${mfdCount}`
  );
  assert(
    'mfd_bookings data preserved (>= 3 rows)',
    (mfdCount || 0) >= 3,
    `Preserved count: ${mfdCount}`
  );

  const { data: modData, count: modCount, error: modError } = await supabase
    .from('module_status')
    .select('*', { count: 'exact', head: true });
  
  assert(
    'module_status table exists and is readable',
    !modError,
    modError ? modError.message : `Row count: ${modCount}`
  );

  // ---------------------------------------------------------------------------
  // 3. Fail-Closed Public Access Verification
  // ---------------------------------------------------------------------------
  console.log('\n[Suite 3/5] Verifying Fail-Closed Public/Anonymous Access...');
  // Verify that an anonymous client cannot read any brewrich_* data
  for (const table of BREWRICH_TABLES) {
    const { data, error } = await supabase.from(table).select('*').limit(1);
    // Expected: either table does not exist yet (PGRST205) or returns empty data [] because RLS denies access
    const isAccessDeniedOrMissing = (error && error.code === 'PGRST205') || (!error && Array.isArray(data) && data.length === 0);
    assert(
      `Anon access to '${table}' is blocked/empty`,
      isAccessDeniedOrMissing,
      error ? error.code : `Rows visible: ${data?.length || 0}`
    );
  }

  // ---------------------------------------------------------------------------
  // 4. Local Paper State Baseline Integrity (Must Not Be Modified)
  // ---------------------------------------------------------------------------
  console.log('\n[Suite 4/5] Verifying Authoritative Local Paper State Baseline...');
  const paperStatePath = '/Users/yogeshnath/Documents/Brewrich Wealth Strategy Engines/Brewrich 400 Wealth Strategy Engine/data/paper_state.json';

  if (fs.existsSync(paperStatePath)) {
    const stateContent = fs.readFileSync(paperStatePath, 'utf8');
    const state = JSON.parse(stateContent);
    assert('Initial capital is ₹100,000.00', state.initial_capital === 100000.0, `Found: ₹${state.initial_capital}`);
    assert('Free cash is ₹2,261.85', state.cash === 2261.85, `Found: ₹${state.cash}`);
    assert('Active positions count is exactly 10', Object.keys(state.positions || {}).length === 10, `Found: ${Object.keys(state.positions || {}).length}`);
    assert('Orders ledger count is exactly 10', (state.orders || []).length === 10, `Found: ${(state.orders || []).length}`);
    assert('Processed event IDs count is exactly 10', (state.processed_event_ids || []).length === 10, `Found: ${(state.processed_event_ids || []).length}`);

    // Compute invested cost basis
    const totalCost = Object.values(state.positions || {}).reduce((acc: number, p: any) => acc + (p.cost_basis || 0), 0);
    assert('Invested cost basis is ₹97,738.15', Math.abs(totalCost - 97738.15) < 0.01, `Found: ₹${totalCost.toFixed(2)}`);
  } else {
    assert('paper_state.json exists at canonical path', false, `Missing file at: ${paperStatePath}`);
  }

  // ---------------------------------------------------------------------------
  // 5. Safety & Idempotency Constraints in SQL
  // ---------------------------------------------------------------------------
  console.log('\n[Suite 5/5] Verifying Safety & Invariant Constraints in SQL Definition...');
  assert('NAV invariant constraint defined in SQL', sql.includes('chk_paper_portfolio_nav_invariant'));
  assert('Paper order side CHECK constraint in SQL', sql.includes("side IN ('BUY', 'SELL')"));
  assert('Paper order execution_mode PAPER_ONLY constraint in SQL', sql.includes("execution_mode = 'PAPER_ONLY'"));
  assert('Risk state PAPER execution mode constraint in SQL', sql.includes("execution_mode = 'PAPER'"));
  assert('Risk state live_locked TRUE constraint in SQL', sql.includes('live_locked = TRUE'));
  assert('Broker connection locked trading constraint in SQL', sql.includes("trading_status = 'LOCKED'"));
  assert('Event ID uniqueness constraint in SQL', sql.includes('event_id VARCHAR(100) UNIQUE NOT NULL'));
  assert('Scheduler job session uniqueness in SQL', sql.includes('uq_brewrich_scheduler_job_session'));

  console.log('\n================================================================================');
  console.log(`Verification Complete: ${passedTests}/${totalTests} tests passed (${failedTests} failed).`);
  console.log('================================================================================\n');

  if (failedTests > 0) {
    process.exit(1);
  }
}

runVerification().catch(err => {
  console.error('Fatal error during verification:', err);
  process.exit(1);
});
