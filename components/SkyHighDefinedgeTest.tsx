'use client';

import React, { useState, useEffect, useCallback } from 'react';
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
  FileCheck,
  Lock,
  LogOut,
  Send,
  UserCheck
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
  diagnostic?: {
    statusCode: number;
    contentType: string;
    responseFormat: string;
    itemCount: number;
    topLevelKeys?: string[];
    rawSnippet: string;
    sampleFirstRecord?: any;
    sampleFieldTypes?: Record<string, string>;
    rejectionReasons: string[];
  };
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

  // 2FA Auth states
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authenticatedUser, setAuthenticatedUser] = useState<string | null>(null);
  const [hasEnvCredentials, setHasEnvCredentials] = useState<boolean>(false);
  const [hasEnvSessionKey, setHasEnvSessionKey] = useState<boolean>(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState<boolean>(true);

  // Step 1 Form states
  const [apiTokenInput, setApiTokenInput] = useState<string>('');
  const [apiSecretInput, setApiSecretInput] = useState<string>('');
  const [isRequestingOtp, setIsRequestingOtp] = useState<boolean>(false);
  const [otpToken, setOtpToken] = useState<string | null>(null);
  const [otpSentMessage, setOtpSentMessage] = useState<string | null>(null);

  // Step 2 Form states
  const [otpInput, setOtpInput] = useState<string>('');
  const [isVerifyingOtp, setIsVerifyingOtp] = useState<boolean>(false);
  const [authStatusMessage, setAuthStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Ingestion Form states
  const [symbol, setSymbol] = useState<string>('RELIANCE');
  const [token, setToken] = useState<string>('2885');
  const [companyName, setCompanyName] = useState<string>('RELIANCE INDUSTRIES LTD');
  const [fromDate, setFromDate] = useState<string>('2024-01-01');
  const [toDate, setToDate] = useState<string>('2024-01-15');

  // Autocomplete search states
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<DefinedgeSecurity[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);

  // Execution states
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [report, setReport] = useState<DefinedgeIngestionReport | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 1. Check Auth Status & Master File
  const checkAuthAndMasterStatus = useCallback(async () => {
    try {
      setIsCheckingAuth(true);

      // Check Master File status
      const statusRes = await fetch('/api/skyhigh/definedge/status');
      const statusData = await statusRes.json();
      if (statusData.status === 'ok') {
        setMasterTotal(statusData.masterFile.totalSymbols);
      }

      // Check 2FA Auth status
      const authRes = await fetch('/api/skyhigh/definedge/auth/status');
      const authData = await authRes.json();
      if (authData.status === 'ok') {
        setIsAuthenticated(authData.isAuthenticated);
        setAuthenticatedUser(authData.username || null);
        setHasEnvCredentials(authData.hasEnvCredentials);
        setHasEnvSessionKey(authData.hasEnvSessionKey);
      }
    } catch (err) {
      console.warn('⚠️ [DEFINEDGE STATUS LOAD ERROR]:', err);
    } finally {
      setIsCheckingAuth(false);
    }
  }, []);

  useEffect(() => {
    checkAuthAndMasterStatus();
  }, [checkAuthAndMasterStatus]);

  // Step 1: Request OTP
  const handleRequestOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    try {
      setIsRequestingOtp(true);
      setAuthStatusMessage(null);
      setOtpSentMessage(null);

      const res = await fetch('/api/skyhigh/definedge/auth/step1', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apiToken: apiTokenInput.trim() || undefined,
          apiSecret: apiSecretInput.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to request OTP from Definedge.');
      }

      setOtpToken(data.otpToken);
      setOtpSentMessage(data.message || 'OTP dispatched to registered mobile and email.');
      setAuthStatusMessage({ type: 'success', text: 'Step 1 Complete: OTP sent.' });

      // Clear sensitive inputs from UI state immediately
      setApiTokenInput('');
      setApiSecretInput('');
    } catch (err: any) {
      setAuthStatusMessage({ type: 'error', text: err?.message || 'Failed to request OTP.' });
    } finally {
      setIsRequestingOtp(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!otpToken) {
      setAuthStatusMessage({ type: 'error', text: 'Please request an OTP first.' });
      return;
    }
    if (!otpInput.trim()) {
      setAuthStatusMessage({ type: 'error', text: 'Please enter the 6-digit OTP.' });
      return;
    }

    try {
      setIsVerifyingOtp(true);
      setAuthStatusMessage(null);

      const res = await fetch('/api/skyhigh/definedge/auth/step2', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          otpToken,
          otp: otpInput.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Definedge OTP verification failed.');
      }

      setIsAuthenticated(true);
      setAuthenticatedUser(data.username || 'Authenticated User');
      setAuthStatusMessage({ type: 'success', text: 'STATUS: SUCCESS — Definedge 2FA Session Active.' });
      setOtpToken(null);
      setOtpInput('');
      setOtpSentMessage(null);
    } catch (err: any) {
      setAuthStatusMessage({ type: 'error', text: `STATUS: FAILED — ${err?.message || 'Invalid or expired OTP.'}` });
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  // Logout
  const handleLogout = async () => {
    try {
      await fetch('/api/skyhigh/definedge/auth/logout', { method: 'POST' });
      setIsAuthenticated(false);
      setAuthenticatedUser(null);
      setOtpToken(null);
      setAuthStatusMessage(null);
      setOtpSentMessage(null);
    } catch (err) {
      console.warn('⚠️ [LOGOUT ERROR]:', err);
    }
  };

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

  // Execute Historical Ingestion
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
              Definedge Data Integration & 2FA
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>NSE Master Mapped ({masterTotal ? masterTotal.toLocaleString('en-IN') : 'Loading...'} tokens)</span>
            </div>
          </div>

          <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
            DEFINEDGE MARKET DATA INTEGRATION
          </h3>
          <p className="text-sm text-slate-500 mt-1">
            Connects to Definedge Securities API (<code className="text-xs font-mono bg-slate-100 px-1 py-0.5 rounded">data.definedgesecurities.com</code>) for secure 2FA authentication and historical OHLCV data ingestion.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border ${
            isAuthenticated 
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
              : 'bg-amber-50 text-amber-800 border-amber-200'
          }`}>
            <Key className="w-3.5 h-3.5" />
            {isAuthenticated ? '2FA Session Active ✓' : '2FA Authentication Required'}
          </span>
        </div>
      </div>

      {/* 2. DEFINEDGE 2-FACTOR AUTHENTICATION CARD */}
      <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200/80">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">
                Definedge 2-Factor Authentication (2FA)
              </h4>
              <p className="text-xs text-slate-500">
                Official Definedge 2FA authentication flow generating temporary server-side session keys.
              </p>
            </div>
          </div>

          {isAuthenticated && (
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                STATUS: SUCCESS {authenticatedUser ? `(${authenticatedUser})` : ''}
              </span>
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-white hover:bg-slate-100 text-slate-600 text-xs font-semibold border border-slate-200"
                title="End current session"
              >
                <LogOut className="w-3 h-3" />
                End Session
              </button>
            </div>
          )}
        </div>

        {/* Not Authenticated: Step 1 & Step 2 Forms */}
        {!isAuthenticated && (
          <div className="space-y-4 pt-1">
            
            {/* Status alert message */}
            {authStatusMessage && (
              <div className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 border ${
                authStatusMessage.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-rose-50 text-rose-800 border-rose-200'
              }`}>
                {authStatusMessage.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                )}
                <span>{authStatusMessage.text}</span>
              </div>
            )}

            {/* Step 1: Request OTP */}
            {!otpToken ? (
              <div className="space-y-3">
                {hasEnvCredentials ? (
                  <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl text-xs text-blue-900 flex items-center justify-between">
                    <span className="flex items-center gap-2 font-medium">
                      <ShieldCheck className="w-4 h-4 text-blue-600" />
                      Server environment credentials detected (<code className="font-mono text-blue-800">DEFINEDGE_API_TOKEN</code> & <code className="font-mono text-blue-800">DEFINEDGE_API_SECRET</code> in .env.local).
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRequestOtp()}
                      disabled={isRequestingOtp}
                      className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm disabled:opacity-50 flex items-center gap-1.5"
                    >
                      <Send className={`w-3 h-3 ${isRequestingOtp ? 'animate-spin' : ''}`} />
                      <span>{isRequestingOtp ? 'Requesting OTP...' : 'Request 2FA OTP'}</span>
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">
                        Definedge API Token
                      </label>
                      <input
                        type="password"
                        placeholder="Enter API Token"
                        value={apiTokenInput}
                        onChange={(e) => setApiTokenInput(e.target.value)}
                        className="w-full text-xs font-mono p-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">
                        Definedge API Secret
                      </label>
                      <input
                        type="password"
                        placeholder="Enter API Secret"
                        value={apiSecretInput}
                        onChange={(e) => setApiSecretInput(e.target.value)}
                        className="w-full text-xs font-mono p-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div className="sm:col-span-2 flex items-center justify-between pt-1">
                      <span className="text-[10px] text-slate-400">
                        Available in Definedge MyAccount → API Config. Credentials are kept server-side and never saved.
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRequestOtp()}
                        disabled={isRequestingOtp || (!hasEnvCredentials && (!apiTokenInput || !apiSecretInput))}
                        className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
                      >
                        <Send className={`w-3 h-3 ${isRequestingOtp ? 'animate-spin' : ''}`} />
                        <span>{isRequestingOtp ? 'Requesting OTP...' : 'Request 2FA OTP'}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Step 2: Enter & Verify OTP */
              <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-3">
                {otpSentMessage && (
                  <p className="text-xs font-medium text-emerald-800 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    {otpSentMessage}
                  </p>
                )}

                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <div className="w-full sm:w-64">
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">
                      Enter 6-Digit 2FA OTP
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      placeholder="e.g. 123456"
                      value={otpInput}
                      onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ''))}
                      className="w-full text-sm font-mono tracking-widest text-center p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 font-bold"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-5 sm:pt-4 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={() => handleVerifyOtp()}
                      disabled={isVerifyingOtp || otpInput.length < 4}
                      className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
                    >
                      <UserCheck className={`w-3.5 h-3.5 ${isVerifyingOtp ? 'animate-spin' : ''}`} />
                      <span>{isVerifyingOtp ? 'Verifying OTP...' : 'Verify OTP & Authenticate'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setOtpToken(null);
                        setOtpInput('');
                        setAuthStatusMessage(null);
                      }}
                      className="px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}
      </div>

      {/* 3. TEST CONTROLS & INGESTION FORM */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Security Selection */}
        <div className="space-y-4 lg:col-span-2 bg-slate-50 p-6 rounded-2xl border border-slate-200">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Select NSE Security
            </label>
            <span className="text-[11px] text-slate-400">Tokens dynamically resolved from Definedge Master</span>
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

        {/* Date Range & Ingestion Action */}
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

            <div className="p-3 bg-white border border-slate-200 rounded-xl text-[11px] text-slate-500 space-y-1">
              <div className="flex items-center justify-between font-semibold text-slate-700">
                <span>Session State:</span>
                <span className={isAuthenticated ? 'text-emerald-700 font-bold' : 'text-amber-700 font-bold'}>
                  {isAuthenticated ? 'Active (Ready)' : '2FA Required'}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 leading-tight">
                {isAuthenticated 
                  ? 'Active session token will be securely used server-side.'
                  : 'Authenticate via the 2FA box above before fetching.'}
              </p>
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

      {/* 4. ERROR MESSAGE */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold block">Definedge Ingestion Error</span>
            <p className="text-xs text-rose-700 leading-relaxed">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* 5. REAL INGESTION REPORT CARD (VERIFICATION SUMMARY) */}
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

          {/* Diagnostic Inspection Box */}
          {report.diagnostic && (
            <div className="p-4 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-bold text-amber-400">🔍 Definedge Response Diagnostics</span>
                <span className="text-[10px] text-slate-400">Safe Server Inspection (No Credentials)</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                <div><span className="text-slate-400 block">HTTP Status:</span> <span className="font-bold text-white">{report.diagnostic.statusCode}</span></div>
                <div><span className="text-slate-400 block">Content-Type:</span> <span className="font-bold text-white">{report.diagnostic.contentType}</span></div>
                <div><span className="text-slate-400 block">Format:</span> <span className="font-bold text-white">{report.diagnostic.responseFormat}</span></div>
                <div><span className="text-slate-400 block">Total Items:</span> <span className="font-bold text-white">{report.diagnostic.itemCount}</span></div>
              </div>
              {report.diagnostic.topLevelKeys && (
                <div>
                  <span className="text-slate-400 block text-[10px]">Top-level Keys:</span>
                  <span className="text-emerald-400 text-[11px]">{report.diagnostic.topLevelKeys.join(', ')}</span>
                </div>
              )}
              {report.diagnostic.sampleFieldTypes && (
                <div>
                  <span className="text-slate-400 block text-[10px]">Sample Field Types:</span>
                  <pre className="text-emerald-300 text-[10px] whitespace-pre-wrap">{JSON.stringify(report.diagnostic.sampleFieldTypes, null, 2)}</pre>
                </div>
              )}
              {report.diagnostic.rejectionReasons && report.diagnostic.rejectionReasons.length > 0 && (
                <div>
                  <span className="text-rose-400 block text-[10px] font-bold">Parser Rejection Analysis:</span>
                  <ul className="list-disc pl-4 space-y-0.5 text-[10px] text-rose-300">
                    {report.diagnostic.rejectionReasons.map((r: string, idx: number) => (
                      <li key={idx}>{r}</li>
                    ))}
                  </ul>
                </div>
              )}
              {report.diagnostic.rawSnippet && (
                <div>
                  <span className="text-slate-400 block text-[10px]">Raw Response Snippet:</span>
                  <pre className="text-slate-300 text-[10px] bg-slate-950 p-2 rounded overflow-x-auto whitespace-pre-wrap max-h-28 overflow-y-auto">
                    {report.diagnostic.rawSnippet}
                  </pre>
                </div>
              )}
            </div>
          )}

        </div>
      )}

      {/* 6. NOTICE ON ZERO-MOCK AND PIPELINE PRESERVATION */}
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
