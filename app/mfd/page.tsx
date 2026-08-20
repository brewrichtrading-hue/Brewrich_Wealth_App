'use client';

import React from 'react';
import Link from 'next/link';

export default function MfdPage() {
  return (
    <div className="min-h-screen bg-blue-600 text-white selection:bg-white selection:text-blue-600">
      
      {/* 1. EXACT HOMEPAGE NAVIGATION */}
      <nav className="border-b border-blue-500/30 bg-blue-600 sticky top-0 z-50 px-6 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg tracking-wider">
            <span className="px-3 py-1 bg-white text-blue-600 rounded-lg text-sm shadow-md">BREWRICH</span>
            <span className="text-blue-100 text-xs uppercase tracking-widest hidden sm:inline">Institutional Wealth & MFD</span>
          </Link>
          <div className="flex items-center gap-4">
            <a 
              href="https://partner.assetplus.in" 
              target="_blank" 
              rel="noreferrer" 
              className="text-xs md:text-sm font-semibold px-4 py-2 rounded-xl bg-white text-blue-600 hover:bg-blue-50 transition-all shadow-md"
            >
              Client Portal Login
            </a>
          </div>
        </div>
      </nav>

      {/* 2. HERO SECTION (Exact Homepage Bright Blue Theme) */}
      <section className="relative px-6 pt-16 pb-20 md:pt-24 md:pb-28 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/30 border border-blue-400/40 text-white text-xs font-semibold mb-6 shadow-sm">
          <span>🛡️ ISO 9001:2015 Certified • AMFI & IRDAI Regulated Desk</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight text-white">
          Institutional Wealth & <br />
          Disciplined Compounding.
        </h1>
        <p className="text-blue-100 text-lg md:text-xl max-w-3xl mx-auto mb-10 leading-relaxed">
          All-in-one financial ecosystem for your business and family: automated mutual funds, SIP/SWP/STP, term & health insurance, fixed deposits, NPS, and instant loans.
        </p>

        {/* Action Buttons & Call Booking Integration */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <a 
            href="https://partner.assetplus.in" 
            target="_blank" 
            rel="noreferrer" 
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white text-blue-600 font-bold hover:bg-blue-50 transition-all shadow-xl"
          >
            Manage My Wealth →
          </a>
          <a 
            href="#consultation" 
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-blue-700/80 border border-blue-400/40 text-white font-bold hover:bg-blue-700 transition-all shadow-lg"
          >
            📅 Book 1-to-1 Consultation Call
          </a>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto p-6 rounded-2xl bg-blue-700/50 border border-blue-500/40 backdrop-blur-md shadow-xl text-white">
          <div className="p-3">
            <div className="text-2xl md:text-3xl font-black">₹140Cr+</div>
            <div className="text-xs text-blue-200 uppercase tracking-wider mt-1">AUM & Capital Advised</div>
          </div>
          <div className="p-3">
            <div className="text-2xl md:text-3xl font-black text-emerald-300">94.2%</div>
            <div className="text-xs text-blue-200 uppercase tracking-wider mt-1">Order Execution Rate</div>
          </div>
          <div className="p-3">
            <div className="text-2xl md:text-3xl font-black">4.9 / 5.0</div>
            <div className="text-xs text-blue-200 uppercase tracking-wider mt-1">Investor Rating</div>
          </div>
          <div className="p-3">
            <div className="text-2xl md:text-3xl font-black">100%</div>
            <div className="text-xs text-blue-200 uppercase tracking-wider mt-1">Regulated & Compliant</div>
          </div>
        </div>
      </section>

      {/* 3. DETAILED PRODUCTS & INFOGRAPHICS SECTION */}
      <section className="bg-slate-950 text-white px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Complete Financial, Protection & Credit Suite</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">Everything you need for comprehensive family security and capital growth, structured under professional regulatory standards.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* SIP Card */}
            <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 hover:border-blue-500 transition-all shadow-lg">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center text-xl mb-6">📈</div>
              <h3 className="text-xl font-bold mb-3">Systematic Investment (SIP)</h3>
              <p className="text-slate-400 text-sm mb-6 leading-relaxed">Discipline-driven monthly compounding across curated Flexi-Cap, Mid-Cap, and Index fund baskets.</p>
              <div className="border-t border-slate-800 pt-4 text-xs text-slate-300 space-y-1">
                <div>✓ Automated UPI Mandates</div>
                <div>✓ Flexible Step-up SIP Options</div>
              </div>
            </div>

            {/* SWP & STP Card */}
            <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 hover:border-blue-500 transition-all shadow-lg">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center text-xl mb-6">🔄</div>
              <h3 className="text-xl font-bold mb-3">SWP & STP Automation</h3>
              <p className="text-slate-400 text-sm mb-6 leading-relaxed">Manage cash flows with Systematic Withdrawal Plans (SWP) or dynamically balance risk via Systematic Transfers (STP).</p>
              <div className="border-t border-slate-800 pt-4 text-xs text-slate-300 space-y-1">
                <div>✓ Tax-Efficient Cashflow</div>
                <div>✓ Dynamic Market Balancing</div>
              </div>
            </div>

            {/* Term Insurance Card */}
            <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500 transition-all shadow-lg relative">
              <div className="absolute top-4 right-4 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">IRDAI REG.</div>
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-xl mb-6">🛡️</div>
              <h3 className="text-xl font-bold mb-3">Multi-Crore Term Insurance</h3>
              <p className="text-slate-400 text-sm mb-6 leading-relaxed">Comprehensive life protection safeguarding your family capital and business continuity against contingencies.</p>
              <div className="border-t border-slate-800 pt-4 text-xs text-slate-300 space-y-1">
                <div>✓ Up to ₹10Cr+ Life Cover</div>
                <div>✓ Dedicated Claim Support Desk</div>
              </div>
            </div>

            {/* Health Insurance Card */}
            <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500 transition-all shadow-lg relative">
              <div className="absolute top-4 right-4 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">CASHLESS</div>
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-xl mb-6">🏥</div>
              <h3 className="text-xl font-bold mb-3">Health Insurance & Cards</h3>
              <p className="text-slate-400 text-sm mb-6 leading-relaxed">Robust health mediclaim coverage featuring instant digital health cards and 10,000+ cashless hospital networks.</p>
              <div className="border-t border-slate-800 pt-4 text-xs text-slate-300 space-y-1">
                <div>✓ Instant Digital Health Card</div>
                <div>✓ Zero Hospitalization Hassles</div>
              </div>
            </div>

            {/* Fixed Deposits & NPS Card */}
            <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-500 transition-all shadow-lg">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center text-xl mb-6">🏦</div>
              <h3 className="text-xl font-bold mb-3">Fixed Deposits & NPS</h3>
              <p className="text-slate-400 text-sm mb-6 leading-relaxed">Secure predictable compounding with AAA-rated Fixed Deposits and tax-saving National Pension System (NPS).</p>
              <div className="border-t border-slate-800 pt-4 text-xs text-slate-300 space-y-1">
                <div>✓ High-Yield AAA FDs</div>
                <div>✓ Tier I & II Retirement Tax Saver</div>
              </div>
            </div>

            {/* Loan Against Mutual Funds Card */}
            <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 hover:border-purple-500 transition-all shadow-lg relative">
              <div className="absolute top-4 right-4 px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-400 text-[10px] font-bold">LIQUIDITY</div>
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center text-xl mb-6">💳</div>
              <h3 className="text-xl font-bold mb-3">Loan Against Mutual Funds</h3>
              <p className="text-slate-400 text-sm mb-6 leading-relaxed">Get instant liquidity without breaking your long-term mutual fund compounding. Pledge units digitally for fast overdraft credit.</p>
              <div className="border-t border-slate-800 pt-4 text-xs text-slate-300 space-y-1">
                <div>✓ Units Stay Fully Invested</div>
                <div>✓ Same-Day Overdraft Disbursal</div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. ONE-TO-ONE CALL BOOKING SECTION */}
      <section id="consultation" className="bg-blue-900 text-white px-6 py-20 text-center border-t border-blue-800">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Book a 1-to-1 Advisory Consultation</h2>
          <p className="text-blue-200 mb-8 leading-relaxed">Discuss your portfolio strategy, insurance coverage, or tax-saving asset allocation directly with our professional desk.</p>
          <a 
            href="https://wa.me/919042747590" 
            target="_blank" 
            rel="noreferrer" 
            className="inline-block px-8 py-4 rounded-xl bg-white text-blue-900 font-bold hover:bg-blue-50 transition-all shadow-xl"
          >
            Schedule Via WhatsApp / Direct Call
          </a>
        </div>
      </section>

      {/* 5. VERIFIED COMPLIANCE FOOTER */}
      <section className="bg-slate-950 border-t border-slate-900 px-6 py-12 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div>
            <div className="font-bold text-white text-sm mb-1">Brewrich Wealth (Brewrich Trading)</div>
            <p>Theni, Tamil Nadu • Professional Institutional Wealth & Distribution Desk</p>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <span className="block font-semibold text-white mb-0.5">AMFI Registered MFD</span>
              ARN-335693 | EUIN: E637441
            </div>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <span className="block font-semibold text-white mb-0.5">IRDAI Licensed Advisor</span>
              URN: CAI0405260445 (Composite)
            </div>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <span className="block font-semibold text-white mb-0.5">ISO 9001:2015 Certified</span>
              Udyam: UDYAM-TN-23-0001645
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
