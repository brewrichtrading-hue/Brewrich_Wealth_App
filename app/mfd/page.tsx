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

        {/* Hero Dashboard Mockup Card */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="w-full max-w-md p-6 rounded-3xl bg-blue-700/40 border border-blue-400/30 backdrop-blur-xl shadow-2xl space-y-6">
            <div className="flex justify-between items-center border-b border-blue-500/40 pb-4">
              <div>
                <span className="text-xs text-blue-200 uppercase tracking-wider">Automated Portfolio</span>
                <div className="text-3xl font-black text-white mt-1">₹140Cr+ <span className="text-sm font-normal text-emerald-300">AUM Advised</span></div>
              </div>
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-xl">📈</div>
            </div>
            <div className="p-4 rounded-2xl bg-blue-800/60 border border-blue-500/30 space-y-3">
              <div className="flex justify-between text-xs text-blue-200">
                <span>Execution Success</span>
                <span className="font-bold text-emerald-300">94.2% Rate</span>
              </div>
              <div className="w-full bg-blue-950 rounded-full h-2 overflow-hidden">
                <div className="bg-emerald-400 h-2 rounded-full w-[94%]"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. VISUAL PRODUCT MODULES (Betterment Style Cards with Rich Mockups) */}
      <section className="bg-slate-950 text-white px-6 py-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">Invest and protect the way you want.</h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">Explore our modular architecture with built-in visual widgets for every financial service.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* 1. SIP WIDGET CARD */}
            <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 hover:border-blue-500 transition-all shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center text-xl font-bold">📈</div>
                  <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold">SIP Growth</span>
                </div>
                <h3 className="text-2xl font-bold mb-2">Systematic Investment</h3>
                <p className="text-slate-400 text-sm mb-6 leading-relaxed">Discipline-driven monthly compounding across top-tier Flexi-Cap & Index baskets.</p>
                {/* Visual Mockup Element */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 mb-6 space-y-2">
                  <div className="flex justify-between text-xs text-slate-400"><span>Monthly SIP</span><span className="text-emerald-400 font-bold">₹5,000 / mo</span></div>
                  <div className="w-full bg-slate-900 rounded-full h-2"><div className="bg-blue-500 h-2 rounded-full w-3/4"></div></div>
                </div>
              </div>
              <a 
                href={onboardingUrl} 
                target="_blank" 
                rel="noreferrer" 
                className="block text-center py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-all shadow-md"
              >
                Start SIP Now →
              </a>
            </div>

            {/* 2. SWP & STP WIDGET CARD */}
            <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 hover:border-blue-500 transition-all shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center text-xl font-bold">🔄</div>
                  <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold">Cashflow</span>
                </div>
                <h3 className="text-2xl font-bold mb-2">SWP & STP Automation</h3>
                <p className="text-slate-400 text-sm mb-6 leading-relaxed">Set up Systematic Withdrawal Plans for regular income or dynamic STP risk balancing.</p>
                {/* Visual Mockup Element */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 mb-6 space-y-2">
                  <div className="flex justify-between text-xs text-slate-400"><span>Transfer Mode</span><span className="text-blue-400 font-bold">Active Rebalance</span></div>
                  <div className="w-full bg-slate-900 rounded-full h-2"><div className="bg-indigo-500 h-2 rounded-full w-2/3"></div></div>
                </div>
              </div>
              <a 
                href={onboardingUrl} 
                target="_blank" 
                rel="noreferrer" 
                className="block text-center py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-all shadow-md"
              >
                Setup Payouts →
              </a>
            </div>

            {/* 3. TERM INSURANCE WIDGET CARD */}
            <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 hover:border-emerald-500 transition-all shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-xl font-bold">🛡️</div>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold">IRDAI Regulated</span>
                </div>
                <h3 className="text-2xl font-bold mb-2">Multi-Crore Term Life</h3>
                <p className="text-slate-400 text-sm mb-6 leading-relaxed">Robust protection safeguarding your family capital and business continuity.</p>
                {/* Visual Mockup Element */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 to-slate-950 border border-emerald-500/30 mb-6 space-y-1">
                  <span className="text-[10px] text-emerald-400 uppercase tracking-widest block font-semibold">Term Protection Card</span>
                  <div className="text-lg font-black text-white">Cover: ₹1.00 Cr - ₹10Cr+</div>
                </div>
              </div>
              <a 
                href="https://wa.me/919042747590" 
                target="_blank" 
                rel="noreferrer" 
                className="block text-center py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold transition-all shadow-md"
              >
                Get Quote →
              </a>
            </div>

            {/* 4. HEALTH INSURANCE WIDGET CARD */}
            <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 hover:border-emerald-500 transition-all shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-xl font-bold">🏥</div>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold">10k+ Hospitals</span>
                </div>
                <h3 className="text-2xl font-bold mb-2">Health Mediclaim Cards</h3>
                <p className="text-slate-400 text-sm mb-6 leading-relaxed">Comprehensive health plans featuring instant digital health cards and cashless access.</p>
                {/* Visual Mockup Element */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-teal-950/40 to-slate-950 border border-teal-500/30 mb-6 space-y-1">
                  <span className="text-[10px] text-teal-400 uppercase tracking-widest block font-semibold">Digital Health Card</span>
                  <div className="text-lg font-black text-white">Cashless Network Active</div>
                </div>
              </div>
              <a 
                href="https://wa.me/919042747590" 
                target="_blank" 
                rel="noreferrer" 
                className="block text-center py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold transition-all shadow-md"
              >
                Claim Support →
              </a>
            </div>

            {/* 5. FIXED DEPOSITS & NPS WIDGET CARD */}
            <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 hover:border-amber-500 transition-all shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center text-xl font-bold">🏦</div>
                  <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold">AAA Yields</span>
                </div>
                <h3 className="text-2xl font-bold mb-2">Fixed Deposits & NPS</h3>
                <p className="text-slate-400 text-sm mb-6 leading-relaxed">Secure predictable yields with corporate FDs and tax-saving retirement compounding.</p>
                {/* Visual Mockup Element */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 mb-6 space-y-2">
                  <div className="flex justify-between text-xs text-slate-400"><span>Target APY</span><span className="text-amber-400 font-bold">High-Yield AAA</span></div>
                  <div className="w-full bg-slate-900 rounded-full h-2"><div className="bg-amber-500 h-2 rounded-full w-4/5"></div></div>
                </div>
              </div>
              <a 
                href={onboardingUrl} 
                target="_blank" 
                rel="noreferrer" 
                className="block text-center py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-sm font-semibold transition-all shadow-md"
              >
                Invest in FDs/NPS →
              </a>
            </div>

            {/* 6. LOAN AGAINST MUTUAL FUNDS WIDGET CARD */}
            <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 hover:border-purple-500 transition-all shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center text-xl font-bold">💳</div>
                  <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-semibold">Instant Credit</span>
                </div>
                <h3 className="text-2xl font-bold mb-2">Loan Against Mutual Funds</h3>
                <p className="text-slate-400 text-sm mb-6 leading-relaxed">Need urgent capital? Pledge units digitally for fast overdraft credit without breaking compounding.</p>
                {/* Visual Mockup Element */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 mb-6 space-y-2">
                  <div className="flex justify-between text-xs text-slate-400"><span>Compounding</span><span className="text-purple-400 font-bold">100% Units Invested</span></div>
                  <div className="w-full bg-slate-900 rounded-full h-2"><div className="bg-purple-500 h-2 rounded-full w-full"></div></div>
                </div>
              </div>
              <a 
                href={onboardingUrl} 
                target="_blank" 
                rel="noreferrer" 
                className="block text-center py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold transition-all shadow-md"
              >
                Check Overdraft Limit →
              </a>
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
