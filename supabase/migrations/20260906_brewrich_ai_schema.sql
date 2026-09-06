-- ==============================================================================
-- BREWRICH AI — PRODUCTION POSTGRESQL DATABASE FOUNDATION
-- Migration: 20260906_brewrich_ai_schema.sql
-- Target: Supabase PostgreSQL (Project: cplgtebmbplroctuqmyz)
-- Mode: Idempotent, non-destructive, zero impact on existing platform tables
-- Security: FAIL-CLOSED RLS — ZERO anonymous or direct public read access.
--           All 12 tables accessible ONLY via backend service_role.
-- ==============================================================================

-- Safety check: Verify extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 1. BREWRICH USERS TABLE (Single-User Owner Identity)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.brewrich_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) DEFAULT 'owner' NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    two_factor_secret_encrypted TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    last_login_at TIMESTAMPTZ
);

ALTER TABLE public.brewrich_users ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'brewrich_users' AND policyname = 'Service role full access to brewrich_users') THEN
        CREATE POLICY "Service role full access to brewrich_users" ON public.brewrich_users FOR ALL TO service_role USING (true) WITH CHECK (true);
    END IF;
END $$;


-- ==============================================================================
-- 2. BREWRICH SESSIONS TABLE (HttpOnly Session Security)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.brewrich_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.brewrich_users(id) ON DELETE CASCADE NOT NULL,
    token_hash VARCHAR(255) UNIQUE NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    is_revoked BOOLEAN DEFAULT FALSE NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_brewrich_sessions_user_id ON public.brewrich_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_brewrich_sessions_token_hash ON public.brewrich_sessions(token_hash);

ALTER TABLE public.brewrich_sessions ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'brewrich_sessions' AND policyname = 'Service role full access to brewrich_sessions') THEN
        CREATE POLICY "Service role full access to brewrich_sessions" ON public.brewrich_sessions FOR ALL TO service_role USING (true) WITH CHECK (true);
    END IF;
END $$;


-- ==============================================================================
-- 3. BREWRICH PAPER PORTFOLIO TABLE (NAV & Capital Accounting)
-- Invariant: cash_balance + invested_value = total_nav
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.brewrich_paper_portfolio (
    id VARCHAR(100) PRIMARY KEY DEFAULT 'canonical_paper_portfolio',
    initial_capital NUMERIC(15, 2) DEFAULT 100000.00 NOT NULL,
    cash_balance NUMERIC(15, 2) NOT NULL,
    invested_value NUMERIC(15, 2) NOT NULL,
    total_nav NUMERIC(15, 2) NOT NULL,
    total_realized_pnl NUMERIC(15, 2) DEFAULT 0.00 NOT NULL,
    total_unrealized_pnl NUMERIC(15, 2) DEFAULT 0.00 NOT NULL,
    rebalance_count INTEGER DEFAULT 0 NOT NULL,
    last_rebalance_date DATE,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT chk_paper_portfolio_nav_invariant CHECK (ABS((cash_balance + invested_value) - total_nav) <= 0.05)
);

ALTER TABLE public.brewrich_paper_portfolio ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'brewrich_paper_portfolio' AND policyname = 'Service role full access to brewrich_paper_portfolio') THEN
        CREATE POLICY "Service role full access to brewrich_paper_portfolio" ON public.brewrich_paper_portfolio FOR ALL TO service_role USING (true) WITH CHECK (true);
    END IF;
END $$;


-- ==============================================================================
-- 4. BREWRICH PAPER POSITIONS TABLE (Active Holdings)
-- Invariant: Unique symbol per portfolio, non-negative quantities
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.brewrich_paper_positions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    portfolio_id VARCHAR(100) REFERENCES public.brewrich_paper_portfolio(id) ON DELETE CASCADE NOT NULL,
    symbol VARCHAR(30) NOT NULL,
    shares NUMERIC(15, 4) NOT NULL CHECK (shares > 0),
    entry_price NUMERIC(15, 2) NOT NULL CHECK (entry_price > 0),
    current_price NUMERIC(15, 2) NOT NULL CHECK (current_price > 0),
    cost_basis NUMERIC(15, 2) NOT NULL CHECK (cost_basis > 0),
    current_value NUMERIC(15, 2) NOT NULL,
    unrealized_pnl NUMERIC(15, 2) NOT NULL,
    unrealized_pnl_pct NUMERIC(8, 4) NOT NULL,
    weight_pct NUMERIC(8, 4) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT uq_brewrich_paper_positions_symbol UNIQUE (portfolio_id, symbol)
);

