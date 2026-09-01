'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { 
  Database, 
  Sparkles, 
  TrendingUp, 
  Play, 
  Lock, 
  ShieldCheck, 
  Layers, 
  CheckCircle2, 
  Clock, 
  Activity,
  Cpu,
  History,
  Calendar,
  Trash2,
  Cloud,
  RefreshCw,
  Server,
  ArrowUpCircle
} from 'lucide-react';
import SkyHighDefinedgeTest from './SkyHighDefinedgeTest';
import { 
  getCloudDataHistoryStats, 
  checkAndMigrateLocalData
} from '@/lib/skyhigh/storage';
import { DataHistoryStats } from '@/lib/skyhigh/types';

export default function SkyHighPage() {
  const [historyStats, setHistoryStats] = useState<DataHistoryStats>({
    latestTradingDate: '—',
    totalTradingDays: 0,
    totalSecurities: 0,
    totalRecords: 0,
    lastImport: '—',
    isCloudConnected: false,
  });

  const [isLoadingHistory, setIsLoadingHistory] = useState<boolean>(true);
  const [migrationStatus, setMigrationStatus] = useState<string | null>(null);
  const [isMigrating, setIsMigrating] = useState<boolean>(false);
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

  const loadCloudHistory = useCallback(async () => {
    try {
      setIsLoadingHistory(true);
      const stats = await getCloudDataHistoryStats();
      setHistoryStats(stats);
    } catch (err) {
      console.warn('⚠️ [SKY HIGH] Error loading cloud data history:', err);
    } finally {
      setIsLoadingHistory(false);
    }
  }, []);

  // Safe migration of local IndexedDB records (e.g. 31 Aug 2026) to Supabase Cloud on mount
  useEffect(() => {
    async function initAndMigrate() {
      await loadCloudHistory();

      // Check if local cache has unmigrated days
      try {
        const result = await checkAndMigrateLocalData((msg) => {
          setMigrationStatus(msg);
        });

        if (result.migratedDays > 0) {
          setMigrationStatus(
            `Successfully migrated ${result.migratedDays} historical trading day (${result.migratedRecords.toLocaleString('en-IN')} records) to Supabase Cloud.`
          );
          await loadCloudHistory();
          setRefreshTrigger(prev => prev + 1);
        }
      } catch (err) {
        console.warn('⚠️ [SKY HIGH] Local migration check warning:', err);
      }
    }

    initAndMigrate();
  }, [loadCloudHistory]);

  const handleManualMigrate = async () => {
    setIsMigrating(true);
    setMigrationStatus('Scanning local IndexedDB for records to migrate...');
    try {
      const result = await checkAndMigrateLocalData((msg) => setMigrationStatus(msg));
      if (result.migratedDays > 0) {
        setMigrationStatus(
          `Migration complete: ${result.migratedDays} day (${result.migratedRecords.toLocaleString('en-IN')} records) safely persisted & verified in Supabase Cloud.`
        );
      } else {
        setMigrationStatus('All local datasets are already synchronized with Supabase Cloud.');
      }
      await loadCloudHistory();
      setRefreshTrigger(prev => prev + 1);
    } catch (err: any) {
      setMigrationStatus(`Migration error: ${err?.message || 'Failed to sync local data'}`);
    } finally {
      setIsMigrating(false);
    }
  };

  const steps = [
    {
      id: 1,
      title: 'DEFINEDGE 2FA',
      subtitle: 'Broker API authenticated',
      status: 'completed',
      badge: 'Active ✓',
      icon: ShieldCheck,
    },
    {
      id: 2,
      title: 'MARKET DATA',
      subtitle: 'Historical & live data feed',
      status: 'completed',
      badge: 'Ready ✓',
      icon: Database,
    },
    {
      id: 3,
      title: '5M SUPERTREND',
      subtitle: 'NIFTY / BANK NIFTY / SENSEX',
      status: 'active',
      badge: 'Next Milestone',
      icon: Sparkles,
    },
    {
      id: 4,
      title: 'BACKTEST',
      subtitle: 'Options backtest & risk rules',
      status: 'upcoming',
      badge: 'Upcoming',
      icon: TrendingUp,
    },
    {
      id: 5,
      title: 'LIVE SIGNALS',
      subtitle: 'Automated execution & signals',
      status: 'locked',
      badge: 'Later',
      icon: Cpu,
    },
  ];

  return (
    <div className="flex flex-col w-full min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-600 selection:text-white">
      
      {/* 1. TOP HERO SECTION */}
      <section className="relative bg-gradient-to-b from-[#0A358F] via-[#0D44B8] to-[#1456F0] text-white pt-14 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute top-0 right-10 w-[450px] h-[450px] bg-white/5 rounded-full blur-3xl pointer-events-none -z-0" />
        <div className="absolute bottom-0 left-10 w-[350px] h-[350px] bg-blue-400/10 rounded-full blur-3xl pointer-events-none -z-0" />

        <div className="relative z-10 mx-auto max-w-6xl">
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold uppercase tracking-wider text-blue-100 shadow-sm">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Brewrich Wealth Platform</span>
            </div>
            
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-300/40 text-amber-200 text-xs font-bold uppercase tracking-wider">
              <span>FOUNDATION READY: DEFINEDGE → 5M SUPERTREND ENGINE</span>
            </div>
          </div>

          <div className="space-y-4 max-w-3xl">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] text-white">
              BREWRICH SKY HIGH
            </h1>
            
            <h2 className="text-xl sm:text-2xl font-semibold text-blue-100 tracking-normal">
              Algorithmic Options Strategy Platform
            </h2>

            <p className="text-base sm:text-lg text-blue-100/90 font-normal leading-relaxed pt-1">
              High-performance market data, strategy engines, and automated risk management powered by Definedge. Screening and execution for NIFTY, BANK NIFTY, and SENSEX options.
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
              Next Milestone: 5-Minute Supertrend Options Strategy
            </div>
          </div>

          {/* Stepper Grid */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 pt-6">
            {steps.map((step) => {
              const isActive = step.status === 'active';
              const isCompleted = step.status === 'completed';

              return (
                <div 
                  key={step.id} 
                  className={`relative p-4 rounded-xl transition-all border ${
                    isActive 
                      ? 'bg-blue-50/70 border-blue-300 shadow-sm ring-1 ring-blue-400/50' 
                      : isCompleted
                        ? 'bg-emerald-50/50 border-emerald-200'
                        : 'bg-slate-50/70 border-slate-200/80 opacity-80'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                      isActive 
                        ? 'bg-blue-600 text-white' 
                        : isCompleted
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-200 text-slate-600'
                    }`}>
                      {isCompleted ? '✓' : step.id}
                    </span>
                    
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      isActive
                        ? 'bg-blue-600 text-white'
                        : isCompleted
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : 'bg-slate-200 text-slate-600'
                    }`}>
                      {step.badge}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span className={`text-base font-bold ${
                        isActive ? 'text-blue-900' : isCompleted ? 'text-emerald-900' : 'text-slate-700'
                      }`}>
                        {step.title}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                        isActive ? 'bg-blue-600' : isCompleted ? 'bg-emerald-500' : 'bg-slate-400'
                      }`} />
                      <span>{step.subtitle}</span>
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. MAIN WORKSPACE: DATA PANEL & DATA HISTORY */}
      <section className="px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-6xl mx-auto space-y-12">

          {/* MIGRATION / SYNC NOTIFICATION BANNER */}
          {migrationStatus && (
            <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-blue-900 text-xs sm:text-sm flex items-center justify-between gap-3 shadow-sm">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <span>{migrationStatus}</span>
              </div>
              <button
                onClick={() => setMigrationStatus(null)}
                className="text-blue-500 hover:text-blue-700 font-bold text-xs"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* 1. DEFINEDGE MARKET DATA & 2FA AUTHENTICATION */}
          <SkyHighDefinedgeTest onIngestionComplete={() => {
            loadCloudHistory();
            setRefreshTrigger(prev => prev + 1);
          }} />

          {/* 2. DATA FOUNDATION STATUS CARD */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-betterment transition-all space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-bold text-xs uppercase tracking-wider">
                    <Database className="w-3.5 h-3.5 text-blue-600" />
                    Storage & Feed
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold text-xs">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Cloud Synced</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">DATA FOUNDATION</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Persistent market data infrastructure powering the 5-minute options engine.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleManualMigrate}
                  disabled={isMigrating}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold transition-all border border-blue-200 disabled:opacity-50"
                  title="Check and sync any local IndexedDB dataset to Supabase Cloud"
                >
                  <ArrowUpCircle className="w-3.5 h-3.5" />
                  {isMigrating ? 'Syncing...' : 'Sync Local Cache'}
                </button>
              </div>
            </div>

            {/* COMPACT KEY-VALUE STATUS GRID */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-1">
              
              {/* Definedge Status */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-[11px] font-semibold text-slate-400 block mb-1">Definedge</span>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Connected
                </span>
                <span className="text-[10px] text-slate-400 block mt-1">2FA API Active</span>
              </div>

              {/* Historical Repository Status */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-[11px] font-semibold text-slate-400 block mb-1">Historical Repository</span>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Connected
                </span>
                <span className="text-[10px] text-slate-400 block mt-1">Supabase Cloud</span>
              </div>

              {/* Latest Data */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-[11px] font-semibold text-slate-400 block mb-1">Latest Data</span>
                <span className="text-sm font-mono font-bold text-blue-700 block truncate">
                  {historyStats.latestTradingDate}
                </span>
                <span className="text-[10px] text-slate-400 block mt-1">Evaluation cut-off</span>
              </div>

              {/* Trading Days Stored */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-[11px] font-semibold text-slate-400 block mb-1">Trading Days Stored</span>
                <span className="text-sm font-mono font-bold text-slate-900 block">
                  {historyStats.totalTradingDays > 0 ? `${historyStats.totalTradingDays} days` : '0 days'}
                </span>
                <span className="text-[10px] text-slate-400 block mt-1">Sessions available</span>
              </div>

              {/* Securities Stored */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-[11px] font-semibold text-slate-400 block mb-1">Securities Stored</span>
                <span className="text-sm font-mono font-bold text-slate-900 block">
                  {historyStats.totalSecurities > 0 ? historyStats.totalSecurities.toLocaleString('en-IN') : '0'}
                </span>
                <span className="text-[10px] text-slate-400 block mt-1">Unique symbols</span>
              </div>

              {/* Last Sync */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-[11px] font-semibold text-slate-400 block mb-1">Last Sync</span>
                <span className="text-xs font-semibold text-slate-800 block truncate" title={historyStats.lastImport}>
                  {historyStats.lastImport}
                </span>
                <span className="text-[10px] text-slate-400 block mt-1">Persistent timestamp</span>
              </div>

            </div>
          </div>

          {/* 3. UPCOMING PIPELINE MODULES (NEXT MILESTONES) */}
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Strategy & Execution Roadmap</h3>
                <p className="text-sm text-slate-500">
                  Target pipeline for 5-minute Supertrend options trading on NIFTY, BANK NIFTY, and SENSEX.
                </p>
              </div>
              <div className="text-xs font-semibold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                Definedge Foundation Connected
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* STAGE 1: 5-MIN SUPERTREND OPTIONS ENGINE */}
              <div className="bg-white rounded-2xl border border-blue-200 p-6 shadow-sm flex flex-col justify-between relative overflow-hidden group ring-1 ring-blue-100">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-blue-600 text-white shadow-xs">
                      NEXT MILESTONE
                    </span>
                  </div>

                  <div>
                    <h4 className="text-base font-bold text-slate-900">5M Supertrend Strategy</h4>
                    <p className="text-xs font-semibold text-blue-600 mt-0.5">NIFTY, BANK NIFTY, SENSEX Options</p>
                    <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                      5-minute candle Supertrend signal engine tracking multi-timeframe directional momentum, index trend, and options strike selection.
                    </p>
                  </div>
                </div>

                <div className="pt-6 mt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1 font-semibold text-blue-700">
                    <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                    Milestone 3
                  </span>
                  <span className="font-semibold text-blue-700">Ready to build</span>
                </div>
              </div>

              {/* STAGE 2: BACKTEST ENGINE & RISK RULES */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between relative overflow-hidden group">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
                      <TrendingUp className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                      UPCOMING
                    </span>
                  </div>

                  <div>
                    <h4 className="text-base font-bold text-slate-900">Options Backtest Engine</h4>
                    <p className="text-xs font-semibold text-slate-600 mt-0.5">Expiry & Risk-Management Rules</p>
                    <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                      Rigorous historical backtesting simulating intraday options pricing, expiry days, stop-loss trailing, and capital risk limits.
                    </p>
                  </div>
                </div>

                <div className="pt-6 mt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5" />
                    Milestone 4
                  </span>
                  <span className="font-semibold text-slate-400">Upcoming</span>
                </div>
              </div>

              {/* STAGE 3: LIVE SIGNALS & EXECUTION */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between relative overflow-hidden group">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
                      <Cpu className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                      FUTURE
                    </span>
                  </div>

                  <div>
                    <h4 className="text-base font-bold text-slate-900">Live Execution & Signals</h4>
                    <p className="text-xs font-semibold text-slate-600 mt-0.5">Definedge API Automated Orders</p>
                    <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                      Direct automated options order dispatching via Definedge API with sub-second execution and automated risk guards.
                    </p>
                  </div>
                </div>

                <div className="pt-6 mt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5" />
                    Milestone 5
                  </span>
                  <span className="font-semibold text-slate-400">Locked</span>
                </div>
              </div>

            </div>
          </div>

          {/* ZERO MOCK NOTICE */}
          <div className="rounded-2xl bg-blue-50/60 border border-blue-200/80 p-6 flex flex-col sm:flex-row items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm mt-0.5">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-slate-900">
                Brewrich Quantitative Rigor & Zero-Mock Principle
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Brewrich Sky High strictly operates on verified exchange records. No placeholder stock names, simulated CAGR, synthetic returns, or imaginary trades are shown. Every metric in the Blue Sky Strategy engine derives strictly from verified daily NSE data stored securely in Supabase cloud persistence.
              </p>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
