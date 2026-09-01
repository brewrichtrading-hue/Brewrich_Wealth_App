'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Database, 
  Calendar, 
  Layers, 
  TrendingUp, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  RefreshCw,
  BarChart3,
  Flame,
  Info
} from 'lucide-react';
import { HistoricalCoverageMetrics } from '@/lib/skyhigh/types';

interface SkyHighCoverageDashboardProps {
  onRefreshNeeded?: () => void;
}

export default function SkyHighCoverageDashboard({ onRefreshNeeded }: SkyHighCoverageDashboardProps) {
  const [coverage, setCoverage] = useState<HistoricalCoverageMetrics | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchCoverage = useCallback(async () => {
    try {
      setIsLoading(true);
      setErrorMessage(null);
      const res = await fetch('/api/skyhigh/coverage');
      const json = await res.json();

      if (json.success && json.coverage) {
        setCoverage(json.coverage);
      } else {
        setErrorMessage(json.error || 'Failed to load historical coverage.');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Network error fetching coverage.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCoverage();
  }, [fetchCoverage]);

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-betterment transition-all space-y-6">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-bold text-xs uppercase tracking-wider">
              <BarChart3 className="w-3.5 h-3.5 text-blue-600" />
              Historical Market Coverage
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Cloud History Auditor</span>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
            DATA COVERAGE & SCREEN READINESS
          </h3>
          <p className="text-sm text-slate-500 mt-1">
            Audits the market-wide historical depth in Supabase required to form cross-sectional Relative Strength (RS 1–99) rankings.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => { fetchCoverage(); onRefreshNeeded?.(); }}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all border border-slate-200 disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>{isLoading ? 'Auditing...' : 'Refresh Coverage'}</span>
          </button>
        </div>
      </div>

      {/* SCREEN READINESS BANNER */}
      {coverage && (
        <div className={`p-4 rounded-2xl border flex items-start gap-3.5 ${
          coverage.isScreenReady
            ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950'
            : 'bg-amber-50/90 border-amber-300 text-amber-950'
        }`}>
          {coverage.isScreenReady ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          )}

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm uppercase tracking-wide">
                {coverage.isScreenReady ? 'BLUE SKY SCREEN READY' : 'BLUE SKY SCREEN NOT READY — INSUFFICIENT MARKET-WIDE COVERAGE'}
              </span>
              <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                coverage.isScreenReady ? 'bg-emerald-200 text-emerald-900' : 'bg-amber-200 text-amber-900'
              }`}>
                {coverage.totalTradingSessions} / 252+ SESSIONS
              </span>
            </div>
            <p className="text-xs leading-relaxed opacity-90">
              {coverage.readinessReason}
            </p>
          </div>
        </div>
      )}

      {/* ERROR STATE */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
          {errorMessage}
        </div>
      )}

      {/* METRICS GRID */}
      {coverage && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
            <span className="text-[11px] font-semibold text-slate-400 block mb-0.5">Total Universe</span>
            <span className="text-lg font-bold text-slate-900">{coverage.totalUniverseSecurities.toLocaleString('en-IN')}</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">NSE primary equities</span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
            <span className="text-[11px] font-semibold text-slate-400 block mb-0.5">History Ingested</span>
            <span className="text-lg font-bold text-blue-700">{coverage.securitiesWithHistory.toLocaleString('en-IN')}</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">securities in DB</span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
            <span className="text-[11px] font-semibold text-slate-400 block mb-0.5">RS-Eligible (≥252d)</span>
            <span className={`text-lg font-bold ${coverage.securitiesWith252Sessions > 0 ? 'text-emerald-700' : 'text-slate-400'}`}>
              {coverage.securitiesWith252Sessions.toLocaleString('en-IN')}
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">≥ 252 sessions depth</span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
            <span className="text-[11px] font-semibold text-slate-400 block mb-0.5">1-Year Coverage</span>
            <span className="text-lg font-bold text-slate-700">{coverage.securitiesWith1Year.toLocaleString('en-IN')}</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">≥ 240 sessions</span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
            <span className="text-[11px] font-semibold text-slate-400 block mb-0.5">3-Year Coverage</span>
            <span className="text-lg font-bold text-slate-700">{coverage.securitiesWith3Years.toLocaleString('en-IN')}</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">≥ 720 sessions</span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
            <span className="text-[11px] font-semibold text-slate-400 block mb-0.5">5-Year Coverage</span>
            <span className="text-lg font-bold text-slate-700">{coverage.securitiesWith5Years.toLocaleString('en-IN')}</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">≥ 1,200 sessions</span>
          </div>

        </div>
      )}

      {/* TIMELINE SUMMARY */}
      {coverage && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          
          <div className="p-3 bg-white rounded-xl border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Earliest Trading Date</span>
            <span className="text-xs font-mono font-bold text-slate-800">{coverage.earliestTradingDate}</span>
          </div>

          <div className="p-3 bg-white rounded-xl border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Latest Trading Date</span>
            <span className="text-xs font-mono font-bold text-blue-700">{coverage.latestTradingDate}</span>
          </div>

          <div className="p-3 bg-white rounded-xl border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Trading Sessions</span>
            <span className="text-xs font-mono font-bold text-slate-900">{coverage.totalTradingSessions} days</span>
          </div>

          <div className="p-3 bg-white rounded-xl border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Total OHLCV Records</span>
            <span className="text-xs font-mono font-bold text-slate-900">{coverage.totalMarketRecords.toLocaleString('en-IN')} rows</span>
          </div>

        </div>
      )}

    </div>
  );
}
