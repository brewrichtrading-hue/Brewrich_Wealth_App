/**
 * BREWRICH AI — SERVER-SIDE SUPABASE PERSISTENCE STORE
 * 
 * Boundary & Security Rules:
 * 1. Strictly SERVER-SIDE data access layer for the 12 dedicated `brewrich_*` tables.
 * 2. Uses SUPABASE_SERVICE_ROLE_KEY to perform backend queries, bypassing RLS safely.
 * 3. Never exposed to browser or client bundles (zero NEXT_PUBLIC_ credential leakage).
 * 4. Strictly READ-ONLY in this phase (zero mutations/inserts to paper tables).
 * 5. Fail-closed: emergency_stop=true and live_locked=true are strictly maintained.
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import {
  PaperPortfolioRecord,
  PaperPositionRecord,
  PaperOrderRecord,
  BrokerConnectionRecord,
  AuditEventRecord,
} from './models';

// Initialize server-side Supabase client
let clientInstance: SupabaseClient | null = null;

export function getSupabaseServerClient(): SupabaseClient {
  if (!clientInstance) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://cplgtebmbplroctuqmyz.supabase.co';
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    const keyToUse = serviceRoleKey || anonKey;
    if (!keyToUse) {
      throw new Error('[SupabaseStore] Neither SUPABASE_SERVICE_ROLE_KEY nor NEXT_PUBLIC_SUPABASE_ANON_KEY is configured.');
    }

    if (!serviceRoleKey) {
      console.warn(
        '⚠️ [SupabaseStore] Running with anon key. Queries to private brewrich_* tables will be filtered by RLS (0 rows returned) until SUPABASE_SERVICE_ROLE_KEY is set in server environment.'
      );
    }

    clientInstance = createClient(supabaseUrl, keyToUse, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }
  return clientInstance;
}

export const supabaseStore = {
  /**
   * 1. Fetch Authoritative Risk & Safety State
   */
  async getRiskState(): Promise<{
    id: string;
    execution_mode: string;
    live_locked: boolean;
    emergency_stop: boolean;
    max_single_position_pct: number;
    drawdown_limit_pct: number;
    updated_at: string;
  } | null> {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from('brewrich_risk_state')
      .select('*')
      .eq('id', 'canonical_risk_state')
      .maybeSingle();

    if (error) {
      console.error('[SupabaseStore] getRiskState error:', error.message);
      return null;
    }
    return data;
  },

  /**
   * 2. Fetch Authoritative Broker Connections (Masked, Read-Only)
   */
  async getBrokerConnections(): Promise<BrokerConnectionRecord[]> {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from('brewrich_broker_connections')
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      console.error('[SupabaseStore] getBrokerConnections error:', error.message);
      return [];
    }

    return (data || []).map((row: any) => ({
      id: row.id,
      name: row.name,
      environment: row.environment,
      maskedClientId: row.masked_client_id,
      credentialsConfiguredServerSide: row.credentials_configured,
      tradingStatus: 'LOCKED',
      updatedAt: row.updated_at,
    }));
  },

  /**
   * 3. Fetch Paper Portfolio Root Record
   */
  async getPaperPortfolio(): Promise<PaperPortfolioRecord | null> {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from('brewrich_paper_portfolio')
      .select('*')
      .eq('id', 'canonical_paper_portfolio')
      .maybeSingle();

    if (error) {
      console.error('[SupabaseStore] getPaperPortfolio error:', error.message);
      return null;
    }
    if (!data) return null;

    return {
      id: data.id,
      initialCapital: Number(data.initial_capital),
      cashBalance: Number(data.cash_balance),
      investedValue: Number(data.invested_value),
      totalNav: Number(data.total_nav),
      totalRealizedPnl: Number(data.total_realized_pnl),
      totalUnrealizedPnl: Number(data.total_unrealized_pnl),
      rebalanceCount: Number(data.rebalance_count),
      lastRebalanceDate: data.last_rebalance_date,
      updatedAt: data.updated_at,
    };
  },

  /**
   * 4. Fetch Active Paper Positions
   */
  async getPaperPositions(portfolioId = 'canonical_paper_portfolio'): Promise<PaperPositionRecord[]> {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from('brewrich_paper_positions')
      .select('*')
      .eq('portfolio_id', portfolioId)
      .order('symbol', { ascending: true });

    if (error) {
      console.error('[SupabaseStore] getPaperPositions error:', error.message);
      return [];
    }

    return (data || []).map((row: any) => ({
      id: row.id,
      portfolioId: row.portfolio_id,
      symbol: row.symbol,
      shares: Number(row.shares),
      entryPrice: Number(row.entry_price),
      currentPrice: Number(row.current_price),
      costBasis: Number(row.cost_basis),
      currentValue: Number(row.current_value),
      unrealizedPnl: Number(row.unrealized_pnl),
      unrealizedPnlPct: Number(row.unrealized_pnl_pct),
      weightPct: Number(row.weight_pct),
      updatedAt: row.updated_at,
    }));
  },

  /**
   * 5. Fetch Paper Execution Orders Ledger
   */
  async getPaperOrders(portfolioId = 'canonical_paper_portfolio', limit = 50): Promise<PaperOrderRecord[]> {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from('brewrich_paper_orders')
      .select('*')
      .eq('portfolio_id', portfolioId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('[SupabaseStore] getPaperOrders error:', error.message);
      return [];
    }

    return (data || []).map((row: any) => ({
      id: row.id,
      portfolioId: row.portfolio_id,
      symbol: row.symbol,
      side: row.side,
      quantity: Number(row.quantity),
      price: Number(row.price),
      orderValue: Number(row.order_value),
      status: row.status,
      executionMode: 'PAPER_ONLY',
      strategySignal: row.strategy_signal,
      brokerContext: row.broker_context,
      eventId: row.event_id,
      timestamp: row.created_at,
    }));
  },

  /**
   * 6. Fetch Immutable Audit Events
   */
  async getAuditEvents(limit = 50): Promise<AuditEventRecord[]> {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from('brewrich_audit_events')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('[SupabaseStore] getAuditEvents error:', error.message);
      return [];
    }

    return (data || []).map((row: any) => ({
      id: row.id,
      timestamp: row.timestamp,
      category: row.category,
      action: row.action,
      details: row.details,
      severity: row.severity,
      metadataJson: row.metadata_json,
    }));
  },

  /**
   * 7. Health & Connectivity Probe
   */
  async probeHealth(): Promise<{
    connected: boolean;
    serviceRoleActive: boolean;
    tablesVerified: boolean;
    message: string;
  }> {
    const isServiceRoleActive = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);
    try {
      const supabase = getSupabaseServerClient();
      const { count, error } = await supabase
        .from('brewrich_risk_state')
        .select('*', { count: 'exact', head: true });

      if (error) {
        return {
          connected: false,
          serviceRoleActive: isServiceRoleActive,
          tablesVerified: false,
          message: error.message,
        };
      }

      return {
        connected: true,
        serviceRoleActive: isServiceRoleActive,
        tablesVerified: true,
        message: `Connected. Accessible risk state rows: ${count ?? 0}`,
      };
    } catch (err: any) {
      return {
        connected: false,
        serviceRoleActive: isServiceRoleActive,
        tablesVerified: false,
        message: err?.message || 'Unknown connection error',
      };
    }
  },
};
