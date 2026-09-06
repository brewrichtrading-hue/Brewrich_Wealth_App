# Brewrich AI — Database & Persistence Specification

**Target Application**: Brewrich AI Personal Wealth Cockpit (`https://brewrich.in/sky-high`)  
**Architecture Phase**: Phase 2 (Backend & Infrastructure Foundation)  
**Baseline State**: `data/paper_state.json` (authoritative paper portfolio)  

---

## 1. Architectural Principles

1. **Personal Single-User Model**: Designed for the single principal/owner of Brewrich Wealth. No public tenanting or multi-user complexity.
2. **Canonical State Compatibility**: The Python `PersistentPaperPortfolio` backed by `data/paper_state.json` remains the baseline source of truth for all paper trades, allocations, and NAV accounting.
3. **Fail-Closed Safety**: Live execution remains strictly disabled (`LIVE_ENABLED=false`, `PAPER_ONLY=true`).
4. **Zero-Secret Persistence**: Broker secrets (API keys, passwords, TOTP secrets) are strictly confined to server-side environment variables and never stored in database tables or logs.
5. **Non-Destructive Database Policy**: Existing Supabase tables (`skyhigh_market_data`, `skyhigh_trading_days`) remain intact.

---

## 2. Relational Database Schema (PostgreSQL / Supabase)

### Table 1: `brewrich_users`
Stores owner authentication identity.
```sql
CREATE TABLE IF NOT EXISTS brewrich_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) DEFAULT 'owner' NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    two_factor_secret_encrypted TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    last_login_at TIMESTAMPTZ
);
```

### Table 2: `brewrich_sessions`
Tracks active HttpOnly session tokens.
```sql
CREATE TABLE IF NOT EXISTS brewrich_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES brewrich_users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    is_revoked BOOLEAN DEFAULT FALSE NOT NULL
);
```

### Table 3: `brewrich_paper_portfolio`
Mirror of canonical `PersistentPaperPortfolio` summary metrics.
```sql
CREATE TABLE IF NOT EXISTS brewrich_paper_portfolio (
    id VARCHAR(100) PRIMARY KEY DEFAULT 'canonical_paper_portfolio',
    initial_capital NUMERIC(15, 2) DEFAULT 100000.00 NOT NULL,
    cash_balance NUMERIC(15, 2) NOT NULL,
    invested_value NUMERIC(15, 2) NOT NULL,
    total_nav NUMERIC(15, 2) NOT NULL,
    total_realized_pnl NUMERIC(15, 2) DEFAULT 0.00 NOT NULL,
    total_unrealized_pnl NUMERIC(15, 2) DEFAULT 0.00 NOT NULL,
    rebalance_count INTEGER DEFAULT 0 NOT NULL,
    last_rebalance_date DATE,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
```

### Table 4: `brewrich_paper_positions`
Mirror of active paper stock holdings.
```sql
CREATE TABLE IF NOT EXISTS brewrich_paper_positions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    portfolio_id VARCHAR(100) REFERENCES brewrich_paper_portfolio(id) ON DELETE CASCADE,
    symbol VARCHAR(30) NOT NULL,
    shares INTEGER NOT NULL,
    entry_price NUMERIC(15, 2) NOT NULL,
    current_price NUMERIC(15, 2) NOT NULL,
    cost_basis NUMERIC(15, 2) NOT NULL,
    current_value NUMERIC(15, 2) NOT NULL,
    unrealized_pnl NUMERIC(15, 2) NOT NULL,
    unrealized_pnl_pct NUMERIC(8, 4) NOT NULL,
    weight_pct NUMERIC(8, 4) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    CONSTRAINT uq_paper_symbol UNIQUE (portfolio_id, symbol)
);
```

### Table 5: `brewrich_paper_orders`
Immutable paper execution book with duplicate event protection.
```sql
CREATE TABLE IF NOT EXISTS brewrich_paper_orders (
    id VARCHAR(100) PRIMARY KEY, -- e.g. ORD_BUY_HFCL_1788673884
    portfolio_id VARCHAR(100) REFERENCES brewrich_paper_portfolio(id) ON DELETE CASCADE,
    symbol VARCHAR(30) NOT NULL,
    side VARCHAR(10) CHECK (side IN ('BUY', 'SELL')) NOT NULL,
    quantity INTEGER NOT NULL,
    price NUMERIC(15, 2) NOT NULL,
    order_value NUMERIC(15, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'FILLED' NOT NULL,
    execution_mode VARCHAR(20) DEFAULT 'PAPER_ONLY' NOT NULL,
    strategy_signal TEXT,
    broker_context VARCHAR(50) DEFAULT 'DHAN_PAPER_ADAPTER' NOT NULL,
    event_id VARCHAR(100) UNIQUE NOT NULL, -- Deterministic deduplication key
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
```

### Table 6: `brewrich_audit_events`
Immutable security and execution audit trail.
```sql
CREATE TABLE IF NOT EXISTS brewrich_audit_events (
    id VARCHAR(100) PRIMARY KEY, -- e.g. AUD-LN8F2K-AB12
    timestamp TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    category VARCHAR(50) NOT NULL, -- AUTH, STRATEGY, PAPER_EXECUTION, SAFETY, BROKER
    action VARCHAR(50) NOT NULL, -- LOGIN, LOGOUT, PAPER_RUN, LIVE_BLOCKED
    details TEXT NOT NULL,
    severity VARCHAR(20) DEFAULT 'INFO' NOT NULL,
    metadata_json JSONB
);
```

---

## 3. Mapping from `data/paper_state.json`

The JSON structure maps directly to relational tables:

| JSON Key | SQL Table | SQL Column | Notes |
| :--- | :--- | :--- | :--- |
| `portfolio_id` | `brewrich_paper_portfolio` | `id` | Defaults to `'canonical_paper_portfolio'` |
| `cash_balance` | `brewrich_paper_portfolio` | `cash_balance` | Free cash reserve |
| `total_nav` | `brewrich_paper_portfolio` | `total_nav` | Total paper portfolio value |
| `positions[]` | `brewrich_paper_positions` | rows | 1-to-many relationship |
| `orders[]` | `brewrich_paper_orders` | rows | Immutable ledger |
| `processed_event_ids[]` | `brewrich_paper_orders` | `event_id` | Deduplication index |

---

## 4. Migration & Baseline Preservation Policy

- Until cloud database migration is explicitly authorized, `data/paper_state.json` on the Python engine remains the active read/write baseline.
- Zero destructive commands (`DROP TABLE`, `TRUNCATE`) may be executed against existing database schemas.
