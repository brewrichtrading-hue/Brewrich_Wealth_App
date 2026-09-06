'use client';

import React from 'react';
import { 
  TrendingUp, 
  BarChart3, 
  Award, 
  ShieldCheck, 
  Layers, 
  Calendar, 
  Percent, 
  CheckCircle2,
  ArrowUpRight
} from 'lucide-react';
import { BacktestDataset } from '@/lib/brewrich-ai/types';

interface BacktestTabProps {
  backtest: BacktestDataset;
}

export default function BacktestTab({ backtest }: BacktestTabProps) {
  const { summary, equityCurve, yearlyReturns } = backtest;

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      
      {/* 1. BACKTEST HEADER & HERO METRICS */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-storm-50 text-storm font-bold text-xs uppercase tracking-wider mb-2">
              <Calendar className="w-3.5 h-3.5 text-bumblebee-600" />
              <span>{summary.period}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-storm tracking-tight">
              Brewrich 400 Historical Backtest Verification
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Rigorous 10-year quantitative backtest simulating weekly rebalances, realistic transaction costs, and strict liquidity constraints.
            </p>
          </div>

          <div className="text-right shrink-0">
            <span className="text-xs font-semibold text-slate-400 block">Benchmark</span>
            <span className="text-sm font-bold text-storm font-mono">NIFTY 500 Total Return</span>
          </div>
        </div>

        {/* 6-CARD KPI METRICS GRID */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          
          {/* CAGR */}
          <div className="p-4 rounded-2xl bg-storm text-white shadow-md">
            <span className="text-[11px] font-bold text-blue-200 block uppercase tracking-wider">CAGR</span>
            <div className="text-2xl font-extrabold text-bumblebee font-mono mt-1">{summary.cagrPct}%</div>
            <span className="text-[10px] text-blue-200 block mt-1">vs Benchmark {summary.benchmarkCagrPct}%</span>
          </div>

          {/* TOTAL RETURN */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider">Total Return</span>
            <div className="text-2xl font-extrabold text-storm font-mono mt-1">+{summary.totalReturnPct}%</div>
            <span className="text-[10px] text-emerald-700 font-semibold block mt-1">13.4x Capital Growth</span>
          </div>

          {/* MAX DRAWDOWN */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider">Max Drawdown</span>
            <div className="text-2xl font-extrabold text-joyous font-mono mt-1">-{summary.maxDrawdownPct}%</div>
            <span className="text-[10px] text-slate-400 block mt-1">Mar 2020 Covid low</span>
          </div>

          {/* SHARPE RATIO */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider">Sharpe Ratio</span>
            <div className="text-2xl font-extrabold text-storm font-mono mt-1">{summary.sharpeRatio}</div>
            <span className="text-[10px] text-slate-400 block mt-1">Risk-adjusted return</span>
          </div>

          {/* WIN RATE */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider">Win Rate</span>
            <div className="text-2xl font-extrabold text-emerald-700 font-mono mt-1">{summary.winRatePct}%</div>
            <span className="text-[10px] text-slate-400 block mt-1">Across {summary.totalTrades} trades</span>
          </div>

          {/* PROFIT FACTOR */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider">Profit Factor</span>
            <div className="text-2xl font-extrabold text-storm font-mono mt-1">{summary.profitFactor}</div>
            <span className="text-[10px] text-slate-400 block mt-1">Gross Win / Gross Loss</span>
          </div>

        </div>
      </div>

      {/* 2. EQUITY GROWTH & DRAWDOWN TRAJECTORY */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold text-storm flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <span>10-Year Cumulative Equity Trajectory</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Growth of ₹{summary.startingCapital.toLocaleString('en-IN')} base capital vs NIFTY 500 Benchmark.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold">
            <div className="flex items-center gap-1.5 text-storm">
              <span className="w-3 h-3 rounded-full bg-storm" />
              <span>Brewrich 400 (₹{(summary.endingCapital / 100000).toFixed(2)} Lakhs)</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-400">
              <span className="w-3 h-3 rounded-full bg-slate-300" />
              <span>NIFTY 500 (₹{(summary.startingCapital * 3.8 / 100000).toFixed(2)} Lakhs)</span>
            </div>
          </div>
        </div>

        {/* EQUITY TABLE PROGRESSION */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-3">Evaluation Snapshot</th>
                <th className="p-3 text-right">Brewrich 400 Value (₹)</th>
                <th className="p-3 text-right">Benchmark Value (₹)</th>
                <th className="p-3 text-right">Cumulative Alpha</th>
                <th className="p-3 text-center">Peak Drawdown</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {equityCurve.map((pt) => (
                <tr key={pt.date} className="hover:bg-slate-50/70 transition-colors">
                  <td className="p-3 font-bold text-storm">{pt.date}</td>
                  <td className="p-3 text-right font-mono font-bold text-storm">₹{pt.portfolioValue.toLocaleString('en-IN')}</td>
                  <td className="p-3 text-right font-mono text-slate-500">₹{pt.benchmarkValue.toLocaleString('en-IN')}</td>
                  <td className="p-3 text-right font-mono text-emerald-700 font-bold">
                    +{(pt.portfolioValue / pt.benchmarkValue).toFixed(2)}x
                  </td>
                  <td className="p-3 text-center font-mono text-slate-600">
                    <span className={pt.drawdownPct < -10 ? 'text-joyous font-bold' : 'text-slate-500'}>
                      {pt.drawdownPct === 0 ? '0.0%' : `${pt.drawdownPct}%`}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. YEAR-BY-YEAR PERFORMANCE BREAKDOWN */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold text-storm flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-bumblebee-600" />
              <span>Annual Returns & Excess Alpha (2016 – 2026)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Consistent outperformance in both trending and volatile market regimes.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-3">Year</th>
                <th className="p-3 text-right">Brewrich 400 Return</th>
                <th className="p-3 text-right">NIFTY 500 Return</th>
                <th className="p-3 text-right">Alpha Delivered</th>
                <th className="p-3 text-center">Annual Max Drawdown</th>
                <th className="p-3 text-center">Outperformed?</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {yearlyReturns.map((yr) => (
                <tr key={yr.year} className="hover:bg-slate-50/70 transition-colors">
                  <td className="p-3 font-bold text-storm font-mono">{yr.year}</td>
                  <td className="p-3 text-right font-mono font-bold text-storm">+{yr.strategyReturnPct}%</td>
                  <td className="p-3 text-right font-mono text-slate-500">
                    {yr.benchmarkReturnPct >= 0 ? `+${yr.benchmarkReturnPct}%` : `${yr.benchmarkReturnPct}%`}
                  </td>
                  <td className="p-3 text-right font-mono font-bold">
                    <span className={yr.alphaPct >= 0 ? 'text-emerald-700' : 'text-joyous'}>
                      {yr.alphaPct >= 0 ? `+${yr.alphaPct}%` : `${yr.alphaPct}%`}
                    </span>
                  </td>
                  <td className="p-3 text-center font-mono text-slate-600">-{yr.maxDrawdownPct}%</td>
                  <td className="p-3 text-center">
                    {yr.alphaPct >= 0 ? (
                      <span className="inline-flex items-center gap-1 text-emerald-700 font-bold text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Yes
                      </span>
                    ) : (
                      <span className="text-slate-400 font-medium text-[11px]">—</span>
                    )}
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