CREATE INDEX IF NOT EXISTS idx_brewrich_paper_positions_sym ON public.brewrich_paper_positions(symbol);
CREATE INDEX IF NOT EXISTS idx_brewrich_paper_positions_portfolio ON public.brewrich_paper_positions(portfolio_id);

ALTER TABLE public.brewrich_paper_positions ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'brewrich_paper_positions' AND policyname = 'Service role full access to brewrich_paper_positions') THEN
        CREATE POLICY "Service role full access to brewrich_paper_positions" ON public.brewrich_paper_positions FOR ALL TO service_role USING (true) WITH CHECK (true);
    END IF;
END $$;


-- ==============================================================================
-- 5. BREWRICH PAPER ORDERS TABLE (Immutable Execution Book)
-- Invariant: Unique event_id for deterministic idempotency
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.brewrich_paper_orders (
    id VARCHAR(100) PRIMARY KEY, -- e.g. ORD_BUY_HFCL_1788673884
    portfolio_id VARCHAR(100) REFERENCES public.brewrich_paper_portfolio(id) ON DELETE CASCADE NOT NULL,
    symbol VARCHAR(30) NOT NULL,
    side VARCHAR(10) CHECK (side IN ('BUY', 'SELL')) NOT NULL,
    quantity NUMERIC(15, 4) NOT NULL CHECK (quantity > 0),
    price NUMERIC(15, 2) NOT NULL CHECK (price > 0),
    order_value NUMERIC(15, 2) NOT NULL CHECK (order_value > 0),
    status VARCHAR(20) DEFAULT 'PAPER_ONLY' NOT NULL,
    execution_mode VARCHAR(20) DEFAULT 'PAPER_ONLY' NOT NULL CHECK (execution_mode = 'PAPER_ONLY'),
    strategy_signal TEXT,
    broker_context VARCHAR(50) DEFAULT 'DHAN_PAPER_ADAPTER' NOT NULL,
    event_id VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_brewrich_paper_orders_event_id ON public.brewrich_paper_orders(event_id);
CREATE INDEX IF NOT EXISTS idx_brewrich_paper_orders_symbol ON public.brewrich_paper_orders(symbol);
CREATE INDEX IF NOT EXISTS idx_brewrich_paper_orders_created_at ON public.brewrich_paper_orders(created_at DESC);

ALTER TABLE public.brewrich_paper_orders ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'brewrich_paper_orders' AND policyname = 'Service role full access to brewrich_paper_orders') THEN
        CREATE POLICY "Service role full access to brewrich_paper_orders" ON public.brewrich_paper_orders FOR ALL TO service_role USING (true) WITH CHECK (true);
    END IF;
END $$;


-- ==============================================================================
-- 6. BREWRICH REBALANCE RUNS TABLE (Execution History)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.brewrich_rebalance_runs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    portfolio_id VARCHAR(100) REFERENCES public.brewrich_paper_portfolio(id) ON DELETE CASCADE NOT NULL,
    session_date DATE NOT NULL,
    vacancies INTEGER NOT NULL DEFAULT 0,
    sells_count INTEGER NOT NULL DEFAULT 0,
    buys_count INTEGER NOT NULL DEFAULT 0,
    actions_json JSONB NOT NULL DEFAULT '[]'::jsonb,
    starting_cash NUMERIC(15, 2) NOT NULL,
    ending_cash NUMERIC(15, 2) NOT NULL,
    status VARCHAR(30) DEFAULT 'SUCCESS' NOT NULL,
    executed_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_brewrich_rebalance_runs_date ON public.brewrich_rebalance_runs(session_date DESC);

ALTER TABLE public.brewrich_rebalance_runs ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'brewrich_rebalance_runs' AND policyname = 'Service role full access to brewrich_rebalance_runs') THEN
        CREATE POLICY "Service role full access to brewrich_rebalance_runs" ON public.brewrich_rebalance_runs FOR ALL TO service_role USING (true) WITH CHECK (true);
    END IF;
END $$;


