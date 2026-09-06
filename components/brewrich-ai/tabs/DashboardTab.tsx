'use client';

import React from 'react';
import { 
  TrendingUp, 
  Wallet, 
  Activity, 
  ShieldCheck, 
  Lock, 
  ArrowUpRight, 
  Clock, 
  Sparkles,
  Zap,
  Server
} from 'lucide-react';
import { CockpitDashboardData, CockpitTab } from '@/lib/brewrich-ai/types';

interface DashboardTabProps {
  data: CockpitDashboardData;
  onNavigate: (tab: CockpitTab) => void;
}

export default function DashboardTab({ data, onNavigate }: DashboardTabProps) {
  const { strategy, portfolio, recentOrders, risk, brokers } = data;

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      
      {/* 1. TOP METRIC CARDS ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* TOTAL PORTFOLIO VALUE (PAPER) */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-brand transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Paper Portfolio</span>
            <div className="w-8 h-8 rounded-xl bg-storm-50 flex items-center justify-center text-storm">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="my-3">
            <div className="text-2xl sm:text-3xl font-extrabold text-storm font-mono">
              ₹{(portfolio.totalPortfolioValue / 100000).toFixed(2)} L
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-xs font-semibold text-emerald-700">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+{portfolio.totalPnlPct}% (₹{(portfolio.totalUnrealizedPnl / 1000).toFixed(1)}k Total Gain)</span>
            </div>
          </div>
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span>Cash: ₹{(portfolio.cashBalance / 100000).toFixed(2)} L ({risk.cashReservePct}%)</span>
            <span className="font-semibold text-blue-700 cursor-pointer hover:underline" onClick={() => onNavigate('portfolio')}>
              Holdings →
            </span>
          </div>
        </div>

        {/* STRATEGY PULSE & STATUS */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-brand transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Brewrich 400 Core</span>
            <div className="w-8 h-8 rounded-xl bg-bumblebee-50 flex items-center justify-center text-bumblebee-700">
              <Sparkles className="w-4 h-4 text-bumblebee-600" />
            </div>
          </div>
          <div className="my-3">
            <div className="text-2xl sm:text-3xl font-extrabold text-storm">
              {strategy.status}
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-xs font-semibold text-slate-600">
              <Activity className="w-3.5 h-3.5 text-blue-600" />
              <span>{strategy.universeSize} Stock Universe ({strategy.eligibleCount} Eligible)</span>
            </div>
          </div>
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span>Eval: {strategy.lastEvaluationDate}</span>
            <span className="font-semibold text-blue-700 cursor-pointer hover:underline" onClick={() => onNavigate('brewrich400')}>
              Rankings →
            </span>
          </div>
        </div>

        {/* PAPER EXECUTION STATE */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-brand transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Execution Mode</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-700">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="my-3">
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-700 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
              PAPER ACTIVE
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-xs font-semibold text-slate-500">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Auto-rebalance enabled (Weekly)</span>
            </div>
          </div>
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span>Positions: {portfolio.positions.length} active</span>
            <span className="font-semibold text-blue-700 cursor-pointer hover:underline" onClick={() => onNavigate('paper-trading')}>
              Execution →
            </span>
          </div>
        </div>

        {/* LIVE TRADING FAIL-CLOSED STATUS */}
        <div className="bg-storm rounded-3xl border border-storm-700 p-6 text-white shadow-lg flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-xl pointer-events-none" />
          <div className="flex items-center justify-between relative z-10">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-200">Live Broker Gateway</span>
            <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-bumblebee">
              <Lock className="w-4 h-4" />
            </div>
          </div>
          <div className="my-3 relative z-10">
            <div className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2">
              <Lock className="w-5 h-5 text-bumblebee" />
              LOCKED
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-blue-200">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Fail-closed safeguards active</span>
            </div>
          </div>
          <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-blue-200 relative z-10">
            <span>Dhan & Firstock: Read-Only</span>
            <span className="font-semibold text-bumblebee cursor-pointer hover:underline" onClick={() => onNavigate('live-locked')}>
              Security Details →
            </span>
          </div>
        </div>

      </div>

      {/* 2. MAIN COCKPIT WORKSPACE (2-COLUMN GRID) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        
        {/* LEFT COLUMN: ACTIVE PAPER HOLDINGS SUMMARY (2 COLUMNS SPAN) */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-100">
            <div>
              <h3 className="text-lg font-bold text-storm">Active Paper Portfolio Holdings</h3>
              <p className="text-xs text-slate-500 mt-0.5">Top-ranked momentum equities currently held in simulation</p>
            </div>
            <button
              onClick={() => onNavigate('portfolio')}
              className="inline-flex items-center gap-1 text-xs font-bold text-blue-700 hover:text-blue-900 bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-100 transition-all self-start sm:self-auto"
            >
              <span>View Full Portfolio</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto mt-4">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3">Security</th>
                  <th className="p-3">Sector</th>
                  <th className="p-3 text-right">Qty</th>
                  <th className="p-3 text-right">LTP</th>
                  <th className="p-3 text-right">Market Value</th>
                  <th className="p-3 text-right">Gain / Loss</th>
                  <th className="p-3 text-center">Weight</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {portfolio.positions.slice(0, 5).map((pos) => (
                  <tr key={pos.symbol} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-3">
                      <div className="font-bold text-storm">{pos.symbol}</div>
                      <div className="text-[11px] text-slate-400 truncate max-w-[130px]">{pos.companyName}</div>
                    </td>
                    <td className="p-3 text-slate-600">{pos.sector}</td>
                    <td className="p-3 text-right font-mono text-slate-800">{pos.quantity}</td>
                    <td className="p-3 text-right font-mono text-slate-900">₹{pos.currentPrice.toLocaleString('en-IN')}</td>
                    <td className="p-3 text-right font-mono font-bold text-storm">₹{pos.currentValue.toLocaleString('en-IN')}</td>
                    <td className="p-3 text-right font-mono">
                      <span className={`inline-flex items-center font-bold ${pos.unrealizedPnl >= 0 ? 'text-emerald-700' : 'text-joyous'}`}>
                        {pos.unrealizedPnl >= 0 ? '+' : ''}{pos.unrealizedPnlPct}%
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-mono text-[11px] font-semibold">
                        {pos.weightPct}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* RIGHT COLUMN: SYSTEM & BROKER STATUS PANEL (1 COLUMN SPAN) */}
        <div className="space-y-6">
          
          {/* BROKER CONNECTION SUMMARY */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h4 className="text-sm font-bold text-storm">Broker Gateways</h4>
              <span className="text-[11px] font-semibold text-slate-400">Server-Side Only</span>
            </div>

            <div className="space-y-3">
              {brokers.map((broker) => (
                <div key={broker.brokerId} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-storm flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      {broker.name}
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                      Client ID: {broker.maskedClientId}
                    </div>
                  </div>
                  <span className="px-2 py-1 rounded-lg bg-slate-200/80 text-slate-700 text-[10px] font-bold uppercase tracking-wider">
                    🔒 {broker.tradingStatus}
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={() => onNavigate('brokers')}
              className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-storm font-bold text-xs transition-all"
            >
              Manage Broker Integrations →
            </button>
          </div>

          {/* RECENT STRATEGY EXECUTIONS */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h4 className="text-sm font-bold text-storm">Recent Paper Executions</h4>
              <span className="text-[11px] font-bold text-emerald-700">0 Live Orders</span>
            </div>

            <div className="space-y-2.5">
              {recentOrders.slice(0, 3).map((order) => (
                <div key={order.orderId} className="text-xs p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-storm flex items-center gap-1.5">
                      <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 text-[10px] font-bold">{order.side}</span>
                      {order.symbol} × {order.quantity}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{order.timestamp}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono font-bold text-storm">₹{order.orderValue.toLocaleString('en-IN')}</div>
                    <div className="text-[10px] text-emerald-600 font-semibold">{order.status}</div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => onNavigate('orders')}
              className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-storm font-bold text-xs transition-all"
            >
              View Order Book →
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
