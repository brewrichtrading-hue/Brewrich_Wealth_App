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
  FileCheck,
  Percent,
  Shield,
  ArrowUpRight
} from 'lucide-react';

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
      title: 'Tax-Loss Harvesting & LTCG Optimization',
      description: 'Systematic redemption and reinvestment to utilize the annual ₹1.25L Long Term Capital Gains tax exemption.',
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
    <div className="flex flex-col w-full pb-20 bg-slate-50">
      
      {/* 1. HERO SECTION (ROYAL BLUE BETTERMENT STYLE) */}
      <section className="relative bg-gradient-to-b from-[#0A358F] via-[#0D44B8] to-[#1456F0] text-white pt-16 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        
        {/* Ambient glow */}
        <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl pointer-events-none -z-0" />

        <div className="relative z-10 mx-auto max-w-5xl text-center space-y-6">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold uppercase tracking-wider shadow-sm">
            <ShieldCheck className="h-4 w-4 text-emerald-300" />
            <span>AMFI Registered Mutual Fund Distributor</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15]">
            Strategic Mutual Fund Wealth Management <br />
            <span className="text-blue-100">
              Tailored for Generational Growth
            </span>
          </h1>

          <p className="mx-auto max-w-2xl text-sm sm:text-lg text-blue-100 font-normal leading-relaxed">
            Stop guessing which funds to pick. We structure your family and business portfolios with institutional asset allocation, zero emotional bias, and systematic alpha compounding.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 pt-2 text-xs sm:text-sm text-blue-100 font-medium">
            <div className="flex items-center gap-1.5 bg-white/10 px-3.5 py-1.5 rounded-full backdrop-blur-sm border border-white/15">
              <CheckCircle2 className="h-4 w-4 text-emerald-300" />
              <span>₹0 Platform Account Fees</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/10 px-3.5 py-1.5 rounded-full backdrop-blur-sm border border-white/15">
              <CheckCircle2 className="h-4 w-4 text-emerald-300" />
              <span>100% Digital Onboarding</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/10 px-3.5 py-1.5 rounded-full backdrop-blur-sm border border-white/15">
              <CheckCircle2 className="h-4 w-4 text-emerald-300" />
              <span>SEBI & AMFI Regulated</span>
            </div>
          </div>

        </div>
      </section>

      {/* 2. CAL.COM BOOKING WIDGET SECTION (CRISP ELEVATED CARD) */}
      <section id="booking-section" className="-mt-12 px-4 sm:px-6 lg:px-8 relative z-20">
        <div className="mx-auto max-w-4xl">
          <CalComEmbed />
        </div>
      </section>

      {/* 3. STRATEGY BASKETS (BETTERMENT CARD ARCHITECTURE) */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-600">
              Curated Portfolios
            </span>
            <h3 className="text-2xl sm:text-4xl font-extrabold text-slate-900">
              Institutional Mutual Fund Baskets
            </h3>
            <p className="text-sm text-slate-600">
              Actively monitored model portfolios engineered for optimal risk-adjusted returns.
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
                    <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Model Structure</span>
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
                  <button
                    onClick={scrollToBooking}
                    className="text-blue-600 hover:text-blue-700 font-extrabold flex items-center gap-1 focus:outline-none"
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

      {/* 4. WHY BREWRICH ADVANTAGE (BETTERMENT CARDS) */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-white border-t border-slate-200/80">
        <div className="mx-auto max-w-6xl">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-600">
              The Advisory Difference
            </span>
            <h4 className="text-2xl sm:text-4xl font-extrabold text-slate-900">
              Why Investors Trust Our Wealth Desk
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {benefits.map((b) => {
              const Icon = b.icon;
              return (
                <div
                  key={b.title}
                  className="p-7 rounded-3xl bg-slate-50 border border-slate-200/80 flex items-start gap-4 shadow-sm"
                >
                  <div className="h-12 w-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h5 className="text-base font-bold text-slate-900 mb-1">{b.title}</h5>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
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
