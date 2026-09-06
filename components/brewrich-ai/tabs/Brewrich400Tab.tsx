'use client';

import React from 'react';
import { 
  Sparkles, 
  ShieldCheck, 
  Layers, 
  Target, 
  Activity, 
  Clock, 
  Lock,
  ArrowRight,
  TrendingUp,
  BarChart3
} from 'lucide-react';
import { Brewrich400State } from '@/lib/brewrich-ai/types';

interface Brewrich400TabProps {
  strategy: Brewrich400State;
}

export default function Brewrich400Tab({ strategy }: Brewrich400TabProps) {
  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      
      {/* 1. HEADER & STRATEGY GOVERNANCE BANNER */}
      <div className="bg-gradient-to-r from-storm via-storm-800 to-storm rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-bumblebee/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold uppercase tracking-wider text-bumblebee">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Proprietary Wealth Engine</span>
            </div>
            
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
              Brewrich 400 Momentum Strategy
            </h2>
            
            <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
              Systematic quantitative momentum model investing in the top decile of high-relative-strength Indian equities. 
              Protected mathematical engine with disciplined weekly rebalancing.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 shrink-0 text-right space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-200 block">Strategy Engine Health</span>
            <div className="text-3xl font-extrabold text-bumblebee font-mono">{strategy.healthScorePct}%</div>
            <div className="text-[11px] text-emerald-400 font-semibold flex items-center justify-end gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Mathematical Integrity Verified</span>
            </div>
          </div>
        </div>

        {/* METRICS ROW */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/10 relative z-10 text-xs">
          <div>
            <span className="text-blue-200 text-[11px] block">Total Universe</span>
            <span className="font-mono font-bold text-white text-base">{strategy.universeSize} Equities</span>
          </div>
          <div>
            <span className="text-blue-200 text-[11px] block">Eligible Candidates</span>
            <span className="font-mono font-bold text-white text-base">{strategy.eligibleCount} Passed</span>
          </div>
          <div>
            <span className="text-blue-200 text-[11px] block">Target Positions</span>
            <span className="font-mono font-bold text-white text-base">{strategy.targetPortfolioSize} Holdings</span>
          </div>
          <div>
            <span className="text-blue-200 text-[11px] block">Rebalance Cycle</span>
            <span className="font-mono font-bold text-white text-base">{strategy.rebalanceFrequency}</span>
          </div>
        </div>
      </div>

      {/* 2. TOP RANKED CANDIDATES (VIEW-ONLY) */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold text-storm flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <span>Top-Ranked Relative Strength Leaders</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Ranked cross-sectionally by proprietary 12-month momentum, volume accumulation, and trend stability.
            </p>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-600 text-xs font-bold">
            <Lock className="w-3.5 h-3.5 text-slate-400" />
            <span>Fixed Proprietary Rules</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-3">Rank</th>
                <th className="p-3">Symbol & Company</th>
                <th className="p-3">Sector</th>
                <th className="p-3 text-right">Market Cap (₹ Cr)</th>
                <th className="p-3 text-right">LTP (₹)</th>
                <th className="p-3 text-center">RS Percentile</th>
                <th className="p-3 text-right">Momentum Score</th>
                <th className="p-3 text-center">Trend Status</th>
                <th className="p-3 text-center">Eligibility</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {strategy.topRanked.map((stock, idx) => (
                <tr key={stock.symbol} className="hover:bg-slate-50/70 transition-colors">
                  <td className="p-3">
                    <span className="w-6 h-6 rounded-full bg-storm-50 text-storm font-mono font-bold flex items-center justify-center text-xs">
                      #{idx + 1}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="font-bold text-storm">{stock.symbol}</div>
                    <div className="text-[11px] text-slate-400 truncate max-w-[150px]">{stock.companyName}</div>
                  </td>
                  <td className="p-3 text-slate-600">{stock.sector}</td>
                  <td className="p-3 text-right font-mono text-slate-800">{stock.marketCapCr.toLocaleString('en-IN')}</td>
                  <td className="p-3 text-right font-mono font-bold text-storm">₹{stock.currentPrice.toLocaleString('en-IN')}</td>
                  <td className="p-3 text-center">
                    <span className="px-2.5 py-0.5 rounded-full bg-bumblebee-100 text-bumblebee-900 font-mono font-bold text-[11px]">
                      RS {stock.rsRank}
                    </span>
                  </td>
                  <td className="p-3 text-right font-mono font-bold text-blue-700">{stock.momentumScore}</td>
                  <td className="p-3 text-center">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      {stock.trendStatus}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-bold uppercase tracking-wider">
                      Qualified ✓
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. TARGET ALLOCATION & REBALANCE RECOMMENDATION */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold text-storm flex items-center gap-2">
              <Target className="w-5 h-5 text-bumblebee-600" />
              <span>Target Portfolio Allocation vs Current Weights</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Calculates target weight parity (10% per holding) and flags rebalancing delta.
            </p>
          </div>
          <div className="text-xs text-slate-500 font-semibold">
            Next Evaluation: {strategy.nextScheduledEvaluation}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-3">Symbol</th>
                <th className="p-3 text-center">Target Weight</th>
                <th className="p-3 text-center">Current Weight</th>
                <th className="p-3 text-center">Deviation</th>
                <th className="p-3 text-right">Target Shares</th>
                <th className="p-3 text-right">Current Shares</th>
                <th className="p-3 text-center">Strategy Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {strategy.targetAllocations.map((alloc) => (
                <tr key={alloc.symbol} className="hover:bg-slate-50/70 transition-colors">
                  <td className="p-3 font-bold text-storm">{alloc.symbol}</td>
                  <td className="p-3 text-center font-mono font-bold text-slate-800">{alloc.targetWeightPct}%</td>
                  <td className="p-3 text-center font-mono text-slate-800">{alloc.currentWeightPct}%</td>
                  <td className="p-3 text-center font-mono">
                    <span className={alloc.deviationPct === 0 ? 'text-slate-400' : alloc.deviationPct > 0 ? 'text-emerald-700 font-bold' : 'text-joyous font-bold'}>
                      {alloc.deviationPct > 0 ? `+${alloc.deviationPct}%` : `${alloc.deviationPct}%`}
                    </span>
                  </td>
                  <td className="p-3 text-right font-mono text-slate-800">{alloc.targetShares}</td>
                  <td className="p-3 text-right font-mono text-slate-800">{alloc.currentShares}</td>
                  <td className="p-3 text-center">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      alloc.recommendedAction === 'HOLD' 
                        ? 'bg-slate-100 text-slate-700' 
                        : alloc.recommendedAction === 'BUY' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-amber-100 text-amber-900'
                    }`}>
                      {alloc.recommendedAction}
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
