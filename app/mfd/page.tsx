'use client';

import React from 'react';
import Link from 'next/link';
import CalComEmbed from '@/components/CalComEmbed';
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
  BarChart2, 
  FileCheck,
  Percent,
  Shield,
  ArrowUpRight,
  Stethoscope,
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
  FileSpreadsheet
} from 'lucide-react';

const ASSETPLUS_ONBOARD_URL = 'https://www.assetplus.in/mfd/ARN-335693';

export default function MfdPage() {
  const strategies = [
    {
      title: 'Flagship Multi-Cap Growth',
      risk: 'Moderate-High',
      riskColor: 'bg-blue-50 text-blue-700 border-blue-200',
      horizon: '5+ Years',
      cagr: '15.8% (3Y Alpha)',
      description: 'Dynamic mix of market leaders and high-momentum mid-caps for steady compound wealth generation.',
      tags: ['Top Tier AMCs', 'Automated Rebalancing', 'Goal-Aligned'],
      allocation: '70% Large/Mid Equity • 20% Flexicap • 10% Dynamic Debt',
    },
    {
      title: 'HNI High Alpha Momentum',
      risk: 'High Growth',
      riskColor: 'bg-purple-50 text-purple-700 border-purple-200',
      horizon: '3-7 Years',
      cagr: '18.4% (3Y Alpha)',
      description: 'Concentrated thematic and factor-based momentum equity funds seeking superior capital multiplication.',
      tags: ['Factor Investing', 'Tactical Allocation', 'Active Review'],
      allocation: '85% Momentum Alpha • 15% Tactical Hedging',
    },
    {
      title: 'Capital Preservation & Liquidity',
      risk: 'Conservative',
      riskColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      horizon: '1-3 Years',
      cagr: '8.2% (Yield)',
      description: 'Institutional arbitrage, short-duration debt, and corporate bond funds for emergency reserves and parking surplus.',
      tags: ['High Liquidity', 'Zero Lock-in', 'Tax Efficient'],
      allocation: '60% Arbitrage • 40% AAA Corporate Debt',
    },
  ];

  const ecosystemFeatures = [
    {
      title: 'Advanced Tax Rebalancing & Loss Harvesting',
      description: 'Systematic quarterly scans across your mutual fund holdings to utilize the annual ₹1.25 Lakh LTCG tax exemption and offset short-term gains, reducing tax drag while compounding continuously.',
      icon: Scale,
      badge: 'Tax Optimization',
      bulletPoints: [
        'Annual ₹1.25L LTCG tax-free harvesting',
        'Tax-loss offsetting against market rallies',
        'Smart asset location across debt & equity',
      ],
    },
    {
      title: 'In-House Auditing & Annual Tax Filing',
      description: 'Direct access to our in-house Chartered Accountants and Tax Auditors for complete annual ITR filings, capital gains schedules, and advance tax estimations. You never need to look outside.',
      icon: Receipt,
      badge: 'Complete CA Support',
      bulletPoints: [
        'End-to-end ITR-1/2/3/4 filing by in-house CAs',
        'Automated capital gains tax schedule computation',
        'Direct scrutiny assistance & advance tax advisory',
      ],
    },
    {
      title: 'Institutional Asset & Debt Allocation',
      description: 'Custom-tailored multi-asset frameworks combining Top-Quartile Equity Alpha, Sovereign Gold Bonds (SGB), and Target-Maturity Corporate Debt for optimal risk-adjusted compounding.',
      icon: Layers,
      badge: 'Multi-Asset Architecture',
      bulletPoints: [
        'Dynamic equity-to-debt rebalancing triggers',
        'Zero-commission direct execution transparency',
        'Protection against emotional market timing',
      ],
    },
    {
      title: 'HNI Family Office & Estate Transfer',
      description: 'Sophisticated generational wealth structuring, private family trust advisory, nominee audits, and seamless intergenerational asset transfer for entrepreneurs and professionals.',
      icon: Landmark,
      badge: 'Generational Wealth',
      bulletPoints: [
        'Family trust & inheritance structuring',
        'Multi-pan account consolidation & tracking',
        'Private consultation with Senior Wealth Directors',
      ],
    },
  ];

  const doctorDeskProfiles = [
    {
      name: 'Dr. Kalai Arasi',
      degree: 'MD, DGO, DRM (Fertility & Laparoscopy)',
      designation: 'Senior Gynaecologist & Clinical Director',
      location: 'Chennai & Madurai, Tamil Nadu',
      avatarInitial: 'KA',
      avatarColor: 'from-pink-600 to-rose-700',
      strategy: 'Specialized Wealth Compounding & Family Office Structuring',
      focus: 'Clinic Treasury Management, Tax-Exempt Multi-Cap Baskets & Succession Planning',
      testimonial: 'Brewrich restructured our hospital surplus and personal family corpus into systematic, tax-shielded multi-cap portfolios. The in-house tax filing means zero disruption to my busy surgical schedule.',
      metrics: {
        portfolioFocus: 'Growth & Succession',
        horizon: '10+ Years',
        taxEfficiency: 'Maximum LTCG Shield',
      },
    },
    {
      name: 'Dr. Benedict Daniel Devaraj',
      degree: 'MS (Ortho), DNB, M.Ch (Ortho)',
      designation: 'Chief Orthopedic Surgeon & Medical Director',
      location: 'Coimbatore, Tamil Nadu',
      avatarInitial: 'BD',
      avatarColor: 'from-blue-600 to-indigo-800',
      strategy: 'Retirement Corpus & Liquid Asset Management',
      focus: 'Target-Maturity Debt, Arbitrage Reserves & High-Yield Preservation',
      testimonial: 'Their disciplined asset allocation and in-house CA team eliminated the stress of capital gain computations. For medical practitioners with demanding hours, Brewrich is an invaluable wealth partner.',
      metrics: {
        portfolioFocus: 'Liquid Capital & Yield',
        horizon: '5 - 7 Years',
        taxEfficiency: 'Arbitrage Tax Shield',
      },
    },
    {
      name: 'Dr. Gokulnath',
      degree: 'MD, DM (Cardiology), FSCAI',
      designation: 'Consultant Interventional Cardiologist',
      location: 'Tiruchirappalli, Tamil Nadu',
      avatarInitial: 'GN',
      avatarColor: 'from-emerald-600 to-teal-800',
      strategy: 'Tax-Efficient Growth & Institutional Equity Allocation',
      focus: 'High-Alpha Flexicap Baskets, Dynamic Rebalancing & Emergency Reserves',
      testimonial: 'The transparency, research rigor, and seamless AssetPlus digital onboarding made opening our portfolio effortless. The quarterly rebalancing gives me complete peace of mind while treating patients.',
      metrics: {
        portfolioFocus: 'Equity Alpha Compounding',
        horizon: '7+ Years',
        taxEfficiency: 'Automated Harvesting',
      },
    },
    {
      name: 'Dr. Yeshwant',
      degree: 'MD (Pediatrics), DCH, FIAP',
      designation: 'Senior Consultant Pediatrician & Clinic Owner',
      location: 'Salem & Chennai, Tamil Nadu',
      avatarInitial: 'YW',
      avatarColor: 'from-amber-600 to-orange-700',
      strategy: 'Multi-Generational Asset Transfer & Strategic SIP Architecture',
      focus: 'Children Education Corpus, Step-Up SIPs & Multi-Asset Hedging',
      testimonial: 'Disciplined goal-based investing with zero platform account fees. The direct AssetPlus account setup took under 2 minutes and our portfolio has compounded reliably across market cycles.',
      metrics: {
        portfolioFocus: 'Next-Gen Education & Estate',
        horizon: '10+ Years',
        taxEfficiency: 'Step-Up Wealth Creation',
      },
    },
  ];

  const scrollToBooking = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById('booking-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="flex flex-col w-full pb-20 bg-slate-50 text-slate-900">
      
      {/* 1. HERO SECTION (BETTERMENT STYLE WITH 3D MOBILE MOCKUP & ZERO-FEE CTA) */}
      <section className="relative bg-gradient-to-b from-[#0A358F] via-[#0D44B8] to-[#1456F0] text-white pt-16 pb-28 px-4 sm:px-6 lg:px-8 overflow-hidden">
        
        {/* Subtle geometric light grids */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff15_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-40" />
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 mx-auto max-w-7xl">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Hero Copy & Zero-Fee CTA */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-white text-xs font-extrabold uppercase tracking-wider shadow-sm">
                <ShieldCheck className="h-4 w-4 text-emerald-300" />
                <span>AMFI Registered Mutual Fund Distributor • ARN-335693</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.12]">
                All-in-One Wealth, <br className="hidden sm:inline" />
                <span className="text-blue-100">
                  Tax Rebalancing & Auditing Desk
                </span>
              </h1>

              <p className="max-w-2xl text-base sm:text-lg text-blue-100/90 font-normal leading-relaxed">
                Institutional mutual fund asset allocation, automated tax-loss harvesting, and dedicated in-house Chartered Accountants under one roof. Zero platform fees, zero commissions bias.
              </p>

              {/* Zero-Fee Micro-Copy Badge */}
              <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 inline-block text-left">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-emerald-400/20 text-emerald-300 flex items-center justify-center font-bold">
                    <Zap className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-extrabold text-white">
                      Start Now: Open your account in just 2 minutes at zero fees.
                    </p>
                    <p className="text-xs text-blue-200">
                      Paperless digital KYC via official AssetPlus onboarding gateway.
                    </p>
                  </div>
                </div>
              </div>

              {/* Primary & Secondary Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3.5 pt-2 justify-center lg:justify-start">
                
                {/* DIRECT ASSETPLUS REDIRECT CTA */}
                <a
                  href={ASSETPLUS_ONBOARD_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-interactive w-full sm:w-auto min-h-[54px] px-8 flex items-center justify-center gap-2.5 rounded-full bg-white hover:bg-slate-100 text-blue-900 font-extrabold text-base shadow-xl shadow-blue-950/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Sparkles className="h-5 w-5 text-blue-600" />
                  <span>Start Now (Open Account)</span>
                  <ArrowUpRight className="h-5 w-5 text-blue-600" />
                </a>

                {/* 1-on-1 Consultation Scroll CTA */}
                <button
                  onClick={scrollToBooking}
                  className="btn-interactive w-full sm:w-auto min-h-[54px] px-7 flex items-center justify-center gap-2 rounded-full bg-blue-900/60 hover:bg-blue-900/80 text-white font-bold text-sm border border-white/20 backdrop-blur-md transition-all"
                >
                  <Clock className="h-4 w-4 text-blue-200" />
                  <span>Schedule 1-on-1 Review</span>
                </button>

              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-3 text-xs text-blue-100/80 font-semibold">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                  <span>₹0 Platform Account Fees</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                  <span>SEBI / AMFI Regulated</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                  <span>In-House CA Tax Support</span>
                </div>
              </div>

            </div>

            {/* Right Column: 3D Mobile App Mockup */}
            <div className="lg:col-span-5 flex justify-center relative">
              
              {/* Decorative floating badge top-left */}
              <div className="absolute -top-4 -left-6 z-20 hidden sm:flex items-center gap-2.5 p-3.5 rounded-2xl bg-white text-slate-900 shadow-2xl border border-slate-100 animate-bounce duration-1000">
                <div className="h-8 w-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <div>
                  <span className="block text-[10px] uppercase font-bold text-slate-500">Regulated</span>
                  <span className="text-xs font-extrabold text-slate-900">ARN-335693 Verified</span>
                </div>
              </div>

              {/* 3D Mobile Device Viewport */}
              <div className="w-full max-w-[340px] rounded-[44px] bg-slate-900 p-3 shadow-2xl shadow-slate-950/40 ring-1 ring-white/20 transform lg:rotate-1 hover:rotate-0 transition-transform duration-500">
                
                {/* Phone screen frame */}
                <div className="rounded-[38px] bg-white overflow-hidden p-5 text-slate-900 space-y-4 border border-slate-100">
                  
                  {/* Phone Header Status Bar */}
                  <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400 font-bold border-b border-slate-100 pb-3">
                    <span className="text-slate-800">09:41</span>
                    <div className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-emerald-500" />
                      <span className="text-[10px] text-emerald-700 font-bold">AssetPlus Active</span>
                    </div>
                  </div>

                  {/* App Balance Card */}
                  <div className="p-4 rounded-3xl bg-gradient-to-br from-[#0A358F] to-[#1456F0] text-white space-y-2 shadow-lg shadow-blue-600/20">
                    <div className="flex justify-between items-center text-xs text-blue-200">
                      <span>Total Wealth Managed</span>
                      <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-bold">Live Model</span>
                    </div>
                    <div className="text-2xl font-extrabold tracking-tight">
                      ₹48,25,400
                    </div>
                    <div className="flex items-center justify-between pt-1 border-t border-white/15 text-[11px]">
                      <span className="text-emerald-300 font-extrabold flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" />
                        +18.4% 3Y CAGR
                      </span>
                      <span className="text-blue-100 font-medium">Alpha: +4.2%</span>
                    </div>
                  </div>

                  {/* Asset Allocation Breakdown */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                      <span>Target Asset Allocation</span>
                      <span className="text-blue-600">Rebalanced</span>
                    </div>
                    <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden flex">
                      <div style={{ width: '70%' }} className="bg-blue-600 h-full" />
                      <div style={{ width: '20%' }} className="bg-emerald-500 h-full" />
                      <div style={{ width: '10%' }} className="bg-amber-400 h-full" />
                    </div>
                    <div className="flex justify-between text-[10px] font-semibold text-slate-500">
                      <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-blue-600" /> 70% Equity</span>
                      <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald-500" /> 20% Debt</span>
                      <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-amber-400" /> 10% Gold</span>
                    </div>
                  </div>

                  {/* Tax Rebalancing Live Widget */}
                  <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <Scale className="h-4 w-4 text-emerald-700" />
                      <div>
                        <span className="block font-bold text-emerald-900 text-[11px]">Auto Tax-Harvesting</span>
                        <span className="text-[10px] text-emerald-700 font-medium">₹1.25L LTCG Shield Active</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-extrabold bg-emerald-200/60 text-emerald-800 px-2 py-0.5 rounded-full">
                      Optimized
                    </span>
                  </div>

                  {/* Direct Account Open Pill inside Mockup */}
                  <a
                    href={ASSETPLUS_ONBOARD_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-center text-xs font-extrabold shadow-md transition-all"
                  >
                    Open Account (2 Mins) →
                  </a>

                </div>

              </div>

              {/* Decorative floating badge bottom-right */}
              <div className="absolute -bottom-6 -right-6 z-20 hidden sm:flex items-center gap-2.5 p-3.5 rounded-2xl bg-white text-slate-900 shadow-2xl border border-slate-100">
                <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                  <Receipt className="h-4 w-4" />
                </div>
                <div>
                  <span className="block text-[10px] uppercase font-bold text-slate-500">In-House Desk</span>
                  <span className="text-xs font-extrabold text-slate-900">CA Tax Filing Included</span>
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* 2. COMPREHENSIVE WEALTH, TAX REBALANCING & IN-HOUSE AUDITING FEATURE GRID */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <div className="mx-auto max-w-7xl">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3.5 py-1 rounded-full border border-blue-200">
              The Complete Financial Ecosystem
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
              Wealth Management, Tax Rebalancing & <br className="hidden sm:inline" />
              In-House Auditing Under One Roof
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Why coordinate separately between brokers, mutual fund agents, and tax accountants? Our integrated desk provides end-to-end portfolio compounding and in-house Chartered Accountants.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {ecosystemFeatures.map((feat) => {
              const Icon = feat.icon;
              return (
                <div
                  key={feat.title}
                  className="p-8 sm:p-10 rounded-3xl bg-white border border-slate-200/80 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:border-blue-200 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="h-14 w-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                        <Icon className="h-7 w-7" />
                      </div>
                      <span className="text-xs font-extrabold uppercase tracking-wider px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                        {feat.badge}
                      </span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-snug">
                      {feat.title}
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {feat.description}
                    </p>

                    <div className="space-y-2.5 pt-2 border-t border-slate-100">
                      {feat.bulletPoints.map((point) => (
                        <div key={point} className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-700">
                          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                          <span>{point}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-500 font-medium">Included at Zero Extra Fee</span>
                    <a
                      href={ASSETPLUS_ONBOARD_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 font-extrabold text-sm flex items-center gap-1.5 group"
                    >
                      <span>Explore Account Setup</span>
                      <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 3. DEDICATED "DOCTOR WEALTH DESK" CORE SECTION */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-100/70 border-y border-slate-200/80">
        <div className="mx-auto max-w-7xl space-y-16">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-extrabold uppercase tracking-wider border border-emerald-300">
              <HeartPulse className="h-4 w-4 text-emerald-700" />
              <span>Specialized Healthcare Treasury Desk</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
              Brewrich Doctor Wealth Desk
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Custom-tailored financial structuring built specifically for medical specialists, surgeons, hospital directors, and clinic owners across Tamil Nadu. We manage your treasury while you save lives.
            </p>
          </div>

          {/* Doctor Profile Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {doctorDeskProfiles.map((doc) => (
              <div
                key={doc.name}
                className="p-8 sm:p-9 rounded-3xl bg-white border border-slate-200/80 shadow-xl shadow-slate-200/40 hover:shadow-2xl transition-all flex flex-col justify-between"
              >
                <div className="space-y-5">
                  
                  {/* Doctor Header Profile */}
                  <div className="flex items-start gap-4">
                    <div className={`h-16 w-16 rounded-2xl bg-gradient-to-tr ${doc.avatarColor} text-white flex items-center justify-center text-xl font-extrabold shadow-md shrink-0`}>
                      {doc.avatarInitial}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h4 className="text-lg sm:text-xl font-extrabold text-slate-900">{doc.name}</h4>
                        <BadgeCheck className="h-5 w-5 text-blue-600 shrink-0" />
                      </div>
                      <p className="text-xs font-bold text-blue-700">{doc.degree}</p>
                      <p className="text-xs text-slate-500 font-medium">{doc.designation}</p>
                      <span className="inline-block text-[11px] font-semibold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full mt-1.5">
                        📍 {doc.location}
                      </span>
                    </div>
                  </div>

                  {/* Strategy Framework */}
                  <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100 space-y-1.5">
                    <span className="text-[10px] uppercase font-bold text-blue-700 tracking-wider block">
                      Custom Wealth Architecture:
                    </span>
                    <p className="text-xs sm:text-sm font-extrabold text-slate-900">
                      {doc.strategy}
                    </p>
                    <p className="text-xs text-slate-600">
                      <strong className="text-slate-800">Core Focus:</strong> {doc.focus}
                    </p>
                  </div>

                  {/* Doctor Quote */}
                  <div className="relative pl-4 border-l-2 border-blue-600 text-xs sm:text-sm text-slate-700 italic leading-relaxed">
                    &ldquo;{doc.testimonial}&rdquo;
                  </div>

                  {/* Metric Chips */}
                  <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100 text-center">
                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-200/60">
                      <span className="block text-[10px] uppercase text-slate-500 font-bold">Horizon</span>
                      <span className="text-xs font-extrabold text-slate-900">{doc.metrics.horizon}</span>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-200/60">
                      <span className="block text-[10px] uppercase text-slate-500 font-bold">Strategy</span>
                      <span className="text-xs font-extrabold text-blue-700 truncate">{doc.metrics.portfolioFocus}</span>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-200/60">
                      <span className="block text-[10px] uppercase text-slate-500 font-bold">Tax Efficiency</span>
                      <span className="text-xs font-extrabold text-emerald-700">{doc.metrics.taxEfficiency}</span>
                    </div>
                  </div>

                </div>

                {/* Card Action */}
                <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500">Doctor Portfolio Structuring</span>
                  <a
                    href={ASSETPLUS_ONBOARD_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-interactive px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md shadow-blue-600/20 flex items-center gap-1.5"
                  >
                    <span>Open Doctor Account</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                </div>

              </div>
            ))}
          </div>

          {/* Doctor Desk Bottom Banner */}
          <div className="p-8 rounded-3xl bg-gradient-to-r from-[#0A358F] to-[#1456F0] text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <h4 className="text-xl sm:text-2xl font-extrabold">Are you a Medical Specialist or Clinic Owner in TN?</h4>
              <p className="text-xs sm:text-sm text-blue-100 max-w-xl">
                Get a dedicated portfolio audit, advance tax projection, and zero-fee AssetPlus account setup tailored to your medical practice.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <a
                href={ASSETPLUS_ONBOARD_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-interactive px-6 py-3.5 rounded-full bg-white hover:bg-slate-100 text-blue-900 font-extrabold text-sm shadow-md flex items-center gap-2"
              >
                <span>Direct Onboarding (ARN-335693)</span>
                <ArrowUpRight className="h-4 w-4" />
              </a>
              <button
                onClick={scrollToBooking}
                className="btn-interactive px-6 py-3.5 rounded-full bg-blue-950/60 hover:bg-blue-950/80 text-white font-bold text-xs border border-white/20"
              >
                Book 1-on-1 Consultation
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* 4. STRATEGY BASKETS (BETTERMENT CARD ARCHITECTURE) */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-600">
              Curated Model Portfolios
            </span>
            <h3 className="text-2xl sm:text-4xl font-extrabold text-slate-900">
              Institutional Mutual Fund Baskets
            </h3>
            <p className="text-sm text-slate-600">
              Actively monitored model portfolios engineered for optimal risk-adjusted returns and minimum capital gains tax drag.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {strategies.map((strat) => (
              <div
                key={strat.title}
                className="p-7 rounded-3xl bg-white border border-slate-200/80 shadow-xl shadow-slate-200/50 hover:shadow-2xl transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-[11px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full border ${strat.riskColor}`}>
                      {strat.risk}
                    </span>
                    <span className="text-xs font-extrabold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                      {strat.cagr}
                    </span>
                  </div>

                  <h5 className="text-lg font-bold text-slate-900 mb-2">{strat.title}</h5>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                    {strat.description}
                  </p>

                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/60 mb-5">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Model Allocation</span>
                    <span className="text-xs font-bold text-slate-800">{strat.allocation}</span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {strat.tags.map((t) => (
                      <span
                        key={t}
                        className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                  <span>Horizon: <strong className="text-slate-900 font-bold">{strat.horizon}</strong></span>
                  <a
                    href={ASSETPLUS_ONBOARD_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 font-extrabold flex items-center gap-1"
                  >
                    <span>Invest Now</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. CAL.COM 1-ON-1 BOOKING WIDGET SECTION (CRISP ELEVATED CARD) */}
      <section id="booking-section" className="py-12 px-4 sm:px-6 lg:px-8 relative z-20 bg-slate-100/60 border-t border-slate-200/80">
        <div className="mx-auto max-w-4xl space-y-6">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-600">
              Direct Advisory Calendar
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Prefer a Direct 1-on-1 Consultation First?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
              Schedule a complimentary 30-minute portfolio structuring session with our Senior Wealth Directors.
            </p>
          </div>

          <CalComEmbed />
        </div>
      </section>

    </div>
  );
}
