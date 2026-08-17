'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import RegisterFlowModal from '@/components/RegisterFlowModal';
import { 
  GraduationCap, 
  Sparkles, 
  CheckCircle2, 
  ShieldAlert, 
  ShieldCheck, 
  Clock, 
  Calendar, 
  Video, 
  Award, 
  ArrowRight, 
  Zap, 
  TrendingUp,
  BarChart3,
  Flame,
  Lock,
  ChevronDown
} from 'lucide-react';

function MiipContent() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [autoTrigger, setAutoTrigger] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    // If user returned from Google OAuth redirect with ?checkout=auto
    if (searchParams?.get('checkout') === 'auto' || searchParams?.get('register') === 'true') {
      setIsModalOpen(true);
      setAutoTrigger(true);
    }
  }, [searchParams]);

  const syllabus = [
    {
      module: 'Module 01',
      title: 'Market Microstructure & Order Flow Footprints',
      description: 'Decode DOM (Depth of Market), aggressive vs passive market orders, volume delta divergence, and institutional absorption.',
      items: [
        'Auction Market Theory & Value Area Shifts',
        'Cumulative Volume Delta (CVD) Anomalies',
        'Footprint Chart Imbalances & Unfinished Auctions',
      ],
    },
    {
      module: 'Module 02',
      title: 'Dark Pool Liquidity & Block Accumulation',
      description: 'Identify where institutions silently accumulate positions before standard retail technical patterns form.',
      items: [
        'Institutional Liquidity Voids & Sweep Orders',
        'High-Frequency Trading (HFT) Trap Patterns',
        'VWAP Bands & Anchored Institutional Benchmarks',
      ],
    },
    {
      module: 'Module 03',
      title: 'Momentum Execution & Multi-Timeframe Confluence',
      description: 'Execute high-expectancy momentum setups with precise mathematical risk-reward profiles.',
      items: [
        'Opening Range Breakout (ORB) with Volume Filter',
        'Momentum Continuation in Trend Days',
        'Options Structure & Gamma Exposure (GEX) Levels',
      ],
    },
    {
      module: 'Module 04',
      title: 'Proprietary Risk Budgeting & Trader Psychology',
      description: 'Manage trading capital like a prop desk risk manager. Protect your account during market drawdowns.',
      items: [
        'Kelly Criterion & Position Sizing Formulas',
        'Trade Journaling & Execution Audit Workflows',
        'Institutional Assessment Certification (Quiz 1 & Quiz 2)',
      ],
    },
  ];

  const whatYouGet = [
    {
      title: 'Weekend Live Strategy Workshops',
      description: '4-Week intensive live weekend sessions (Saturdays & Sundays) hosted via Google Meet with real-time market breakdowns.',
      icon: Video,
    },
    {
      title: 'Institutional Alpha Community Access',
      description: 'Exclusive private Discord alpha desk with institutional setups, morning game plans, and daily order flow alerts.',
      icon: Flame,
    },
    {
      title: 'Protected Student Portal Access',
      description: 'Access recordings, algorithmic cheat sheets, and dynamic knowledge assessments (Quiz 1 & Quiz 2) with certificates.',
      icon: GraduationCap,
    },
    {
      title: '1-on-1 Trading Journal Audits',
      description: 'Personalized feedback on your trade logs and psychological biases to eliminate recurring profit leaks.',
      icon: ShieldCheck,
    },
  ];

  return (
    <div className="flex flex-col w-full pb-24 md:pb-16 bg-slate-50">
      
      {/* 1. HERO SALES SECTION (ROYAL BLUE BETTERMENT STYLE) */}
      <section className="relative bg-gradient-to-b from-[#0A358F] via-[#0D44B8] to-[#1456F0] text-white pt-16 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        
        {/* Glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none -z-0" />
        
        <div className="relative z-10 mx-auto max-w-5xl text-center space-y-6">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold uppercase tracking-wider shadow-sm">
            <Sparkles className="h-4 w-4 text-amber-300" />
            <span>High-Ticket Quantitative Mentorship</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.12]">
            Momentum Institutional <br />
            <span className="text-blue-100">
              Investing Program (MIIP)
            </span>
          </h1>

          <p className="mx-auto max-w-2xl text-sm sm:text-lg text-blue-100 font-normal leading-relaxed">
            Transition from retail liquidity prey to an institutional momentum executor. Master order flow, dark pool accumulation, and quantitative trade execution.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 pt-2 text-xs sm:text-sm text-blue-100 font-semibold">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-amber-300" />
              <span>Weekend Live Batches</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Video className="h-4 w-4 text-emerald-300" />
              <span>Google Meet Live Interactive</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Award className="h-4 w-4 text-teal-300" />
              <span>Certification on Quiz Completion</span>
            </div>
          </div>

        </div>
      </section>

      {/* 2. PRICING HIGHLIGHT CARD (CRISP SOLID WHITE) */}
      <section className="-mt-12 px-4 sm:px-6 lg:px-8 relative z-20">
        <div className="mx-auto max-w-md p-8 rounded-3xl bg-white border border-slate-200/80 shadow-2xl shadow-slate-200/80 text-center space-y-5">
          <div className="flex items-center justify-between text-xs uppercase tracking-wider text-slate-500 font-bold">
            <span>Cohort Registration Fee</span>
            <span className="text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">Limited 25 Seats</span>
          </div>
          
          <div className="flex items-baseline justify-center gap-2">
            <span className="text-4xl sm:text-5xl font-extrabold text-slate-900">₹22,000</span>
            <span className="text-sm font-bold text-slate-500">INR (All-Inclusive)</span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Includes Saturday & Sunday Live Google Meet sessions, Student Portal dashboard, & Assessment Unlocks.
          </p>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="btn-interactive w-full min-h-[52px] flex items-center justify-center gap-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-base shadow-lg shadow-blue-600/30 transition-all hover:scale-[1.01] active:scale-[0.99]"
          >
            <Sparkles className="h-5 w-5 text-amber-300" />
            <span>Register Now • ₹22,000</span>
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </section>

      {/* 3. RETAIL TRADING VS INSTITUTIONAL REALITY (CRISP COMPARISON CARDS) */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-red-600">
              The Reality Check
            </span>
            <h3 className="text-2xl sm:text-4xl font-extrabold text-slate-900">
              Why 95% of Retail Traders Fail
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Retail Flaws */}
            <div className="p-8 rounded-3xl bg-red-50/60 border border-red-200/80 space-y-4 shadow-sm">
              <div className="flex items-center gap-2 text-red-700 font-extrabold text-sm uppercase tracking-wider">
                <ShieldAlert className="h-5 w-5 text-red-600" />
                <span>The Retail Trap</span>
              </div>
              <ul className="space-y-3 text-xs sm:text-sm text-slate-700 font-medium">
                <li className="flex items-start gap-2.5">
                  <span className="text-red-600 font-bold">✕</span>
                  <span>Trading lagging indicators (RSI, MACD, Moving Average Crossovers)</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-red-600 font-bold">✕</span>
                  <span>Entering at retail breakout highs right where institutions sell</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-red-600 font-bold">✕</span>
                  <span>Zero concept of order book depth, liquidity sweeps, or delta</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-red-600 font-bold">✕</span>
                  <span>Emotional position sizing and revenge trading after drawdowns</span>
                </li>
              </ul>
            </div>

            {/* Institutional Advantage */}
            <div className="p-8 rounded-3xl bg-blue-50/60 border border-blue-200/80 space-y-4 shadow-sm">
              <div className="flex items-center gap-2 text-blue-800 font-extrabold text-sm uppercase tracking-wider">
                <ShieldCheck className="h-5 w-5 text-blue-600" />
                <span>The MIIP Institutional Advantage</span>
              </div>
              <ul className="space-y-3 text-xs sm:text-sm text-slate-700 font-medium">
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>Trading real-time Volume Delta and Footprint imbalances</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>Entering alongside institutional absorption with tight stops</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>Exploiting Gamma Exposure (GEX) and VWAP mean reversion</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>Mathematical risk budgeting and disciplined trade logging</span>
                </li>
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* 4. DETAILED 4-MODULE CURRICULUM (BETTERMENT CARDS) */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-white border-y border-slate-200/80">
        <div className="mx-auto max-w-5xl">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-600">
              Curriculum Breakdown
            </span>
            <h4 className="text-2xl sm:text-4xl font-extrabold text-slate-900">
              Institutional Masterclass Modules
            </h4>
          </div>

          <div className="space-y-5">
            {syllabus.map((item) => (
              <div
                key={item.module}
                className="p-8 rounded-3xl bg-slate-50 border border-slate-200/80 shadow-md space-y-3.5 hover:border-blue-300 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                      {item.module}
                    </span>
                    <h5 className="text-lg sm:text-xl font-bold text-slate-900">
                      {item.title}
                    </h5>
                  </div>
                  <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Weekend Intensive</span>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {item.description}
                </p>

                <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {item.items.map((subItem) => (
                    <div
                      key={subItem}
                      className="p-3 rounded-2xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 flex items-center gap-2 shadow-sm"
                    >
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                      <span>{subItem}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. WHAT IS INCLUDED */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-600">
              The Full Stack
            </span>
            <h4 className="text-2xl sm:text-4xl font-extrabold text-slate-900">
              What Your ₹22,000 Enrollment Includes
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {whatYouGet.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-md flex items-start gap-4"
                >
                  <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="space-y-1">
                    <h5 className="text-base font-bold text-slate-900">{item.title}</h5>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Final Call to Action Box */}
          <div className="mt-14 p-10 rounded-3xl bg-gradient-to-r from-[#0A358F] to-[#1456F0] text-white text-center space-y-6 shadow-2xl">
            <h4 className="text-2xl sm:text-3xl font-extrabold">
              Ready to Upgrade Your Capital Execution?
            </h4>
            <p className="text-sm text-blue-100 max-w-xl mx-auto">
              Join the next cohort of institutional traders. Direct Google sign-in and secure Razorpay payment gateway checkout.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="btn-interactive inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white text-blue-900 font-extrabold text-base shadow-xl hover:bg-blue-50 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Sparkles className="h-5 w-5 text-blue-700" />
              <span>Register Now for ₹22,000</span>
              <ArrowRight className="h-5 w-5 text-blue-700" />
            </button>
          </div>
        </div>
      </section>

      {/* 6. STICKY MOBILE-FRIENDLY "REGISTER NOW" BOTTOM BAR */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-xl border-t border-slate-200 p-3 sm:p-4 md:hidden pb-safe shadow-2xl">
        <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold text-blue-700 tracking-wider">
              MIIP Enrollment
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-extrabold text-slate-900">₹22,000</span>
              <span className="text-[10px] text-slate-500 font-semibold">INR</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="btn-interactive flex-1 min-h-[48px] flex items-center justify-center gap-2 rounded-full bg-blue-600 active:bg-blue-700 text-white font-extrabold text-sm shadow-md shadow-blue-600/30"
          >
            <Sparkles className="h-4 w-4" />
            <span>Register Now</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Registration & Razorpay Flow Modal */}
      <RegisterFlowModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setAutoTrigger(false);
        }}
        autoTriggerCheckout={autoTrigger}
      />

    </div>
  );
}

export default function MiipPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-600">
        <div className="h-8 w-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <MiipContent />
    </Suspense>
  );
}
