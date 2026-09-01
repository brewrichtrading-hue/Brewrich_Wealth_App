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
  XCircle
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
            qualifiedCount: 0,
            watchlistCount: 0,
            noSignalCount: 0,
            insufficientHistoryCount: 0,
            isSingleDayDataset: true,
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
                Milestone 4 Strategy Engine
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
              Quantitative breakout screener evaluating all-time high proximity and universe relative strength.
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
              <span>{showConfig ? 'Hide Config' : 'Engine Config'}</span>
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

        {/* CONFIGURATION PANEL (EXPLICIT CONFIGURATION DISCLOSURE) */}
        {showConfig && (
          <div className="my-6 p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-blue-600" />
                  Engine Screening Parameters (Configuration Defaults)
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  These adjustable parameters define proximity thresholds and liquidity filters. They represent configurable engine logic, not hardcoded dogma.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <span className="text-[11px] font-semibold text-slate-400 block">Breakout Proximity</span>
                <span className="text-sm font-bold text-slate-800">≤ {config.breakoutTolerancePercent}%</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Distance to high</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <span className="text-[11px] font-semibold text-slate-400 block">Watchlist Proximity</span>
                <span className="text-sm font-bold text-slate-800">≤ {config.watchlistProximityPercent}%</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Near breakout level</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <span className="text-[11px] font-semibold text-slate-400 block">Min Volume</span>
                <span className="text-sm font-bold text-slate-800">{config.minVolume.toLocaleString('en-IN')} shares</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Liquidity filter</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <span className="text-[11px] font-semibold text-slate-400 block">Min Stock Price</span>
                <span className="text-sm font-bold text-slate-800">₹{config.minPrice.toFixed(2)}</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Micro-penny filter</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <span className="text-[11px] font-semibold text-slate-400 block">Allowed Series</span>
                <span className="text-sm font-bold text-slate-800">{config.allowedSeries.join(', ')}</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Equity segments</span>
              </div>
            </div>
          </div>
        )}

        {/* HONEST DATASET NOTICE FOR SINGLE-DAY / LIMITED DATASETS */}
        {engineResult && engineResult.summary.isSingleDayDataset && (
          <div className="my-6 p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-900 text-xs sm:text-sm flex items-start gap-3">
            <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold text-amber-950 block">
                Single-Day Observation Notice ({engineResult.summary.tradingDate})
              </span>
              <p className="text-xs text-amber-800 leading-relaxed">
                The current cloud repository contains 1 trading day. Multi-day rate-of-change momentum will automatically unlock as subsequent NSE Bhavcopies are uploaded. Calculations currently evaluate intraday high breakouts and universe relative strength percentiles against all {engineResult.summary.totalUniverse.toLocaleString('en-IN')} securities.
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
                  Latest Trading Date
                </div>
                <div className="text-lg font-bold text-slate-900 truncate">
                  {engineResult.summary.tradingDate}
                </div>
              </div>

              {/* Universe */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                <div className="flex items-center gap-1.5 text-slate-400 text-xs font-semibold mb-1">
                  <Layers className="w-3.5 h-3.5 text-blue-600" />
                  Universe
                </div>
                <div className="text-lg font-bold text-slate-900">
                  {engineResult.summary.totalUniverse.toLocaleString('en-IN')}
                </div>
              </div>

              {/* Qualified */}
              <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200">
                <div className="flex items-center gap-1.5 text-emerald-800 text-xs font-bold mb-1">
                  <Zap className="w-3.5 h-3.5 text-emerald-600" />
                  Qualified
                </div>
                <div className="text-xl font-extrabold text-emerald-900">
                  {engineResult.summary.qualifiedCount.toLocaleString('en-IN')}
                </div>
              </div>

              {/* Watchlist */}
              <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200">
                <div className="flex items-center gap-1.5 text-amber-800 text-xs font-bold mb-1">
                  <Eye className="w-3.5 h-3.5 text-amber-600" />
                  Watchlist
                </div>
                <div className="text-xl font-extrabold text-amber-900">
                  {engineResult.summary.watchlistCount.toLocaleString('en-IN')}
                </div>
              </div>

              {/* No Signal */}
              <div className="col-span-2 sm:col-span-1 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                <div className="flex items-center gap-1.5 text-slate-400 text-xs font-semibold mb-1">
                  <XCircle className="w-3.5 h-3.5 text-slate-500" />
                  No Signal
                </div>
                <div className="text-lg font-bold text-slate-700">
                  {engineResult.summary.noSignalCount.toLocaleString('en-IN')}
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
                  onClick={() => { setStatusFilter('Qualified'); setCurrentPage(1); }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    statusFilter === 'Qualified'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-emerald-800 hover:bg-emerald-50'
                  }`}
                >
                  Qualified ({engineResult.summary.qualifiedCount.toLocaleString('en-IN')})
                </button>
                <button
                  onClick={() => { setStatusFilter('Watchlist'); setCurrentPage(1); }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    statusFilter === 'Watchlist'
                      ? 'bg-amber-500 text-white shadow-sm'
                      : 'text-amber-800 hover:bg-amber-50'
                  }`}
                >
                  Watchlist ({engineResult.summary.watchlistCount.toLocaleString('en-IN')})
                </button>
                <button
                  onClick={() => { setStatusFilter('No Signal'); setCurrentPage(1); }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    statusFilter === 'No Signal'
                      ? 'bg-slate-700 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  No Signal ({engineResult.summary.noSignalCount.toLocaleString('en-IN')})
                </button>
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
                    <th className="p-3">Series</th>
                    <th className="p-3 text-right">Latest Close</th>
                    <th className="p-3 text-right">Historical High</th>
                    <th className="p-3 text-right">Distance to High</th>
                    <th className="p-3 text-right">Momentum</th>
                    <th className="p-3 text-center">Breakout</th>
                    <th className="p-3 text-center">Relative Strength</th>
                    <th className="p-3 text-center">Blue Sky Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {paginatedSecurities.map((sec) => {
                    const isQualified = sec.status === 'Qualified';
                    const isWatchlist = sec.status === 'Watchlist';

                    return (
                      <tr key={sec.symbol} className="hover:bg-slate-50/80 transition-colors">
                        
                        {/* Symbol */}
                        <td className="p-3 font-bold text-slate-900">
                          {sec.symbol}
                        </td>

                        {/* Series */}
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-mono text-[10px] font-semibold">
                            {sec.series || '—'}
                          </span>
                        </td>

                        {/* Latest Close */}
                        <td className="p-3 text-right font-mono font-bold text-slate-900">
                          ₹{sec.latestClose.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>

                        {/* Historical High */}
                        <td className="p-3 text-right font-mono text-slate-600">
                          ₹{sec.historicalHighestHigh.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>

                        {/* Distance to High */}
                        <td className="p-3 text-right font-mono font-semibold">
                          <span className={`${
                            sec.distanceToHighPercent === 0 
                              ? 'text-emerald-700 font-bold' 
                              : sec.distanceToHighPercent <= 3.0 
                                ? 'text-amber-700 font-semibold' 
                                : 'text-slate-600'
                          }`}>
                            {sec.distanceToHighPercent === 0 ? '0.00% (At High)' : `-${sec.distanceToHighPercent.toFixed(2)}%`}
                          </span>
                        </td>

                        {/* Momentum */}
                        <td className="p-3 text-right font-mono">
                          {sec.recentMomentumPercent !== null ? (
                            <span className={sec.recentMomentumPercent >= 0 ? 'text-emerald-700 font-semibold' : 'text-rose-700'}>
                              {sec.recentMomentumPercent >= 0 ? '+' : ''}{sec.recentMomentumPercent.toFixed(2)}%
                            </span>
                          ) : (
                            <span className="text-slate-400 text-[11px]" title="Single day observation — requires 2+ days for multi-day momentum">
                              — (1 Day)
                            </span>
                          )}
                        </td>

                        {/* Breakout */}
                        <td className="p-3 text-center">
                          <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            sec.breakoutStatus === 'Breakout'
                              ? 'bg-blue-100 text-blue-800 border border-blue-200'
                              : sec.breakoutStatus === 'Near Breakout'
                                ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                : 'bg-slate-100 text-slate-500'
                          }`}>
                            {sec.breakoutStatus}
                          </span>
                        </td>

                        {/* Relative Strength */}
                        <td className="p-3 text-center font-mono">
                          {sec.relativeStrengthPercentile !== null ? (
                            <span className={`text-[11px] font-bold ${
                              sec.relativeStrengthPercentile >= 80 
                                ? 'text-emerald-700' 
                                : sec.relativeStrengthPercentile >= 50 
                                  ? 'text-blue-700' 
                                  : 'text-slate-500'
                            }`}>
                              {sec.relativeStrengthPercentile}th %ile
                            </span>
                          ) : (
                            <span className="text-slate-400">—</span>
                          )}
                        </td>

                        {/* Blue Sky Status */}
                        <td className="p-3 text-center">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide ${
                            isQualified
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : isWatchlist
                                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                : 'bg-slate-100 text-slate-500'
                          }`}>
                            {isQualified && <CheckCircle2 className="w-3 h-3 text-white inline" />}
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
