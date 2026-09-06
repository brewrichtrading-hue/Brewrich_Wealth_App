# BREWRICH AI — PRODUCT RESET AUDIT & ARCHITECTURAL DIRECTIVE

**Target Route**: `/sky-high` $\longrightarrow$ **BREWRICH AI (Personal Wealth Cockpit)**  
**Audit Date**: September 5, 2026  
**Status**: AUDIT COMPLETE — AWAITING EXPLICIT APPROVAL (`APPROVE RESET`)

---

## 1. Executive Summary & Core Principle

The old Sky High / Definedge architecture is **OBSOLETE** and will be **COMPLETELY REMOVED** from the `/sky-high` product route. The new product is:

**BREWRICH AI — Personal Wealth Cockpit**  
Operating the **Brewrich 400 Wealth Strategy Engine** with **Paper Trading Execution**, backed by server-side **Dhan** and **Firstock** broker adapters, and with **Live Trading 🔒 LOCKED**.

The new product has **ZERO dependency on Definedge**, zero Definedge API routes, zero Definedge tokens, zero Definedge UI, and zero Definedge market data.

---

## 2. Protected Routes (Strict Read-Only / Untouched)

The following core website routes are strictly protected and will NOT be modified:
1. `https://brewrich.in/` (Home)
2. `https://brewrich.in/mfd` (Mutual Fund Distribution)
3. `https://brewrich.in/miip` (Master Investor Internship Program)
4. `https://brewrich.in/aiinvesting` (**UX/UI Reference Only** — Read Only)

---

## 3. Old Architecture vs. New Architecture Comparison

### Old Sky High / Definedge Architecture (To Be Removed)
- **Data Source**: Definedge SDS API (`/sds/history/NSE/*`)
- **Authentication**: Definedge 2FA Token + OTP session key encryption
- **Market Data Tables**: `skyhigh_market_data`, `skyhigh_trading_days` (Old Definedge tables)
- **Token Map**: Definedge master file inflation (`nsecash.zip`)
- **Strategy Concept**: Old Options / Supertrend roadmap
- **UI Components**: `SkyHighPage.tsx`, `SkyHighDefinedgeTest.tsx`

### New Brewrich AI Architecture (To Be Implemented)
- **Product**: Brewrich AI Personal Wealth Cockpit
- **Strategy Core**: **Brewrich 400 Wealth Strategy Engine** (Fixed, Proprietary Momentum Engine, View-Only)
- **Historical Dataset**: Brewrich 400 10-Year Historical Dataset & Backtest Engine
- **Execution Mode**: **Paper Trading** (Default active mode)
- **Paper Portfolio**: Persistent state (`paper_state.json` / atomic writes, restart idempotency, processed order/event IDs, cash & position safeguards)
- **Broker Adapters**: **Dhan** and **Firstock** (Server-side metadata only; credentials never exposed)
- **Live Trading**: **🔒 LOCKED / DISABLED** (Fail-closed, 0 live order placement endpoints)
- **Design Language**: Official Brewrich Brand Guidelines (Storm `#000B4F`, Bumblebee `#FFC729`, Joyous Red `#B0261D`, Surface `#FEFEFE`, GT America / Plus Jakarta Sans)

---

## 4. File Classification Matrix

### A. Files to Delete / Remove (Old Definedge / Sky High Stack)
| File Path | Reason for Removal |
| :--- | :--- |
| `components/SkyHighDefinedgeTest.tsx` | Obsolete Definedge diagnostic & ingestion UI |
| `lib/skyhigh/definedgeAuth.ts` | Obsolete Definedge 2FA authentication & session cookies |
| `lib/skyhigh/definedgeMaster.ts` | Obsolete Definedge master token zip inflater & search |
| `lib/skyhigh/definedgeService.ts` | Obsolete Definedge historical bar fetcher & parser |
| `tests/skyhigh/definedgeParser.test.ts` | Obsolete Definedge parser unit tests |
| `app/api/skyhigh/definedge/auth/step1/route.ts` | Obsolete Definedge OTP step 1 endpoint |
| `app/api/skyhigh/definedge/auth/step2/route.ts` | Obsolete Definedge OTP step 2 endpoint |
| `app/api/skyhigh/definedge/auth/status/route.ts` | Obsolete Definedge auth status endpoint |
| `app/api/skyhigh/definedge/auth/logout/route.ts` | Obsolete Definedge logout endpoint |
| `app/api/skyhigh/definedge/history/route.ts` | Obsolete Definedge history query endpoint |
| `app/api/skyhigh/definedge/search/route.ts` | Obsolete Definedge search endpoint |
| `app/api/skyhigh/definedge/status/route.ts` | Obsolete Definedge master status endpoint |

