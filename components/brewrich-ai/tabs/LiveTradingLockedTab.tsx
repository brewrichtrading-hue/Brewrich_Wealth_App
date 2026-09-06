'use client';

import React from 'react';
import { 
  Lock, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Zap, 
  ArrowRight,
  Shield
} from 'lucide-react';
import { CockpitTab } from '@/lib/brewrich-ai/types';

interface LiveTradingLockedTabProps {
  onNavigate: (tab: CockpitTab) => void;
}

export default function LiveTradingLockedTab({ onNavigate }: LiveTradingLockedTabProps) {
  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      
      {/* 1. HERO LOCKED CONTAINER */}
      <div className="bg-storm rounded-3xl border border-storm-700 p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden text-center space-y-6">
        <div className="absolute top-0 right-0 w-96 h-96 bg-bumblebee/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-2xl mx-auto space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-white/10 border border-white/20 flex items-center justify-center mx-auto text-bumblebee shadow-lg">
            <Lock className="w-8 h-8" />
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-bumblebee/20 border border-bumblebee/40 text-bumblebee font-bold text-xs uppercase tracking-wider">
            <span>FAIL-CLOSED SAFETY GATE ENFORCED</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            LIVE TRADING — 🔒 LOCKED
          </h2>

          <p className="text-sm sm:text-base text-blue-100 leading-relaxed font-normal">
            Paper trading is currently the active execution environment. 
            All live order dispatching is strictly disarmed by policy to guarantee zero capital risk during systematic forward verification.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => onNavigate('paper-trading')}
              className="py-3 px-6 rounded-2xl bg-bumblebee hover:bg-bumblebee-400 text-storm font-bold text-xs sm:text-sm shadow-md transition-all active:scale-[0.98] flex items-center gap-2"
            >
              <span>Go to Paper Trading</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('dashboard')}
              className="py-3 px-6 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm border border-white/20 transition-all"
            >
              <span>Back to Dashboard</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. SECURITY & ISOLATION CHECKLIST */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div>
          <h3 className="text-lg font-bold text-storm flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <span>Active Live-Lock Safeguards</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Verified programmatic barriers preventing accidental live broker execution.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5 font-bold">
              ✓
            </div>
            <div>
              <h4 className="font-bold text-storm">Zero Live Order API Endpoints</h4>
              <p className="text-slate-500 text-[11px] mt-0.5">
                The backend exposes no live order endpoints. All trade routes pipe exclusively to the paper execution sandbox.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5 font-bold">
              ✓
            </div>
            <div>
              <h4 className="font-bold text-storm">Hardcoded Fail-Closed Safety Flags</h4>
              <p className="text-slate-500 text-[11px] mt-0.5">
                <code className="font-mono text-storm bg-slate-200 px-1 rounded">LIVE_ENABLED=false</code> and <code className="font-mono text-storm bg-slate-200 px-1 rounded">PAPER_ONLY=true</code> are enforced at the server core.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5 font-bold">
              ✓
            </div>
            <div>
              <h4 className="font-bold text-storm">Dhan & Firstock Read-Only Gateways</h4>
              <p className="text-slate-500 text-[11px] mt-0.5">
                Broker adapters are locked to read-only metadata verification. Order placement permissions are withheld.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5 font-bold">
              ✓
            </div>
            <div>
              <h4 className="font-bold text-storm">Zero UI Live Order Buttons</h4>
              <p className="text-slate-500 text-[11px] mt-0.5">
                The user interface has zero live dispatch buttons or forms, eliminating any risk of operator error.
              </p>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
