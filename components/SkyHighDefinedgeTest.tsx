'use client';

import React, { useState, useEffect } from 'react';
import { 
  Database, 
  Search, 
  Calendar, 
  CheckCircle2, 
  AlertCircle, 
  Layers, 
  Server, 
  RefreshCw, 
  Key, 
  ShieldCheck, 
  ArrowRight,
  Sparkles,
  Info,
  Clock,
  TrendingUp,
  FileCheck
} from 'lucide-react';

interface DefinedgeSecurity {
  segment: string;
  token: string;
  symbol: string;
  tradingsym: string;
  series: string;
  company: string;
}

interface DefinedgeIngestionReport {
  success: boolean;
  symbol: string;
  token: string;
  tradingsym: string;
  series: string;
  company: string;
  fromDate: string;
  toDate: string;
  recordsReceived: number;
  recordsInserted: number;
  recordsSkipped: number;
  recordsRejected: number;
  source: string;
  cloudVerification: {
    verified: boolean;
    persistedTotalForSymbol: number;
    sampleDate?: string;
    sampleClose?: number;
  };
  error?: string;
  barsPreview?: Array<{
    trading_date: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
  }>;
}

interface SkyHighDefinedgeTestProps {
  onIngestionComplete?: () => void;
}

export default function SkyHighDefinedgeTest({ onIngestionComplete }: SkyHighDefinedgeTestProps) {
  const [masterTotal, setMasterTotal] = useState<number | null>(null);
  const [hasEnvKey, setHasEnvKey] = useState<boolean>(false);
  const [isLoadingStatus, setIsLoadingStatus] = useState<boolean>(true);

  // Form states
  const [symbol, setSymbol] = useState<string>('RELIANCE');
  const [token, setToken] = useState<string>('2885');
  const [companyName, setCompanyName] = useState<string>('RELIANCE INDUSTRIES LTD');
  const [fromDate, setFromDate] = useState<string>('2024-01-01');
  const [toDate, setToDate] = useState<string>('2024-01-15');
  const [sessionKey, setSessionKey] = useState<string>('');

  // Autocomplete search states
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<DefinedgeSecurity[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);

  // Execution states
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [report, setReport] = useState<DefinedgeIngestionReport | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Load Definedge master file status & environment check
  useEffect(() => {
    async function checkStatus() {
      try {
        setIsLoadingStatus(true);
        const res = await fetch('/api/skyhigh/definedge/status');
        const data = await res.json();
        if (data.status === 'ok') {
          setMasterTotal(data.masterFile.totalSymbols);
          setHasEnvKey(data.hasEnvSessionKey);
        }
      } catch (err) {
        console.warn('⚠️ [DEFINEDGE STATUS LOAD ERROR]:', err);
      } finally {
        setIsLoadingStatus(false);
      }
    }
    checkStatus();
  }, []);

  // Search autocomplete handler
  const handleSearch = async (val: string) => {
    setSearchQuery(val);
    if (!val.trim()) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }
    try {
      setIsSearching(true);
      const res = await fetch(`/api/skyhigh/definedge/search?q=${encodeURIComponent(val)}&limit=8`);
      const data = await res.json();
      setSearchResults(data.results || []);
      setShowDropdown(true);
    } catch (err) {
      console.warn('⚠️ [SEARCH ERROR]:', err);
    } finally {
      setIsSearching(false);
    }
  };

  const selectSecurity = (sec: DefinedgeSecurity) => {
    setSymbol(sec.symbol);
    setToken(sec.token);
    setCompanyName(sec.company);
    setSearchQuery('');
    setShowDropdown(false);
  };

  const executeIngestion = async () => {
    try {
      setIsExecuting(true);
      setErrorMessage(null);
      setReport(null);

      const res = await fetch('/api/skyhigh/definedge/history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symbol,
          token,
          fromDate,
          toDate,
          sessionKey: sessionKey.trim() || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || `HTTP ${res.status}: Failed to fetch historical data.`);
      }

      setReport(data);
      if (onIngestionComplete) {
        onIngestionComplete();
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Error occurred during Definedge historical ingestion.');
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-betterment transition-all space-y-8">
      
      {/* 1. HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-bold text-xs uppercase tracking-wider">
              <Server className="w-3.5 h-3.5 text-blue-600" />
              Phase 4: Definedge Historical Ingestion
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>NSE Master Mapped ({masterTotal ? masterTotal.toLocaleString('en-IN') : 'Loading...'} tokens)</span>
            </div>
          </div>

          <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
            DEFINEDGE HISTORICAL DATA INTEGRATION
          </h3>
          <p className="text-sm text-slate-500 mt-1">
            Connects to Definedge Securities API (<code className="text-xs font-mono bg-slate-100 px-1 py-0.5 rounded">data.definedgesecurities.com</code>) to ingest multi-year NSE daily historical OHLCV data.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border ${
            hasEnvKey 
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
              : 'bg-amber-50 text-amber-800 border-amber-200'
          }`}>
            <Key className="w-3.5 h-3.5" />
            {hasEnvKey ? 'Server Env Key Configured' : 'Session Key Required'}
          </span>
        </div>
      </div>

      {/* 2. TEST CONTROLS & INGESTION FORM */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Security Selection */}
        <div className="space-y-4 lg:col-span-2 bg-slate-50 p-6 rounded-2xl border border-slate-200">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Select NSE Security
            </label>
            <span className="text-[11px] text-slate-400">Tokens dynamically resolved from Definedge Master</span>
          </div>

          {/* Quick select buttons */}
          <div className="flex flex-wrap gap-2">
            {[
              { sym: 'RELIANCE', tok: '2885', comp: 'RELIANCE INDUSTRIES LTD' },
              { sym: 'TCS', tok: '11536', comp: 'TATA CONSULTANCY SERV LT' },
              { sym: 'INFY', tok: '1594', comp: 'INFOSYS LIMITED' },
              { sym: 'HDFCBANK', tok: '1333', comp: 'HDFC BANK LTD' },
              { sym: 'ICICIBANK', tok: '4963', comp: 'ICICI BANK LTD.' },
            ].map((item) => (
              <button
                key={item.sym}
                type="button"
                onClick={() => {
                  setSymbol(item.sym);
                  setToken(item.tok);
                  setCompanyName(item.comp);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                  symbol === item.sym 
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm' 
                    : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                {item.sym} <span className="opacity-70 text-[10px]">({item.tok})</span>
              </button>
            ))}
          </div>

          {/* Autocomplete Search */}
          <div className="relative pt-2">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Or search any of 9,800+ NSE symbols or companies..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 font-semibold text-slate-800"
              />
            </div>

            {/* Dropdown */}
            {showDropdown && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 z-30 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-48 overflow-y-auto divide-y divide-slate-100">
                {searchResults.map((sec) => (
                  <button
                    key={`${sec.token}_${sec.symbol}`}
                    type="button"
                    onClick={() => selectSecurity(sec)}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-slate-50 flex items-center justify-between"
                  >
                    <div>
                      <span className="font-bold text-slate-900">{sec.symbol}</span>
                      <span className="text-slate-400 text-[11px] ml-2">{sec.company}</span>
                    </div>
                    <span className="text-[10px] font-mono font-semibold bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                      Token: {sec.token}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Active Selection Details */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3 bg-white rounded-xl border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Active Symbol</span>
              <span className="text-sm font-bold text-blue-700">{symbol}</span>
            </div>
            <div className="p-3 bg-white rounded-xl border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Definedge Token</span>
              <span className="text-sm font-bold text-slate-900 font-mono">{token}</span>
            </div>
            <div className="col-span-2 sm:col-span-1 p-3 bg-white rounded-xl border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Security Name</span>
              <span className="text-xs font-semibold text-slate-700 truncate block" title={companyName}>
                {companyName}
              </span>
            </div>
          </div>
        </div>

        {/* Date Range & Authentication */}
        <div className="space-y-4 bg-slate-50 p-6 rounded-2xl border border-slate-200 flex flex-col justify-between">
          <div className="space-y-4">
            <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
              Historical Date Range
            </label>

            <div className="grid grid-cols-2 gap-2">
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

            {/* Session Key Input (if not configured in env) */}
            <div>
              <span className="text-[10px] font-semibold text-slate-400 block mb-1 flex items-center justify-between">
                <span>API Session Key</span>
                {hasEnvKey && (
                  <span className="text-[10px] text-emerald-600 font-bold">Auto (Server Env)</span>
                )}
              </span>
              <input
                type="password"
                placeholder={hasEnvKey ? "Using server DEFINEDGE_API_SESSION_KEY" : "Paste Definedge api_session_key"}
                value={sessionKey}
                onChange={(e) => setSessionKey(e.target.value)}
                className="w-full text-xs font-mono p-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500"
              />
              <span className="text-[10px] text-slate-400 block mt-1">
                Keys are never exposed client-side or stored in public repos.
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={executeIngestion}
            disabled={isExecuting || !symbol || !token}
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isExecuting ? 'animate-spin' : ''}`} />
            <span>{isExecuting ? 'Fetching Definedge Historical Data...' : 'Fetch & Ingest Definedge Data'}</span>
          </button>
        </div>

      </div>

      {/* 3. ERROR MESSAGE */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold block">Definedge Ingestion Error</span>
            <p className="text-xs text-rose-700 leading-relaxed">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* 4. REAL INGESTION REPORT CARD (VERIFICATION SUMMARY) */}
      {report && (
        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-200 text-xs font-bold mb-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Definedge Historical Ingestion Complete
              </div>
              <h4 className="text-lg font-bold text-slate-900">
                {report.symbol} ({report.company})
              </h4>
              <p className="text-xs text-slate-500">
                Date Range: <span className="font-mono font-semibold text-slate-700">{report.fromDate}</span> to <span className="font-mono font-semibold text-slate-700">{report.toDate}</span> • Token: <span className="font-mono font-semibold text-slate-700">{report.token}</span>
              </p>
            </div>

            <div className="text-right">
              <span className="text-[11px] font-semibold text-slate-400 block">Cloud Persistence Status</span>
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Cloud Verified ✓ ({report.cloudVerification.persistedTotalForSymbol} total records in Supabase)
              </span>
            </div>
          </div>

          {/* Test Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="p-3.5 bg-white rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Records Received</span>
              <span className="text-lg font-bold text-slate-900">{report.recordsReceived}</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">from Definedge API</span>
            </div>

            <div className="p-3.5 bg-white rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold uppercase text-emerald-700 block">Records Inserted</span>
              <span className="text-lg font-extrabold text-emerald-700">{report.recordsInserted}</span>
              <span className="text-[10px] text-emerald-600 block mt-0.5">new rows saved</span>
            </div>

            <div className="p-3.5 bg-white rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold uppercase text-amber-700 block">Skipped Duplicates</span>
              <span className="text-lg font-bold text-amber-700">{report.recordsSkipped}</span>
              <span className="text-[10px] text-amber-600 block mt-0.5">already existed</span>
            </div>

            <div className="p-3.5 bg-white rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold uppercase text-rose-700 block">Rejected Records</span>
              <span className="text-lg font-bold text-slate-700">{report.recordsRejected}</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">malformed bars</span>
            </div>

            <div className="p-3.5 bg-white rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold uppercase text-blue-700 block">Source Tag</span>
              <span className="text-xs font-bold text-blue-900 block truncate">{report.source}</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">source_file column</span>
            </div>
          </div>

          {/* Preview of Ingested Bars */}
          {report.barsPreview && report.barsPreview.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Recent Ingested Daily Bars Preview (OHLCV)
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  Showing {report.barsPreview.length} samples
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
                  <thead className="bg-slate-100 text-slate-600 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="p-2.5">Trading Date</th>
                      <th className="p-2.5 text-right">Open</th>
                      <th className="p-2.5 text-right">High</th>
                      <th className="p-2.5 text-right">Low</th>
                      <th className="p-2.5 text-right">Close</th>
                      <th className="p-2.5 text-right">Volume</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white font-mono">
                    {report.barsPreview.map((bar) => (
                      <tr key={bar.trading_date} className="hover:bg-slate-50">
                        <td className="p-2.5 font-bold text-slate-900">{bar.trading_date}</td>
                        <td className="p-2.5 text-right text-slate-700">₹{bar.open.toFixed(2)}</td>
                        <td className="p-2.5 text-right text-emerald-700 font-semibold">₹{bar.high.toFixed(2)}</td>
                        <td className="p-2.5 text-right text-rose-700">₹{bar.low.toFixed(2)}</td>
                        <td className="p-2.5 text-right font-bold text-slate-900">₹{bar.close.toFixed(2)}</td>
                        <td className="p-2.5 text-right text-slate-600">{bar.volume.toLocaleString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      )}

      {/* 5. NOTICE ON ZERO-MOCK AND PIPELINE PRESERVATION */}
      <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200/80 flex items-start gap-3 text-xs text-slate-600">
        <ShieldCheck className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <span className="font-bold text-slate-800 block">Multi-Source Historical Persistence Model</span>
          <p className="leading-relaxed">
            Historical records ingested from Definedge Securities API are tagged with <code className="bg-white px-1 py-0.2 rounded font-mono text-blue-800">source_file: "Definedge Historical"</code>, while daily uploads maintain their individual CSV filenames. The uniqueness model <code className="bg-white px-1 py-0.2 rounded font-mono text-slate-700">(symbol, trading_date)</code> prevents duplicate rows across sources.
          </p>
        </div>
      </div>

    </div>
  );
}