-- ==============================================================================
-- 7. BREWRICH STRATEGY RUNS TABLE (Strategy Snapshots)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.brewrich_strategy_runs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    strategy_code VARCHAR(50) DEFAULT 'BREWRICH_400' NOT NULL,
    as_of_date DATE NOT NULL,
    universe_size INTEGER NOT NULL DEFAULT 400,
    eligible_candidate_count INTEGER NOT NULL DEFAULT 0,
    top_ranked_symbols JSONB NOT NULL DEFAULT '[]'::jsonb,
    allocations_json JSONB NOT NULL DEFAULT '{}'::jsonb,
    executed_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT uq_brewrich_strategy_runs_date UNIQUE (strategy_code, as_of_date)
);

CREATE INDEX IF NOT EXISTS idx_brewrich_strategy_runs_date ON public.brewrich_strategy_runs(as_of_date DESC);

ALTER TABLE public.brewrich_strategy_runs ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'brewrich_strategy_runs' AND policyname = 'Service role full access to brewrich_strategy_runs') THEN
        CREATE POLICY "Service role full access to brewrich_strategy_runs" ON public.brewrich_strategy_runs FOR ALL TO service_role USING (true) WITH CHECK (true);
    END IF;
END $$;


-- ==============================================================================
-- 8. BREWRICH BACKTEST RUNS TABLE (Cached Historical Backtest)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.brewrich_backtest_runs (
    id VARCHAR(100) PRIMARY KEY DEFAULT 'BREWRICH_400_10Y_CANONICAL',
    strategy_code VARCHAR(50) DEFAULT 'BREWRICH_400' NOT NULL,
    period VARCHAR(100) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    initial_capital NUMERIC(15, 2) NOT NULL DEFAULT 100000.00,
    final_equity NUMERIC(15, 2) NOT NULL,
    cagr_pct NUMERIC(8, 4) NOT NULL,
    max_drawdown_pct NUMERIC(8, 4) NOT NULL,
    sharpe_ratio NUMERIC(8, 4) NOT NULL,
    total_trades INTEGER NOT NULL,
    win_rate_pct NUMERIC(8, 4) NOT NULL,
    metrics_json JSONB NOT NULL,
    equity_curve_json JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.brewrich_backtest_runs ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'brewrich_backtest_runs' AND policyname = 'Service role full access to brewrich_backtest_runs') THEN
        CREATE POLICY "Service role full access to brewrich_backtest_runs" ON public.brewrich_backtest_runs FOR ALL TO service_role USING (true) WITH CHECK (true);
    END IF;
END $$;


-- ==============================================================================
-- 9. BREWRICH BROKER CONNECTIONS TABLE (Masked Metadata, Zero Secrets)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.brewrich_broker_connections (
    id VARCHAR(50) PRIMARY KEY, -- 'dhan', 'firstock'
    name VARCHAR(100) NOT NULL,
    environment VARCHAR(50) DEFAULT 'PAPER_SIMULATION' NOT NULL,
    masked_client_id VARCHAR(50) NOT NULL,
    credentials_configured BOOLEAN DEFAULT FALSE NOT NULL,
    trading_status VARCHAR(30) DEFAULT 'LOCKED' NOT NULL CHECK (trading_status = 'LOCKED'),
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.brewrich_broker_connections ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'brewrich_broker_connections' AND policyname = 'Service role full access to brewrich_broker_connections') THEN
        CREATE POLICY "Service role full access to brewrich_broker_connections" ON public.brewrich_broker_connections FOR ALL TO service_role USING (true) WITH CHECK (true);
    END IF;
END $$;

-- Seed default safe broker metadata
INSERT INTO public.brewrich_broker_connections (id, name, environment, masked_client_id, credentials_configured, trading_status)
VALUES 
    ('dhan', 'DhanHQ', 'PAPER_SIMULATION', '1100****48', true, 'LOCKED'),
    ('firstock', 'Firstock', 'PAPER_SIMULATION', 'FS_*****92', false, 'LOCKED')
ON CONFLICT (id) DO UPDATE SET
    environment = EXCLUDED.environment,
    trading_status = EXCLUDED.trading_status,
    updated_at = timezone('utc'::text, now());


