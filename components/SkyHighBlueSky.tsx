'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Sparkles, 
  Search, 
  Filter, 
  TrendingUp, 
  Layers, 
  CheckCircle2, 
  AlertCircle, 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Sliders, 
  RefreshCw, 
  Info,
  Server,
  ShieldCheck,
  Zap,
  Eye,
  XCircle,
  HelpCircle
} from 'lucide-react';
import { 
  fetchAllMarketDataFromCloud, 
  calculateBlueSkyStrategy, 
  DEFAULT_BLUE_SKY_CONFIG 
} from '@/lib/skyhigh/blueSky';
import { 
  BlueSkyEngineResult, 
  BlueSkyConfig, 
  BlueSkyStatus, 
  SecurityHistoricalMetrics 
} from '@/lib/skyhigh/types';

interface SkyHighBlueSkyProps {
  onRefreshNeeded?: () => void;
}

export default function SkyHighBlueSky({ onRefreshNeeded }: SkyHighBlueSkyProps) {
  const [engineResult, setEngineResult] = useState<BlueSkyEngineResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [progressCount, setProgressCount] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | BlueSkyStatus>('ALL');
  const [seriesFilter, setSeriesFilter] = useState<string>('ALL');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [showConfig, setShowConfig] = useState<boolean>(false);

  // Engine Configuration state
  const [config, setConfig] = useState<BlueSkyConfig>(DEFAULT_BLUE_SKY_CONFIG);

  const PAGE_SIZE = 50;

  const runStrategy = useCallback(async (customConfig?: BlueSkyConfig) => {
    try {
      setIsLoading(true);
      setErrorMessage(null);
      setProgressCount(0);

      const records = await fetchAllMarketDataFromCloud((loaded) => {
        setProgressCount(loaded);
      });

      if (records.length === 0) {
        setEngineResult({
          summary: {
            tradingDate: '—',
            totalUniverse: 0,
            breakoutCount: 0,
            candidateCount: 0,
            notQualifiedCount: 0,
            insufficientHistoryCount: 0,
            isSingleDayDataset: true,
            isScreenReady: false,
            totalHistoricalDays: 0,
            calculatedAt: new Date().toLocaleString('en-IN'),
          },
          securities: [],
          config: customConfig || config,
        });
        return;
      }

      const calculated = calculateBlueSkyStrategy(records, customConfig || config);
      setEngineResult(calculated);
      setCurrentPage(1);
    } catch (err: any) {
      console.error('❌ [BLUE SKY ENGINE ERROR]:', err);
      setErrorMessage(err?.message || 'Failed to calculate Blue Sky strategy from Supabase records.');
    } finally {
      setIsLoading(false);
    }
  }, [config]);

  useEffect(() => {
    runStrategy();
  }, [runStrategy]);

  // Filtered and searched securities
  const filteredSecurities = useMemo(() => {
    if (!engineResult) return [];

    return engineResult.securities.filter((sec) => {
      // Search filter
      const matchesSearch = 
        searchQuery.trim() === '' ||
        sec.symbol.toLowerCase().includes(searchQuery.trim().toLowerCase());

      // Status filter
      const matchesStatus = 
        statusFilter === 'ALL' || sec.status === statusFilter;

      // Series filter
      const matchesSeries = 
        seriesFilter === 'ALL' || 
        (sec.series && sec.series.toUpperCase() === seriesFilter);

      return matchesSearch && matchesStatus && matchesSeries;
    });
  }, [engineResult, searchQuery, statusFilter, seriesFilter]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredSecurities.length / PAGE_SIZE));
  const paginatedSecurities = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredSecurities.slice(start, start + PAGE_SIZE);
  }, [filteredSecurities, currentPage]);

  const availableSeries = useMemo(() => {
    if (!engineResult) return [];
    const set = new Set<string>();
    engineResult.securities.forEach(s => {
      if (s.series) set.add(s.series);
    });
    return Array.from(set).sort();
  }, [engineResult]);

  return (
    <div className="w-full space-y-8">
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-betterment transition-all">
        
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-bold text-xs uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                BananaPatterns Blue Sky Strategy Engine
              </div>
              
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold text-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Supabase Cloud Strategy</span>
              </div>
            </div>

            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              BLUE SKY STRATEGY
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              Screening stocks basing at all-time high with Relative Strength (1–99) and 20% pivot proximity.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowConfig(!showConfig)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all border ${
                showConfig 
                  ? 'bg-blue-600 text-white border-blue-600' 
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>{showConfig ? 'Hide Config' : 'Engine Rules'}</span>
            </button>

            <button
              onClick={() => runStrategy()}
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-sm disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>{isLoading ? 'Calculating...' : 'Recalculate'}</span>
            </button>
          </div>
        </div>

        {/* CONFIGURATION & SPECIFICATION PANEL */}
        {showConfig && (
          <div className="my-6 p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
            <div>
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-blue-600" />
                Approved BananaPatterns Blue Sky Specification
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Core rules operating on complete historical prices without rolling 252-day ATH limits or VCP logic.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <span className="text-[11px] font-semibold text-slate-400 block">Candidate Proximity</span>
                <span className="text-sm font-bold text-slate-800">≤ {config.proximityThresholdPercent}%</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Distance to ATH Pivot</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <span className="text-[11px] font-semibold text-slate-400 block">Relative Strength (RS)</span>
                <span className="text-sm font-bold text-emerald-700">≥ {config.minRelativeStrength} (1–99)</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">252-session Trailing Return</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <span className="text-[11px] font-semibold text-slate-400 block">Min Daily Traded Value</span>
                <span className="text-sm font-bold text-slate-800">≥ ₹{config.minAvgDailyTradedValueCrores} Cr</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Average Daily Turnover</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <span className="text-[11px] font-semibold text-slate-400 block">Min Market Cap</span>
                <span className="text-sm font-bold text-slate-800">≥ ₹{config.minMarketCapCrores} Cr</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Pending Shares Feed</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <span className="text-[11px] font-semibold text-slate-400 block">Breakout Condition</span>
                <span className="text-sm font-bold text-blue-700">Close &gt; Pivot</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Clears ATH Ceiling</span>
              </div>
            </div>
          </div>
        )}

        {/* SCREEN READINESS NOTICE */}
        {engineResult && !engineResult.summary.isScreenReady && (
          <div className="my-6 p-5 rounded-2xl bg-amber-50/90 border border-amber-300 text-amber-950 text-xs sm:text-sm flex items-start gap-3.5 shadow-sm">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm text-amber-950 uppercase tracking-wide">
                  BLUE SKY SCREEN NOT READY — INSUFFICIENT MARKET-WIDE HISTORICAL COVERAGE
                </span>
                <span className="text-[10px] font-bold bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full">
                  {engineResult.summary.totalHistoricalDays} / 252+ SESSIONS
                </span>
              </div>
              <p className="text-xs text-amber-900 leading-relaxed">
                The repository currently contains <strong>{engineResult.summary.totalHistoricalDays}</strong> trading session(s). Cross-sectional Relative Strength ranking (RS 1–99) requires at least <strong>252 historical trading sessions</strong> across the eligible market universe. In accordance with the approved Blue Sky rules, stocks cannot be screened or ranked without complete historical depth. Use the <strong>Market-Wide Historical Ingestion</strong> panel above to ingest 1-year or 5-year benchmark datasets.
              </p>
            </div>
          </div>
        )}

        {/* ERROR STATE */}
        {errorMessage && (
          <div className="my-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* LOADING INDICATOR */}
        {isLoading && (
          <div className="my-8 p-8 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-3">
            <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm font-semibold text-slate-800">
              Executing Blue Sky Strategy across Supabase records...
            </p>
            {progressCount > 0 && (
              <p className="text-xs text-slate-500 font-mono">
                Fetched {progressCount.toLocaleString('en-IN')} records from cloud
              </p>
            )}
          </div>
        )}

        {/* 1. STRATEGY SUMMARY METRICS */}
        {engineResult && !isLoading && (
          <div className="pt-6">
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
              
              {/* Latest Trading Date */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                <div className="flex items-center gap-1.5 text-slate-400 text-xs font-semibold mb-1">
                  <Calendar className="w-3.5 h-3.5 text-blue-600" />
                  Evaluation Date
                </div>
                <div className="text-lg font-bold text-slate-900 truncate">
                  {engineResult.summary.tradingDate}
                </div>
              </div>

              {/* Total Universe */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                <div className="flex items-center gap-1.5 text-slate-400 text-xs font-semibold mb-1">
                  <Layers className="w-3.5 h-3.5 text-blue-600" />
                  Total Universe
                </div>
                <div className="text-lg font-bold text-slate-900">
                  {engineResult.summary.totalUniverse.toLocaleString('en-IN')}
                </div>
              </div>

              {/* Breakout Count */}
              <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200">
                <div className="flex items-center gap-1.5 text-blue-800 text-xs font-bold mb-1">
                  <Zap className="w-3.5 h-3.5 text-blue-600" />
                  Blue Sky Breakout
                </div>
                <div className="text-xl font-extrabold text-blue-900">
                  {engineResult.summary.breakoutCount.toLocaleString('en-IN')}
                </div>
              </div>

              {/* Candidate Count */}
              <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200">
                <div className="flex items-center gap-1.5 text-emerald-800 text-xs font-bold mb-1">
                  <Eye className="w-3.5 h-3.5 text-emerald-600" />
                  Blue Sky Candidate
                </div>
                <div className="text-xl font-extrabold text-emerald-900">
                  {engineResult.summary.candidateCount.toLocaleString('en-IN')}
                </div>
              </div>

              {/* Not Qualified / Insufficient History */}
              <div className="col-span-2 sm:col-span-1 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                <div className="flex items-center gap-1.5 text-slate-400 text-xs font-semibold mb-1">
                  <XCircle className="w-3.5 h-3.5 text-slate-500" />
                  Other / Unqualified
                </div>
                <div className="text-lg font-bold text-slate-700">
                  {(engineResult.summary.notQualifiedCount + engineResult.summary.insufficientHistoryCount).toLocaleString('en-IN')}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* 2. CONTROLS, SEARCH & FILTER TABS */}
        {engineResult && !isLoading && (
          <div className="mt-8 pt-6 border-t border-slate-100 space-y-4">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              
              {/* Filter Tabs */}
              <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
                <button
                  onClick={() => { setStatusFilter('ALL'); setCurrentPage(1); }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    statusFilter === 'ALL'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  All ({engineResult.summary.totalUniverse.toLocaleString('en-IN')})
                </button>
                <button
                  onClick={() => { setStatusFilter('BLUE SKY BREAKOUT'); setCurrentPage(1); }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    statusFilter === 'BLUE SKY BREAKOUT'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-blue-800 hover:bg-blue-50'
                  }`}
                >
                  Breakout ({engineResult.summary.breakoutCount.toLocaleString('en-IN')})
                </button>
                <button
                  onClick={() => { setStatusFilter('BLUE SKY CANDIDATE'); setCurrentPage(1); }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    statusFilter === 'BLUE SKY CANDIDATE'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-emerald-800 hover:bg-emerald-50'
                  }`}
                >
                  Candidate ({engineResult.summary.candidateCount.toLocaleString('en-IN')})
                </button>
                <button
                  onClick={() => { setStatusFilter('NOT QUALIFIED'); setCurrentPage(1); }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    statusFilter === 'NOT QUALIFIED'
                      ? 'bg-slate-700 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Not Qualified ({engineResult.summary.notQualifiedCount.toLocaleString('en-IN')})
                </button>
                {engineResult.summary.insufficientHistoryCount > 0 && (
                  <button
                    onClick={() => { setStatusFilter('INSUFFICIENT HISTORY'); setCurrentPage(1); }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      statusFilter === 'INSUFFICIENT HISTORY'
                        ? 'bg-amber-600 text-white shadow-sm'
                        : 'text-amber-800 hover:bg-amber-50'
                    }`}
                  >
                    &lt; 252d ({engineResult.summary.insufficientHistoryCount.toLocaleString('en-IN')})
                  </button>
                )}
              </div>

              {/* Search & Series Dropdown */}
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search symbol..."
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                    className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 font-semibold w-40 sm:w-48"
                  />
                </div>

                {availableSeries.length > 0 && (
                  <select
                    value={seriesFilter}
                    onChange={(e) => { setSeriesFilter(e.target.value); setCurrentPage(1); }}
                    className="py-1.5 px-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 font-semibold text-slate-700"
                  >
                    <option value="ALL">All Series</option>
                    {availableSeries.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                )}
              </div>

            </div>

            {/* Active filter count indicator */}
            <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
              <span>
                Showing {filteredSecurities.length.toLocaleString('en-IN')} of {engineResult.summary.totalUniverse.toLocaleString('en-IN')} securities
              </span>
              <span>Page {currentPage} of {totalPages}</span>
            </div>

          </div>
        )}

        {/* 3. STRATEGY RESULTS TABLE */}
        {engineResult && !isLoading && (
          <div className="mt-4 overflow-x-auto">
            {filteredSecurities.length > 0 ? (
              <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
                <thead className="bg-slate-100/90 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="p-3">Symbol</th>
                    <th className="p-3 text-right">Latest Close</th>
                    <th className="p-3 text-right">All-Time High (ATH)</th>
                    <th className="p-3 text-right">Blue Sky Pivot</th>
                    <th className="p-3 text-right">Distance to Pivot %</th>
                    <th className="p-3 text-center">RS Score (1–99)</th>
                    <th className="p-3 text-right">Avg Daily Traded Value</th>
                    <th className="p-3 text-center">Market Cap</th>
                    <th className="p-3 text-center">Base Status</th>
                    <th className="p-3 text-center">Breakout Status</th>
                    <th className="p-3 text-center">Pipeline Stage</th>
                    <th className="p-3 text-center">Blue Sky Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {paginatedSecurities.map((sec) => {
                    const isBreakout = sec.status === 'BLUE SKY BREAKOUT';
                    const isCandidate = sec.status === 'BLUE SKY CANDIDATE';
                    const isInsufficient = sec.status === 'INSUFFICIENT HISTORY';

                    return (
                      <tr key={sec.symbol} className="hover:bg-slate-50/80 transition-colors">
                        
                        {/* Symbol */}
                        <td className="p-3">
                          <div className="font-bold text-slate-900">{sec.symbol}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{sec.series || 'EQ'}</div>
                        </td>

                        {/* Latest Close */}
                        <td className="p-3 text-right font-mono font-bold text-slate-900">
                          ₹{sec.latestClose.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>

                        {/* Historical All-Time High */}
                        <td className="p-3 text-right font-mono text-slate-600">
                          ₹{sec.allTimeHigh.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>

                        {/* Blue Sky Pivot */}
                        <td className="p-3 text-right font-mono font-semibold text-blue-700">
                          ₹{sec.pivot.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>

                        {/* Distance to Pivot % */}
                        <td className="p-3 text-right font-mono font-semibold">
                          <span className={`${
                            sec.distanceToPivotPercent === 0 
                              ? 'text-emerald-700 font-bold' 
                              : sec.distanceToPivotPercent <= 20.0 
                                ? 'text-blue-700 font-semibold' 
                                : 'text-slate-500'
                          }`}>
                            {sec.distanceToPivotPercent === 0 ? '0.00% (At Pivot)' : `-${sec.distanceToPivotPercent.toFixed(2)}%`}
                          </span>
                        </td>

                        {/* Relative Strength Score (1-99) */}
                        <td className="p-3 text-center font-mono">
                          {sec.relativeStrengthScore !== null ? (
                            <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-bold ${
                              sec.relativeStrengthScore >= 70
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : 'bg-slate-100 text-slate-600'
                            }`}>
                              RS {sec.relativeStrengthScore}
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-400 font-sans" title="Requires >= 252 sessions">
                              &lt;252d
                            </span>
                          )}
                        </td>

                        {/* Avg Daily Traded Value */}
                        <td className="p-3 text-right font-mono">
                          <span className={`${sec.avgDailyTradedValueCrores >= 5 ? 'text-slate-800 font-semibold' : 'text-slate-400'}`}>
                            ₹{sec.avgDailyTradedValueCrores.toFixed(2)} Cr
                          </span>
                        </td>

                        {/* Market Cap */}
                        <td className="p-3 text-center">
                          {sec.marketCapCrores !== null ? (
                            <span className="font-mono text-slate-800">₹{sec.marketCapCrores} Cr</span>
                          ) : (
                            <span className="inline-flex px-2 py-0.5 rounded bg-slate-100 text-slate-400 text-[10px] font-mono" title="Shares outstanding data unavailable in raw daily OHLCV">
                              DATA UNAVAILABLE
                            </span>
                          )}
                        </td>

                        {/* Base Status */}
                        <td className="p-3 text-center">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold" title="Conceptually required by BananaPatterns; exact mathematical detection formula not supplied">
                            UNRESOLVED
                          </span>
                        </td>

                        {/* Breakout Status */}
                        <td className="p-3 text-center">
                          <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            sec.breakoutStatus === 'Breakout'
                              ? 'bg-blue-100 text-blue-800 border border-blue-200'
                              : sec.breakoutStatus === 'Within 20% Pivot'
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                : 'bg-slate-100 text-slate-500'
                          }`}>
                            {sec.breakoutStatus}
                          </span>
                        </td>

                        {/* Pipeline Stage */}
                        <td className="p-3 text-center">
                          <span className="inline-flex px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-mono font-bold">
                            {sec.pipelineStage || 'UNIVERSE'}
                          </span>
                        </td>

                        {/* Overall Blue Sky Status */}
                        <td className="p-3 text-center">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider ${
                            isBreakout
                              ? 'bg-blue-600 text-white shadow-xs'
                              : isCandidate
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : isInsufficient
                                  ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                  : 'bg-slate-100 text-slate-500'
                          }`}>
                            {(isBreakout || isCandidate) && <CheckCircle2 className="w-3 h-3 text-white inline" />}
                            {sec.status}
                          </span>
                        </td>

                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-2">
                <p className="text-sm font-bold text-slate-800">NO MARKET DATA AVAILABLE</p>
                <p className="text-xs text-slate-500">
                  {searchQuery || statusFilter !== 'ALL' || seriesFilter !== 'ALL'
                    ? 'No securities matched the current filters. Try resetting the search or filter selection.'
                    : 'No historical records were found in public.skyhigh_market_data.'}
                </p>
              </div>
            )}
          </div>
        )}

        {/* 4. PAGINATION CONTROLS */}
        {filteredSecurities.length > PAGE_SIZE && !isLoading && (
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
            <span className="text-xs text-slate-500">
              Showing {(currentPage - 1) * PAGE_SIZE + 1} to {Math.min(currentPage * PAGE_SIZE, filteredSecurities.length)} of {filteredSecurities.length} results
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                Previous
              </button>

              <span className="px-3 py-1 text-xs font-bold text-slate-700 bg-slate-100 rounded-lg">
                {currentPage} / {totalPages}
              </span>

              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
              >
                Next
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
