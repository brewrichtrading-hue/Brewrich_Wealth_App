-- ==============================================================================
-- BREWRICH AI — DEDICATED ATOMIC PAPER REBALANCE RPC
-- Migration: 20260907_brewrich_ai_atomic_rebalance_rpc.sql
-- Target: Supabase PostgreSQL (Project: cplgtebmbplroctuqmyz)
-- Mode: Atomic, single-transaction, fail-closed, zero partial writes
-- Idempotency: Enforced via deterministic session_date and portfolio FOR UPDATE lock
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.brewrich_execute_paper_rebalance_atomic(
    p_run_id text,
    p_session_date date,
    p_portfolio jsonb,
    p_active_positions jsonb,
    p_new_orders jsonb,
    p_rebalance_run jsonb,
    p_audit_event jsonb
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_portfolio_id text := COALESCE(p_portfolio->>'id', 'canonical_paper_portfolio');
    v_current_last_date date;
    v_current_reb_count integer;
    v_pos jsonb;
    v_ord jsonb;
    v_positions_count integer := 0;
    v_orders_count integer := 0;
    v_total_cost numeric := 0;
    v_total_val numeric := 0;
    v_cash numeric;
    v_nav numeric;
    v_nav_diff numeric;
    v_symbols_array text[];
BEGIN
    -- 1. Fail-Closed Payload Validation
    IF p_portfolio IS NULL OR p_active_positions IS NULL THEN
        RAISE EXCEPTION 'FAIL-CLOSED: Rebalance portfolio and active positions payloads cannot be NULL';
    END IF;

    IF p_session_date IS NULL THEN
        RAISE EXCEPTION 'FAIL-CLOSED: Rebalance session date cannot be NULL';
    END IF;

    v_cash := (p_portfolio->>'cash_balance')::numeric;
    v_nav  := (p_portfolio->>'total_nav')::numeric;

    IF v_cash < 0 OR v_nav <= 0 THEN
        RAISE EXCEPTION 'FAIL-CLOSED: Invalid cash (%) or NAV (%) in rebalance payload', v_cash, v_nav;
    END IF;

    -- 2. Concurrency Control: Acquire exclusive row-level lock on portfolio
    SELECT last_rebalance_date, rebalance_count
    INTO v_current_last_date, v_current_reb_count
    FROM public.brewrich_paper_portfolio
    WHERE id = v_portfolio_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'FAIL-CLOSED: Canonical paper portfolio "%" not found in database', v_portfolio_id;
    END IF;

    -- 3. Idempotency Check: Prevent duplicate rebalance execution for the same market session
    IF v_current_last_date = p_session_date THEN
        RETURN jsonb_build_object(
            'success', true,
            'status', 'skipped',
            'message', 'Paper rebalance already completed for session ' || p_session_date::text,
            'portfolio_id', v_portfolio_id,
            'session_date', p_session_date::text,
            'rebalance_count', v_current_reb_count
        );
    END IF;

    -- 4. Calculate active positions symbols to remove exited holdings
    SELECT array_agg(elem->>'symbol')
    INTO v_symbols_array
    FROM jsonb_array_elements(p_active_positions) elem;

    -- Delete exited positions from active holdings table
    IF v_symbols_array IS NOT NULL AND array_length(v_symbols_array, 1) > 0 THEN
        DELETE FROM public.brewrich_paper_positions
        WHERE portfolio_id = v_portfolio_id
          AND symbol != ALL(v_symbols_array);
    ELSE
        -- If active positions is empty (e.g. 100% cash defensive stance)
        DELETE FROM public.brewrich_paper_positions
        WHERE portfolio_id = v_portfolio_id;
    END IF;

    -- 5. Upsert Current Active Holdings
    FOR v_pos IN SELECT * FROM jsonb_array_elements(p_active_positions) LOOP
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
            v_portfolio_id,
            v_pos->>'symbol',
            (v_pos->>'shares')::numeric,
            (v_pos->>'entry_price')::numeric,
            (v_pos->>'current_price')::numeric,
            (v_pos->>'cost_basis')::numeric,
            (v_pos->>'current_value')::numeric,
            COALESCE((v_pos->>'unrealized_pnl')::numeric, 0.00),
            COALESCE((v_pos->>'unrealized_pnl_pct')::numeric, 0.00),
            COALESCE((v_pos->>'weight_pct')::numeric, 0.00),
            timezone('utc'::text, now())
        )
        ON CONFLICT (portfolio_id, symbol) DO UPDATE SET
            shares = EXCLUDED.shares,
            entry_price = EXCLUDED.entry_price,
            current_price = EXCLUDED.current_price,
            cost_basis = EXCLUDED.cost_basis,
            current_value = EXCLUDED.current_value,
            unrealized_pnl = EXCLUDED.unrealized_pnl,
            unrealized_pnl_pct = EXCLUDED.unrealized_pnl_pct,
            weight_pct = EXCLUDED.weight_pct,
            updated_at = EXCLUDED.updated_at;

        v_total_cost := v_total_cost + (v_pos->>'cost_basis')::numeric;
        v_total_val  := v_total_val  + (v_pos->>'current_value')::numeric;
        v_positions_count := v_positions_count + 1;
    END LOOP;

    -- 6. Insert New Paper Orders (Idempotent by event_id)
    IF p_new_orders IS NOT NULL AND jsonb_array_length(p_new_orders) > 0 THEN
        FOR v_ord IN SELECT * FROM jsonb_array_elements(p_new_orders) LOOP
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
                v_portfolio_id,
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
    END IF;

    -- 7. Accounting Invariant Assertion (Fail-Closed)
    v_nav_diff := ABS((v_cash + v_total_val) - v_nav);
    IF v_nav_diff > 0.05 THEN
        RAISE EXCEPTION 'FAIL-CLOSED: NAV accounting invariant violated. Cash (%), Holdings Val (%), NAV (%), Diff (%)',
            v_cash, v_total_val, v_nav, v_nav_diff;
    END IF;

    -- 8. Update Canonical Paper Portfolio Root Record
    UPDATE public.brewrich_paper_portfolio
    SET
        cash_balance = v_cash,
        invested_value = v_total_val,
        total_nav = v_nav,
        total_unrealized_pnl = v_total_val - v_total_cost,
        rebalance_count = v_current_reb_count + 1,
        last_rebalance_date = p_session_date,
        updated_at = timezone('utc'::text, now())
    WHERE id = v_portfolio_id;

    -- 9. Insert Rebalance Run Record
    IF p_rebalance_run IS NOT NULL THEN
        INSERT INTO public.brewrich_rebalance_runs (
            id,
            portfolio_id,
            session_date,
            vacancies,
            sells_count,
            buys_count,
            actions_json,
            starting_cash,
            ending_cash,
            status,
            executed_at
        ) VALUES (
            CASE
                WHEN p_run_id ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' THEN p_run_id::uuid
                ELSE gen_random_uuid()
            END,
            v_portfolio_id,
            p_session_date,
            COALESCE((p_rebalance_run->>'vacancies')::integer, 0),
            COALESCE((p_rebalance_run->>'sells_count')::integer, 0),
            COALESCE((p_rebalance_run->>'buys_count')::integer, 0),
            COALESCE((p_rebalance_run->>'actions_json')::jsonb, '[]'::jsonb),
            COALESCE((p_rebalance_run->>'starting_cash')::numeric, v_cash),
            v_cash,
            'SUCCESS',
            timezone('utc'::text, now())
        );
    END IF;

    -- 10. Record Immutable Audit Event
    IF p_audit_event IS NOT NULL AND p_audit_event != '{}'::jsonb THEN
        INSERT INTO public.brewrich_audit_events (
            id,
            category,
            action,
            details,
            severity,
            metadata_json
        ) VALUES (
            COALESCE(p_audit_event->>'id', 'AUD_REB_' || p_session_date::text || '_' || extract(epoch from now())::bigint::text),
            COALESCE(p_audit_event->>'category', 'REBALANCE'),
            COALESCE(p_audit_event->>'action', 'PAPER_REBALANCE_CYCLE'),
            COALESCE(p_audit_event->>'details', 'Automated paper rebalance execution'),
            COALESCE(p_audit_event->>'severity', 'INFO'),
            COALESCE((p_audit_event->>'metadata_json')::jsonb, '{}'::jsonb)
        )
        ON CONFLICT (id) DO NOTHING;
    END IF;

    -- 11. Return Structured Verification Payload
    RETURN jsonb_build_object(
        'success', true,
        'status', 'executed',
        'portfolio_id', v_portfolio_id,
        'session_date', p_session_date::text,
        'cash_balance', v_cash,
        'invested_value', v_total_val,
        'total_nav', v_nav,
        'positions_count', v_positions_count,
        'orders_count', v_orders_count,
        'rebalance_count', v_current_reb_count + 1,
        'executed_at', timezone('utc'::text, now())
    );
END;
$$;

-- Security Hardening: Revoke execution from public, anon, and authenticated
REVOKE EXECUTE ON FUNCTION public.brewrich_execute_paper_rebalance_atomic(text, date, jsonb, jsonb, jsonb, jsonb, jsonb) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.brewrich_execute_paper_rebalance_atomic(text, date, jsonb, jsonb, jsonb, jsonb, jsonb) FROM anon;
REVOKE EXECUTE ON FUNCTION public.brewrich_execute_paper_rebalance_atomic(text, date, jsonb, jsonb, jsonb, jsonb, jsonb) FROM authenticated;
GRANT EXECUTE ON FUNCTION public.brewrich_execute_paper_rebalance_atomic(text, date, jsonb, jsonb, jsonb, jsonb, jsonb) TO service_role;
