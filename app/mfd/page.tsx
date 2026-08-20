'use client';

import React from 'react';
import Link from 'next/link';

export default function MfdPage() {
  const onboardingUrl = "https://mweb.assetplus.in/client_onboarding/?advisor=688b3679af6048595923afd2";

  return (
    <div className="min-h-screen bg-blue-600 text-white selection:bg-white selection:text-blue-600">
      
      {/* 1. NAVIGATION BAR */}
      <nav className="border-b border-blue-500/40 bg-blue-600 sticky top-0 z-50 px-6 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg tracking-wider group">
            <span className="px-3 py-1 bg-white text-blue-600 rounded-lg text-sm shadow-md group-hover:bg-blue-50 transition-all">BREWRICH</span>
            <span className="text-blue-100 text-xs uppercase tracking-widest hidden sm:inline">Institutional Wealth & MFD</span>
          </Link>
          <div className="flex items-center gap-4">
            <a 
              href={onboardingUrl} 
              target="_blank" 
              rel="noreferrer" 
              className="text-xs md:text-sm font-semibold px-5 py-2.5 rounded-xl bg-white text-blue-600 hover:bg-blue-50 transition-all shadow-md"
            >
              Client Portal Login
            </a>
          </div>
        </div>
      </nav>

      {/* 2. HERO SECTION */}
      <section className="relative px-6 pt-16 pb-24 md:pt-24 md:pb-32 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-700/60 border border-blue-400/40 text-blue-100 text-xs font-semibold mb-6 shadow-sm">
            <span>🛡️ ISO 9001:2015 Certified • AMFI & IRDAI Regulated Desk</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight text-white">
            Build wealth with confidence and ease.
          </h1>
          <p className="text-blue-100 text-lg md:text-xl max-w-2xl mb-10 leading-relaxed">
            Automated compounding, institutional mutual fund baskets, family protection, and instant liquidity credit—managed for you under one unified platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <a 
              href={onboardingUrl} 
              target="_blank" 
              rel="noreferrer" 
              className="px-8 py-4 rounded-2xl bg-white text-blue-600 font-bold hover:bg-blue-50 transition-all shadow-xl text-center"
            >
              Get Started (Open Account) →
            </a>
            <a 
              href="#consultation" 
              className="px-8 py-4 rounded-2xl bg-blue-700/80 border border-blue-400/40 text-white font-bold hover:bg-blue-700 transition-all shadow-lg text-center"
            >
              📅 Book 1-to-1 Consultation
            </a>
          </div>
        </div>

        {/* Hero Phone Mockup Graphic */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="w-full max-w-sm p-5 rounded-[40px] bg-slate-900 border-4 border-blue-400/30 shadow-2xl space-y-4">
            <div className="flex justify-between items-center px-2">
              <span className="text-xs text-slate-400 font-medium">Brewrich Wealth App</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>
            <div className="p-4 rounded-3xl bg-blue-600 text-white space-y-3 shadow-inner">
              <div className="text-xs text-blue-200 font-medium">Total Portfolio Value</div>
              <div className="text-3xl font-black tracking-tight">₹48,920.40</div>
              <div className="text-xs text-emerald-300 font-semibold">+18.4% XIRR Returns</div>
            </div>
            <div className="p-3 rounded-2xl bg-slate-800 text-xs space-y-2">
              <div className="flex justify-between text-slate-300">
                <span>Active SIP</span>
                <span className="text-emerald-400 font-bold">₹10,000 / mo</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Execution Rate</span>
                <span className="text-blue-400 font-bold">94.2%</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. DETAILED SECTIONS WITH RICH VISUAL MOCKUPS (Betterment Style) */}
      <section className="bg-slate-950 text-white px-6 py-24 space-y-24">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">Every financial tool, visually structured.</h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">Explore high-fidelity mockups for mutual fund automation, insurance protection, and credit lines.</p>
        </div>

        <div className="max-w-7xl mx-auto space-y-20">

          {/* SECTION A: SIP & MUTUAL FUNDS (Interactive Graph Mockup) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center bg-slate-900 p-8 md:p-12 rounded-3xl border border-slate-800 shadow-xl">
            <div className="lg:col-span-6 space-y-6">
              <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider">Automated Investing</span>
              <h3 className="text-3xl font-bold">Systematic Investment Plan (SIP)</h3>
              <p className="text-slate-400 text-base leading-relaxed">
                Put your wealth creation on autopilot. Discipline-driven monthly allocations across Flexi-Cap, Mid-Cap, and Index baskets with automated UPI mandates.
              </p>
              <ul className="space-y-2 text-sm text-slate-300">
                <li className="flex items-center gap-2"><span className="text-blue-400 font-bold">✓</span> Flexible step-up SIP to match your income growth</li>
                <li className="flex items-center gap-2"><span className="text-blue-400 font-bold">✓</span> Instant portfolio rebalancing and tax-loss harvesting</li>
              </ul>
              <div className="pt-4">
                <a 
                  href={onboardingUrl} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="inline-block px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all shadow-md shadow-blue-600/25"
                >
                  Start SIP Portfolio →
                </a>
              </div>
            </div>
            <div className="lg:col-span-6 flex justify-center">
              <div className="w-full max-w-md p-6 rounded-3xl bg-slate-950 border border-slate-800 shadow-2xl space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-400 font-medium">SIP Compounding Curve</span>
                  <span className="text-xs text-emerald-400 font-bold">15.8% CAGR</span>
                </div>
                <div className="h-32 flex items-end gap-2 pt-4 border-b border-slate-800 pb-2">
                  <div className="w-1/6 bg-blue-600/40 h-1/4 rounded-t-lg"></div>
                  <div className="w-1/6 bg-blue-600/60 h-2/5 rounded-t-lg"></div>
                  <div className="w-1/6 bg-blue-600/80 h-3/5 rounded-t-lg"></div>
                  <div className="w-1/6 bg-blue-600 h-4/5 rounded-t-lg"></div>
                  <div className="w-1/6 bg-emerald-500 h-full rounded-t-lg"></div>
                </div>
                <div className="flex justify-between text-xs text-slate-400 font-medium">
                  <span>Year 1</span><span>Year 3</span><span>Year 5</span><span>Year 10+</span>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION B: SWP & STP AUTOMATION */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center bg-slate-900 p-8 md:p-12 rounded-3xl border border-slate-800 shadow-xl">
            <div className="lg:col-span-6 order-2 lg:order-1 flex justify-center">
              <div className="w-full max-w-md p-6 rounded-3xl bg-slate-950 border border-slate-800 shadow-2xl space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-400 font-medium">Cashflow Engine</span>
                  <span className="text-xs text-blue-400 font-bold">SWP Active</span>
                </div>
                <div className="p-4 rounded-2xl bg-blue-950/60 border border-blue-500/30 space-y-2">
                  <div className="text-xs text-blue-300 font-medium">Monthly Payout to Bank</div>
                  <div className="text-2xl font-black text-white">₹25,000 / mo</div>
                </div>
                <div className="text-xs text-slate-400 text-center">Tax-efficient capital withdrawal without triggering heavy exit loads.</div>
              </div>
            </div>
            <div className="lg:col-span-6 order-1 lg:order-2 space-y-6">
              <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider">Dynamic Payouts</span>
              <h3 className="text-3xl font-bold">SWP & STP Automation</h3>
              <p className="text-slate-400 text-base leading-relaxed">
                Take control of your cash flow. Set up Systematic Withdrawal Plans (SWP) for regular income or Systematic Transfer Plans (STP) to transition funds safely during market peaks.
              </p>
              <div className="pt-4">
                <a 
                  href={onboardingUrl} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="inline-block px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all shadow-md shadow-blue-600/25"
                >
                  Setup Cashflows →
                </a>
              </div>
            </div>
          </div>

          {/* SECTION C: TERM & HEALTH INSURANCE (Digital Policy Card Mockups) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center bg-slate-900 p-8 md:p-12 rounded-3xl border border-slate-800 shadow-xl">
            <div className="lg:col-span-6 space-y-6">
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider">IRDAI Regulated Protection</span>
              <h3 className="text-3xl font-bold">Term Life & Health Mediclaim Cards</h3>
              <p className="text-slate-400 text-base leading-relaxed">
                Shield your family capital and business continuity. Get multi-crore term life protection and instant digital health cards with 10,000+ cashless hospital networks.
              </p>
              <ul className="space-y-2 text-sm text-slate-300">
                <li className="flex items-center gap-2"><span className="text-emerald-400 font-bold">✓</span> In-house dedicated claim support desk</li>
                <li className="flex items-center gap-2"><span className="text-emerald-400 font-bold">✓</span> Instant digital health card access</li>
              </ul>
              <div className="pt-4">
                <a 
                  href="https://wa.me/919042747590" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="inline-block px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-all shadow-md shadow-emerald-600/25"
                >
                  Request Insurance Quote →
                </a>
              </div>
            </div>
            <div className="lg:col-span-6 flex justify-center">
              <div className="w-full max-w-md p-6 rounded-3xl bg-gradient-to-br from-emerald-950 via-slate-950 to-slate-900 border border-emerald-500/40 shadow-2xl space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">Digital Policy Card</span>
                  <span className="text-xs text-white font-semibold">Active</span>
                </div>
                <div className="p-4 rounded-2xl bg-emerald-900/30 border border-emerald-500/30 space-y-1">
                  <div className="text-xs text-emerald-300 font-medium">Term Cover Approved</div>
                  <div className="text-2xl font-black text-white">₹1,00,00,000+</div>
                </div>
                <div className="p-4 rounded-2xl bg-teal-900/30 border border-teal-500/30 space-y-1">
                  <div className="text-xs text-teal-300 font-medium">Health Cashless Desk</div>
                  <div className="text-sm font-bold text-white">10,000+ Network Hospitals</div>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION D: LOAN AGAINST MUTUAL FUNDS (Overdraft Credit Mockup) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center bg-slate-900 p-8 md:p-12 rounded-3xl border border-slate-800 shadow-xl">
            <div className="lg:col-span-6 order-2 lg:order-1 flex justify-center">
              <div className="w-full max-w-md p-6 rounded-3xl bg-slate-950 border border-slate-800 shadow-2xl space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-400 font-medium">Pledge Credit Limit</span>
                  <span className="text-xs text-purple-400 font-bold">Instant Overdraft</span>
                </div>
                <div className="p-4 rounded-2xl bg-purple-950/50 border border-purple-500/30 space-y-2">
                  <div className="text-xs text-purple-300 font-medium">Available Credit Disbursal</div>
                  <div className="text-2xl font-black text-white">Up to 80% of Portfolio</div>
                </div>
                <div className="text-xs text-emerald-400 font-semibold text-center">✓ Mutual fund units stay invested & compounding</div>
              </div>
            </div>
            <div className="lg:col-span-6 order-1 lg:order-2 space-y-6">
              <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-400 text-xs font-bold uppercase tracking-wider">Instant Liquidity</span>
              <h3 className="text-3xl font-bold">Loan Against Mutual Funds</h3>
              <p className="text-slate-400 text-base leading-relaxed">
                Need urgent capital without breaking your long-term compounding? Pledge your mutual fund units digitally and receive same-day overdraft credit directly in your bank account.
              </p>
              <div className="pt-4">
                <a 
                  href={onboardingUrl} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="inline-block px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold transition-all shadow-md shadow-purple-600/25"
                >
                  Check Credit Limit →
                </a>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 4. 1-TO-1 CONSULTATION SECTION */}
      <section id="consultation" className="bg-blue-900 text-white px-6 py-24 text-center border-t border-blue-800">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Book a 1-to-1 Advisory Consultation</h2>
          <p className="text-blue-200 text-lg leading-relaxed">Discuss your portfolio strategy, insurance coverage, or tax-saving asset allocation directly with our professional desk.</p>
          <div className="pt-4">
            <a 
              href="https://wa.me/919042747590" 
              target="_blank" 
              rel="noreferrer" 
              className="inline-block px-8 py-4 rounded-2xl bg-white text-blue-900 font-bold hover:bg-blue-50 transition-all shadow-xl"
            >
              Schedule Via WhatsApp / Direct Call
            </a>
          </div>
        </div>
      </section>

      {/* 5. VERIFIED REGULATORY FOOTER */}
      <section className="bg-slate-950 border-t border-slate-900 px-6 py-12 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="space-y-1">
            <div className="font-bold text-white text-sm">Brewrich Wealth (Brewrich Trading)</div>
            <p>Theni, Tamil Nadu • Professional Institutional Wealth & Distribution Desk</p>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="block font-bold text-white mb-0.5">AMFI Registered MFD</span>
              ARN-335693 | EUIN: E637441
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="block font-bold text-white mb-0.5">IRDAI Licensed Advisor</span>
              URN: CAI0405260445 (Composite)
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="block font-bold text-white mb-0.5">ISO 9001:2015 Certified</span>
              Udyam: UDYAM-TN-23-0001645
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
