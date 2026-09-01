'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Database, 
  Sparkles, 
  TrendingUp, 
  Play, 
  Lock, 
  ChevronRight, 
  ShieldCheck, 
  ArrowUpRight, 
  Layers, 
  CheckCircle2, 
  Clock, 
  Activity,
  Cpu
} from 'lucide-react';
import SkyHighDataUpload from './SkyHighDataUpload';

export default function SkyHighPage() {
  const steps = [
    {
      id: 1,
      title: 'NSE DATA',
      subtitle: 'Upload daily NSE data',
      status: 'active',
      badge: 'Current Milestone',
      icon: Database,
    },
    {
      id: 2,
      title: 'BLUE SKY',
      subtitle: 'Strategy engine — next milestone',
      status: 'upcoming',
      badge: 'Next Milestone',
      icon: Sparkles,
    },
    {
      id: 3,
      title: 'BACKTEST',
      subtitle: 'Realistic backtest — next milestone',
      status: 'upcoming',
      badge: 'Next Milestone',
      icon: TrendingUp,
    },
    {
      id: 4,
      title: 'PAPER',
      subtitle: 'Paper trading — later',
      status: 'locked',
      badge: 'Later',
      icon: Play,
    },
    {
      id: 5,
      title: 'LIVE',
      subtitle: 'Broker execution — later',
      status: 'locked',
      badge: 'Later',
      icon: Cpu,
    },
  ];

  return (
    <div className="flex flex-col w-full min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-600 selection:text-white">
      
      {/* 1. TOP HERO SECTION */}
      <section className="relative bg-gradient-to-b from-[#0A358F] via-[#0D44B8] to-[#1456F0] text-white pt-14 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Subtle background ambient lights */}
        <div className="absolute top-0 right-10 w-[450px] h-[450px] bg-white/5 rounded-full blur-3xl pointer-events-none -z-0" />
        <div className="absolute bottom-0 left-10 w-[350px] h-[350px] bg-blue-400/10 rounded-full blur-3xl pointer-events-none -z-0" />

        <div className="relative z-10 mx-auto max-w-6xl">
          {/* Brewrich Tag / Breadcrumb */}
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold uppercase tracking-wider text-blue-100 shadow-sm">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Brewrich Wealth Platform</span>
            </div>
            
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-300/40 text-amber-200 text-xs font-bold uppercase tracking-wider">
              <span>CURRENT MILESTONE: NSE DATA FOUNDATION</span>
            </div>
          </div>

          {/* Titles & Descriptions as specified */}
          <div className="space-y-4 max-w-3xl">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] text-white">
              BREWRICH SKY HIGH
            </h1>
            
            <h2 className="text-xl sm:text-2xl font-semibold text-blue-100 tracking-normal">
              Blue Sky Strategy Engine
            </h2>

            <p className="text-base sm:text-lg text-blue-100/90 font-normal leading-relaxed pt-1">
              A focused NSE strategy engine for screening, backtesting and eventually live execution.
            </p>
          </div>
        </div>
      </section>

      {/* 2. SYSTEM STATUS / PROGRESS SECTION */}
      <section className="relative -mt-8 z-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-betterment">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold tracking-wider text-blue-600 uppercase">Engine Roadmap</span>
              <h3 className="text-lg font-bold text-slate-900 mt-0.5">Execution Pipeline & Milestones</h3>
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-100 text-blue-800 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
              Phase 1 Active: Data Foundation
            </div>
          </div>

          {/* Stepper Grid */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 pt-6">
            {steps.map((step) => {
              const Icon = step.icon;
              const isActive = step.status === 'active';

              return (
                <div 
                  key={step.id} 
                  className={`relative p-4 rounded-xl transition-all border ${
                    isActive 
                      ? 'bg-blue-50/70 border-blue-300 shadow-sm' 
                      : 'bg-slate-50/70 border-slate-200/80 opacity-80'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                      isActive 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-slate-200 text-slate-600'
                    }`}>
                      {step.id}
                    </span>
                    
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      isActive
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-200 text-slate-600'
                    }`}>
                      {step.badge}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span className={`text-base font-bold ${isActive ? 'text-blue-900' : 'text-slate-700'}`}>
                        {step.title}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${isActive ? 'bg-blue-600' : 'bg-slate-400'}`} />
                      <span>{step.subtitle}</span>
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. MAIN WORKSPACE: DATA PANEL & FUTURE MODULES */}
      <section className="px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-6xl mx-auto space-y-12">

          {/* NSE DATA UPLOAD CARD (ACTIVE FOR MILESTONE 1) */}
          <SkyHighDataUpload />

          {/* UPCOMING PIPELINE MODULES (VISIBLY COMING NEXT - NOT FUNCTIONAL) */}
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Future Pipeline Stages</h3>
                <p className="text-sm text-slate-500">
                  These downstream engines will activate in subsequent milestones upon NSE data validation.
                </p>
              </div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Strict Zero-Mock Data Policy
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* STAGE 2: BLUE SKY */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between relative overflow-hidden group">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                      COMING NEXT
                    </span>
                  </div>

                  <div>
                    <h4 className="text-base font-bold text-slate-900">Blue Sky Strategy</h4>
                    <p className="text-xs font-semibold text-blue-600 mt-0.5">Strategy engine — next milestone</p>
                    <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                      Screens NSE universe for all-time high breakouts, momentum filters, and relative strength pivots.
                    </p>
                  </div>
                </div>

                <div className="pt-6 mt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5" />
                    Milestone 2
                  </span>
                  <span className="font-semibold text-slate-400">Locked</span>
                </div>
              </div>

              {/* STAGE 3: BACKTEST */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between relative overflow-hidden group">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
                      <TrendingUp className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                      COMING NEXT
                    </span>
                  </div>

                  <div>
                    <h4 className="text-base font-bold text-slate-900">Backtest Engine</h4>
                    <p className="text-xs font-semibold text-blue-600 mt-0.5">Realistic backtest — next milestone</p>
                    <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                      Simulates multi-year historical executions with realistic slippage, liquidity constraints, and drawdown metrics.
                    </p>
                  </div>
                </div>

                <div className="pt-6 mt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5" />
                    Milestone 2
                  </span>
                  <span className="font-semibold text-slate-400">Locked</span>
                </div>
              </div>

              {/* STAGE 4: PAPER TRADING */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between relative overflow-hidden group">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
                      <Play className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                      COMING NEXT
                    </span>
                  </div>

                  <div>
                    <h4 className="text-base font-bold text-slate-900">Paper Trading</h4>
                    <p className="text-xs font-semibold text-slate-600 mt-0.5">Paper trading — later</p>
                    <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                      Simulated real-time forward orders during live Indian market hours without risking actual capital.
                    </p>
                  </div>
                </div>

                <div className="pt-6 mt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5" />
                    Future Phase
                  </span>
                  <span className="font-semibold text-slate-400">Locked</span>
                </div>
              </div>

              {/* STAGE 5: LIVE EXECUTION */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between relative overflow-hidden group">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
                      <Cpu className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                      COMING NEXT
                    </span>
                  </div>

                  <div>
                    <h4 className="text-base font-bold text-slate-900">Live Execution</h4>
                    <p className="text-xs font-semibold text-slate-600 mt-0.5">Broker execution — later</p>
                    <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                      Direct automated order dispatching via leading Indian broker API endpoints with pre-trade risk controls.
                    </p>
                  </div>
                </div>

                <div className="pt-6 mt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5" />
                    Future Phase
                  </span>
                  <span className="font-semibold text-slate-400">Locked</span>
                </div>
              </div>

            </div>
          </div>

          {/* ARCHITECTURAL TRANSPARENCY NOTICE */}
          <div className="rounded-2xl bg-blue-50/60 border border-blue-200/80 p-6 flex flex-col sm:flex-row items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm mt-0.5">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-slate-900">
                Brewrich Quantitative Rigor & Zero-Mock Principle
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Brewrich Sky High strictly operates on verified exchange records. No placeholder stock names, simulated CAGR, synthetic returns, or imaginary trades are shown. Every metric in downstream modules will derive strictly from your verified daily NSE data history.
              </p>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
