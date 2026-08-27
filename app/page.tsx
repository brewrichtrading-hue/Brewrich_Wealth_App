'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Shield, 
  TrendingUp, 
  Sparkles, 
  ArrowRight, 
  BarChart3, 
  CheckCircle2, 
  Lock, 
  PieChart, 
  GraduationCap, 
  ChevronRight, 
  Zap,
  Clock,
  Target,
  Award,
  Users,
  ArrowUpRight,
  ShieldCheck,
  Percent
} from 'lucide-react';

export default function HomePage() {
  const [sipAmount, setSipAmount] = useState<number>(25000);
  const [tenureYears, setTenureYears] = useState<number>(15);
  const expectedReturn = 14.5; // Institutional CAGR

  // Calculate compound return: FV = P * [((1 + r)^n - 1) / r] * (1 + r)
  const monthlyRate = expectedReturn / 12 / 100;
  const totalMonths = tenureYears * 12;
  const investedAmount = sipAmount * totalMonths;
  const futureValue = Math.round(
    sipAmount *
      ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) *
      (1 + monthlyRate)
  );
  const wealthGained = futureValue - investedAmount;

  return (
    <div className="flex flex-col w-full overflow-hidden bg-slate-50">
      
      {/* 1. CINEMATIC ROYAL BLUE HERO SECTION (BETTERMENT STYLE) */}
      <section className="relative bg-gradient-to-b from-[#0A358F] via-[#0D44B8] to-[#1456F0] text-white pt-16 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        
        {/* Subtle Ambient Shapes */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl pointer-events-none -z-0" />
        <div className="absolute bottom-0 left-10 w-[400px] h-[400px] bg-blue-400/10 rounded-full blur-3xl pointer-events-none -z-0" />

        <div className="relative z-10 mx-auto max-w-5xl text-center space-y-8">
          
          {/* Regulatory & Institutional Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold uppercase tracking-wider text-blue-100 shadow-sm">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            <span>AMFI Registered Mutual Fund Distributor & Institutional Desk</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] text-white">
            Institutional Wealth & <br className="hidden sm:inline" />
            <span className="text-white drop-shadow-sm">
              Disciplined Compounding.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mx-auto max-w-2xl text-base sm:text-xl text-blue-100 font-normal leading-relaxed">
            Automated, hands-off portfolio growth through top-tier mutual fund baskets or elite mentorship to trade with institutional order flow algorithms.
          </p>

          {/* DUAL PRIMARY CALL TO ACTION BUTTONS (PILL SHAPED) */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4 pt-2 max-w-xl mx-auto">
            
            {/* Button 1: Manage My Wealth (Routes to /mfd) */}
            <Link
              href="/mfd"
              className="btn-interactive flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-white text-blue-900 font-extrabold text-base shadow-xl shadow-blue-950/30 hover:bg-blue-50 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <PieChart className="h-5 w-5 text-blue-700" />
              <span>Manage My Wealth</span>
              <ArrowRight className="h-5 w-5 text-blue-700" />
            </Link>

            {/* Button 2: Become Your Own Fund Manager (Routes to /miip) */}
            <Link
              href="/miip"
              className="btn-interactive flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-blue-800/80 hover:bg-blue-800 text-white font-extrabold text-base border border-white/20 shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <GraduationCap className="h-5 w-5 text-amber-300" />
              <span>Become Your Own Fund Manager</span>
              <ChevronRight className="h-5 w-5 opacity-80" />
            </Link>

          </div>

          {/* FLOATING MICRO-WIDGET TICKER STRIP (FINTECH DASHBOARD FEEL) */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs text-white">
              <span className="font-bold">NIFTY50 ETF</span>
              <span className="text-emerald-300 font-bold bg-emerald-500/20 px-2 py-0.5 rounded-full">+1.42%</span>
            </div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs text-white">
              <span className="font-bold">GOLDBEES</span>
              <span className="text-emerald-300 font-bold bg-emerald-500/20 px-2 py-0.5 rounded-full">+0.85%</span>
            </div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs text-white">
              <span className="font-bold">SILVERBEES</span>
              <span className="text-emerald-300 font-bold bg-emerald-500/20 px-2 py-0.5 rounded-full">+2.10%</span>
            </div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs text-white">
              <span className="font-bold">MON100 NASDAQ</span>
              <span className="text-emerald-300 font-bold bg-emerald-500/20 px-2 py-0.5 rounded-full">+1.95%</span>
            </div>
          </div>

        </div>
      </section>

      {/* 2. INSTITUTIONAL METRICS OVERLAY WRAPPER */}
      <section className="-mt-10 px-4 sm:px-6 lg:px-8 relative z-20">
        <div className="mx-auto max-w-5xl rounded-3xl bg-white p-6 sm:p-8 shadow-xl shadow-slate-200/60 border border-slate-100">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
            <div className="pt-2 sm:pt-0">
              <p className="text-2xl sm:text-3xl font-extrabold text-blue-700">₹140Cr+</p>
              <p className="text-xs text-slate-500 mt-1 uppercase font-bold tracking-wider">AUM & Capital Advised</p>
            </div>
            <div className="pt-4 sm:pt-0">
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">94.2%</p>
              <p className="text-xs text-slate-500 mt-1 uppercase font-bold tracking-wider">Order Execution Rate</p>
            </div>
            <div className="pt-4 sm:pt-0">
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">4.9 / 5.0</p>
              <p className="text-xs text-slate-500 mt-1 uppercase font-bold tracking-wider">Investor Rating</p>
            </div>
            <div className="pt-4 sm:pt-0">
              <p className="text-2xl sm:text-3xl font-extrabold text-emerald-600">100%</p>
              <p className="text-xs text-slate-500 mt-1 uppercase font-bold tracking-wider">SEBI Regulated</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. TWO PILLARS OF BREWRICH WEALTH (BETTERMENT CARD ARCHITECTURE) */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-widest text-blue-600">
              Tailored Architecture
            </h2>
            <h3 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
              Choose Your Wealth Pathway
            </h3>
            <p className="text-base text-slate-600">
              Comprehensive mutual fund wealth management or intensive proprietary trading mentorship.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Pillar 1: Mutual Fund Distribution (Crisp White Card) */}
            <div className="relative rounded-3xl p-8 sm:p-10 bg-white border border-slate-200/80 shadow-xl shadow-slate-200/50 flex flex-col justify-between hover:shadow-2xl transition-all group">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                    <PieChart className="h-7 w-7" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                    Passive & HNI Portfolios
                  </span>
                </div>

                <div>
                  <h4 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2">
                    Mutual Fund Wealth Management
                  </h4>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Designed for founders, doctors, executives, and families seeking structured, zero-stress compounding without watching daily market fluctuations.
                  </p>
                </div>

                {/* Micro Asset Allocation Progress Bar Preview */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 space-y-2">
                  <div className="flex justify-between text-xs font-bold text-slate-700">
                    <span>Target Model Allocation</span>
                    <span className="text-blue-700 font-extrabold">Dynamic Balanced</span>
                  </div>
                  <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden flex">
                    <div style={{ width: '65%' }} className="bg-blue-600" title="Equity 65%" />
                    <div style={{ width: '25%' }} className="bg-teal-500" title="Debt 25%" />
                    <div style={{ width: '10%' }} className="bg-amber-400" title="Gold 10%" />
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-500 font-medium pt-1">
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-600" /> Equity 65%</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-teal-500" /> Debt 25%</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400" /> Gold/Hedging 10%</span>
                  </div>
                </div>

                <ul className="space-y-3">
                  <li className="flex items-start gap-3 text-sm text-slate-700 font-medium">
                    <CheckCircle2 className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                    <span>AMFI-Certified Portfolio Architect allocation & systematic rebalancing</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm text-slate-700 font-medium">
                    <CheckCircle2 className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                    <span>Automated tax-loss harvesting & annual ₹1.25L LTCG optimization</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm text-slate-700 font-medium">
                    <CheckCircle2 className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                    <span>Direct 1-on-1 desk consultations with Senior Wealth Strategist</span>
                  </li>
                </ul>
              </div>

              <div className="pt-8 mt-8 border-t border-slate-100">
                <Link
                  href="/mfd"
                  className="btn-interactive w-full flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm shadow-lg shadow-blue-600/25 transition-all hover:scale-[1.01] active:scale-[0.99]"
                >
                  <span>Explore Mutual Fund Solutions</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Pillar 2: MIIP Program (Crisp White Card) */}
            <div className="relative rounded-3xl p-8 sm:p-10 bg-white border border-slate-200/80 shadow-xl shadow-slate-200/50 flex flex-col justify-between hover:shadow-2xl transition-all group">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
                    <GraduationCap className="h-7 w-7" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                    Flagship Mentorship
                  </span>
                </div>

                <div>
                  <h4 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2">
                    Momentum Investing Program (MIP)
                  </h4>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    A rigorous institutional training bootcamp for traders seeking to exploit market microstructure, volume footprints, and dark pool liquidity.
                  </p>
                </div>

                {/* Micro Live Workshop Badge */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-[11px] font-bold uppercase text-slate-500">Mentorship Format</span>
                    <p className="text-xs font-extrabold text-slate-900">4-Wk Cohort + 2-Day Live Campus Immersion</p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                    Enrolling Now
                  </span>
                </div>

                <ul className="space-y-3">
                  <li className="flex items-start gap-3 text-sm text-slate-700 font-medium">
                    <CheckCircle2 className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                    <span>Weekend live online strategy workshops & order flow breakdown</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm text-slate-700 font-medium">
                    <CheckCircle2 className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                    <span>Mandatory 2-day live campus immersion with all meals & stay included</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm text-slate-700 font-medium">
                    <CheckCircle2 className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                    <span>1-on-1 strategy audit & SEBI research-backed assessment certificate</span>
                  </li>
                </ul>
              </div>

              <div className="pt-8 mt-8 border-t border-slate-100">
                <Link
                  href="/miip"
                  className="btn-interactive w-full flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-sm shadow-lg shadow-slate-900/20 transition-all hover:scale-[1.01] active:scale-[0.99]"
                >
                  <span>Join MIP Program (₹46,000)</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. INTERACTIVE COMPOUND WEALTH CALCULATOR (BETTERMENT STYLE) */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-white border-y border-slate-200/80">
        <div className="mx-auto max-w-5xl rounded-3xl bg-slate-50 border border-slate-200/80 p-8 sm:p-12 shadow-xl">
          
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-600">
              Wealth Projections
            </span>
            <h3 className="text-2xl sm:text-4xl font-extrabold text-slate-900">
              The Power of Systematic Compounding
            </h3>
            <p className="text-sm text-slate-600">
              See what disciplined momentum compounding at 14.5% targeted annualized returns achieves over time.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            
            {/* Sliders */}
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                    Monthly SIP Allocation
                  </label>
                  <span className="text-xl font-extrabold text-blue-700">
                    ₹{sipAmount.toLocaleString('en-IN')}
                  </span>
                </div>
                <input
                  type="range"
                  min={5000}
                  max={200000}
                  step={5000}
                  value={sipAmount}
                  onChange={(e) => setSipAmount(Number(e.target.value))}
                  className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-xs text-slate-500 font-medium mt-1">
                  <span>₹5,000</span>
                  <span>₹1,00,000</span>
                  <span>₹2,00,000</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                    Investment Duration
                  </label>
                  <span className="text-xl font-extrabold text-slate-900">
                    {tenureYears} Years
                  </span>
                </div>
                <input
                  type="range"
                  min={3}
                  max={30}
                  step={1}
                  value={tenureYears}
                  onChange={(e) => setTenureYears(Number(e.target.value))}
                  className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-xs text-slate-500 font-medium mt-1">
                  <span>3 Yrs</span>
                  <span>15 Yrs</span>
                  <span>30 Yrs</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200 text-xs text-slate-600 space-y-1.5">
                <p><strong>Alpha Benchmark Model:</strong> 14.5% Targeted CAGR Multi-Cap Momentum</p>
                <p><strong>Total Principal Invested:</strong> ₹{investedAmount.toLocaleString('en-IN')}</p>
              </div>
            </div>

            {/* Visualizer Display Card */}
            <div className="rounded-3xl bg-white border border-slate-200/80 p-6 sm:p-8 text-center space-y-6 shadow-lg shadow-slate-200/60">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">
                  Estimated Wealth Accumulated
                </p>
                <p className="text-3xl sm:text-5xl font-extrabold text-blue-700 tracking-tight">
                  ₹{futureValue.toLocaleString('en-IN')}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-100">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-left">
                  <span className="text-[10px] uppercase text-slate-500 block font-bold">Invested</span>
                  <span className="text-sm font-extrabold text-slate-900">₹{(investedAmount / 100000).toFixed(1)} Lakh</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200/80 text-left">
                  <span className="text-[10px] uppercase text-emerald-700 block font-bold">Gained Alpha</span>
                  <span className="text-sm font-extrabold text-emerald-600">+₹{(wealthGained / 100000).toFixed(1)} Lakh</span>
                </div>
              </div>

              <Link
                href="/mfd"
                className="btn-interactive w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm shadow-md shadow-blue-600/25 transition-all"
              >
                <span>Initiate Your Goal Blueprint</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

          </div>

        </div>
      </section>

      {/* 4. INSTITUTIONAL ADVANTAGE FEATURES */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-widest text-blue-600">
              The Proprietary Edge
            </h3>
            <h4 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              Why Wealth Creators Choose Brewrich
            </h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-lg shadow-slate-200/40 hover:shadow-xl transition-all space-y-4">
              <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <BarChart3 className="h-6 w-6" />
              </div>
              <h5 className="text-lg font-bold text-slate-900">Order Flow & Dark Pools</h5>
              <p className="text-sm text-slate-600 leading-relaxed">
                We track institutional block deals, volume footprints, and VWAP absorption so you invest and trade alongside smart money.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-lg shadow-slate-200/40 hover:shadow-xl transition-all space-y-4">
              <div className="h-12 w-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Shield className="h-6 w-6" />
              </div>
              <h5 className="text-lg font-bold text-slate-900">Asymmetric Risk Budgeting</h5>
              <p className="text-sm text-slate-600 leading-relaxed">
                Strict drawdown controls and capital preservation rules ensuring maximal upside participation with capped downside risk.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-lg shadow-slate-200/40 hover:shadow-xl transition-all space-y-4">
              <div className="h-12 w-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center">
                <Target className="h-6 w-6" />
              </div>
              <h5 className="text-lg font-bold text-slate-900">Multi-Asset Synergy</h5>
              <p className="text-sm text-slate-600 leading-relaxed">
                Seamlessly combining core equity mutual fund holdings with tactical momentum derivatives for superior Sharpe ratios.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
