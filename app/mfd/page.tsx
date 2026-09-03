'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Stethoscope, 
  Phone, 
  Award, 
  TrendingUp, 
  PieChart, 
  Lock, 
  Calendar, 
  Video, 
  FileText, 
  Layers, 
  Briefcase, 
  HeartHandshake, 
  Scale, 
  Zap, 
  ChevronRight,
  ShieldCheck,
  Building2,
  Check
} from 'lucide-react';
import { WhatsAppInlineBanner } from '@/components/WhatsAppPromoBanner';

export default function MfdPage() {
  // Interactive State for SIP Calculator
  const [sipAmount, setSipAmount] = useState<number>(15000);
  const sipYears = 10;
  const expectedReturn = 0.14; // 14% p.a. historical equity expectation
  
  const monthlyRate = expectedReturn / 12;
  const totalMonths = sipYears * 12;
  const investedAmount = sipAmount * totalMonths;
  const futureValue = sipAmount * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) * (1 + monthlyRate);
  const estimatedGains = futureValue - investedAmount;

  // Interactive State for Loan Against Mutual Funds (LAMF)
  const [portfolioValue, setPortfolioValue] = useState<number>(2500000);
  const approvedLimit = portfolioValue * 0.80; // 80% LTV

  // Category Tab State for "All Under One Roof" Section
  const [activeCategory, setActiveCategory] = useState<number>(0);

  // Scenario Card Interactive State
  const [activeScenario, setActiveScenario] = useState<number>(0);

  const onboardingUrl = "https://mweb.assetplus.in/client_onboarding/?advisor=688b3679af6048595923afd2";
  const phoneWhatsAppNumber = "+919042747590";

  // Category Tabs Data
  const categories = [
    {
      id: 'investment',
      title: 'Investment Planning',
      icon: TrendingUp,
      badge: 'Alpha Compounding',
      headline: 'Disciplined Factor-Driven Wealth Creation',
      description: 'Systematic mutual fund baskets, multi-cap equity funds, debt rebalancing, and smart tax-loss harvesting engineered to outpace inflation.',
      features: [
        'Automated SIP allocation & quarterly portfolio rebalancing',
        'Multi-asset diversification: Large, Mid, Small-Cap & Gold ETFs',
        'Direct AMFI-certified fund manager advisory',
        'Real-time XIRR performance tracking via unified client portal',
      ],
      metric: { label: 'Target Historical XIRR', value: '14-16% p.a.' }
    },
    {
      id: 'financial',
      title: 'Financial Planning',
      icon: PieChart,
      badge: 'Goal Architecture',
      headline: 'Milestone-Based Capital Allocation',
      description: 'Customized blueprints for retirement at 50/55, children higher education abroad, real estate acquisition, and generational wealth compounding.',
      features: [
        'Inflation-adjusted milestone mathematical modelling',
        'Contingency emergency reserve sizing (6-12 months expenses)',
        'Cashflow runway analysis and lifestyle budgeting',
        'Annual goal trajectory audits with certified financial planners',
      ],
      metric: { label: 'Goal Realization Rate', value: '98.4%' }
    },
    {
      id: 'tax',
      title: 'Tax Planning',
      icon: Scale,
      badge: 'Tax Optimization',
      headline: 'Maximize Net Post-Tax Take-Home Returns',
      description: 'Proactive tax optimization utilizing annual ₹1.25 Lakh LTCG exemption, Sec 80CCD NPS deductions, and tax-efficient Systematic Withdrawal Plans.',
      features: [
        'Automated annual ₹1.25L LTCG tax-free gains harvesting',
        'NPS Tier-1 additional ₹50,000 deduction under Sec 80CCD(1B)',
        'SWP vs Dividend tax comparison engine for retirees',
        'Capital gains statement generation for seamless ITR filing',
      ],
      metric: { label: 'Annual Tax Saved', value: 'Up to ₹1.25L+' }
    },
    {
      id: 'insurance',
      title: 'Insurance Planning',
      icon: ShieldCheck,
      badge: 'Family Protection',
      headline: 'Institutional Shield Against Life & Health Crises',
      description: 'Pure term life protection up to ₹10 Cr+ and cashless health insurance networks across 10,000+ top multi-specialty hospitals.',
      features: [
        'Zero-commission pure term life cover with critical illness riders',
        'Comprehensive family floater health cover with no room rent capping',
        'Specialized professional indemnity for practicing doctors & founders',
        'Dedicated 24/7 priority cashless claim settlement desk',
      ],
      metric: { label: 'Hospital Network', value: '10,000+ Cashless' }
    },
    {
      id: 'liability',
      title: 'Liability Management',
      icon: Briefcase,
      badge: 'Instant Liquidity',
      headline: 'Loan Against Mutual Funds (LAMF) at 80% LTV',
      description: 'Unlock instant bank overdraft liquidity without redeeming your investments, breaking your compounding curve, or triggering capital gains tax.',
      features: [
        'Instant digital sanction at 80% Loan-to-Value (LTV)',
        'Pay interest only on the amount utilized, zero prepayment penalty',
        'Portfolio units continue compounding and receiving dividends',
        'Same-day digital disbursement directly to your bank account',
      ],
      metric: { label: 'Approved LTV', value: 'Up to 80%' }
    },
    {
      id: 'succession',
      title: 'Succession Planning',
      icon: HeartHandshake,
      badge: 'Generational Legacy',
      headline: 'Smooth & Dispute-Free Wealth Transmission',
      description: 'Protect your legacy through structured nominee audits, family trust advisory, and legally sound digital estate planning.',
      features: [
        'Unified nominee audit across all mutual funds, demat & bank accounts',
        'Family trust structuring for smooth inter-generational handover',
        'Will drafting assistance with registered legal consultants',
        'Asset consolidation map for immediate family clarity',
      ],
      metric: { label: 'Legacy Security', value: '100% Verified' }
    },
  ];

  return (
    <div className="min-h-screen bg-surface text-storm font-sans selection:bg-bumblebee selection:text-storm pb-40 md:pb-16">
      
      {/* ========================================================================= */}
      {/* 1. HERO SECTION & TRUST BADGE (MATCHING REFERENCE DESIGN) */}
      {/* ========================================================================= */}
      <section className="relative bg-storm text-surface overflow-hidden pt-20 pb-28 px-4 sm:px-6 lg:px-8 border-b border-storm-800">
        
        {/* Subtle Ambient Brand Glows & Architectural Grid */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-bumblebee/10 via-storm to-storm-950 pointer-events-none" />
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-bumblebee/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-joyous/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center space-y-8 relative z-10">
          
          {/* Regulatory & Institutional Pill */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-storm-800/90 border border-bumblebee/30 text-caption font-bold tracking-wide uppercase backdrop-blur-md text-bumblebee shadow-sm"
          >
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-bumblebee opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-bumblebee" />
            </span>
            <span>We&apos;re SEBI Regulated & AMFI Registered</span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-display font-extrabold tracking-tight leading-[1.1] text-surface max-w-4xl mx-auto"
          >
            Financial advice, <br />
            <span className="italic font-serif text-bumblebee drop-shadow-sm font-normal">tailored</span> for you.
          </motion.h1>

          {/* Sub-headline */}
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-body sm:text-lg text-slate-300 font-normal max-w-2xl mx-auto leading-relaxed"
          >
            We help you manage every aspect of your personal finances, all in one place.
          </motion.p>

          {/* Primary CTA Area */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2 max-w-md mx-auto"
          >
            <a
              href={onboardingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-interactive w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-bumblebee hover:bg-bumblebee-400 text-storm font-extrabold text-body shadow-xl transition-all transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Start your journey</span>
              <ArrowRight className="h-5 w-5 text-storm" />
            </a>

            <a
              href={`https://wa.me/${phoneWhatsAppNumber.replace('+', '')}?text=Hi,%20I%20would%20like%20to%20schedule%20a%201-to-1%20wealth%20consultation.`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-interactive w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 py-4 rounded-full bg-storm-800 hover:bg-storm-700 text-surface font-bold text-sm border border-storm-600 backdrop-blur-md transition-all"
            >
              <Phone className="h-4 w-4 text-bumblebee" />
              <span>Talk to our experts</span>
            </a>
          </motion.div>

          {/* Social Proof Strip (Matching Reference) */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="pt-10 border-t border-storm-800 max-w-4xl mx-auto"
          >
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-center text-left sm:text-center divide-y sm:divide-y-0 sm:divide-x divide-storm-800 text-slate-300 text-xs">
              <div className="pb-3 sm:pb-0 flex items-center justify-center gap-2">
                <span className="text-2xl font-black text-bumblebee">100%</span>
                <span className="text-caption font-bold text-slate-300 text-left leading-tight">of our<br />members</span>
              </div>
              <div className="py-2 sm:py-0 px-3">
                <p className="font-semibold text-surface">Feel improved</p>
                <p className="text-caption text-slate-400">financial confidence</p>
              </div>
              <div className="py-2 sm:py-0 px-3">
                <p className="font-semibold text-surface">Gain clarity on</p>
                <p className="text-caption text-slate-400">their financial goals</p>
              </div>
              <div className="pt-2 sm:pt-0 px-3">
                <p className="font-semibold text-surface">Recommend us</p>
                <p className="text-caption text-slate-400">to their peers</p>
              </div>
            </div>
          </motion.div>

        </div>
      </section>


      {/* ========================================================================= */}
      {/* 2. PHILOSOPHY & INTERACTIVE QUESTION CARDS (MATCHING REFERENCE IMAGE 2) */}
      {/* ========================================================================= */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-surface">
        <div className="max-w-6xl mx-auto space-y-16">
          
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <h2 className="text-3xl sm:text-5xl font-extrabold text-storm tracking-tight leading-tight">
              No two lives follow the same path. <br />
              So, we plan specifically to <span className="italic font-serif text-bumblebee-600 font-normal">yours.</span>
            </h2>
            <p className="text-body text-slate-600">
              Personal finance isn&apos;t one-size-fits-all. We simulate your exact life milestones to answer the questions that matter most.
            </p>
          </div>

          {/* 3 Interactive Question Scenario Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Card 1: Debt vs Investing */}
            <div 
              onClick={() => setActiveScenario(0)}
              className={`cursor-pointer rounded-3xl p-8 border transition-all duration-300 shadow-brand hover:shadow-brand-hover flex flex-col justify-between ${
                activeScenario === 0 ? 'bg-[#FEFEFE] border-storm ring-2 ring-storm/10' : 'bg-[#FEFEFE] border-slate-200'
              }`}
            >
              <div className="space-y-6">
                {/* Visual Blueprint Mockup */}
                <div className="h-48 rounded-2xl bg-storm-50/70 border border-storm-100 p-4 relative flex flex-col justify-center items-center overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(#000B4F_1px,transparent_1px)] [background-size:16px_16px] opacity-10" />
                  
                  <div className="relative z-10 w-full space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200 shadow-sm">
                      <div className="flex items-center gap-2">
                        <span className="h-6 w-6 rounded-full bg-joyous-50 text-joyous font-bold text-xs flex items-center justify-center">₹</span>
                        <span className="text-caption font-bold text-slate-700">Prepay Loan? (8.5%)</span>
                      </div>
                      <span className="text-caption font-bold text-joyous">Interest saved</span>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-storm-200 shadow-sm">
                      <div className="flex items-center gap-2">
                        <span className="h-6 w-6 rounded-full bg-storm-50 text-storm font-bold text-xs flex items-center justify-center">₹</span>
                        <span className="text-caption font-bold text-storm">Invest in SIP? (14.5%)</span>
                      </div>
                      <span className="text-caption font-extrabold text-emerald-600">+₹18.4L Alpha</span>
                    </div>
                  </div>
                </div>

                <p className="text-h3 font-bold text-storm leading-snug">
                  &ldquo;Is it wiser to pay off more of my debt or invest the money?&rdquo;
                </p>
              </div>

              <div className="pt-6 border-t border-slate-100 text-caption text-slate-500 font-semibold flex items-center justify-between">
                <span>Mathematical Arbitrage</span>
                <span className="text-storm font-bold">Optimal Blend &rarr;</span>
              </div>
            </div>

            {/* Card 2: Goal Tracking */}
            <div 
              onClick={() => setActiveScenario(1)}
              className={`cursor-pointer rounded-3xl p-8 border transition-all duration-300 shadow-brand hover:shadow-brand-hover flex flex-col justify-between ${
                activeScenario === 1 ? 'bg-[#FEFEFE] border-storm ring-2 ring-storm/10' : 'bg-[#FEFEFE] border-slate-200'
              }`}
            >
              <div className="space-y-6">
                {/* Visual Blueprint Mockup */}
                <div className="h-48 rounded-2xl bg-storm-50/70 border border-storm-100 p-4 relative flex flex-col justify-center items-center overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(#000B4F_1px,transparent_1px)] [background-size:16px_16px] opacity-10" />
                  
                  <div className="relative z-10 w-full space-y-2 text-center">
                    <div className="grid grid-cols-2 gap-2 text-caption">
                      <div className="p-2 rounded-lg bg-white border border-slate-200 shadow-sm font-semibold text-storm">
                        Retirement
                      </div>
                      <div className="p-2 rounded-lg bg-white border border-slate-200 shadow-sm font-semibold text-slate-600">
                        Kids Higher Ed
                      </div>
                      <div className="p-2 rounded-lg bg-white border border-slate-200 shadow-sm font-semibold text-slate-600">
                        Equity Stocks
                      </div>
                      <div className="p-2 rounded-lg bg-white border border-slate-200 shadow-sm font-semibold text-slate-600">
                        Term Cover
                      </div>
                    </div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-bumblebee/20 text-storm font-extrabold text-[11px] border border-bumblebee/40">
                      <span>✓ All Baskets Synced</span>
                    </div>
                  </div>
                </div>

                <p className="text-h3 font-bold text-storm leading-snug">
                  &ldquo;Am I on the right track to reach my financial milestones?&rdquo;
                </p>
              </div>

              <div className="pt-6 border-t border-slate-100 text-caption text-slate-500 font-semibold flex items-center justify-between">
                <span>Multi-Asset Alignment</span>
                <span className="text-storm font-bold">Track Now &rarr;</span>
              </div>
            </div>

            {/* Card 3: Early Retirement */}
            <div 
              onClick={() => setActiveScenario(2)}
              className={`cursor-pointer rounded-3xl p-8 border transition-all duration-300 shadow-brand hover:shadow-brand-hover flex flex-col justify-between ${
                activeScenario === 2 ? 'bg-[#FEFEFE] border-storm ring-2 ring-storm/10' : 'bg-[#FEFEFE] border-slate-200'
              }`}
            >
              <div className="space-y-6">
                {/* Visual Blueprint Mockup */}
                <div className="h-48 rounded-2xl bg-storm-50/70 border border-storm-100 p-4 relative flex flex-col justify-center items-center overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(#000B4F_1px,transparent_1px)] [background-size:16px_16px] opacity-10" />
                  
                  <div className="relative z-10 w-full text-center space-y-2">
                    <div className="p-4 rounded-2xl bg-white border border-storm-200 shadow-sm inline-block w-full">
                      <p className="text-3xl font-black text-storm">55 yrs</p>
                      <p className="text-caption font-bold text-slate-500 uppercase tracking-wider mt-0.5">Retirement Goal Age</p>
                      <div className="mt-2 w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full rounded-full w-[100%]" />
                      </div>
                      <p className="text-[11px] font-extrabold text-emerald-600 mt-1">100% Achieved on Strategy</p>
                    </div>
                  </div>
                </div>

                <p className="text-h3 font-bold text-storm leading-snug">
                  &ldquo;How can I retire early with predictable passive monthly cashflows?&rdquo;
                </p>
              </div>

              <div className="pt-6 border-t border-slate-100 text-caption text-slate-500 font-semibold flex items-center justify-between">
                <span>SWP & Compounding</span>
                <span className="text-storm font-bold">Calculate &rarr;</span>
              </div>
            </div>

          </div>

        </div>
      </section>


      {/* ========================================================================= */}
      {/* 3. CORE PILLARS & "ALL UNDER ONE ROOF" CATEGORY NAVIGATION (IMAGE 3) */}
      {/* ========================================================================= */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-storm text-surface border-y border-storm-800">
        <div className="max-w-6xl mx-auto space-y-16">
          
          {/* Core Pillars Checkmarks & Vertical Golden Line */}
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 pb-12 border-b border-storm-800">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-2xl bg-bumblebee text-storm flex items-center justify-center font-black">
                  <Check className="h-6 w-6 stroke-[3]" />
                </div>
                <h3 className="text-3xl sm:text-4xl font-extrabold text-surface">Unbiased Advice</h3>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-2xl bg-bumblebee text-storm flex items-center justify-center font-black">
                  <Check className="h-6 w-6 stroke-[3]" />
                </div>
                <h3 className="text-3xl sm:text-4xl font-extrabold text-surface font-serif italic text-bumblebee font-normal">Personalized Plans</h3>
              </div>
            </div>

            <div className="max-w-md text-slate-300 text-body leading-relaxed">
              We operate strictly in your fiduciary best interest. Zero opaque product pushing. Every allocation is driven by institutional quantitative factor models.
            </div>
          </div>

          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <h3 className="text-3xl sm:text-5xl font-extrabold text-surface tracking-tight">
              All your financial needs, <br />
              <span className="italic font-serif text-bumblebee font-normal">under one roof</span>
            </h3>
            <p className="text-slate-300 text-body">
              Switch between service categories to explore our comprehensive wealth advisory architecture.
            </p>
          </div>

          {/* Category Navigation Tabs Pill Bar */}
          <div className="flex flex-wrap items-center justify-center gap-2 max-w-5xl mx-auto">
            {categories.map((cat, idx) => {
              const Icon = cat.icon;
              const isActive = activeCategory === idx;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(idx)}
                  className={`btn-interactive flex items-center gap-2 px-5 py-3 rounded-full text-caption font-bold transition-all ${
                    isActive 
                      ? 'bg-bumblebee text-storm shadow-lg scale-105' 
                      : 'bg-storm-800/80 hover:bg-storm-700 text-slate-300 border border-storm-700'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{cat.title}</span>
                </button>
              );
            })}
          </div>

          {/* Active Category Deep-Dive Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="rounded-3xl bg-[#FEFEFE] text-storm p-8 sm:p-12 border border-slate-200 shadow-2xl max-w-5xl mx-auto"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                
                <div className="lg:col-span-8 space-y-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-storm-50 text-storm border border-storm-100 text-caption font-extrabold uppercase tracking-wider">
                    <span>{categories[activeCategory].badge}</span>
                  </div>

                  <h4 className="text-2xl sm:text-4xl font-extrabold text-storm tracking-tight">
                    {categories[activeCategory].headline}
                  </h4>

                  <p className="text-slate-600 text-body leading-relaxed">
                    {categories[activeCategory].description}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {categories[activeCategory].features.map((feat) => (
                      <div key={feat} className="flex items-start gap-2.5 text-caption sm:text-sm text-slate-700 font-medium">
                        <CheckCircle2 className="h-4 w-4 text-storm shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Action & Metric Badge */}
                <div className="lg:col-span-4 rounded-2xl bg-storm text-surface p-6 border border-storm-800 space-y-6 text-center flex flex-col justify-between">
                  <div className="space-y-2">
                    <span className="text-caption text-slate-300 uppercase font-bold tracking-wider block">
                      {categories[activeCategory].metric.label}
                    </span>
                    <p className="text-3xl sm:text-4xl font-black text-bumblebee">
                      {categories[activeCategory].metric.value}
                    </p>
                  </div>

                  <a
                    href={onboardingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-interactive w-full py-3.5 rounded-xl bg-bumblebee hover:bg-bumblebee-400 text-storm font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <span>Execute Plan</span>
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </div>

              </div>
            </motion.div>
          </AnimatePresence>

        </div>
      </section>


      {/* ========================================================================= */}
      {/* 4. INTERACTIVE PRODUCT MODULES (SIP & LAMF CALCULATORS) */}
      {/* ========================================================================= */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
        
        <div className="text-center space-y-3">
          <h2 className="text-caption font-bold uppercase tracking-widest text-storm bg-bumblebee/20 px-3 py-1 rounded-full inline-block border border-bumblebee/40">
            Interactive Advisory Engines
          </h2>
          <p className="text-3xl sm:text-h1 font-serif text-storm">Engineered for Maximum Yield</p>
          <p className="text-slate-600 max-w-xl mx-auto text-body">
            Select your strategy and let institutional automation handle rebalancing, tax-loss harvesting, and credit line creation.
          </p>
        </div>

        {/* 3-Column Card Grid with White Surface Top & Interactive Bottom */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Card 1: SIP & Mutual Funds */}
          <div className="bg-[#FEFEFE] rounded-3xl border border-slate-200 shadow-brand overflow-hidden flex flex-col justify-between hover:shadow-brand-hover transition-all">
            <div className="p-8 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-storm-50 border border-storm-100 flex items-center justify-center text-storm font-bold text-lg">
                01
              </div>
              <h3 className="text-h3 font-serif font-bold text-storm">SIP & Mutual Funds</h3>
              <p className="text-slate-600 text-body leading-relaxed">
                Build long-term wealth with automated monthly disciplined allocations and smart tax harvesting.
              </p>
            </div>

            {/* Interactive Storm Bottom Module */}
            <div className="bg-storm p-6 text-surface space-y-4">
              <div className="flex justify-between items-center text-caption text-slate-300">
                <span>Monthly Allocation:</span>
                <span className="font-bold text-storm bg-bumblebee px-2.5 py-1 rounded-lg">₹{sipAmount.toLocaleString('en-IN')}/mo</span>
              </div>
              <input 
                type="range" 
                min={1000} 
                max={100000} 
                step={1000}
                value={sipAmount}
                onChange={(e) => setSipAmount(Number(e.target.value))}
                className="w-full accent-bumblebee bg-storm-800 rounded-lg h-2 cursor-pointer"
                aria-label="SIP Monthly Allocation"
              />
              <div className="pt-2 border-t border-storm-700 flex justify-between items-center text-caption">
                <span className="text-slate-300">Est. 10Y Growth:</span>
                <span className="font-bold text-bumblebee">+₹{(estimatedGains / 100000).toFixed(2)} Lakhs</span>
              </div>
              <a 
                href={onboardingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-interactive block text-center w-full py-3.5 rounded-xl bg-bumblebee hover:bg-bumblebee-400 text-storm font-bold text-sm shadow-lg transition-all"
              >
                Start SIP Portfolio &rarr;
              </a>
            </div>
          </div>

          {/* Card 2: Loan Against Mutual Funds (LAMF) */}
          <div className="bg-[#FEFEFE] rounded-3xl border border-slate-200 shadow-brand overflow-hidden flex flex-col justify-between hover:shadow-brand-hover transition-all">
            <div className="p-8 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-storm-50 border border-storm-100 flex items-center justify-center text-storm font-bold text-lg">
                02
              </div>
              <h3 className="text-h3 font-serif font-bold text-storm">Loan Against Mutual Funds</h3>
              <p className="text-slate-600 text-body leading-relaxed">
                Unlock instant bank overdraft liquidity without breaking your compounding or triggering capital gains tax.
              </p>
            </div>

            {/* Interactive Dark Bottom Module */}
            <div className="bg-storm-950 p-6 text-surface space-y-4">
              <div className="flex justify-between items-center text-caption text-slate-400">
                <span>Pledged Portfolio:</span>
                <span className="font-bold text-surface bg-storm-800 px-2.5 py-1 rounded-lg">₹{(portfolioValue / 100000).toFixed(1)} Lakhs</span>
              </div>
              <input 
                type="range" 
                min={500000} 
                max={10000000} 
                step={500000}
                value={portfolioValue}
                onChange={(e) => setPortfolioValue(Number(e.target.value))}
                className="w-full accent-bumblebee bg-storm-800 rounded-lg h-2 cursor-pointer"
                aria-label="Pledged Portfolio Amount"
              />
              <div className="pt-2 border-t border-storm-800 flex justify-between items-center text-caption">
                <span className="text-slate-400">Overdraft Limit (80% LTV):</span>
                <span className="font-bold text-bumblebee">₹{approvedLimit.toLocaleString('en-IN')}</span>
              </div>
              <a 
                href={onboardingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-interactive block text-center w-full py-3.5 rounded-xl bg-storm-800 hover:bg-storm-700 text-surface font-bold text-sm shadow-lg transition-all"
              >
                Access Credit Line &rarr;
              </a>
            </div>
          </div>

          {/* Card 3: Term & Health Insurance Protection */}
          <div className="bg-[#FEFEFE] rounded-3xl border border-slate-200 shadow-brand overflow-hidden flex flex-col justify-between hover:shadow-brand-hover transition-all">
            <div className="p-8 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-joyous-50 border border-joyous-100 flex items-center justify-center text-joyous font-bold text-lg">
                03
              </div>
              <h3 className="text-h3 font-serif font-bold text-storm">Term & Health Protection</h3>
              <p className="text-slate-600 text-body leading-relaxed">
                Multi-crore life cover and cashless health networks across 10,000+ top hospitals for family security.
              </p>
            </div>

            {/* Digital Policy Card Visual Bottom Module */}
            <div className="bg-storm-900 p-6 text-surface space-y-4">
              <div className="flex justify-between items-center text-caption text-bumblebee">
                <span className="font-bold uppercase tracking-wider">Verified Active Cover</span>
                <span className="w-2.5 h-2.5 rounded-full bg-bumblebee animate-pulse" />
              </div>
              <div className="bg-storm-800/80 border border-storm-700 rounded-2xl p-3.5">
                <p className="text-caption text-slate-300">Composite Life Protection</p>
                <p className="text-xl font-black text-surface">₹10 Crore+ Life Cover</p>
              </div>
              <a 
                href={onboardingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-interactive block text-center w-full py-3.5 rounded-xl bg-joyous hover:bg-joyous-600 text-surface font-bold text-sm shadow-lg transition-all"
              >
                Explore Protection Plans &rarr;
              </a>
            </div>
          </div>

        </div>

        {/* Secondary Row: SWP/STP & NPS/FD */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <div className="bg-[#FEFEFE] rounded-3xl border border-slate-200 p-8 shadow-brand flex flex-col justify-between">
            <div className="space-y-4">
              <span className="px-3 py-1 rounded-full bg-storm-50 text-storm text-caption font-bold uppercase tracking-wide border border-storm-100">Cashflow Management</span>
              <h3 className="text-h2 font-serif font-bold text-storm">SWP & STP Automation</h3>
              <p className="text-slate-600 text-body leading-relaxed">
                Systematic Withdrawal Plans (SWP) for tax-efficient retirement income and Systematic Transfer Plans (STP) to dollar-cost average safely into equities.
              </p>
              <ul className="space-y-2 text-body font-medium text-slate-700 pt-2">
                <li className="flex items-center gap-2">✓ Automated monthly payouts directly to your bank account</li>
                <li className="flex items-center gap-2">✓ Zero capital gains tax on principal drawdown components</li>
              </ul>
            </div>
            <div className="pt-8">
              <a href={onboardingUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-storm hover:text-storm-700 font-bold text-sm">
                Configure Cashflows &rarr;
              </a>
            </div>
          </div>

          <div className="bg-[#FEFEFE] rounded-3xl border border-slate-200 p-8 shadow-brand flex flex-col justify-between">
            <div className="space-y-4">
              <span className="px-3 py-1 rounded-full bg-bumblebee/20 text-storm text-caption font-bold uppercase tracking-wide border border-bumblebee/30">Retirement & Tax Shield</span>
              <h3 className="text-h2 font-serif font-bold text-storm">NPS & High-Yield FDs</h3>
              <p className="text-slate-600 text-body leading-relaxed">
                National Pension System (NPS) allocations for additional tax deductions under Sec 80CCD(1B), combined with elite corporate fixed deposits.
              </p>
              <ul className="space-y-2 text-body font-medium text-slate-700 pt-2">
                <li className="flex items-center gap-2">✓ Extra tax savings under Section 80CCD</li>
                <li className="flex items-center gap-2">✓ Curated high-yield corporate FD instruments</li>
              </ul>
            </div>
            <div className="pt-8">
              <a href={onboardingUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-storm hover:text-storm-700 font-bold text-sm">
                Secure Retirement &rarr;
              </a>
            </div>
          </div>

        </div>

      </section>


      {/* ========================================================================= */}
      {/* 5. 4-STEP ONBOARDING JOURNEY (MATCHING REFERENCE IMAGES 4 & 5) */}
      {/* ========================================================================= */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-storm-50/50 border-y border-slate-200">
        <div className="max-w-5xl mx-auto space-y-16">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-caption font-bold uppercase tracking-widest text-storm bg-bumblebee/20 px-3 py-1 rounded-full inline-block border border-bumblebee/40">
              Structured Roadmap
            </span>
            <h2 className="text-3xl sm:text-h1 font-extrabold text-storm tracking-tight">
              Take control of your finances in just four steps
            </h2>
            <p className="text-body text-slate-600">
              A transparent, zero-stress advisory process designed to bring total clarity to your family&apos;s financial future.
            </p>
          </div>

          {/* Vertical 4-Step Timeline with Connecting Gold Line */}
          <div className="relative pl-6 sm:pl-10 space-y-12 before:absolute before:left-3 sm:before:left-5 before:top-4 before:bottom-4 before:w-1 before:bg-bumblebee">
            
            {/* Step 01 */}
            <div className="relative flex flex-col md:flex-row gap-6 md:gap-10 items-start">
              <div className="absolute -left-6 sm:-left-10 h-7 w-7 rounded-full bg-storm border-4 border-bumblebee flex items-center justify-center text-[10px] font-bold text-surface shrink-0" />
              
              <div className="md:w-1/3">
                <span className="text-4xl font-black text-slate-300 block font-mono">01</span>
                <h3 className="text-2xl font-bold text-storm mt-1">Discovery call</h3>
                <p className="text-slate-600 text-caption mt-2 leading-relaxed">
                  We begin by understanding your current finances, goals, responsibilities, and risk appetite so that every step forward is informed.
                </p>
              </div>

              {/* Visual Mockup Card */}
              <div className="md:w-2/3 w-full rounded-3xl bg-storm text-surface p-6 border border-storm-800 shadow-xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-storm-700">
                  <span className="text-caption uppercase tracking-wider text-bumblebee font-bold">Intro Call</span>
                  <span className="text-[11px] text-slate-300">15 min Google Meet</span>
                </div>
                <p className="text-xs text-slate-300">
                  We will understand your financial situation in detail: cashflows, existing insurance policies, active loans, and milestone timelines.
                </p>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-storm-800 border border-storm-700 text-caption text-surface font-semibold">
                  <Video className="h-4 w-4 text-bumblebee" />
                  <span>Interactive 1-on-1 Session</span>
                </div>
              </div>
            </div>

            {/* Step 02 */}
            <div className="relative flex flex-col md:flex-row gap-6 md:gap-10 items-start">
              <div className="absolute -left-6 sm:-left-10 h-7 w-7 rounded-full bg-storm border-4 border-bumblebee flex items-center justify-center text-[10px] font-bold text-surface shrink-0" />
              
              <div className="md:w-1/3">
                <span className="text-4xl font-black text-slate-300 block font-mono">02</span>
                <h3 className="text-2xl font-bold text-storm mt-1">Action Plan</h3>
                <p className="text-slate-600 text-caption mt-2 leading-relaxed">
                  We construct a holistic, prioritized financial blueprint mapping investments, tax savings, insurance covers, and debt optimization.
                </p>
              </div>

              {/* Visual Mockup Card */}
              <div className="md:w-2/3 w-full rounded-3xl bg-storm text-surface p-6 border border-storm-800 shadow-xl space-y-3">
                <span className="text-caption uppercase tracking-wider text-bumblebee font-bold block pb-2 border-b border-storm-700">
                  Customized Blueprint
                </span>
                <div className="space-y-2 text-caption">
                  <div className="flex items-center gap-2 text-slate-200">
                    <span className="h-2 w-2 rounded-full bg-bumblebee" />
                    <span>Update term & health insurance policies</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-200">
                    <span className="h-2 w-2 rounded-full bg-bumblebee" />
                    <span>Start goal-based systematic equity SIP allocations</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-200">
                    <span className="h-2 w-2 rounded-full bg-bumblebee" />
                    <span>Structure emergency contingency reserve fund</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-200">
                    <span className="h-2 w-2 rounded-full bg-bumblebee" />
                    <span>Maximize Section 80CCD NPS tax deductions</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 03 */}
            <div className="relative flex flex-col md:flex-row gap-6 md:gap-10 items-start">
              <div className="absolute -left-6 sm:-left-10 h-7 w-7 rounded-full bg-storm border-4 border-bumblebee flex items-center justify-center text-[10px] font-bold text-surface shrink-0" />
              
              <div className="md:w-1/3">
                <span className="text-4xl font-black text-slate-300 block font-mono">03</span>
                <h3 className="text-2xl font-bold text-storm mt-1">Guided Walkthrough</h3>
                <p className="text-slate-600 text-caption mt-2 leading-relaxed">
                  We walk you through the plan in detail, ensuring you understand each recommendation and mathematical rationale before you take action.
                </p>
              </div>

              {/* Visual Mockup Card */}
              <div className="md:w-2/3 w-full rounded-3xl bg-storm text-surface p-6 border border-storm-800 shadow-xl space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-bumblebee text-storm flex items-center justify-center font-bold">
                    BR
                  </div>
                  <div>
                    <p className="text-sm font-bold text-surface">Senior Wealth Strategist</p>
                    <p className="text-caption text-slate-400">Brewrich Advisory Desk</p>
                  </div>
                </div>
                <p className="text-xs text-slate-300">
                  Complete transparent rationale provided for every asset class weighting, fund scheme selection, and risk management trigger.
                </p>
              </div>
            </div>

            {/* Step 04 */}
            <div className="relative flex flex-col md:flex-row gap-6 md:gap-10 items-start">
              <div className="absolute -left-6 sm:-left-10 h-7 w-7 rounded-full bg-storm border-4 border-bumblebee flex items-center justify-center text-[10px] font-bold text-surface shrink-0" />
              
              <div className="md:w-1/3">
                <span className="text-4xl font-black text-slate-300 block font-mono">04</span>
                <h3 className="text-2xl font-bold text-storm mt-1">Monitoring & Reviews</h3>
                <p className="text-slate-600 text-caption mt-2 leading-relaxed">
                  Continuous dashboard tracking, quarterly portfolio reviews, automated tax harvesting, and proactive rebalancing.
                </p>
              </div>

              {/* Visual Mockup Card */}
              <div className="md:w-2/3 w-full rounded-3xl bg-storm text-surface p-6 border border-storm-800 shadow-xl space-y-3">
                <span className="text-caption uppercase tracking-wider text-bumblebee font-bold block pb-2 border-b border-storm-700">
                  Continuous Support
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-caption">
                  <div className="p-2.5 rounded-xl bg-storm-800 text-center text-slate-200">
                    <p className="font-bold text-surface">Dashboard</p>
                    <p className="text-[10px] text-slate-400">24/7 Access</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-storm-800 text-center text-slate-200">
                    <p className="font-bold text-surface">Quarterly</p>
                    <p className="text-[10px] text-slate-400">Strategy Audits</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-storm-800 text-center text-slate-200">
                    <p className="font-bold text-surface">Tax Filing</p>
                    <p className="text-[10px] text-slate-400">Harvesting Support</p>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>


      {/* ========================================================================= */}
      {/* 6. SPECIALIZED MEDICAL PROFESSIONALS & HNI WEALTH DESK (MANDATORY) */}
      {/* ========================================================================= */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-surface">
        <div className="max-w-6xl mx-auto space-y-12">
          
          <div className="rounded-3xl bg-storm text-surface p-8 sm:p-12 border border-storm-800 shadow-2xl relative overflow-hidden">
            
            {/* Background Medical Shield Ambient */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-bumblebee/5 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-8">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-storm-800 pb-6">
                <div className="flex items-center gap-3.5">
                  <div className="h-14 w-14 rounded-2xl bg-bumblebee text-storm flex items-center justify-center shadow-lg">
                    <Stethoscope className="h-8 w-8" />
                  </div>
                  <div>
                    <span className="text-caption uppercase font-extrabold tracking-wider text-bumblebee block">
                      Dedicated HNI Practice Desk
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-surface">
                      Specialized Medical Professionals Desk
                    </h3>
                  </div>
                </div>

                <span className="text-caption font-bold px-3.5 py-1.5 rounded-full bg-storm-800 text-slate-200 border border-storm-700 self-start sm:self-auto">
                  Tailored Doctor Wealth Architecture
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                
                <div className="lg:col-span-7 space-y-4 text-body text-slate-300 leading-relaxed">
                  <p>
                    Practicing doctors and medical specialists face unique financial dynamics: high early-career opportunity costs, substantial practice cashflows, complex professional indemnity liabilities, and demanding surgical schedules with zero time to monitor markets.
                  </p>
                  <p>
                    Brewrich operates a specialized private advisory desk providing structured, hands-off portfolio compounding, clinical income tax shields, and liquid overdraft facilities.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-caption font-semibold text-slate-200">
                    <div className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-bumblebee" />
                      <span>Doctor Professional Indemnity & Risk Shields</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-bumblebee" />
                      <span>Clinical Equipment & Practice Cashflow Structuring</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-bumblebee" />
                      <span>High-Bracket Tax Shielding & LTCG Harvesting</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-bumblebee" />
                      <span>Direct 1-on-1 Senior Wealth Strategist Consultations</span>
                    </div>
                  </div>
                </div>

                {/* Honored Medical Client Registry Card */}
                <div className="lg:col-span-5 rounded-2xl bg-storm-950 p-6 border border-storm-700 space-y-4">
                  <span className="text-caption uppercase tracking-wider text-bumblebee font-bold block">
                    Specialized Medical Advisory Desk Clients
                  </span>

                  <div className="space-y-2.5">
                    {[
                      { name: 'Dr. Kalaiyarasi', title: 'Medical Consultant & Specialist' },
                      { name: 'Dr. Daniel Benedict Devraj', title: 'Medical Specialist & Surgeon' },
                      { name: 'Dr. Gokulnath', title: 'Healthcare Practitioner' },
                      { name: 'Dr. Yeshwant', title: 'Senior Medical Professional' },
                    ].map((doc) => (
                      <div key={doc.name} className="p-3 rounded-xl bg-storm-900 border border-storm-800 flex items-center justify-between">
                        <div>
                          <p className="text-sm font-bold text-surface">{doc.name}</p>
                          <p className="text-[10px] text-slate-400">{doc.title}</p>
                        </div>
                        <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                      </div>
                    ))}
                  </div>

                  <a
                    href={`https://wa.me/${phoneWhatsAppNumber.replace('+', '')}?text=Hi,%20I%20am%20a%20medical%20professional%20and%20would%20like%20to%20consult%20with%20the%20Specialized%20Doctors%20Wealth%20Desk.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-interactive block text-center w-full py-3 rounded-xl bg-bumblebee hover:bg-bumblebee-400 text-storm font-extrabold text-caption shadow-md transition-all mt-2"
                  >
                    Schedule Private Doctor Desk Consultation &rarr;
                  </a>
                </div>

              </div>

            </div>
          </div>

        </div>
      </section>


      {/* ========================================================================= */}
      {/* 7. GLOBAL WHATSAPP CHANNEL INLINE CONVERSION BANNER */}
      {/* ========================================================================= */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto pb-12">
        <WhatsAppInlineBanner 
          title="Stay Ahead With Institutional Market Insights"
          subtitle="Join our exclusive WhatsApp broadcast for real-time SIP fund rebalancing alerts, IPO analysis, tax-saving strategies, and live weekend webinars."
        />
      </section>


      {/* ========================================================================= */}
      {/* 8. 1-TO-1 CONSULTATION HUB */}
      {/* ========================================================================= */}
      <section className="bg-storm text-surface py-16 px-4 sm:px-6 lg:px-8 border-t border-storm-800">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-3xl sm:text-h1 font-serif font-bold text-surface">Need Customized Portfolio Allocation?</h2>
          <p className="text-slate-300 text-body max-w-2xl mx-auto">
            Book a 1-to-1 consultation session with our certified financial planners. Get your existing mutual funds audited and optimized.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <a
              href={`https://wa.me/${phoneWhatsAppNumber.replace('+', '')}?text=Hello,%20I%20would%20like%20to%20schedule%20a%20wealth%20consultation.`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-interactive px-8 py-4 rounded-2xl bg-bumblebee hover:bg-bumblebee-400 text-storm font-extrabold text-body shadow-lg transition-all"
            >
              Chat on WhatsApp ({phoneWhatsAppNumber})
            </a>
            <a
              href={`tel:${phoneWhatsAppNumber}`}
              className="btn-interactive px-8 py-4 rounded-2xl bg-storm-800 hover:bg-storm-700 text-surface font-bold text-body border border-storm-600 transition-all"
            >
              Direct Call ({phoneWhatsAppNumber})
            </a>
          </div>
        </div>
      </section>


      {/* ========================================================================= */}
      {/* 9. MANDATORY REGULATORY COMPLIANCE FOOTER */}
      {/* ========================================================================= */}
      <footer className="bg-[#FEFEFE] border-t border-slate-200 text-slate-600 py-12 px-4 sm:px-6 lg:px-8 text-caption">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-8 border-b border-slate-200">
          
          <div className="space-y-3">
            <p className="font-bold text-storm text-sm uppercase tracking-wider">Brewrich Wealth</p>
            <p className="text-slate-500">Helping individuals build long-term wealth using structured, disciplined, and AI-driven intelligent financial planning.</p>
            <p className="text-slate-700 font-medium">Brewrich 2151/1A, Sri Rajarajeshwari Nagar, plot no 21, Periyakulam - Theni Rd, Lakshmipuram, Thamarai Kulam, Tamil Nadu 625523</p>
          </div>

          <div className="space-y-2">
            <p className="font-bold text-storm text-sm uppercase tracking-wider">Regulatory Credentials</p>
            <p><strong className="text-slate-800">AMFI Registered MFD:</strong> ARN-335693</p>
            <p><strong className="text-slate-800">EUIN:</strong> E637441</p>
            <p><strong className="text-slate-800">IRDAI Licensed Advisor:</strong> URN: CAI0405260445 (Composite)</p>
          </div>

          <div className="space-y-2">
            <p className="font-bold text-storm text-sm uppercase tracking-wider">Accreditations & Quality</p>
            <p><strong className="text-slate-800">ISO 9001:2015 Certified:</strong> UDYAM-TN-23-0001645</p>
            <p><strong className="text-slate-800">Certifications:</strong> CFP | NISM Series V-A | NISM Series VII Certified</p>
          </div>

          <div className="space-y-2">
            <p className="font-bold text-storm text-sm uppercase tracking-wider">Client Onboarding</p>
            <p className="text-slate-500">Direct secure digital account opening powered by authorized institutional infrastructure.</p>
            <a href={onboardingUrl} target="_blank" rel="noopener noreferrer" className="inline-block text-storm hover:underline font-bold pt-1">
              Launch Client Portal &rarr;
            </a>
          </div>

        </div>

        <div className="max-w-7xl mx-auto pt-8 flex flex-col sm:flex-row justify-between items-center text-slate-500 gap-4">
          <p>&copy; {new Date().getFullYear()} Brewrich Wealth. All rights reserved.</p>
          <p className="text-center sm:text-right">Mutual fund investments are subject to market risks. Read all scheme related documents carefully.</p>
        </div>
      </footer>

    </div>
  );
}
