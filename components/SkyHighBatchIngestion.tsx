'use client';

import React, { useState } from 'react';
import { 
  Layers, 
  Play, 
  Calendar, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  ShieldCheck, 
  Clock, 
  TrendingUp, 
  Sparkles,
  Server,
  StopCircle
} from 'lucide-react';
import { UniversePreset, BatchIngestionReport } from '@/lib/skyhigh/definedgeBatchService';

interface SkyHighBatchIngestionProps {
  onIngestionComplete?: () => void;
}

export default function SkyHighBatchIngestion({ onIngestionComplete }: SkyHighBatchIngestionProps) {
  const [universePreset, setUniversePreset] = useState<UniversePreset>('NIFTY_50');
  const [customSymbolsInput, setCustomSymbolsInput] = useState<string>('');
  
  // Date Range (default: 1 Year)
  const [fromDate, setFromDate] = useState<string>('2025-08-01');
  const [toDate, setToDate] = useState<string>('2026-08-31');

  // Ingestion states
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [progressText, setProgressText] = useState<string>('');
  const [report, setReport] = useState<BatchIngestionReport | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Quick Date Range Presets
  const setQuickRange = (range: '1M' | '1Y' | '5Y') => {
    const end = '2026-08-31';
    setToDate(end);
    if (range === '1M') setFromDate('2026-08-01');
    if (range === '1Y') setFromDate('2025-08-01');
    if (range === '5Y') setFromDate('2021-08-01');
  };

  const startBatchIngestion = async () => {
    try {
      setIsRunning(true);
      setErrorMessage(null);
      setReport(null);
      setProgressText('Initiating market-wide batch historical ingestion...');

      const customSymbols = universePreset === 'CUSTOM'
        ? customSymbolsInput.split(',').map(s => s.trim().toUpperCase()).filter(Boolean)
        : undefined;

      const res = await fetch('/api/skyhigh/definedge/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          universePreset,
          customSymbols,
          fromDate,
          toDate,
          delayMsBetweenRequests: 200,
        }),
      });

      const json = await res.json();

      if (json.success && json.report) {
        setReport(json.report);
        setProgressText('Batch ingestion complete!');
        onIngestionComplete?.();
      } else {
        setErrorMessage(json.error || 'Batch historical ingestion failed.');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Network error during batch ingestion.');
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-betterment transition-all space-y-8">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-bold text-xs uppercase tracking-wider">
              <Layers className="w-3.5 h-3.5 text-blue-600" />
              Market-Scale Pipeline
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Multi-Security Historical Ingestion</span>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
            MARKET-WIDE HISTORICAL INGESTION
          </h3>
          <p className="text-sm text-slate-500 mt-1">
            Automates multi-year historical OHLCV data ingestion across benchmark indices (Nifty 50, Nifty 100, Active Equities) without manual one-by-one security entry.
          </p>
        </div>
      </div>

      {/* CONTROLS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* 1. Universe Selection */}
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              1. Select Universe
            </label>
            <span className="text-[10px] text-slate-400 font-mono">Benchmark Lists</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setUniversePreset('NIFTY_50')}
              className={`p-3 rounded-xl text-left border transition-all ${
                universePreset === 'NIFTY_50'
                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              <span className="text-xs font-bold block">Nifty 50</span>
              <span className={`text-[10px] block mt-0.5 ${universePreset === 'NIFTY_50' ? 'text-blue-100' : 'text-slate-400'}`}>
                Top 50 liquid stocks
              </span>
            </button>

            <button
              type="button"
              onClick={() => setUniversePreset('NIFTY_100')}
              className={`p-3 rounded-xl text-left border transition-all ${
                universePreset === 'NIFTY_100'
                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              <span className="text-xs font-bold block">Nifty 100</span>
              <span className={`text-[10px] block mt-0.5 ${universePreset === 'NIFTY_100' ? 'text-blue-100' : 'text-slate-400'}`}>
                Top 100 large-caps
              </span>
            </button>

            <button
              type="button"
              onClick={() => setUniversePreset('ACTIVE_EQ')}
              className={`p-3 rounded-xl text-left border transition-all ${
                universePreset === 'ACTIVE_EQ'
                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              <span className="text-xs font-bold block">Active Equities</span>
              <span className={`text-[10px] block mt-0.5 ${universePreset === 'ACTIVE_EQ' ? 'text-blue-100' : 'text-slate-400'}`}>
                All primary NSE cash
              </span>
            </button>

            <button
              type="button"
              onClick={() => setUniversePreset('CUSTOM')}
              className={`p-3 rounded-xl text-left border transition-all ${
                universePreset === 'CUSTOM'
                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              <span className="text-xs font-bold block">Custom List</span>
              <span className={`text-[10px] block mt-0.5 ${universePreset === 'CUSTOM' ? 'text-blue-100' : 'text-slate-400'}`}>
                Specific symbols
              </span>
            </button>
          </div>

          {universePreset === 'CUSTOM' && (
            <div className="pt-2">
              <label className="text-[10px] font-bold text-slate-600 block mb-1">Enter Comma-Separated Symbols</label>
              <input
                type="text"
                value={customSymbolsInput}
                onChange={(e) => setCustomSymbolsInput(e.target.value)}
                placeholder="RELIANCE, TCS, INFY, HDFCBANK, ICICIBANK"
                className="w-full text-xs font-mono p-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500"
              />
            </div>
          )}
        </div>

        {/* 2. Historical Interval */}
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              2. Historical Interval
            </label>
            <span className="text-[10px] text-slate-400 font-mono">Date Range</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setQuickRange('1M')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                fromDate === '2026-08-01'
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              1 Month (~21d)
            </button>
            <button
              type="button"
              onClick={() => setQuickRange('1Y')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                fromDate === '2025-08-01'
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              1 Year (~250d)
            </button>
            <button
              type="button"
              onClick={() => setQuickRange('5Y')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                fromDate === '2021-08-01'
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              5 Years (~1,250d)
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2">
            <div>
              <span className="text-[10px] font-semibold text-slate-400 block mb-1">From Date</span>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-full text-xs font-semibold p-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <span className="text-[10px] font-semibold text-slate-400 block mb-1">To Date</span>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="w-full text-xs font-semibold p-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* 3. Execution Action */}
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
              3. Execution Summary
            </span>
            <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
              <div><span className="text-slate-400">Target Universe:</span> <strong className="text-slate-800">{universePreset}</strong></div>
              <div><span className="text-slate-400">Historical Range:</span> <strong className="text-blue-700 font-mono">{fromDate} → {toDate}</strong></div>
              <div><span className="text-slate-400">Pacing:</span> <span className="text-slate-700">200ms per request (rate-limit safe)</span></div>
            </div>
          </div>

          <button
            type="button"
            onClick={startBatchIngestion}
            disabled={isRunning}
            className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer hover:shadow-glow-royal"
          >
            {isRunning ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Ingesting Market Dataset...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span>Start Market-Wide Ingestion</span>
              </>
            )}
          </button>
        </div>

      </div>

      {/* RUNNING STATUS */}
      {isRunning && (
        <div className="p-6 rounded-2xl bg-blue-50 border border-blue-200 text-center space-y-3">
          <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-bold text-blue-900">{progressText}</p>
          <p className="text-xs text-blue-700">
            Ingesting records into Supabase cloud repository. Previous trading dates are safely preserved.
          </p>
        </div>
      )}

      {/* ERROR MESSAGE */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* BATCH REPORT */}
      {report && !isRunning && (
        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Batch Ingestion Report ({report.universePreset})
            </span>
            <span className="text-xs text-slate-400 font-mono">
              {report.startedAt.slice(11, 19)} → {report.completedAt.slice(11, 19)}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="p-3 bg-white rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Securities Processed</span>
              <span className="text-lg font-bold text-slate-900">{report.succeededSecurities} / {report.totalSecurities}</span>
              <span className="text-[10px] text-emerald-600 block mt-0.5">Succeeded</span>
            </div>

            <div className="p-3 bg-white rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Rows Received</span>
              <span className="text-lg font-bold text-blue-700">{report.totalRowsReceived.toLocaleString('en-IN')}</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">From Definedge API</span>
            </div>

            <div className="p-3 bg-white rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Rows Inserted</span>
              <span className="text-lg font-bold text-emerald-700">{report.totalRowsInserted.toLocaleString('en-IN')}</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">To Supabase Cloud</span>
            </div>

            <div className="p-3 bg-white rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Duplicates Skipped</span>
              <span className="text-lg font-bold text-slate-600">{report.totalDuplicatesSkipped.toLocaleString('en-IN')}</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Already in repository</span>
            </div>

            <div className="p-3 bg-white rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Rows Rejected</span>
              <span className="text-lg font-bold text-rose-700">{report.totalRowsRejected}</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Malformed</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
