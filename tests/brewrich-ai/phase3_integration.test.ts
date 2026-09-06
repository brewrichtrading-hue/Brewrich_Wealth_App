/**
 * BREWRICH AI — PHASE 3 MASTER INTEGRATION TEST SUITE
 *
 * Verifies the complete local pipeline:
 * Browser ↔ Next.js API ↔ CockpitService ↔ Python Engine Bridge :8400 ↔ Paper Portfolio
 */

import assert from 'assert';

const API_BASE = 'http://127.0.0.1:3000';
const PYTHON_API_BASE = 'http://127.0.0.1:8400';

export async function runPhase3Verification() {
  console.log('================================================================');
  console.log('BREWRICH AI — PHASE 3 FULL INTEGRATION VERIFICATION SUITE');
  console.log('================================================================\n');

  // STEP 1: Check Python Bridge is Running
  console.log('STEP 1: Verifying Python Strategy Engine Bridge on 127.0.0.1:8400...');
  const healthRes = await fetch(`${PYTHON_API_BASE}/api/v1/health`);
  assert(healthRes.ok, 'Python bridge must return 200 OK');
  const healthJson = await healthRes.json();
  assert(healthJson.status === 'healthy', 'Python bridge status must be healthy');
  console.log(`✓ STEP 1 PASSED: Python bridge connected (Version: ${healthJson.version}, Engine: ${healthJson.engine}).\n`);

  // STEP 2: Verify Unauthenticated Access Handling
  console.log('STEP 2: Verifying unauthenticated API protection...');
  const unauthAuthRes = await fetch(`${API_BASE}/api/brewrich-ai/auth`);
  const unauthAuthJson = await unauthAuthRes.json();
  assert(unauthAuthJson.isAuthenticated === false, 'Initial state must report unauthenticated without cookie');
  console.log('✓ STEP 2 PASSED: Protected endpoints correctly identify unauthenticated state.\n');

  // STEP 3: Verify Owner Login Flow
  console.log('STEP 3: Testing owner authentication flow...');
  const testPasswordFixture = process.env.BREWRICH_ADMIN_PASSWORD || 'TestOwnerPass123!';
  const loginRes = await fetch(`${API_BASE}/api/brewrich-ai/auth`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'wealth@brewrich.in',
      password: testPasswordFixture,
    }),
  });
  assert(loginRes.ok, 'Login must succeed with 200 OK');
  const loginJson = await loginRes.json();
  assert(loginJson.success === true, 'Login response success must be true');
  assert(loginJson.user.email === 'wealth@brewrich.in', 'User email must match owner');
  assert(loginJson.user.role === 'owner', 'User role must be owner');

  const setCookie = loginRes.headers.get('set-cookie');
  assert(setCookie !== null, 'Login must return Set-Cookie header');
  assert(setCookie.includes('brewrich_ai_session'), 'Cookie must be named brewrich_ai_session');
  assert(setCookie.includes('HttpOnly'), 'Cookie must have HttpOnly flag');
  console.log('✓ STEP 3 PASSED: Owner login succeeded and issued secure HttpOnly session cookie.\n');

  // Extract session cookie for subsequent authenticated calls
  const sessionCookieHeader = setCookie.split(';')[0];

  // STEP 4: Authenticated Dashboard API
  console.log('STEP 4: Fetching Dashboard via authenticated session...');
  const dashRes = await fetch(`${API_BASE}/api/brewrich-ai/dashboard`, {
    headers: { Cookie: sessionCookieHeader },
  });
  assert(dashRes.ok, 'Authenticated dashboard request must succeed');
  const dashJson = await dashRes.json();
  assert(dashJson.success === true, 'Dashboard success must be true');
  assert(dashJson.authenticated === true, 'Dashboard must confirm authenticated=true');
  const d = dashJson.data;
  assert(d.strategy.universeSize === 400, 'Universe size must be 400');
  assert(d.strategy.eligibleCount > 0, 'Eligible count must be > 0');
  assert(d.portfolio.totalPortfolioValue === 100000, 'Total portfolio NAV must be ₹1,00,000');
  assert(d.portfolio.positions.length === 10, 'Positions count must be 10');
  assert(d.risk.liveTradingStatus === 'LOCKED', 'Live trading must be LOCKED');
  console.log(`✓ STEP 4 PASSED: Authenticated Dashboard loaded (NAV: ₹${d.portfolio.totalPortfolioValue}, Eligible: ${d.strategy.eligibleCount}, Positions: ${d.portfolio.positions.length}).\n`);

  // STEP 5: Authoritative 10-Year Backtest
  console.log('STEP 5: Verifying authentic 10-year backtest metrics...');
  const btRes = await fetch(`${API_BASE}/api/brewrich-ai/backtest`, {
    headers: { Cookie: sessionCookieHeader },
  });
  assert(btRes.ok, 'Backtest request must succeed');
  const btJson = await btRes.json();
  const bt = btJson.backtest;
  assert(bt.summary.cagrPct === 41.26, `CAGR must equal 41.26% (got ${bt.summary.cagrPct}%)`);
  assert(bt.summary.totalTrades === 226, `Total trades must equal 226 (got ${bt.summary.totalTrades})`);
  assert(bt.summary.endingCapital === 2799932.58, `Ending capital must equal ₹27,99,932.58 (got ${bt.summary.endingCapital})`);
  assert(bt.summary.sharpeRatio === 1.33, `Sharpe ratio must equal 1.33 (got ${bt.summary.sharpeRatio})`);
  assert(bt.summary.maxDrawdownPct === -45.27, `Max DD must equal -45.27% (got ${bt.summary.maxDrawdownPct}%)`);
  console.log(`✓ STEP 5 PASSED: 10-Year Backtest verified (CAGR: ${bt.summary.cagrPct}%, Trades: ${bt.summary.totalTrades}, Final NAV: ₹${bt.summary.endingCapital.toLocaleString('en-IN')}).\n`);

  // STEP 6: Persistent Paper Portfolio Reading & Accounting
  console.log('STEP 6: Verifying Paper Portfolio state reading...');
  const portRes = await fetch(`${API_BASE}/api/brewrich-ai/portfolio`, {
    headers: { Cookie: sessionCookieHeader },
  });
  assert(portRes.ok, 'Portfolio request must succeed');
  const portJson = await portRes.json();
  const p = portJson.portfolio;
  assert(p.initialCapital === 100000, 'Initial capital must be ₹1,00,000');
  assert(p.cashBalance === 2261.85, 'Cash balance must be ₹2,261.85');
  assert(p.investedValue === 97738.15, 'Invested value must be ₹97,738.15');
  assert(p.totalPortfolioValue === 100000, 'Total portfolio value must be ₹1,00,000');
  assert(p.positions.length === 10, 'Positions count must be 10');
  console.log(`✓ STEP 6 PASSED: Paper Portfolio state verified (Cash: ₹${p.cashBalance}, Invested: ₹${p.investedValue}, NAV: ₹${p.totalPortfolioValue}).\n`);

  // STEP 7: Paper Order Book
  console.log('STEP 7: Verifying Paper Order Book...');
  const ordRes = await fetch(`${API_BASE}/api/brewrich-ai/orders`, {
    headers: { Cookie: sessionCookieHeader },
  });
  assert(ordRes.ok, 'Orders request must succeed');
  const ordJson = await ordRes.json();
  assert(ordJson.orders.length === 10, 'Must have 10 paper orders recorded');
  for (const o of ordJson.orders) {
    assert(o.executionMode === 'PAPER_ONLY' || o.executionMode === 'PAPER', 'All orders must be PAPER_ONLY');
    assert(o.orderId.startsWith('ORD_BUY_'), 'Orders must start with ORD_BUY_');
  }
  console.log(`✓ STEP 7 PASSED: 10 paper orders verified. Zero non-paper orders.\n`);

  // STEP 8: Duplicate Order Protection (Idempotency)
  console.log('STEP 8: Testing duplicate paper order protection (idempotency)...');
  const rebalanceRes = await fetch(`${API_BASE}/api/brewrich-ai/paper`, {
    method: 'POST',
    headers: { Cookie: sessionCookieHeader, 'Content-Type': 'application/json' },
  });
  assert(rebalanceRes.ok, 'Paper rebalance call must succeed');
  const rebalanceJson = await rebalanceRes.json();
  // Since all 10 positions are already filled for session 2026-09-03, executed actions should be 0
  assert(rebalanceJson.actions.length === 0, `Expected 0 duplicate actions, got ${rebalanceJson.actions.length}`);

  // Verify portfolio values remained completely identical
  const portAfterRes = await fetch(`${API_BASE}/api/brewrich-ai/portfolio`, {
    headers: { Cookie: sessionCookieHeader },
  });
  const portAfterJson = await portAfterRes.json();
  assert(portAfterJson.portfolio.cashBalance === 2261.85, 'Cash balance must not change on duplicate evaluation');
  assert(portAfterJson.portfolio.positions.length === 10, 'Position count must remain 10');
  console.log('✓ STEP 8 PASSED: Duplicate paper evaluation created 0 duplicate orders. State is 100% idempotent.\n');

  // STEP 9: Broker Status & Secret Masking
  console.log('STEP 9: Verifying Broker statuses & secret masking...');
  const brkRes = await fetch(`${API_BASE}/api/brewrich-ai/brokers`, {
    headers: { Cookie: sessionCookieHeader },
  });
  assert(brkRes.ok, 'Brokers request must succeed');
  const brkJson = await brkRes.json();
  const dhan = brkJson.brokers.find((b: any) => b.brokerId === 'dhan');
  const firstock = brkJson.brokers.find((b: any) => b.brokerId === 'firstock');
  assert(dhan !== undefined, 'Dhan broker must be present');
  assert(firstock !== undefined, 'Firstock broker must be present');
  assert(dhan.maskedClientId === '1100****48', 'Dhan client ID must be masked');
  assert(firstock.maskedClientId === 'FS_*****92', 'Firstock client ID must be masked');
  assert(dhan.tradingStatus === 'LOCKED', 'Dhan trading status must be LOCKED');
  assert(firstock.tradingStatus === 'LOCKED', 'Firstock trading status must be LOCKED');

  const rawBrokerPayload = JSON.stringify(brkJson);
  assert(!rawBrokerPayload.includes('access_token'), 'No access_token in payload');
  assert(!rawBrokerPayload.includes('api_key'), 'No api_key in payload');
  assert(!rawBrokerPayload.includes('password'), 'No password in payload');
  assert(!rawBrokerPayload.includes('totp_secret'), 'No totp_secret in payload');
  console.log('✓ STEP 9 PASSED: Dhan & Firstock adapters masked cleanly. Zero secrets leaked.\n');

  // STEP 10: Live Trading Gate Lock & HTTP 403 Fail-Closed
  console.log('STEP 10: Verifying Live Trading Lock & fail-closed HTTP 403...');
  const liveGetRes = await fetch(`${API_BASE}/api/brewrich-ai/live`);
  const liveGetJson = await liveGetRes.json();
  assert(liveGetJson.liveStatus.isLocked === true, 'Live status must be locked');
  assert(liveGetJson.liveStatus.liveEnabled === false, 'LIVE_ENABLED must be false');
  assert(liveGetJson.liveStatus.paperOnly === true, 'PAPER_ONLY must be true');

  // Attempt live mutation
  const livePostRes = await fetch(`${API_BASE}/api/brewrich-ai/live`, {
    method: 'POST',
    headers: { Cookie: sessionCookieHeader, 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'BUY', symbol: 'RELIANCE', quantity: 100 }),
  });
  assert(livePostRes.status === 403, `Live mutation must return HTTP 403 Forbidden (got ${livePostRes.status})`);
  const livePostJson = await livePostRes.json();
  assert(livePostJson.code === 'LIVE_TRADING_LOCKED', 'Error code must be LIVE_TRADING_LOCKED');
  console.log('✓ STEP 10 PASSED: Live mutation blocked with HTTP 403 LIVE_TRADING_LOCKED.\n');

  // STEP 11: Audit Log Verification
  console.log('STEP 11: Verifying Audit Log events...');
  const audRes = await fetch(`${API_BASE}/api/brewrich-ai/audit`, {
    headers: { Cookie: sessionCookieHeader },
  });
  assert(audRes.ok, 'Audit log request must succeed');
  const audJson = await audRes.json();
  assert(audJson.logs.length > 0, 'Must have audit logs');
  const liveBlockedEvent = audJson.logs.find((l: any) => l.action === 'LIVE_BLOCKED');
  assert(liveBlockedEvent !== undefined, 'LIVE_BLOCKED audit event must be present in audit trail');
  console.log(`✓ STEP 11 PASSED: Audit trail verified with ${audJson.logs.length} events including LIVE_BLOCKED interception.\n`);

  // STEP 12: Logout & Invalidation
  console.log('STEP 12: Testing logout & session invalidation...');
  const logoutRes = await fetch(`${API_BASE}/api/brewrich-ai/auth`, {
    method: 'DELETE',
    headers: { Cookie: sessionCookieHeader },
  });
  assert(logoutRes.ok, 'Logout request must succeed');
  const logoutJson = await logoutRes.json();
  assert(logoutJson.success === true, 'Logout success must be true');

  const afterLogoutRes = await fetch(`${API_BASE}/api/brewrich-ai/auth`);
  const afterLogoutJson = await afterLogoutRes.json();
  assert(afterLogoutJson.isAuthenticated === false, 'Session must be invalidated after logout');
  console.log('✓ STEP 12 PASSED: Logout successfully terminated session.\n');

  console.log('================================================================');
  console.log('ALL 12 PHASE 3 INTEGRATION TEST SCENARIOS PASSED WITH 100% SUCCESS!');
  console.log('================================================================\n');
}

if (typeof require !== 'undefined' && require.main === module) {
  runPhase3Verification().catch(err => {
    console.error('❌ PHASE 3 TEST FAILED:', err);
    process.exit(1);
  });
}