-- ==============================================================================
-- 10. BREWRICH RISK STATE TABLE (Fail-Closed Safety Configuration)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.brewrich_risk_state (
    id VARCHAR(50) PRIMARY KEY DEFAULT 'canonical_risk_state',
    execution_mode VARCHAR(20) DEFAULT 'PAPER' NOT NULL CHECK (execution_mode = 'PAPER'),
    live_locked BOOLEAN DEFAULT TRUE NOT NULL CHECK (live_locked = TRUE),
    emergency_stop BOOLEAN DEFAULT TRUE NOT NULL,
    max_single_position_pct NUMERIC(8, 4) DEFAULT 10.00 NOT NULL,
    drawdown_limit_pct NUMERIC(8, 4) DEFAULT 15.00 NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.brewrich_risk_state ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'brewrich_risk_state' AND policyname = 'Service role full access to brewrich_risk_state') THEN
        CREATE POLICY "Service role full access to brewrich_risk_state" ON public.brewrich_risk_state FOR ALL TO service_role USING (true) WITH CHECK (true);
    END IF;
END $$;

-- Seed default risk state (live_locked = true, emergency_stop = true)
INSERT INTO public.brewrich_risk_state (id, execution_mode, live_locked, emergency_stop, max_single_position_pct, drawdown_limit_pct)
VALUES ('canonical_risk_state', 'PAPER', true, true, 10.00, 15.00)
ON CONFLICT (id) DO UPDATE SET
    live_locked = true,
    updated_at = timezone('utc'::text, now());


-- ==============================================================================
-- 11. BREWRICH SCHEDULER JOBS TABLE (Job Audit & Duplicate Prevention)
-- Invariant: Unique (job_name, session_date)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.brewrich_scheduler_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_name VARCHAR(100) NOT NULL,
    session_date DATE NOT NULL,
    scheduled_for TIMESTAMPTZ NOT NULL,
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    status VARCHAR(30) DEFAULT 'PENDING' NOT NULL,
    execution_result_json JSONB,
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT uq_brewrich_scheduler_job_session UNIQUE (job_name, session_date)
);

CREATE INDEX IF NOT EXISTS idx_brewrich_scheduler_jobs_name_date ON public.brewrich_scheduler_jobs(job_name, session_date);

ALTER TABLE public.brewrich_scheduler_jobs ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'brewrich_scheduler_jobs' AND policyname = 'Service role full access to brewrich_scheduler_jobs') THEN
        CREATE POLICY "Service role full access to brewrich_scheduler_jobs" ON public.brewrich_scheduler_jobs FOR ALL TO service_role USING (true) WITH CHECK (true);
    END IF;
END $$;


-- ==============================================================================
-- 12. BREWRICH AUDIT EVENTS TABLE (Immutable Audit Trail)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.brewrich_audit_events (
    id VARCHAR(100) PRIMARY KEY, -- 'AUD-...'
    timestamp TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('AUTH', 'STRATEGY', 'PAPER_EXECUTION', 'REBALANCE', 'SCHEDULER', 'SAFETY', 'BROKER', 'MIGRATION', 'SYSTEM', 'ERROR')),
    action VARCHAR(100) NOT NULL,
    details TEXT NOT NULL,
    severity VARCHAR(20) DEFAULT 'INFO' NOT NULL CHECK (severity IN ('INFO', 'SUCCESS', 'WARNING', 'CRITICAL')),
    metadata_json JSONB
);

CREATE INDEX IF NOT EXISTS idx_brewrich_audit_events_cat ON public.brewrich_audit_events(category);
CREATE INDEX IF NOT EXISTS idx_brewrich_audit_events_time ON public.brewrich_audit_events(timestamp DESC);

ALTER TABLE public.brewrich_audit_events ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'brewrich_audit_events' AND policyname = 'Service role full access to brewrich_audit_events') THEN
        CREATE POLICY "Service role full access to brewrich_audit_events" ON public.brewrich_audit_events FOR ALL TO service_role USING (true) WITH CHECK (true);
    END IF;
END $$;

-- Record initial foundation audit event
INSERT INTO public.brewrich_audit_events (id, category, action, details, severity, metadata_json)
VALUES (
    'AUD_FOUNDATION_INIT',
    'SYSTEM',
    'DATABASE_FOUNDATION_DEPLOYED',
    'Brewrich AI production PostgreSQL schema initialized with 12 dedicated tables and fail-closed locks.',
    'SUCCESS',
    '{"live_enabled": false, "paper_only": true, "phase": "4B"}'::jsonb
)
ON CONFLICT (id) DO NOTHING;

-- ==============================================================================
-- END OF MIGRATION
-- ==============================================================================
