'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  TrendingUp, 
  PieChart, 
  CheckCircle2, 
  Clock, 
  Lock, 
  Award, 
  Users, 
  ArrowRight, 
  Sparkles, 
  Layers, 
  BarChart3, 
  FileCheck,
  Percent,
  Shield,
  ArrowUpRight,
  Calculator,
  Briefcase,
  Building2,
  BadgeCheck,
  Check,
  Zap,
  Smartphone,
  Landmark,
  Scale,
  HeartPulse,
  Receipt,
  Umbrella,
  CreditCard,
  PhoneCall,
  MessageSquare,
  ChevronRight,
  Activity,
  Wallet,
  ArrowDownRight
} from 'lucide-react';

const ONBOARDING_URL = "https://mweb.assetplus.in/client_onboarding/?advisor=688b3679af6048595923afd2";
const WHATSAPP_CONSULT_URL = "https://wa.me/919042747590";

export default function MfdPage() {
  // Interactive mini-calculator for hero preview
  const [sipSlider, setSipSlider] = useState<number>(10000);
  const [yearsSlider, setYearsSlider] = useState<number>(10);
  const expectedReturn = 15.2; // Institutional Multi-Cap CAGR

  const monthlyRate = expectedReturn / 12 / 100;
  const totalMonths = yearsSlider * 12;
  const totalInvested = sipSlider * totalMonths;
  const projectedCorpus = Math.round(
    sipSlider * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) * (1 + monthlyRate)
  );
  const wealthGenerated = projectedCorpus - totalInvested;

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-blue-600 selection:text-white font-sans antialiased">
      
      {/* ========================================================================= */}
      {/* 1. INSTITUTIONAL STICKY NAVIGATION BAR */}
      {/* ========================================================================= */}
      <nav className="sticky top-0 z-50 w-full border-b border-blue-500/30 bg-blue-600/95 backdrop-blur-md px-4 sm:px-6 lg:px-8 py-3.5 transition-all">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          
          {/* Logo & Platform Tag */}
          <Link href="/" className="flex items-center gap-3 group focus:outline-none">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-blue-600 font-black shadow-md group-hover:scale-105 transition-transform">
              <Shield className="h-5 w-5 fill-blue-600" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-lg font-black tracking-wider text-white">BREWRICH</span>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-blue-700 text-blue-100 border border-blue-400/40">
                  Wealth Desk
                </span>
              </div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-blue-100/80 hidden sm:inline">
                AMFI Registered MFD • ARN-335693
              </span>
            </div>
          </Link>

          {/* Nav Actions */}
          <div className="flex items-center gap-3">
            <a
              href="#consultation"
              className="hidden md:inline-flex items-center gap-1.5 text-xs font-bold text-white hover:text-blue-100 px-3.5 py-2 rounded-xl bg-blue-700/60 border border-blue-400/30 hover:bg-blue-700 transition-all"
            >
              <PhoneCall className="h-3.5 w-3.5" />
              <span>Talk to Advisor</span>
            </a>

            <a
              href={ONBOARDING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-interactive inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-blue-600 font-extrabold text-xs sm:text-sm shadow-lg shadow-blue-900/30 hover:bg-blue-50 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Client Portal Login</span>
              <ArrowUpRight className="h-4 w-4 text-blue-600" />
            </a>
          </div>

        </div>
      </nav>

      {/* ========================================================================= */}
      {/* 2. HERO SECTION (ROYAL BLUE THEME WITH 3D MOBILE APP MOCKUP) */}
      {/* ========================================================================= */}
      <section className="relative bg-gradient-to-b from-blue-600 via-blue-600 to-blue-700 text-white pt-14 pb-20 md:pt-20 md:pb-28 px-4 sm:px-6 lg:px-8 overflow-hidden">
        
        {/* Ambient background glow & grid */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff18_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-40" />
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Value Proposition & CTAs */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-700/60 border border-blue-400/40 text-blue-100 text-xs font-bold tracking-wide shadow-inner">
                <ShieldCheck className="h-4 w-4 text-emerald-300" />
                <span>ISO 9001:2015 Certified • AMFI & IRDAI Regulated Platform</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.12]">
                Build wealth with <br className="hidden sm:inline" />
                <span className="text-white drop-shadow-sm">
                  confidence and ease.
                </span>
              </h1>

              <p className="max-w-2xl text-base sm:text-xl text-blue-100/90 font-normal leading-relaxed">
                Automated multi-cap compounding, institutional fund baskets, family protection, and instant liquidity overdraft—managed for you under one unified platform.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3.5 pt-2 justify-center lg:justify-start">
                <a
                  href={ONBOARDING_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-interactive w-full sm:w-auto min-h-[52px] px-8 flex items-center justify-center gap-2.5 rounded-2xl bg-white text-blue-600 font-black text-base shadow-xl shadow-blue-950/30 hover:bg-blue-50 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Zap className="h-5 w-5 fill-blue-600" />
                  <span>Get Started (Open Account)</span>
                  <ArrowRight className="h-5 w-5" />
                </a>

                <a
                  href="#consultation"
                  className="btn-interactive w-full sm:w-auto min-h-[52px] px-7 flex items-center justify-center gap-2 rounded-2xl bg-blue-800/80 hover:bg-blue-800 text-white font-bold text-sm border border-blue-400/40 shadow-lg backdrop-blur-md transition-all"
                >
                  <Clock className="h-4 w-4 text-blue-200" />
                  <span>Book 1-to-1 Consultation</span>
                </a>
              </div>

              {/* High-Trust Bullet Metrics */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-3 text-xs text-blue-100/90 font-semibold">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                  <span>₹0 Platform Account Fees</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                  <span>100% Paperless 2-Min KYC</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                  <span>In-House Dedicated CA Desk</span>
                </div>
              </div>

            </div>

            {/* Right Column: Ultra-High-Fidelity 3D Mobile App Mockup */}
            <div className="lg:col-span-5 flex justify-center relative">
              
              {/* Floating Live Indicator Top-Left */}
              <div className="absolute -top-4 -left-4 z-20 hidden sm:flex items-center gap-2.5 p-3 rounded-2xl bg-slate-900/95 text-white shadow-2xl border border-blue-500/30 backdrop-blur-md animate-bounce duration-1000">
                <div className="h-7 w-7 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <TrendingUp className="h-4 w-4" />
                </div>
                <div>
                  <span className="block text-[9px] uppercase font-bold text-slate-400">Model CAGR</span>
                  <span className="text-xs font-black text-emerald-400">+18.4% Alpha</span>
                </div>
              </div>

              {/* 3D Mobile Phone Device Shell */}
              <div className="w-full max-w-[340px] rounded-[44px] bg-slate-900 p-3.5 shadow-2xl shadow-blue-950/60 ring-4 ring-blue-400/20 border border-slate-700 transform lg:rotate-1 hover:rotate-0 transition-transform duration-500">
                
                {/* Phone Glass Inner Screen */}
                <div className="rounded-[36px] bg-slate-950 overflow-hidden p-5 text-white space-y-4 border border-slate-800">
                  
                  {/* Status Bar */}
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-bold border-b border-slate-800/80 pb-2.5">
                    <span className="text-slate-300">09:41</span>
                    <div className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-[10px] text-emerald-400 font-bold">AssetPlus Direct</span>
                    </div>
                  </div>

                  {/* Portfolio Valuation Card */}
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 text-white space-y-2 shadow-lg shadow-blue-600/30">
                    <div className="flex justify-between items-center text-xs text-blue-100">
                      <span>Total Portfolio Value</span>
                      <span className="text-[10px] bg-blue-800/80 px-2 py-0.5 rounded-full font-bold">Live Model</span>
                    </div>
                    <div className="text-2xl font-black tracking-tight">
                      ₹48,25,400<span className="text-sm font-normal text-blue-200">.00</span>
                    </div>
                    <div className="flex items-center justify-between pt-1 border-t border-white/20 text-[11px]">
                      <span className="text-emerald-300 font-extrabold flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" />
                        +18.4% XIRR Returns
                      </span>
                      <span className="text-blue-100 text-[10px]">Auto-Rebalanced</span>
                    </div>
                  </div>

                  {/* Active Services Live Breakdown */}
                  <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2.5 text-xs">
                    <div className="flex justify-between items-center text-slate-300">
                      <span className="flex items-center gap-1.5 font-medium">
                        <span className="h-2 w-2 rounded-full bg-blue-500" />
                        Active Monthly SIP
                      </span>
                      <span className="font-extrabold text-white">₹10,000/mo</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-300">
                      <span className="flex items-center gap-1.5 font-medium">
                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                        Term Life Shield
                      </span>
                      <span className="font-extrabold text-emerald-400">₹2.00 Cr Cover</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-300">
                      <span className="flex items-center gap-1.5 font-medium">
                        <span className="h-2 w-2 rounded-full bg-purple-500" />
                        LAMF Overdraft Limit
                      </span>
                      <span className="font-extrabold text-purple-300">₹18.50 Lakh</span>
                    </div>
                  </div>

                  {/* In-App Direct CTA Button */}
                  <a
                    href={ONBOARDING_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-center text-xs font-black shadow-md transition-all tracking-wide"
                  >
                    Open Account (Zero Fees) →
                  </a>

                </div>

              </div>

              {/* Floating Badge Bottom-Right */}
              <div className="absolute -bottom-4 -right-4 z-20 hidden sm:flex items-center gap-2 p-3 rounded-2xl bg-slate-900/95 text-white shadow-2xl border border-blue-500/30 backdrop-blur-md">
                <div className="h-7 w-7 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                  <Receipt className="h-4 w-4" />
                </div>
                <div>
                  <span className="block text-[9px] uppercase font-bold text-slate-400">CA Auditing</span>
                  <span className="text-xs font-bold text-white">ITR Support Included</span>
                </div>
              </div>

            </div>

          </div>

          {/* Live Metrics Bar Overlay */}
          <div className="mt-14 p-6 sm:p-8 rounded-3xl bg-blue-700/50 border border-blue-400/30 backdrop-blur-xl shadow-2xl text-white">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y sm:divide-y-0 sm:divide-x divide-blue-500/30">
              <div className="pt-2 sm:pt-0">
                <p className="text-2xl sm:text-3xl font-black text-white">₹140Cr+</p>
                <p className="text-xs text-blue-200 mt-1 uppercase font-bold tracking-wider">AUM & Capital Advised</p>
              </div>
              <div className="pt-4 sm:pt-0">
                <p className="text-2xl sm:text-3xl font-black text-emerald-300">94.2%</p>
                <p className="text-xs text-blue-200 mt-1 uppercase font-bold tracking-wider">Order Execution Rate</p>
              </div>
              <div className="pt-4 sm:pt-0">
                <p className="text-2xl sm:text-3xl font-black text-white">4.9 / 5.0</p>
                <p className="text-xs text-blue-200 mt-1 uppercase font-bold tracking-wider">Investor Rating</p>
              </div>
              <div className="pt-4 sm:pt-0">
                <p className="text-2xl sm:text-3xl font-black text-blue-200">100%</p>
                <p className="text-xs text-blue-200 mt-1 uppercase font-bold tracking-wider">Regulated & Compliant</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. PRODUCT SUITE: MODULAR HIGH-FIDELITY PRODUCT CATEGORIES */}
      {/* ========================================================================= */}
      <section className="bg-slate-950 text-white px-4 sm:px-6 lg:px-8 py-24 space-y-28">
        
        <div className="mx-auto max-w-7xl text-center space-y-3">
          <span className="text-xs font-extrabold uppercase tracking-widest text-blue-400 bg-blue-500/10 px-3.5 py-1.5 rounded-full border border-blue-500/20">
            Institutional Product Suite
          </span>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            Every financial tool, visually structured.
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-base sm:text-lg">
            Explore high-fidelity interfaces for mutual fund compounding, instant overdraft credit lines, and multi-crore life protection.
          </p>
        </div>

        <div className="mx-auto max-w-7xl space-y-24">

          {/* --------------------------------------------------------------------- */}
          {/* PRODUCT 1: SIP & MUTUAL FUNDS (Interactive Compounding Mockup) */}
          {/* --------------------------------------------------------------------- */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center bg-slate-900/80 p-8 sm:p-12 rounded-3xl border border-slate-800 shadow-2xl hover:border-blue-500/40 transition-all">
            
            {/* Copy & Details */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold uppercase tracking-wider border border-blue-500/20">
                <BarChart3 className="h-3.5 w-3.5" />
                <span>Automated Wealth Creation</span>
              </div>
              
              <h3 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                Systematic Investment Plan (SIP)
              </h3>
              
              <p className="text-slate-300 text-base leading-relaxed">
                Put your wealth creation on autopilot. Discipline-driven monthly allocations across curated Flexi-Cap, Mid-Cap, and Index fund baskets with automated UPI mandates and auto-tax harvesting.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-xs text-slate-400 font-medium">Minimum SIP</span>
                  <p className="text-lg font-black text-white">₹500 / month</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-xs text-slate-400 font-medium">Tax Exemption</span>
                  <p className="text-lg font-black text-emerald-400">₹1.25L LTCG Free</p>
                </div>
              </div>

              <ul className="space-y-2.5 text-sm text-slate-300">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-blue-400 shrink-0" />
                  <span>Flexible step-up SIP matching your annual income growth</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-blue-400 shrink-0" />
                  <span>Quarterly portfolio rebalancing & tax-loss harvesting</span>
                </li>
              </ul>

              <div className="pt-2">
                <a
                  href={ONBOARDING_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-interactive inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-sm shadow-lg shadow-blue-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span>Start SIP Portfolio →</span>
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </div>

            {/* Interactive Visual Graph Mockup */}
            <div className="lg:col-span-6 flex justify-center">
              <div className="w-full max-w-md p-6 sm:p-8 rounded-3xl bg-slate-950 border border-slate-800 shadow-2xl space-y-5">
                
                <div className="flex justify-between items-center pb-3 border-b border-slate-800">
                  <div>
                    <span className="text-xs text-slate-400 uppercase tracking-wider font-bold">SIP Compounding Visualizer</span>
                    <p className="text-lg font-extrabold text-white">15.2% Targeted Alpha CAGR</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-black">
                    High Growth
                  </span>
                </div>

                {/* Simulated Growth Chart Bars */}
                <div className="space-y-2 pt-2">
                  <div className="flex justify-between text-xs text-slate-400 font-medium">
                    <span>Year 1: ₹65,000</span>
                    <span className="text-blue-400 font-bold">Year 10: ₹27.8 Lakh+</span>
                  </div>
                  <div className="h-28 flex items-end gap-3 pt-4 border-b border-slate-800 pb-2">
                    <div className="w-1/5 bg-blue-600/30 h-1/5 rounded-t-lg transition-all" title="Yr 1" />
                    <div className="w-1/5 bg-blue-600/50 h-2/5 rounded-t-lg transition-all" title="Yr 3" />
                    <div className="w-1/5 bg-blue-600/70 h-3/5 rounded-t-lg transition-all" title="Yr 5" />
                    <div className="w-1/5 bg-blue-600 h-4/5 rounded-t-lg transition-all" title="Yr 7" />
                    <div className="w-1/5 bg-emerald-500 h-full rounded-t-lg transition-all shadow-lg shadow-emerald-500/30" title="Yr 10+" />
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-500 font-bold uppercase pt-1">
                    <span>Year 1</span>
                    <span>Year 3</span>
                    <span>Year 5</span>
                    <span>Year 7</span>
                    <span className="text-emerald-400">Year 10+</span>
                  </div>
                </div>

                {/* Metric Summary Card */}
                <div className="p-3.5 rounded-2xl bg-blue-950/40 border border-blue-500/30 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-blue-200 block text-[11px]">Monthly SIP Allocation</span>
                    <span className="text-base font-black text-white">₹10,000 / month</span>
                  </div>
                  <div className="text-right">
                    <span className="text-emerald-300 block text-[11px]">Estimated Wealth Gained</span>
                    <span className="text-base font-black text-emerald-400">+₹15.8 Lakh</span>
                  </div>
                </div>

              </div>
            </div>

          </div>

          {/* --------------------------------------------------------------------- */}
          {/* PRODUCT 2: LOAN AGAINST MUTUAL FUNDS (Overdraft Credit Line Mockup) */}
          {/* --------------------------------------------------------------------- */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center bg-slate-900/80 p-8 sm:p-12 rounded-3xl border border-slate-800 shadow-2xl hover:border-purple-500/40 transition-all">
            
            {/* Visual Credit Line Mockup Left */}
            <div className="lg:col-span-6 order-2 lg:order-1 flex justify-center">
              <div className="w-full max-w-md p-6 sm:p-8 rounded-3xl bg-slate-950 border border-slate-800 shadow-2xl space-y-5">
                
                <div className="flex justify-between items-center pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-purple-400" />
                    <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Digital Credit Line</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-black">
                    Instant Disbursal
                  </span>
                </div>

                {/* Overdraft Valuation Box */}
                <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-950/60 to-slate-900 border border-purple-500/30 space-y-2">
                  <span className="text-xs text-purple-200">Approved Overdraft Limit</span>
                  <div className="text-3xl font-black text-white tracking-tight">
                    ₹18,50,000<span className="text-sm font-normal text-slate-400"> (80% LTV)</span>
                  </div>
                  <p className="text-[11px] text-emerald-400 font-semibold">
                    ✓ Interest charged ONLY on utilized funds (9.5% p.a.)
                  </p>
                </div>

                {/* Feature Pills inside Mockup */}
                <div className="space-y-2 text-xs">
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex justify-between">
                    <span className="text-slate-400">Portfolio Status:</span>
                    <span className="font-extrabold text-white">100% Units Compounding</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex justify-between">
                    <span className="text-slate-400">Disbursal Speed:</span>
                    <span className="font-extrabold text-purple-300">Same-Day Direct to Bank</span>
                  </div>
                </div>

              </div>
            </div>

            {/* Copy & Details Right */}
            <div className="lg:col-span-6 order-1 lg:order-2 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs font-bold uppercase tracking-wider border border-purple-500/20">
                <CreditCard className="h-3.5 w-3.5" />
                <span>Instant Liquidity Credit</span>
              </div>
              
              <h3 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                Loan Against Mutual Funds (LAMF)
              </h3>
              
              <p className="text-slate-300 text-base leading-relaxed">
                Need urgent liquidity for business operations or personal cashflow? Never break your compounding. Digitally pledge your mutual fund portfolio and unlock instant bank overdraft credit within hours.
              </p>

              <ul className="space-y-2.5 text-sm text-slate-300">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-purple-400 shrink-0" />
                  <span>Zero exit loads and zero capital gains tax triggered</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-purple-400 shrink-0" />
                  <span>Pay interest only on the exact amount and days used</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-purple-400 shrink-0" />
                  <span>Your units continue earning dividends, gains, and alpha</span>
                </li>
              </ul>

              <div className="pt-2">
                <a
                  href={ONBOARDING_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-interactive inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black text-sm shadow-lg shadow-purple-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span>Check Overdraft Limit →</span>
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </div>

          </div>

          {/* --------------------------------------------------------------------- */}
          {/* PRODUCT 3: TERM & HEALTH INSURANCE (Digital Policy Card Mockup) */}
          {/* --------------------------------------------------------------------- */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center bg-slate-900/80 p-8 sm:p-12 rounded-3xl border border-slate-800 shadow-2xl hover:border-emerald-500/40 transition-all">
            
            {/* Copy & Details */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold uppercase tracking-wider border border-emerald-500/20">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>IRDAI Licensed Protection</span>
              </div>
              
              <h3 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                Term Life & Health Mediclaim Cards
              </h3>
              
              <p className="text-slate-300 text-base leading-relaxed">
                Protect your multi-generational wealth against life and health contingencies. Institutional risk underwriting providing multi-crore term life protection and cashless health cards across 10,000+ top hospitals.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-xs text-slate-400 font-medium">Life Protection</span>
                  <p className="text-lg font-black text-white">Up to ₹10Cr+ Cover</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-xs text-slate-400 font-medium">Cashless Network</span>
                  <p className="text-lg font-black text-emerald-400">10,000+ Hospitals</p>
                </div>
              </div>

              <ul className="space-y-2.5 text-sm text-slate-300">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Dedicated in-house claims assistance & emergency settlement desk</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Instant digital health cards with zero hospitalization hassles</span>
                </li>
              </ul>

              <div className="pt-2">
                <a
                  href={WHATSAPP_CONSULT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-interactive inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm shadow-lg shadow-emerald-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <MessageSquare className="h-4 w-4" />
                  <span>Request Insurance Quote via WhatsApp →</span>
                </a>
              </div>
            </div>

            {/* Visual Digital Policy Mockup Right */}
            <div className="lg:col-span-6 flex justify-center">
              <div className="w-full max-w-md p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-emerald-950 via-slate-950 to-slate-900 border border-emerald-500/40 shadow-2xl space-y-5">
                
                <div className="flex justify-between items-center pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Umbrella className="h-5 w-5 text-emerald-400" />
                    <span className="text-xs text-emerald-300 font-bold uppercase tracking-wider">Digital Policy Card</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-black">
                    Verified Active
                  </span>
                </div>

                <div className="p-5 rounded-2xl bg-emerald-900/30 border border-emerald-500/30 space-y-1">
                  <span className="text-xs text-emerald-300">Term Life Cover Approved</span>
                  <div className="text-3xl font-black text-white tracking-tight">₹2,00,00,000</div>
                  <span className="text-[11px] text-slate-300">Annual Premium Shielded via Section 80C</span>
                </div>

                <div className="p-4 rounded-2xl bg-teal-900/30 border border-teal-500/30 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-teal-200">Mediclaim Health Card</span>
                    <p className="text-sm font-black text-white">Cashless Network Active</p>
                  </div>
                  <span className="text-xs font-extrabold text-teal-300 bg-teal-950 px-3 py-1 rounded-full border border-teal-500/30">
                    10k+ Hospitals
                  </span>
                </div>

              </div>
            </div>

          </div>

          {/* --------------------------------------------------------------------- */}
          {/* PRODUCT 4: SWP/STP, FIXED DEPOSITS & NPS */}
          {/* --------------------------------------------------------------------- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Card A: SWP & STP Automation */}
            <div className="p-8 sm:p-10 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl hover:border-blue-500/40 transition-all flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="h-12 w-12 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold">
                    <Activity className="h-6 w-6" />
                  </div>
                  <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold uppercase tracking-wider">
                    Cashflow Engine
                  </span>
                </div>

                <h4 className="text-2xl font-black text-white">SWP & STP Automation</h4>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Take control of cash flows. Set up Systematic Withdrawal Plans (SWP) for monthly income or Systematic Transfer Plans (STP) to optimize market dips safely.
                </p>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex justify-between items-center text-xs">
                  <span className="text-slate-400">Monthly Payout to Bank:</span>
                  <span className="font-black text-white text-base">₹25,000 / mo</span>
                </div>
              </div>

              <a
                href={ONBOARDING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-center text-xs font-black shadow-md transition-all block"
              >
                Setup SWP Payouts →
              </a>
            </div>

            {/* Card B: Fixed Deposits & NPS */}
            <div className="p-8 sm:p-10 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl hover:border-amber-500/40 transition-all flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="h-12 w-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
                    <Landmark className="h-6 w-6" />
                  </div>
                  <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold uppercase tracking-wider">
                    AAA Yields & Pension
                  </span>
                </div>

                <h4 className="text-2xl font-black text-white">Fixed Deposits & NPS</h4>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Lock in secure yields with AAA-rated corporate FDs alongside tax-saving retirement compounding through the National Pension System (NPS Tier I & II).
                </p>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex justify-between items-center text-xs">
                  <span className="text-slate-400">Target AAA Yield:</span>
                  <span className="font-black text-amber-400 text-base">Up to 8.65% p.a.</span>
                </div>
              </div>

              <a
                href={ONBOARDING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-center text-xs font-black shadow-md transition-all block"
              >
                Invest in FDs & NPS →
              </a>
            </div>

          </div>

        </div>

      </section>

      {/* ========================================================================= */}
      {/* 4. 1-TO-1 ADVISORY CONSULTATION HUB */}
      {/* ========================================================================= */}
      <section id="consultation" className="bg-gradient-to-b from-blue-900 to-blue-950 text-white px-4 sm:px-6 lg:px-8 py-24 text-center border-t border-blue-800">
        <div className="max-w-4xl mx-auto space-y-8">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-blue-200 text-xs font-bold uppercase tracking-wider border border-white/20">
            <PhoneCall className="h-3.5 w-3.5 text-emerald-300" />
            <span>Direct Advisor Desk</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            Book a 1-to-1 Advisory Consultation
          </h2>
          
          <p className="text-blue-100 text-base sm:text-xl max-w-2xl mx-auto leading-relaxed">
            Discuss your portfolio asset allocation, tax-saving strategies, term life coverage, or business overdraft limits directly with our Senior Wealth Directors.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <a
              href={WHATSAPP_CONSULT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-interactive w-full sm:w-auto px-8 py-4 rounded-2xl bg-white text-blue-900 font-black text-base shadow-2xl hover:bg-blue-50 transition-all flex items-center justify-center gap-2.5 hover:scale-[1.02] active:scale-[0.98]"
            >
              <MessageSquare className="h-5 w-5 text-emerald-600" />
              <span>Schedule via WhatsApp (+91 90427 47590)</span>
            </a>

            <a
              href="tel:+919042747590"
              className="btn-interactive w-full sm:w-auto px-7 py-4 rounded-2xl bg-blue-800/80 hover:bg-blue-800 text-white font-bold text-sm border border-blue-400/30 transition-all flex items-center justify-center gap-2"
            >
              <PhoneCall className="h-4 w-4 text-blue-200" />
              <span>Direct Desk Call</span>
            </a>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. MANDATORY REGULATORY COMPLIANCE FOOTER */}
      {/* ========================================================================= */}
      <footer className="bg-slate-950 border-t border-slate-900 px-4 sm:px-6 lg:px-8 py-14 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          
          {/* Company Bio */}
          <div className="space-y-1.5 max-w-md">
            <div className="font-extrabold text-white text-base flex items-center justify-center md:justify-start gap-2">
              <Shield className="h-4 w-4 text-blue-500" />
              <span>Brewrich Wealth (Brewrich Trading)</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Headquartered in Theni, Tamil Nadu • Professional institutional wealth management, mutual fund distribution, and corporate insurance advisory.
            </p>
          </div>

          {/* Compliance & Regulatory Badges */}
          <div className="flex flex-wrap justify-center gap-4">
            
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-left">
              <span className="block font-extrabold text-white text-xs mb-0.5">AMFI Registered MFD</span>
              <span className="text-slate-400 font-mono text-[11px]">ARN-335693 | EUIN: E637441</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-left">
              <span className="block font-extrabold text-white text-xs mb-0.5">IRDAI Licensed Advisor</span>
              <span className="text-slate-400 font-mono text-[11px]">URN: CAI0405260445 (Composite)</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-left">
              <span className="block font-extrabold text-white text-xs mb-0.5">ISO 9001:2015 Certified</span>
              <span className="text-slate-400 font-mono text-[11px]">Udyam: UDYAM-TN-23-0001645</span>
            </div>

          </div>

        </div>

        <div className="max-w-7xl mx-auto mt-10 pt-6 border-t border-slate-900 text-center text-slate-500 text-[11px]">
          Mutual fund investments are subject to market risks. Please read all scheme-related documents carefully before investing. Past performance is not indicative of future returns.
        </div>
      </footer>

    </div>
  );
}
