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
    <div className="flex flex-col w-full pb-24 md:pb-16">
      
      {/* 1. HERO SALES SECTION */}
      <section className="relative pt-12 pb-16 px-4 sm:px-6 lg:px-8 border-b border-slate-800/80 bg-gradient-to-b from-dark-900/80 via-dark-950 to-dark-950 overflow-hidden">
        
        {/* Glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
        
        <div className="mx-auto max-w-5xl text-center space-y-6">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="h-4 w-4 text-amber-400" />
            <span>High-Ticket Quantitative Mentorship</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.12]">
            Momentum Institutional <br />
            <span className="bg-gradient-to-r from-amber-400 via-amber-200 to-emerald-400 bg-clip-text text-transparent">
              Investing Program (MIIP)
            </span>
          </h1>

          <p className="mx-auto max-w-2xl text-sm sm:text-lg text-slate-300 font-normal leading-relaxed">
            Transition from retail liquidity prey to an institutional momentum executor. Master order flow, dark pool accumulation, and quantitative trade execution.
          </p>

          {/* Pricing Highlight Card */}
          <div className="mx-auto max-w-md p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-dark-950 border border-amber-500/40 shadow-2xl shadow-amber-950/40 space-y-4">
            <div className="flex items-center justify-between text-xs uppercase tracking-wider text-slate-400">
              <span>Cohort Registration Fee</span>
              <span className="text-emerald-400 font-bold">Limited 25 Seats / Batch</span>
            </div>
            
            <div className="flex items-baseline justify-center gap-2">
              <span className="text-4xl sm:text-5xl font-extrabold text-white">₹22,000</span>
              <span className="text-sm font-semibold text-slate-400">INR (All-Inclusive)</span>
            </div>

            <p className="text-xs text-slate-400">
              Includes Saturday & Sunday Live Google Meet sessions, Student Portal dashboard, & Assessment Unlocks.
            </p>

            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="btn-interactive w-full min-h-[52px] flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-base shadow-xl shadow-amber-950/60 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Sparkles className="h-5 w-5" />
              <span>Register Now • ₹22,000</span>
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 pt-2 text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-amber-400" />
              <span>Weekend Live Batches</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Video className="h-4 w-4 text-emerald-400" />
              <span>Google Meet Direct Interactive</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Award className="h-4 w-4 text-teal-400" />
              <span>Certification on Quiz Completion</span>
            </div>
          </div>

        </div>
      </section>

      {/* 2. RETAIL TRADING VS INSTITUTIONAL REALITY */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-dark-900/40 border-b border-slate-800/80">
        <div className="mx-auto max-w-5xl">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-widest text-red-400">
              The Reality Check
            </h2>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              Why 95% of Retail Traders Fail
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Retail Flaws */}
            <div className="p-6 sm:p-8 rounded-2xl bg-red-950/10 border border-red-800/30 space-y-4">
              <div className="flex items-center gap-2 text-red-400 font-bold text-sm uppercase tracking-wider">
                <ShieldAlert className="h-5 w-5" />
                <span>The Retail Trap</span>
              </div>
              <ul className="space-y-3 text-xs sm:text-sm text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-red-400 font-bold">✕</span>
                  <span>Trading lagging indicators (RSI, MACD, Moving Average Crossovers)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 font-bold">✕</span>
                  <span>Entering at retail breakout highs right where institutions sell</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 font-bold">✕</span>
                  <span>Zero concept of order book depth, liquidity sweeps, or delta</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 font-bold">✕</span>
                  <span>Emotional position sizing and revenge trading after drawdowns</span>
                </li>
              </ul>
            </div>

            {/* Institutional Advantage */}
            <div className="p-6 sm:p-8 rounded-2xl bg-emerald-950/15 border border-emerald-500/30 space-y-4">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm uppercase tracking-wider">
                <ShieldCheck className="h-5 w-5" />
                <span>The MIIP Institutional Advantage</span>
              </div>
              <ul className="space-y-3 text-xs sm:text-sm text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>Trading real-time Volume Delta and Footprint imbalances</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>Entering alongside institutional absorption with tight stops</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>Exploiting Gamma Exposure (GEX) and VWAP mean reversion</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>Mathematical risk budgeting and disciplined trade logging</span>
                </li>
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* 3. DETAILED 4-MODULE CURRICULUM */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-widest text-amber-400">
              Curriculum Breakdown
            </h3>
            <h4 className="text-2xl sm:text-4xl font-extrabold text-white">
              Institutional Masterclass Modules
            </h4>
          </div>

          <div className="space-y-4">
            {syllabus.map((item, idx) => (
              <div
                key={item.module}
                className="p-6 sm:p-8 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-amber-500/40 transition-all space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-extrabold px-2.5 py-1 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      {item.module}
                    </span>
                    <h5 className="text-lg sm:text-xl font-bold text-white">
                      {item.title}
                    </h5>
                  </div>
                  <span className="text-xs text-slate-400 font-medium">Weekend Intensive</span>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {item.description}
                </p>

                <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {item.items.map((subItem) => (
                    <div
                      key={subItem}
                      className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/60 text-xs text-slate-300 flex items-center gap-2"
                    >
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                      <span>{subItem}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. WHAT IS INCLUDED */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 border-t border-slate-800/80 bg-dark-900/20">
        <div className="mx-auto max-w-6xl">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-widest text-emerald-400">
              The Full Stack
            </h3>
            <h4 className="text-2xl sm:text-4xl font-extrabold text-white">
              What Your ₹22,000 Enrollment Includes
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {whatYouGet.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="p-6 sm:p-8 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-start gap-4"
                >
                  <div className="h-12 w-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="space-y-1">
                    <h5 className="text-base font-bold text-white">{item.title}</h5>
                    <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Final Call to Action Box */}
          <div className="mt-12 p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-emerald-950/40 to-slate-900 border border-amber-500/30 text-center space-y-6">
            <h4 className="text-2xl sm:text-3xl font-extrabold text-white">
              Ready to Upgrade Your Capital Execution?
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
              Join the next cohort of institutional traders. Direct Google sign-in and secure Razorpay payment gateway checkout.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="btn-interactive inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-base shadow-xl shadow-amber-950/60 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Sparkles className="h-5 w-5" />
              <span>Register Now for ₹22,000</span>
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </section>

      {/* 5. STICKY MOBILE-FRIENDLY "REGISTER NOW" BOTTOM BAR (MANDATORY REQUIREMENT) */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-dark-950/95 backdrop-blur-xl border-t border-slate-800 p-3 sm:p-4 md:hidden pb-safe">
        <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
              MIIP Enrollment
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-extrabold text-white">₹22,000</span>
              <span className="text-[10px] text-slate-400">INR</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="btn-interactive flex-1 min-h-[48px] flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 active:from-amber-600 text-slate-950 font-bold text-sm shadow-lg shadow-amber-950/60"
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
      <div className="min-h-screen flex items-center justify-center bg-dark-950 text-slate-400">
        <div className="h-8 w-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <MiipContent />
    </Suspense>
  );
}
