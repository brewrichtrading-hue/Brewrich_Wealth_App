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
  FileSpreadsheet,
  Umbrella,
  HeartHandshake
} from 'lucide-react';

const ASSETPLUS_ONBOARD_URL = 'https://www.assetplus.in/mfd/ARN-335693';
const ASSETPLUS_PORTAL_URL = 'https://partner.assetplus.in';

export default function MfdPage() {
  const scrollToBooking = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById('booking-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

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

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-blue-500 selection:text-white">
      
      {/* 1. HERO SECTION: All-in-One Wealth & Protection */}
      <section className="relative px-6 pt-24 pb-16 md:pt-32 md:pb-24 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-6">
          <span>🛡️ ISO 9001:2015 Certified Ecosystem • ARN-335693</span>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
          All-in-One Wealth & Protection <br />
          <span className="bg-gradient-to-r from-blue-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
            For Your Business & Family
          </span>
        </h1>
        
        <p className="text-slate-300 text-lg md:text-xl max-w-3xl mx-auto mb-10 leading-relaxed">
          Manage institutional mutual funds, multi-crore term insurance, health cards, and fixed income securely under one digital roof with Brewrich Wealth.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a
            href={ASSETPLUS_ONBOARD_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 font-semibold transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>Start Now (Open Account)</span>
            <ArrowUpRight className="h-4 w-4" />
          </a>
          
          <a
            href="#services"
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 font-semibold transition-all flex items-center justify-center gap-2"
          >
            <span>Explore All Services</span>
          </a>

          <a
            href={ASSETPLUS_PORTAL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-blue-500/40 text-slate-300 hover:text-white font-semibold transition-all flex items-center justify-center gap-2"
          >
            <span>Client Portal Login</span>
            <ArrowUpRight className="h-4 w-4 opacity-70" />
          </a>
        </div>

        {/* Micro High-Trust Stat Strip */}
        <div className="mt-12 pt-8 border-t border-slate-900 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-center">
          <div className="p-3">
            <p className="text-2xl font-extrabold text-blue-400">₹0</p>
            <p className="text-xs text-slate-400 font-medium">Account Opening Fee</p>
          </div>
          <div className="p-3">
            <p className="text-2xl font-extrabold text-emerald-400">2 Mins</p>
            <p className="text-xs text-slate-400 font-medium">100% Paperless KYC</p>
          </div>
          <div className="p-3">
            <p className="text-2xl font-extrabold text-teal-400">AMFI & IRDAI</p>
            <p className="text-xs text-slate-400 font-medium">Dual Regulated Desk</p>
          </div>
          <div className="p-3">
            <p className="text-2xl font-extrabold text-amber-400">In-House</p>
            <p className="text-xs text-slate-400 font-medium">CA Tax Filing Support</p>
          </div>
        </div>
      </section>

      {/* 2. SERVICES GRID: Betterment Style Cards */}
      <section id="services" className="px-6 py-16 max-w-7xl mx-auto">
        <div className="text-center mb-16 space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-400">
            Comprehensive Suite
          </span>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Complete Financial & Protection Suite</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">Designed for disciplined compounding, tax minimization, and absolute family security.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* Mutual Funds Card */}
          <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-blue-500/50 transition-all flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 text-xl font-bold mb-6">
                📈
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Mutual Funds & SIPs</h3>
              <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                Automated wealth creation through curated Flexi-Cap, Mid-Cap, ELSS, and multi-asset baskets with live XIRR tracking.
              </p>
              <ul className="text-xs text-slate-300 space-y-2.5 border-t border-slate-800/80 pt-4 mb-6">
                <li className="flex items-center gap-2">
                  <span className="text-blue-400 font-bold">✓</span>
                  <span>Systematic Investment Plans (SIP)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-blue-400 font-bold">✓</span>
                  <span>SWP & STP Wealth Automation</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-blue-400 font-bold">✓</span>
                  <span>Tax Saving Solutions (ELSS Section 80C)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-blue-400 font-bold">✓</span>
                  <span>Annual ₹1.25L LTCG Tax-Loss Harvesting</span>
                </li>
              </ul>
            </div>
            
            <a
              href={ASSETPLUS_ONBOARD_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 rounded-xl bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white font-semibold text-xs border border-blue-500/30 transition-all flex items-center justify-center gap-2"
            >
              <span>Explore Mutual Funds</span>
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>

          {/* Insurance Card */}
          <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-emerald-500/50 transition-all flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 text-xl font-bold mb-6">
                🛡️
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Term & Health Insurance</h3>
              <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                Robust risk management shielding your family capital and business continuity against unforeseen health and life contingencies.
              </p>
              <ul className="text-xs text-slate-300 space-y-2.5 border-t border-slate-800/80 pt-4 mb-6">
                <li className="flex items-center gap-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>Multi-Crore Term Life Protection</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>Comprehensive Health Mediclaim Cards</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>IRDAI Licensed Advisory Support</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>Direct Hospital Cashless Claim Desk</span>
                </li>
              </ul>
            </div>

            <button
              onClick={scrollToBooking}
              className="w-full py-3 rounded-xl bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white font-semibold text-xs border border-emerald-500/30 transition-all flex items-center justify-center gap-2"
            >
              <span>Get Insurance Quote</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          {/* Fixed Income Card */}
          <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-amber-500/50 transition-all flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 text-xl font-bold mb-6">
                🏦
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Fixed Deposits & NPS</h3>
              <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                Stable, predictable compounding and retirement planning instruments designed to preserve capital safety.
              </p>
              <ul className="text-xs text-slate-300 space-y-2.5 border-t border-slate-800/80 pt-4 mb-6">
                <li className="flex items-center gap-2">
                  <span className="text-amber-400 font-bold">✓</span>
                  <span>High-Yield AAA Rated Fixed Deposits</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-amber-400 font-bold">✓</span>
                  <span>National Pension System (NPS Tier I/II)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-amber-400 font-bold">✓</span>
                  <span>Instant Loan Against Mutual Funds</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-amber-400 font-bold">✓</span>
                  <span>Sovereign Gold Bonds (SGB) Strategy</span>
                </li>
              </ul>
            </div>

            <a
              href={ASSETPLUS_ONBOARD_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 rounded-xl bg-amber-600/20 hover:bg-amber-600 text-amber-300 hover:text-white font-semibold text-xs border border-amber-500/30 transition-all flex items-center justify-center gap-2"
            >
              <span>Explore Fixed Income</span>
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>

        </div>
      </section>

      {/* 3. DEDICATED "DOCTOR WEALTH DESK" SECTION */}
      <section className="px-6 py-16 bg-slate-900/40 border-y border-slate-900">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
              <HeartPulse className="h-4 w-4" />
              <span>Specialized Healthcare Treasury Desk</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
              Brewrich Doctor Wealth Desk
            </h2>
            <p className="text-slate-400 text-sm md:text-base leading-relaxed">
              Custom-tailored financial structuring, hospital surplus treasury, and tax minimization built specifically for medical specialists, surgeons, and clinic owners across Tamil Nadu.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {doctorDeskProfiles.map((doc) => (
              <div
                key={doc.name}
                className="p-7 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-all space-y-4"
              >
                <div className="flex items-start gap-4">
                  <div className={`h-14 w-14 rounded-2xl bg-gradient-to-tr ${doc.avatarColor} text-white flex items-center justify-center text-lg font-bold shadow-md shrink-0`}>
                    {doc.avatarInitial}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <h4 className="text-base font-bold text-white">{doc.name}</h4>
                      <BadgeCheck className="h-4 w-4 text-blue-400 shrink-0" />
                    </div>
                    <p className="text-xs font-semibold text-blue-400">{doc.degree}</p>
                    <p className="text-xs text-slate-400">{doc.designation}</p>
                    <span className="inline-block text-[11px] text-slate-400 bg-slate-800/80 px-2.5 py-0.5 rounded-full mt-1.5">
                      📍 {doc.location}
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1 text-xs">
                  <span className="text-[10px] uppercase font-bold text-blue-400">Strategy Focus:</span>
                  <p className="font-semibold text-slate-200">{doc.strategy}</p>
                  <p className="text-slate-400">{doc.focus}</p>
                </div>

                <p className="text-xs text-slate-300 italic pl-3 border-l-2 border-blue-500 leading-relaxed">
                  &ldquo;{doc.testimonial}&rdquo;
                </p>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 font-medium">AMFI & AssetPlus Verified</span>
                  <a
                    href={ASSETPLUS_ONBOARD_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1"
                  >
                    <span>Open Doctor Portfolio</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 4. DIRECT 1-ON-1 CONSULTATION DESK */}
      <section id="booking-section" className="px-6 py-16 max-w-4xl mx-auto">
        <div className="text-center mb-8 space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-400">
            Advisory Calendar
          </span>
          <h3 className="text-2xl md:text-3xl font-bold text-white">
            Schedule a 1-on-1 Consultation
          </h3>
          <p className="text-slate-400 text-xs sm:text-sm">
            Complimentary 30-minute wealth review, tax harvesting audit, and personalized portfolio structuring.
          </p>
        </div>

        <CalComEmbed />
      </section>

      {/* 5. VERIFIED LICENSING & TRUST FOOTER */}
      <section className="border-t border-slate-900 bg-slate-950 px-6 py-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          <div>
            <h4 className="font-bold text-lg text-white mb-2">Brewrich Wealth (Brewrich Trading)</h4>
            <p className="text-xs text-slate-400 max-w-md leading-relaxed">
              Professional wealth management, institutional distribution, and advisory services based in Theni, Tamil Nadu.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-4 text-xs text-slate-400">
            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
              <span className="block font-semibold text-white mb-1">AMFI Registered MFD</span>
              ARN-335693 | EUIN: E637441
            </div>
            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
              <span className="block font-semibold text-white mb-1">IRDAI Licensed Advisor</span>
              URN: CAI0405260445 (Corp Agent)
            </div>
            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
              <span className="block font-semibold text-white mb-1">ISO 9001:2015 Certified</span>
              Udyam: UDYAM-TN-23-0001645
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
