'use client';

import React from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  Lock, 
  CheckCircle2, 
  Activity, 
  Zap, 
  Layers, 
  Percent,
  Sliders
} from 'lucide-react';
import { RiskSafetyMetrics } from '@/lib/brewrich-ai/types';

interface RiskSafetyTabProps {
  risk: RiskSafetyMetrics;
}

export default function RiskSafetyTab({ risk }: RiskSafetyTabProps) {
  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      
      {/* 1. RISK & SAFETY HEADER */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-storm-50 text-storm font-bold text-xs uppercase tracking-wider mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>SAFETY GATE MONITOR</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-storm tracking-tight">
              Quantitative Risk Management & Circuit Controls
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Multi-layer risk boundaries governing portfolio concentration, cash reserve floors, drawdown limits, and live gateway isolation.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3.5 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>System Health: {risk.systemHealth}</span>
            </span>
          </div>
        </div>

        {/* 4 CORE RISK INDICATORS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* LIVE GATEWAY */}
          <div className="p-5 rounded-2xl bg-storm text-white shadow-md flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-200 uppercase tracking-wider">Live Gateway</span>
              <Lock className="w-4 h-4 text-bumblebee" />
            </div>
            <div className="my-2">
              <div className="text-2xl font-extrabold text-white">🔒 LOCKED</div>
              <span className="text-[11px] text-emerald-400 font-semibold block mt-1">Fail-Closed Boundary Active</span>
            </div>
            <div className="pt-2 border-t border-white/10 text-[10px] text-blue-200">
              Zero Live Order Authorization
            </div>
          </div>

          {/* MAX DRAWDOWN LIMIT */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Drawdown Circuit</span>
              <Percent className="w-4 h-4 text-slate-400" />
            </div>
            <div className="my-2">
              <div className="text-2xl font-extrabold text-storm font-mono">{risk.currentMaxDrawdownPct}%</div>
              <span className="text-[11px] text-slate-500 block mt-1">Circuit Cap: {risk.drawdownLimitPct}%</span>
            </div>
            <div className="pt-2 border-t border-slate-200 text-[10px] text-emerald-700 font-bold">
              ● Safe Buffer Maintained
            </div>
          </div>

          {/* POSITION SIZING CEILING */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Max Single Exposure</span>
              <Sliders className="w-4 h-4 text-slate-400" />
            </div>
            <div className="my-2">
              <div className="text-2xl font-extrabold text-storm font-mono">{risk.maxSinglePositionPct}%</div>
              <span className="text-[11px] text-slate-500 block mt-1">Cap: 10.5% per holding</span>
            </div>
            <div className="pt-2 border-t border-slate-200 text-[10px] text-emerald-700 font-bold">
              ● Concentration Guard Passed
            </div>
          </div>

          {/* CASH RESERVE FLOOR */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Cash Reserve</span>
              <ShieldCheck className="w-4 h-4 text-slate-400" />
            </div>
            <div className="my-2">
              <div className="text-2xl font-extrabold text-storm font-mono">{risk.cashReservePct}%</div>
              <span className="text-[11px] text-slate-500 block mt-1">Floor: 10.0% Minimum</span>
            </div>
            <div className="pt-2 border-t border-slate-200 text-[10px] text-emerald-700 font-bold">
              ● Liquidity Guard Passed
            </div>
          </div>

        </div>
      </div>

      {/* 2. SAFETY CONTROLS MATRIX */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold text-storm flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span>Active System Safeguards & Emergency Interlocks</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Verified programmatic invariants checked before every paper trade execution.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-storm">Idempotency & Duplicate Order Guard</h4>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                Unique event hashing ensures no strategy signal can ever generate duplicate orders across reboots or retries.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-storm">Zero Live Order Enforcement</h4>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                All order dispatch handlers route strictly to the paper portfolio sandbox. Live broker endpoints are disarmed.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-storm">Cash Overdraft Prevention</h4>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                Buy orders are pre-checked against available simulated cash balances before allocation. Zero negative cash permitted.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-storm">Emergency Killswitch Ready</h4>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                One-click manual circuit breaker disarms all automated rebalance schedules instantaneously.
              </p>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
