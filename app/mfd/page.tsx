'use client';

import React from 'react';
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
  FileCheck
} from 'lucide-react';

export default function MfdPage() {
  const strategies = [
    {
      title: 'Flagship Multi-Cap Growth',
      risk: 'Moderate-High',
      horizon: '5+ Years',
      cagr: '15.8% (3Y Alpha)',
      description: 'Dynamic mix of market leaders and high-momentum mid-caps for steady compound wealth generation.',
      tags: ['Top Tier AMCs', 'Automated Rebalancing', 'Goal-Aligned'],
    },
    {
      title: 'HNI High Alpha Momentum',
      risk: 'High',
      horizon: '3-7 Years',
      cagr: '18.4% (3Y Alpha)',
      description: 'Concentrated thematic and factor-based momentum equity funds seeking superior capital multiplication.',
      tags: ['Factor Investing', 'Tactical Allocation', 'Active Review'],
    },
    {
      title: 'Capital Preservation & Liquidity',
      risk: 'Low-Moderate',
      horizon: '1-3 Years',
      cagr: '8.2% (Yield)',
      description: 'Institutional arbitrage, short-duration debt, and corporate bond funds for emergency reserves and parking surplus.',
      tags: ['High Liquidity', 'Zero Lock-in', 'Tax Efficient'],
    },
  ];

  const benefits = [
    {
      title: 'Zero Hidden Fees & Complete Transparency',
      description: 'Direct visibility into fund performance, expense ratios, portfolio overlap, and commission disclosures.',
      icon: Layers,
    },
    {
      title: 'Automated Goal Tracking & Rebalancing',
      description: 'Continuous monitoring of your asset allocation. We trigger rebalancing when equity-to-debt weights drift.',
      icon: BarChart2,
    },
    {
      title: 'Tax-Loss Harvesting & Capital Gains Optimization',
      description: 'Systematic redemption and reinvestment to utilize the annual ₹1.25L Long Term Capital Gains (LTCG) tax exemption.',
      icon: FileCheck,
    },
    {
      title: '1-on-1 Dedicated Wealth Strategist',
      description: 'Direct phone & video desk access whenever market volatility arises. No automated robot ticket replies.',
      icon: Users,
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
    <div className="flex flex-col w-full pb-16">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 pb-16 px-4 sm:px-6 lg:px-8 border-b border-slate-800/80 bg-gradient-to-b from-dark-900/60 to-dark-950">
        <div className="mx-auto max-w-5xl text-center space-y-6">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="h-4 w-4" />
            <span>AMFI Registered Mutual Fund Distributor</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15]">
            Strategic Mutual Fund Wealth Management <br />
            <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
              Tailored for Generational Growth
            </span>
          </h1>

          <p className="mx-auto max-w-2xl text-sm sm:text-lg text-slate-300 font-normal leading-relaxed">
            Stop guessing which funds to pick. We structure your family and business portfolios with institutional asset allocation, zero emotional bias, and systematic alpha compounding.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2 text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>₹0 Platform Account Fees</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>Paperless 100% Digital Onboarding</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>AMFI & SEBI Regulated Ecosystem</span>
            </div>
          </div>

        </div>
      </section>

      {/* 2. CAL.COM BOOKING WIDGET SECTION */}
      <section id="booking-section" className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-8">
            <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-2">
              Fast-Track Account Opening
            </h2>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              Reserve Your 1-on-1 Portfolio Consultation
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Select an available time slot below. Our Senior Wealth Advisor will review your existing holdings and propose a tailored asset allocation blueprint.
            </p>
          </div>

          {/* Cal.com Embedded Widget */}
          <CalComEmbed />
        </div>
      </section>

      {/* 3. STRATEGY BASKETS */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 border-t border-slate-800/80 bg-dark-900/30">
        <div className="mx-auto max-w-6xl">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-widest text-emerald-400">
              Curated Portfolios
            </h3>
            <h4 className="text-2xl sm:text-4xl font-extrabold text-white">
              Institutional Mutual Fund Baskets
            </h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {strategies.map((strat) => (
              <div
                key={strat.title}
                className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-emerald-500/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {strat.risk} Risk
                    </span>
                    <span className="text-xs font-extrabold text-emerald-400">
                      {strat.cagr}
                    </span>
                  </div>

                  <h5 className="text-lg font-bold text-white mb-2">{strat.title}</h5>
                  <p className="text-xs text-slate-400 leading-relaxed mb-4">
                    {strat.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {strat.tags.map((t) => (
                      <span
                        key={t}
                        className="text-[10px] px-2 py-0.5 rounded bg-slate-800/80 text-slate-400 border border-slate-700/60"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <span>Horizon: <strong className="text-slate-200">{strat.horizon}</strong></span>
                  <button
                    onClick={scrollToBooking}
                    className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1 focus:outline-none"
                  >
                    <span>Invest Now</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. WHY BREWRICH ADVANTAGE */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 border-t border-slate-800/80">
        <div className="mx-auto max-w-6xl">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-widest text-amber-400">
              The Advisory Difference
            </h3>
            <h4 className="text-2xl sm:text-4xl font-extrabold text-white">
              Why Investors Trust Our Desk
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {benefits.map((b) => {
              const Icon = b.icon;
              return (
                <div
                  key={b.title}
                  className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 flex items-start gap-4"
                >
                  <div className="h-12 w-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h5 className="text-base font-bold text-white mb-1">{b.title}</h5>
                    <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                      {b.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

    </div>
  );
}
