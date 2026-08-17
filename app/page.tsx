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
  Users
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
    <div className="flex flex-col w-full overflow-hidden">
      
      {/* 1. CINEMATIC HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-8 pb-16 px-4 sm:px-6 lg:px-8">
        
        {/* Background Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[900px] h-[450px] bg-gradient-to-tr from-emerald-500/10 via-amber-500/10 to-transparent blur-[140px] pointer-events-none -z-10 rounded-full" />
        
        <div className="mx-auto max-w-5xl text-center space-y-8">
          
          {/* Regulatory & Institutional Pill */}
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-slate-900/90 border border-slate-800 shadow-xl backdrop-blur-md">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              AMFI Registered Mutual Fund Distributor & Institutional Desk
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
            Institutional Alpha for <br />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 bg-clip-text text-transparent">
              Modern Wealth Creators
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mx-auto max-w-2xl text-base sm:text-xl text-slate-300 font-normal leading-relaxed">
            Whether you want automated, hands-off portfolio compounding through top-tier mutual funds or institutional training to trade your own capital like a proprietary desk.
          </p>

          {/* DUAL PRIMARY CALL TO ACTION BUTTONS (MANDATORY REQUIREMENT) */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4 pt-4 max-w-xl mx-auto">
            
            {/* Button 1: Manage My Wealth (Routes to /mfd) */}
            <Link
              href="/mfd"
              className="btn-interactive flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-base shadow-xl shadow-emerald-950/60 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <PieChart className="h-5 w-5" />
              <span>Manage My Wealth</span>
              <ArrowRight className="h-5 w-5" />
            </Link>

            {/* Button 2: Become Your Own Fund Manager (Routes to /miip) */}
            <Link
              href="/miip"
              className="btn-interactive flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-amber-500/40 hover:border-amber-400 text-amber-300 hover:text-amber-200 font-bold text-base shadow-xl shadow-amber-950/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <GraduationCap className="h-5 w-5 text-amber-400" />
              <span>Become Your Own Fund Manager</span>
              <ChevronRight className="h-5 w-5 opacity-70" />
            </Link>

          </div>

          {/* Institutional Trust Markers Grid */}
          <div className="pt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 border-t border-slate-800/80 max-w-4xl mx-auto">
            <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/60 text-center">
              <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400">₹140Cr+</p>
              <p className="text-xs text-slate-400 mt-1 uppercase font-medium tracking-wider">AUM & Capital Advised</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/60 text-center">
              <p className="text-2xl sm:text-3xl font-extrabold text-amber-400">94.2%</p>
              <p className="text-xs text-slate-400 mt-1 uppercase font-medium tracking-wider">Order Execution Rate</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/60 text-center">
              <p className="text-2xl sm:text-3xl font-extrabold text-white">4.9 / 5.0</p>
              <p className="text-xs text-slate-400 mt-1 uppercase font-medium tracking-wider">Student Satisfaction</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/60 text-center">
              <p className="text-2xl sm:text-3xl font-extrabold text-teal-400">100%</p>
              <p className="text-xs text-slate-400 mt-1 uppercase font-medium tracking-wider">AMFI / SEBI Regulated</p>
            </div>
          </div>

        </div>
      </section>

      {/* 2. TWO PILLARS OF BREWRICH WEALTH */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-t border-slate-800/60 bg-dark-900/40">
        <div className="mx-auto max-w-7xl">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-400">
              Architected for Every Investor Persona
            </h2>
            <h3 className="text-3xl sm:text-5xl font-extrabold text-white">
              Choose Your Wealth Pathway
            </h3>
            <p className="text-sm sm:text-base text-slate-400">
              Direct institutional wealth management or self-directed algorithmic momentum execution.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Pillar 1: Mutual Fund Distribution */}
            <div className="relative rounded-3xl p-8 sm:p-10 border border-emerald-500/30 bg-gradient-to-b from-slate-900/90 to-dark-950 flex flex-col justify-between shadow-2xl hover:border-emerald-500/60 transition-all group">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                    <PieChart className="h-7 w-7" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Passive & HNI Wealth
                  </span>
                </div>

                <div>
                  <h4 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                    Mutual Fund Distribution (MFD)
                  </h4>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Designed for busy professionals, doctors, business founders, and families seeking structured, zero-stress compounding without watching charts all day.
                  </p>
                </div>

                <ul className="space-y-3 pt-2">
                  <li className="flex items-start gap-3 text-sm text-slate-300">
                    <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>AMFI-Certified Portfolio Architect allocation & systematic rebalancing</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm text-slate-300">
                    <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Direct tax harvesting, goal-based SIPs, and index overlay strategies</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm text-slate-300">
                    <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Dedicated 1-on-1 private wealth desk consultations on Cal.com</span>
                  </li>
                </ul>
              </div>

              <div className="pt-8 mt-8 border-t border-slate-800">
                <Link
                  href="/mfd"
                  className="btn-interactive w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-950/40 transition-all"
                >
                  <span>Explore Mutual Fund Solutions</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Pillar 2: MIIP Program */}
            <div className="relative rounded-3xl p-8 sm:p-10 border border-amber-500/30 bg-gradient-to-b from-slate-900/90 to-dark-950 flex flex-col justify-between shadow-2xl hover:border-amber-500/60 transition-all group">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                    <GraduationCap className="h-7 w-7" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
                    Flagship Mentorship
                  </span>
                </div>

                <div>
                  <h4 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                    Momentum Institutional Investing Program (MIIP)
                  </h4>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    A rigorous institutional training bootcamp for traders seeking to exploit market microstructure, volume footprints, and dark pool liquidity.
                  </p>
                </div>

                <ul className="space-y-3 pt-2">
                  <li className="flex items-start gap-3 text-sm text-slate-300">
                    <CheckCircle2 className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
                    <span>Live Saturday & Sunday institutional strategy workshops via Google Meet</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm text-slate-300">
                    <CheckCircle2 className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
                    <span>Dynamic module unlocking & mastery assessments (Quiz 1 & Quiz 2)</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm text-slate-300">
                    <CheckCircle2 className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
                    <span>Lifetime student portal access & private quantitative alpha desk</span>
                  </li>
                </ul>
              </div>

              <div className="pt-8 mt-8 border-t border-slate-800">
                <Link
                  href="/miip"
                  className="btn-interactive w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-lg shadow-amber-950/40 transition-all"
                >
                  <span>Join MIIP Program (₹22,000)</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. INTERACTIVE COMPOUND WEALTH CALCULATOR */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-t border-slate-800/60">
        <div className="mx-auto max-w-5xl rounded-3xl bg-slate-900/80 border border-slate-800 p-8 sm:p-12 shadow-2xl backdrop-blur-xl">
          
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h3 className="text-2xl sm:text-4xl font-extrabold text-white">
              The Power of Systematic Alpha Compounding
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              See what disciplined momentum compounding at 14.5% targeted annualized returns achieves over time.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            
            {/* Sliders */}
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Monthly SIP Allocation
                  </label>
                  <span className="text-lg font-bold text-emerald-400">
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
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                  <span>₹5,000</span>
                  <span>₹1,00,000</span>
                  <span>₹2,00,000</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Investment Duration
                  </label>
                  <span className="text-lg font-bold text-amber-400">
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
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
                <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                  <span>3 Yrs</span>
                  <span>15 Yrs</span>
                  <span>30 Yrs</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-400 space-y-1">
                <p><strong>Target Alpha Benchmark:</strong> 14.5% CAGR Multi-Cap Momentum</p>
                <p><strong>Total Capital Invested:</strong> ₹{investedAmount.toLocaleString('en-IN')}</p>
              </div>
            </div>

            {/* Visualizer Display */}
            <div className="rounded-2xl bg-gradient-to-br from-dark-950 to-slate-900 border border-emerald-500/30 p-6 sm:p-8 text-center space-y-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-1">
                  Estimated Portfolio Value
                </p>
                <p className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
                  ₹{futureValue.toLocaleString('en-IN')}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-800">
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-left">
                  <span className="text-[10px] uppercase text-slate-400 block font-medium">Invested</span>
                  <span className="text-sm font-bold text-slate-200">₹{(investedAmount / 100000).toFixed(1)} Lakh</span>
                </div>
                <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-800/40 text-left">
                  <span className="text-[10px] uppercase text-emerald-400 block font-medium">Wealth Gained</span>
                  <span className="text-sm font-bold text-emerald-400">+₹{(wealthGained / 100000).toFixed(1)} Lakh</span>
                </div>
              </div>

              <Link
                href="/mfd"
                className="btn-interactive w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-950/40 transition-all"
              >
                <span>Initiate Your Goal Blueprint</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

          </div>

        </div>
      </section>

      {/* 4. INSTITUTIONAL ADVANTAGE FEATURES */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-t border-slate-800/60 bg-dark-900/20">
        <div className="mx-auto max-w-7xl">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-widest text-amber-400">
              The Proprietary Edge
            </h3>
            <h4 className="text-3xl sm:text-4xl font-extrabold text-white">
              Why Wealth Creators Choose Brewrich
            </h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all space-y-4">
              <div className="h-12 w-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <BarChart3 className="h-6 w-6" />
              </div>
              <h5 className="text-lg font-bold text-white">Order Flow & Dark Pools</h5>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                We track institutional block deals, volume footprints, and VWAP absorption so you trade in alignment with smart money, never against it.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all space-y-4">
              <div className="h-12 w-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
                <Shield className="h-6 w-6" />
              </div>
              <h5 className="text-lg font-bold text-white">Asymmetric Risk Budgeting</h5>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Strict drawdown controls and capital preservation rules ensuring maximal upside participation with capped downside volatility.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all space-y-4">
              <div className="h-12 w-12 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center">
                <Target className="h-6 w-6" />
              </div>
              <h5 className="text-lg font-bold text-white">Multi-Asset Synergy</h5>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Seamlessly combining core equity mutual fund holdings with tactical momentum derivatives for superior risk-adjusted Sharpe ratios.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