*Database Tables Scheduled for Decommissioning*: `skyhigh_market_data`, `skyhigh_trading_days` (Confirmed 0 dependents in protected routes).

### B. Files to Refactor (The /sky-high Product Experience)
| File Path | Refactoring Purpose |
| :--- | :--- |
| `app/sky-high/page.tsx` | Update page metadata to `Brewrich AI \| Personal Wealth Cockpit` and mount new UI shell |
| `components/SkyHighPage.tsx` | Replace container with modular `BrewrichAiShell.tsx` |
| `lib/skyhigh/types.ts` | Replace old Definedge types with Brewrich AI Cockpit, Brewrich 400, Portfolio, Order, and Broker types |

### C. Files to Keep / Protected (Global Platform)
| File Path | Status |
| :--- | :--- |
| `app/page.tsx`, `app/mfd/page.tsx`, `app/miip/page.tsx`, `app/mip/page.tsx` | **PROTECTED / UNTOUCHED** |
| `app/admin/page.tsx`, `app/dashboard/page.tsx`, `app/student/*` | **PROTECTED / UNTOUCHED** |
| `components/Navbar.tsx`, `components/Footer.tsx`, `components/GlobalScrollUnlocker.tsx` | **PROTECTED / UNTOUCHED** |
| `lib/supabase/*`, `supabase/schema.sql`, `public.mfd_bookings`, `public.module_status` | **PROTECTED / UNTOUCHED** |
| `package.json`, `tailwind.config.ts`, `app/layout.tsx`, `app/globals.css` | **PROTECTED / UNTOUCHED** |

### D. Files to Create (New Brewrich AI Personal Wealth Cockpit)
```
components/brewrich-ai/
├── BrewrichAiShell.tsx           # Primary Cockpit Shell & Tab Navigation
├── BrewrichAiAuthModal.tsx       # Dedicated Brewrich AI Cockpit Login & 2FA
├── tabs/
│   ├── DashboardTab.tsx          # System health, strategy state, positions, P&L
│   ├── Brewrich400Tab.tsx        # View-only Brewrich 400 strategy metrics & rankings
│   ├── BacktestTab.tsx           # Historical backtest metrics, equity & drawdown curves
│   ├── PaperTradingTab.tsx       # Active paper execution controls & health
│   ├── PortfolioTab.tsx          # Paper holdings, weights, cash & asset allocation
│   ├── OrdersTab.tsx             # Paper order book, execution reasons, audit trail
│   ├── RiskSafetyTab.tsx         # Exposure, drawdowns, emergency stops, safety gates
│   ├── BrokersTab.tsx            # Dhan & Firstock status (masked, server-side only)
│   ├── AuditLogTab.tsx           # Append-oriented operational event log
│   └── LiveTradingLockedTab.tsx  # Visibly locked live trading screen (🔒 LOCKED)

lib/brewrich-ai/
├── types.ts                      # Cockpit state, Brewrich 400, Portfolio, Order, and Broker types
├── brewrich400Engine.ts          # Protected Brewrich 400 strategy service boundary
├── paperExecution.ts             # Persistent paper execution & idempotency guards
└── brokerService.ts              # Dhan & Firstock status service (trading locked)

app/api/brewrich-ai/
├── auth/route.ts                 # Brewrich AI cockpit login
├── dashboard/route.ts            # Cockpit summary data
├── strategy/route.ts             # Brewrich 400 view-only data
├── backtest/route.ts             # Backtest performance data
├── paper/route.ts                # Paper execution status & controls
├── portfolio/route.ts            # Paper holdings query
├── orders/route.ts               # Paper order book query
├── risk/route.ts                 # Risk & safety metrics
├── brokers/route.ts              # Dhan & Firstock connection status
├── audit/route.ts                # Audit event logs
└── live/route.ts                 # Locked live status endpoint (fail-closed)
```

---

## 5. Security & Isolation Assurances

1. **Zero Broker Secrets in Browser**: Dhan and Firstock API tokens, secrets, and credentials remain 100% server-side; UI displays masked metadata only (`Connected`, `Trading: Locked`).
2. **Fail-Closed Live Trading**: `LIVE_ENABLED=false` is hardcoded. Zero live order placement endpoints, zero live broker calls.
3. **Paper Execution Safeguards**: Atomic state writes, duplicate-order protection, processed order IDs, cash overdraft guards, and restart idempotency.
4. **Zero Impact on Protected Routes**: `/`, `/mfd`, `/miip` share zero logic with the new `/sky-high` cockpit.
