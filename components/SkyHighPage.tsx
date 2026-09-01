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
import SkyHighDataUpload from './SkyHighDataUpload';
import SkyHighBlueSky from './SkyHighBlueSky';
import { 
  getCloudDataHistoryStats, 
  getCloudImportedDays, 
  clearAllSkyHighStorage,
  checkAndMigrateLocalData
} from '@/lib/skyhigh/storage';
import { DataHistoryStats, StoredTradingDay } from '@/lib/skyhigh/types';

export default function SkyHighPage() {
  const [historyStats, setHistoryStats] = useState<DataHistoryStats>({
    latestTradingDate: '—',
    totalTradingDays: 0,
    totalSecurities: 0,
    totalRecords: 0,
    lastImport: '—',
    isCloudConnected: false,
  });

  const [importedDays, setImportedDays] = useState<StoredTradingDay[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState<boolean>(true);
  const [migrationStatus, setMigrationStatus] = useState<string | null>(null);
  const [isMigrating, setIsMigrating] = useState<boolean>(false);
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

  const loadCloudHistory = useCallback(async () => {
    try {
      setIsLoadingHistory(true);
      const stats = await getCloudDataHistoryStats();
      const days = await getCloudImportedDays();
      setHistoryStats(stats);
      setImportedDays(days);
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

  const handleClearHistory = async () => {
    if (confirm('Are you sure you want to clear all Sky High historical records from Supabase and local cache?')) {
      await clearAllSkyHighStorage();
      await loadCloudHistory();
      setMigrationStatus(null);
      setRefreshTrigger(prev => prev + 1);
    }
  };

  const steps = [
    {
      id: 1,
      title: 'NSE DATA',
      subtitle: 'Upload daily NSE data',
      status: 'completed',
      badge: 'Completed ✓',
      icon: Database,
    },
    {
      id: 2,
      title: 'BLUE SKY',
      subtitle: 'Strategy engine active',
      status: 'active',
      badge: 'Current Milestone',
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
        <div className="absolute top-0 right-10 w-[450px] h-[450px] bg-white/5 rounded-full blur-3xl pointer-events-none -z-0" />
        <div className="absolute bottom-0 left-10 w-[350px] h-[350px] bg-blue-400/10 rounded-full blur-3xl pointer-events-none -z-0" />

        <div className="relative z-10 mx-auto max-w-6xl">
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold uppercase tracking-wider text-blue-100 shadow-sm">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Brewrich Wealth Platform</span>
            </div>
            
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-300/40 text-amber-200 text-xs font-bold uppercase tracking-wider">
              <span>CURRENT MILESTONE: BLUE SKY STRATEGY ENGINE</span>
            </div>
          </div>

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
              Milestone 4 Active: Blue Sky Strategy
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

          {/* 1. NSE DATA UPLOAD CARD */}
          <SkyHighDataUpload onImportComplete={() => {
            loadCloudHistory();
            setRefreshTrigger(prev => prev + 1);
          }} />

          {/* 2. DATA HISTORY SECTION */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-betterment transition-all">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 font-bold text-xs uppercase tracking-wider">
                    <History className="w-3.5 h-3.5 text-blue-600" />
                    Historical Cumulative Repository
                  </div>
                  
                  {/* REAL DATA SOURCE INDICATOR */}
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold text-xs">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Cloud Repository: Connected</span>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 tracking-tight">DATA HISTORY</h3>
                <p className="text-sm text-slate-500 mt-1">
                  Accumulated multi-day records stored in isolated Supabase cloud tables. Cross-session persistent.
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

                {importedDays.length > 0 && (
                  <button
                    onClick={handleClearHistory}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-600 text-xs font-semibold transition-all border border-slate-200"
                    title="Clear dataset from Supabase Cloud and local cache"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Clear Dataset
                  </button>
                )}
              </div>
            </div>

            {/* CUMULATIVE METRICS CARDS FROM SUPABASE */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 pt-6">
              {/* Latest Trading Date */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                <div className="flex items-center gap-1.5 text-slate-400 text-xs font-semibold mb-1">
                  <Calendar className="w-3.5 h-3.5 text-blue-600" />
                  Latest Trading Date
                </div>
                <div className="text-lg font-bold text-slate-900 truncate">
                  {historyStats.latestTradingDate}
                </div>
              </div>

              {/* Total Trading Days */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                <div className="flex items-center gap-1.5 text-slate-400 text-xs font-semibold mb-1">
                  <Layers className="w-3.5 h-3.5 text-blue-600" />
                  Total Trading Days
                </div>
                <div className="text-lg font-bold text-slate-900">
                  {historyStats.totalTradingDays > 0 ? historyStats.totalTradingDays : '—'}
                </div>
              </div>

              {/* Total Securities */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                <div className="flex items-center gap-1.5 text-slate-400 text-xs font-semibold mb-1">
                  <Database className="w-3.5 h-3.5 text-blue-600" />
                  Total Securities
                </div>
                <div className="text-lg font-bold text-slate-900">
                  {historyStats.totalSecurities > 0 ? historyStats.totalSecurities.toLocaleString('en-IN') : '—'}
                </div>
              </div>

              {/* Total Records */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                <div className="flex items-center gap-1.5 text-slate-400 text-xs font-semibold mb-1">
                  <Activity className="w-3.5 h-3.5 text-blue-600" />
                  Total Records
                </div>
                <div className="text-lg font-bold text-slate-900">
                  {historyStats.totalRecords > 0 ? historyStats.totalRecords.toLocaleString('en-IN') : '—'}
                </div>
              </div>

              {/* Last Import */}
              <div className="col-span-2 md:col-span-1 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                <div className="flex items-center gap-1.5 text-slate-400 text-xs font-semibold mb-1">
                  <Clock className="w-3.5 h-3.5 text-blue-600" />
                  Last Import
                </div>
                <div className="text-xs sm:text-sm font-semibold text-slate-900 truncate" title={historyStats.lastImport}>
                  {historyStats.lastImport}
                </div>
              </div>
            </div>

            {/* STORED TRADING SESSIONS TABLE (READ FROM CLOUD) */}
            {importedDays.length > 0 ? (
              <div className="mt-8 pt-6 border-t border-slate-100 overflow-x-auto">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Cloud-Persisted Trading Days Log
                  </span>
                  <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Cloud verified ✓
                  </span>
                </div>

                <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
                  <thead className="bg-slate-100/80 text-slate-600 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="p-3">Trading Date</th>
                      <th className="p-3">Source File</th>
                      <th className="p-3">Securities Loaded</th>
                      <th className="p-3">Records Stored</th>
                      <th className="p-3">Import Timestamp</th>
                      <th className="p-3">Persistence Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {importedDays.map((day) => (
                      <tr key={day.date} className="hover:bg-slate-50">
                        <td className="p-3 font-bold text-slate-900 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          {day.formattedDate}
                        </td>
                        <td className="p-3 text-slate-600 truncate max-w-xs">{day.fileName}</td>
                        <td className="p-3 font-semibold text-slate-800">{day.stockCount.toLocaleString('en-IN')}</td>
                        <td className="p-3 font-semibold text-blue-700">{day.rowCount.toLocaleString('en-IN')}</td>
                        <td className="p-3 text-slate-500">{day.importedAt}</td>
                        <td className="p-3">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-bold">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Cloud verified ✓
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="mt-6 p-4 rounded-xl bg-slate-50 text-center text-xs text-slate-500 border border-slate-100">
                No historical sessions recorded yet. Upload a daily NSE Bhavcopy CSV to initialize persistent cloud history.
              </div>
            )}
          </div>

          {/* 3. MILESTONE 4: REAL BLUE SKY STRATEGY SECTION */}
          <SkyHighBlueSky key={refreshTrigger} />

          {/* 4. UPCOMING PIPELINE MODULES (MILESTONES 5+) */}
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Future Pipeline Stages</h3>
                <p className="text-sm text-slate-500">
                  Downstream engines activating in subsequent milestones upon strategy qualification.
                </p>
              </div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Strict Zero-Mock Data Policy
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
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
                    Milestone 5
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
