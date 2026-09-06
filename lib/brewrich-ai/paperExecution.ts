/**
 * BREWRICH AI — PERSISTENT PAPER EXECUTION CLIENT (THIN ADAPTER)
 * 
 * Boundary Rule:
 * This file contains ZERO independent portfolio accounting and ZERO parallel ledgers.
 * It communicates directly with PersistentPaperPortfolio on the Python engine at 127.0.0.1:8400,
 * which maintains the authoritative data/paper_state.json.
 */

import { PaperPortfolioState, PaperPosition, PaperOrder } from './types';


const PYTHON_API_BASE = process.env.BREWRICH_PYTHON_API_URL || 'http://127.0.0.1:8400';

export async function fetchPaperPortfolioFromPython(): Promise<PaperPortfolioState> {
  try {
    const res = await fetch(`${PYTHON_API_BASE}/api/v1/paper/portfolio`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      throw new Error(`Python engine returned HTTP ${res.status}`);
    }

    const data = await res.json();
    
    const positions: PaperPosition[] = (data.positions || []).map((p: any) => ({
      symbol: p.symbol,
      companyName: p.symbol,
      sector: 'Nifty MidSmall 400',
      quantity: p.shares,
      avgBuyPrice: p.entry_price,
      currentPrice: p.current_price,
      investedValue: p.cost_basis,
      currentValue: p.current_value,
      unrealizedPnl: p.unrealized_pnl,
      unrealizedPnlPct: p.unrealized_pnl_pct,
      weightPct: p.weight_pct,
      targetWeightPct: 10.0,
      allocationStatus: p.weight_pct > 11 ? 'Overweight' : (p.weight_pct < 9 ? 'Underweight' : 'Balanced'),
    }));

    return {
      initialCapital: data.initial_capital || 100000,
      cashBalance: data.cash_balance || 0,
      investedValue: data.invested_value || 0,
      totalPortfolioValue: data.total_nav || 0,
      totalRealizedPnl: 0,
      totalUnrealizedPnl: data.total_pnl || 0,
      totalPnlPct: data.total_pnl_pct || 0,
      dayPnl: 0,
      dayPnlPct: 0,
      positions,
      lastUpdated: new Date().toISOString(),
      executionMode: 'PAPER_ONLY',
    };
  } catch (error) {
    console.error('[PaperExecution Client] Failed to fetch paper portfolio from Python:', error);
    return {
      initialCapital: 100000,
      cashBalance: 100000,
      investedValue: 0,
      totalPortfolioValue: 100000,
      totalRealizedPnl: 0,
      totalUnrealizedPnl: 0,
      totalPnlPct: 0,
      dayPnl: 0,
      dayPnlPct: 0,
      positions: [],
      lastUpdated: new Date().toISOString(),
      executionMode: 'PAPER_ONLY',
    };
  }
}

export async function executePaperRebalanceInPython(): Promise<{ success: boolean; message: string; actions: any[] }> {
  try {
    const res = await fetch(`${PYTHON_API_BASE}/api/v1/paper/rebalance`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!res.ok) {
      throw new Error(`Python engine returned HTTP ${res.status}`);
    }

    const data = await res.json();
    return {
      success: true,
      message: data.message || 'Paper rebalance executed',
      actions: data.actions_executed || [],
    };
  } catch (error: any) {
    console.error('[PaperExecution Client] Rebalance failed:', error);
    return {
      success: false,
      message: error?.message || 'Failed to connect to Python engine',
      actions: [],
    };
  }
}

export async function fetchPaperOrdersFromPython(): Promise<PaperOrder[]> {
  try {
    const res = await fetch(`${PYTHON_API_BASE}/api/v1/paper/portfolio`, {
      cache: 'no-store',
    });

    if (!res.ok) return [];
    const data = await res.json();
    return (data.orders || []).map((o: any) => ({
      orderId: o.order_id,
      symbol: o.symbol,
      side: o.side,
      quantity: o.quantity,
      price: o.price,
      orderValue: o.value,
      timestamp: o.timestamp,
      reason: o.strategy_signal || 'Strategy Signal',
      status: 'FILLED',
      executionMode: 'PAPER_ONLY',
      brokerContext: 'DHAN_PAPER_ADAPTER',
      processedEventId: o.event_id,
    }));
  } catch (error) {
    return [];
  }
}

// Synchronous fallbacks
export function getPaperPortfolio(): PaperPortfolioState {
  return {
    initialCapital: 100000,
    cashBalance: 100000,
    investedValue: 0,
    totalPortfolioValue: 100000,
    totalRealizedPnl: 0,
    totalUnrealizedPnl: 0,
    totalPnlPct: 0,
    dayPnl: 0,
    dayPnlPct: 0,
    positions: [],
    lastUpdated: new Date().toISOString(),
    executionMode: 'PAPER_ONLY',
  };
}

export function getPaperOrders(): PaperOrder[] {
  return [];
}


