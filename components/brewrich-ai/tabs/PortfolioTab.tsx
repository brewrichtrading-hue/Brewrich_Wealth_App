'use client';

import React from 'react';
import { 
  Wallet, 
  PieChart, 
  ArrowUpRight, 
  ArrowDownRight, 
  Layers, 
  CheckCircle2,
  DollarSign
} from 'lucide-react';
import { PaperPortfolioState } from '@/lib/brewrich-ai/types';

interface PortfolioTabProps {
  portfolio: PaperPortfolioState;
}

export default function PortfolioTab({ portfolio }: PortfolioTabProps) {
  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      
      {/* 1. PORTFOLIO VALUE OVERVIEW */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold text-xs uppercase tracking-wider mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>PAPER PORTFOLIO HOLDINGS</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-storm tracking-tight">
              Personal Wealth Capital Allocation
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Real-time mark-to-market valuations and sector exposure across active momentum holdings.
            </p>
          </div>

          <div className="text-right shrink-0">
            <span className="text-xs font-semibold text-slate-400 block">Last Revalued</span>
            <span className="text-xs font-bold text-storm font-mono">{portfolio.lastUpdated}</span>
          </div>
        </div>

        {/* 4 SUMMARY STAT CARDS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider">Total Portfolio Value</span>
            <div className="text-xl sm:text-2xl font-extrabold text-storm font-mono mt-1">
              ₹{(portfolio.totalPortfolioValue / 100000).toFixed(2)} L
            </div>
            <span className="text-[10px] text-slate-400 block mt-1">Base: ₹{(portfolio.initialCapital / 100000).toFixed(0)} Lakhs</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider">Invested Equity</span>
            <div className="text-xl sm:text-2xl font-extrabold text-blue-700 font-mono mt-1">
              ₹{(portfolio.investedValue / 100000).toFixed(2)} L
            </div>
            <span className="text-[10px] text-slate-400 block mt-1">{portfolio.positions.length} Active Positions</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider">Cash Reserve</span>
            <div className="text-xl sm:text-2xl font-extrabold text-slate-800 font-mono mt-1">
              ₹{(portfolio.cashBalance / 100000).toFixed(2)} L
            </div>
            <span className="text-[10px] text-slate-400 block mt-1">{((portfolio.cashBalance / portfolio.totalPortfolioValue) * 100).toFixed(1)}% Cash Buffer</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider">Total Unrealized P&L</span>
            <div className="text-xl sm:text-2xl font-extrabold text-emerald-700 font-mono mt-1 flex items-center gap-1">
              <ArrowUpRight className="w-5 h-5 shrink-0" />
              <span>+₹{(portfolio.totalUnrealizedPnl / 1000).toFixed(1)}k</span>
            </div>
            <span className="text-[10px] text-emerald-700 font-bold block mt-1">+{portfolio.totalPnlPct}% Gain</span>
          </div>

        </div>
      </div>

      {/* 2. FULL POSITIONS TABLE */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold text-storm flex items-center gap-2">
              <Layers className="w-5 h-5 text-blue-600" />
              <span>Current Portfolio Holdings ({portfolio.positions.length})</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Strictly simulated paper trading positions governed by the Brewrich 400 strategy engine.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-3">Holding</th>
                <th className="p-3">Sector</th>
                <th className="p-3 text-right">Shares</th>
                <th className="p-3 text-right">Avg Buy Price</th>
                <th className="p-3 text-right">Current LTP</th>
                <th className="p-3 text-right">Invested Value</th>
                <th className="p-3 text-right">Current Value</th>
                <th className="p-3 text-right">P&L (₹)</th>
                <th className="p-3 text-center">Weight</th>
                <th className="p-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {portfolio.positions.map((pos) => (
                <tr key={pos.symbol} className="hover:bg-slate-50/70 transition-colors">
                  <td className="p-3">
                    <div className="font-bold text-storm">{pos.symbol}</div>
                    <div className="text-[11px] text-slate-400 truncate max-w-[140px]">{pos.companyName}</div>
                  </td>
                  <td className="p-3 text-slate-600">{pos.sector}</td>
                  <td className="p-3 text-right font-mono text-slate-800">{pos.quantity}</td>
                  <td className="p-3 text-right font-mono text-slate-500">₹{pos.avgBuyPrice.toLocaleString('en-IN')}</td>
                  <td className="p-3 text-right font-mono text-slate-900 font-bold">₹{pos.currentPrice.toLocaleString('en-IN')}</td>
                  <td className="p-3 text-right font-mono text-slate-500">₹{pos.investedValue.toLocaleString('en-IN')}</td>
                  <td className="p-3 text-right font-mono font-bold text-storm">₹{pos.currentValue.toLocaleString('en-IN')}</td>
                  <td className="p-3 text-right font-mono">
                    <span className={`font-bold ${pos.unrealizedPnl >= 0 ? 'text-emerald-700' : 'text-joyous'}`}>
                      {pos.unrealizedPnl >= 0 ? '+' : ''}₹{pos.unrealizedPnl.toLocaleString('en-IN')} ({pos.unrealizedPnlPct}%)
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-mono text-[11px] font-bold">
                      {pos.weightPct}%
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      {pos.allocationStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
