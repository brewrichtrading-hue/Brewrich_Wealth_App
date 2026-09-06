-- ==============================================================================
-- BREWRICH AI — ATOMIC TRANSACTIONAL PAPER STATE MIGRATION RPC
-- Migration: 20260906_brewrich_ai_atomic_migration_rpc.sql
-- Target: Supabase PostgreSQL (Project: cplgtebmbplroctuqmyz)
-- Mode: Atomic, single-transaction, fail-closed, zero partial writes
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.brewrich_migrate_paper_baseline(
    p_portfolio jsonb,
    p_positions jsonb,
    p_orders jsonb,
    p_audit_event jsonb
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_pos jsonb;
    v_ord jsonb;
    v_positions_count integer := 0;
    v_orders_count integer := 0;
    v_nav_diff numeric;
    v_total_cost numeric := 0;
    v_cash numeric;
    v_nav numeric;
BEGIN
    -- 1. Fail-Closed Pre-flight Validation
    IF p_portfolio IS NULL OR p_positions IS NULL OR p_orders IS NULL OR p_audit_event IS NULL THEN
        RAISE EXCEPTION 'FAIL-CLOSED: Migration payload components cannot be NULL';
    END IF;

    v_cash := (p_portfolio->>'cash_balance')::numeric;
    v_nav  := (p_portfolio->>'total_nav')::numeric;

    IF v_cash < 0 OR v_nav <= 0 THEN
        RAISE EXCEPTION 'FAIL-CLOSED: Invalid cash (%) or NAV (%) in portfolio payload', v_cash, v_nav;
    END IF;

    -- 2. Upsert Canonical Paper Portfolio Root Record
    INSERT INTO public.brewrich_paper_portfolio (
        id,
        initial_capital,
        cash_balance,
        invested_value,
        total_nav,
        total_realized_pnl,
        total_unrealized_pnl,
        rebalance_count,
        last_rebalance_date,
        updated_at
    ) VALUES (
        p_portfolio->>'id',
        (p_portfolio->>'initial_capital')::numeric,
        v_cash,
        (p_portfolio->>'invested_value')::numeric,
        v_nav,
        COALESCE((p_portfolio->>'total_realized_pnl')::numeric, 0.00),
        COALESCE((p_portfolio->>'total_unrealized_pnl')::numeric, 0.00),
        COALESCE((p_portfolio->>'rebalance_count')::integer, 1),
        (p_portfolio->>'last_rebalance_date')::date,
        COALESCE((p_portfolio->>'updated_at')::timestamptz, timezone('utc'::text, now()))
    )
    ON CONFLICT (id) DO UPDATE SET
        initial_capital = EXCLUDED.initial_capital,
        cash_balance = EXCLUDED.cash_balance,
        invested_value = EXCLUDED.invested_value,
        total_nav = EXCLUDED.total_nav,
        total_realized_pnl = EXCLUDED.total_realized_pnl,
        total_unrealized_pnl = EXCLUDED.total_unrealized_pnl,
        rebalance_count = EXCLUDED.rebalance_count,
        last_rebalance_date = EXCLUDED.last_rebalance_date,
        updated_at = EXCLUDED.updated_at;

    -- 3. Upsert All Active Holdings (Exactly 10 Expected)
    FOR v_pos IN SELECT * FROM jsonb_array_elements(p_positions) LOOP
        INSERT INTO public.brewrich_paper_positions (
            portfolio_id,
            symbol,
            shares,
            entry_price,
            current_price,
            cost_basis,
            current_value,
            unrealized_pnl,
            unrealized_pnl_pct,
            weight_pct,
            updated_at
        ) VALUES (
            v_pos->>'portfolio_id',
            v_pos->>'symbol',
            (v_pos->>'shares')::numeric,
            (v_pos->>'entry_price')::numeric,
            (v_pos->>'current_price')::numeric,
            (v_pos->>'cost_basis')::numeric,
            (v_pos->>'current_value')::numeric,
            COALESCE((v_pos->>'unrealized_pnl')::numeric, 0.00),
            COALESCE((v_pos->>'unrealized_pnl_pct')::numeric, 0.00),
            (v_pos->>'weight_pct')::numeric,
            COALESCE((v_pos->>'updated_at')::timestamptz, timezone('utc'::text, now()))
        )
        ON CONFLICT (portfolio_id, symbol) DO UPDATE SET
            shares = EXCLUDED.shares,
            entry_price = EXCLUDED.entry_price,
            current_price = EXCLUDED.current_price,
            cost_basis = EXCLUDED.cost_basis,
            current_value = EXCLUDED.current_value,
            weight_pct = EXCLUDED.weight_pct,
            updated_at = EXCLUDED.updated_at;

        v_total_cost := v_total_cost + (v_pos->>'cost_basis')::numeric;
        v_positions_count := v_positions_count + 1;
    END LOOP;

    -- 4. Insert Immutable Paper Orders (Exactly 10 Expected, Duplicate-Safe)
    FOR v_ord IN SELECT * FROM jsonb_array_elements(p_orders) LOOP
        INSERT INTO public.brewrich_paper_orders (
            id,
            portfolio_id,
            symbol,
            side,
            quantity,
            price,
            order_value,
            status,
            execution_mode,
            strategy_signal,
            broker_context,
            event_id,
            created_at
        ) VALUES (
            v_ord->>'id',
            v_ord->>'portfolio_id',
            v_ord->>'symbol',
            v_ord->>'side',
            (v_ord->>'quantity')::numeric,
            (v_ord->>'price')::numeric,
            (v_ord->>'order_value')::numeric,
            COALESCE(v_ord->>'status', 'PAPER_ONLY'),
            'PAPER_ONLY',
            v_ord->>'strategy_signal',
            COALESCE(v_ord->>'broker_context', 'DHAN_PAPER_ADAPTER'),
            v_ord->>'event_id',
            COALESCE((v_ord->>'created_at')::timestamptz, timezone('utc'::text, now()))
        )
        ON CONFLICT (id) DO NOTHING;

        v_orders_count := v_orders_count + 1;
    END LOOP;

    -- 5. Record Immutable Migration Audit Event
    INSERT INTO public.brewrich_audit_events (
        id,
        category,
        action,
        details,
        severity,
        metadata_json
    ) VALUES (
        p_audit_event->>'id',
        p_audit_event->>'category',
        p_audit_event->>'action',
        p_audit_event->>'details',
        p_audit_event->>'severity',
        (p_audit_event->>'metadata_json')::jsonb
    )
    ON CONFLICT (id) DO NOTHING;

    -- 6. Transactional Invariant Assertions (Fail-Closed)
    v_nav_diff := ABS((v_cash + v_total_cost) - v_nav);
    IF v_nav_diff > 0.05 THEN
        RAISE EXCEPTION 'FAIL-CLOSED: NAV invariant violated during migration. Cash (%), Invested (%), NAV (%), Diff (%)',
            v_cash, v_total_cost, v_nav, v_nav_diff;
    END IF;

    IF v_positions_count != 10 THEN
        RAISE EXCEPTION 'FAIL-CLOSED: Migration expected exactly 10 positions, processed %', v_positions_count;
    END IF;

    IF v_orders_count != 10 THEN
        RAISE EXCEPTION 'FAIL-CLOSED: Migration expected exactly 10 orders, processed %', v_orders_count;
    END IF;

    -- 7. Return Structured Verification Payload
    RETURN jsonb_build_object(
        'success', true,
        'portfolio_id', p_portfolio->>'id',
        'initial_capital', (p_portfolio->>'initial_capital')::numeric,
        'cash_balance', v_cash,
        'invested_value', v_total_cost,
        'total_nav', v_nav,
        'positions_count', v_positions_count,
        'orders_count', v_orders_count,
        'audit_event_id', p_audit_event->>'id',
        'migrated_at', timezone('utc'::text, now())
    );
END;
$$;

-- Security Hardening: Revoke execution from public, anon, and authenticated
REVOKE EXECUTE ON FUNCTION public.brewrich_migrate_paper_baseline(jsonb, jsonb, jsonb, jsonb) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.brewrich_migrate_paper_baseline(jsonb, jsonb, jsonb, jsonb) FROM anon;
REVOKE EXECUTE ON FUNCTION public.brewrich_migrate_paper_baseline(jsonb, jsonb, jsonb, jsonb) FROM authenticated;
GRANT EXECUTE ON FUNCTION public.brewrich_migrate_paper_baseline(jsonb, jsonb, jsonb, jsonb) TO service_role;
