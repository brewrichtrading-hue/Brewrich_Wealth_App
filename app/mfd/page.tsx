'use client';

import React from 'react';
import Link from 'next/link';

const ASSETPLUS_ONBOARD_URL = 'https://www.assetplus.in/mfd/ARN-335693';
const ASSETPLUS_PORTAL_URL = 'https://partner.assetplus.in';

export default function MfdPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-950 via-blue-900 to-slate-950 text-white selection:bg-blue-500 selection:text-white">
      
      {/* 1. NAVBAR / HEADER SIMILAR TO MAIN HOMEPAGE */}
      <nav className="border-b border-blue-800/50 bg-blue-950/80 backdrop-blur-md sticky top-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg tracking-wider group">
            <span className="px-3 py-1 bg-blue-600 rounded-lg text-white text-sm shadow-md group-hover:bg-blue-500 transition-all">BREWRICH</span>
            <span className="text-blue-200 text-xs uppercase tracking-widest hidden sm:inline">Institutional Wealth & MFD</span>
          </Link>
          <div className="flex items-center gap-3">
            <a
              href={ASSETPLUS_ONBOARD_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs md:text-sm font-semibold px-4 py-2 rounded-xl bg-white text-blue-950 hover:bg-blue-50 transition-all shadow-md"
            >
              Open Free Account
            </a>
            <a
              href={ASSETPLUS_PORTAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs md:text-sm font-semibold px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 transition-all shadow-md shadow-blue-600/30"
            >
              Client Portal Login
            </a>
          </div>
        </div>
      </nav>

      {/* 2. HERO SECTION (Matching Main Homepage Blue Theme) */}
      <section className="relative px-6 pt-16 pb-16 md:pt-24 md:pb-20 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold mb-6 shadow-inner">
          <span>🛡️ ISO 9001:2015 Certified • AMFI & IRDAI Regulated Desk</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
          All-in-One Wealth, Protection & <br />
          <span className="bg-gradient-to-r from-blue-300 via-white to-emerald-300 bg-clip-text text-transparent">
            Credit Solutions for Your Family
          </span>
        </h1>
        <p className="text-blue-200/80 text-lg md:text-xl max-w-3xl mx-auto mb-10 leading-relaxed">
          Seamlessly manage mutual fund compounding, SIP/SWP automation, multi-crore term & health insurance, and instant liquidity loans under one roof.
        </p>

        {/* Live Metrics Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto p-6 rounded-2xl bg-blue-900/40 border border-blue-700/50 backdrop-blur-md shadow-2xl">
          <div className="p-3">
            <div className="text-2xl md:text-3xl font-black text-white">₹140Cr+</div>
            <div className="text-xs text-blue-300 uppercase tracking-wider mt-1">AUM & Capital Advised</div>
          </div>
          <div className="p-3">
            <div className="text-2xl md:text-3xl font-black text-emerald-400">94.2%</div>
            <div className="text-xs text-blue-300 uppercase tracking-wider mt-1">Order Execution Rate</div>
          </div>
          <div className="p-3">
            <div className="text-2xl md:text-3xl font-black text-white">4.9 / 5.0</div>
            <div className="text-xs text-blue-300 uppercase tracking-wider mt-1">Investor Rating</div>
          </div>
          <div className="p-3">
            <div className="text-2xl md:text-3xl font-black text-blue-300">100%</div>
            <div className="text-xs text-blue-300 uppercase tracking-wider mt-1">Regulated & Compliant</div>
          </div>
        </div>
      </section>

      {/* 3. COMPREHENSIVE PRODUCT SUITE & INFOGRAPHICS */}
      <section className="px-6 py-16 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Explore Our Financial Services Suite</h2>
          <p className="text-blue-200/70 max-w-2xl mx-auto">Engineered for disciplined wealth accumulation, risk mitigation, and instant liquidity.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* CARD 1: SIP & Mutual Funds */}
          <div className="p-8 rounded-2xl bg-blue-900/30 border border-blue-700/40 hover:border-blue-400 transition-all shadow-xl flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-xl bg-blue-600/30 border border-blue-400/40 flex items-center justify-center text-xl mb-6">📈</div>
              <h3 className="text-2xl font-bold mb-3 text-white">Systematic Investment (SIP)</h3>
              <p className="text-blue-200/80 text-sm mb-6 leading-relaxed">
                Automate your wealth compounding with disciplined monthly allocations across top-tier Flexi-Cap, Mid-Cap, and Index baskets.
              </p>
            </div>
            <div className="border-t border-blue-800/60 pt-4 space-y-2 text-xs text-blue-200">
              <div className="flex justify-between"><span>Minimum SIP:</span> <span className="font-semibold text-white">₹500 / month</span></div>
              <div className="flex justify-between"><span>Execution:</span> <span className="font-semibold text-emerald-400">Instant UPI / Mandate</span></div>
              <div className="pt-2">
                <a
                  href={ASSETPLUS_ONBOARD_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-2.5 text-center rounded-xl bg-blue-600/40 hover:bg-blue-600 text-white font-semibold text-xs transition-all"
                >
                  Start SIP On AssetPlus →
                </a>
              </div>
            </div>
          </div>

          {/* CARD 2: SWP & STP Wealth Automation */}
          <div className="p-8 rounded-2xl bg-blue-900/30 border border-blue-700/40 hover:border-blue-400 transition-all shadow-xl flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-xl bg-blue-600/30 border border-blue-400/40 flex items-center justify-center text-xl mb-6">🔄</div>
              <h3 className="text-2xl font-bold mb-3 text-white">SWP & STP Automation</h3>
              <p className="text-blue-200/80 text-sm mb-6 leading-relaxed">
                Take control of cash flows. Set up Systematic Withdrawal Plans (SWP) for regular income or Systematic Transfer Plans (STP) to optimize market dips.
              </p>
            </div>
            <div className="border-t border-blue-800/60 pt-4 space-y-2 text-xs text-blue-200">
              <div className="flex justify-between"><span>SWP Benefit:</span> <span className="font-semibold text-white">Tax-Efficient Cashflow</span></div>
              <div className="flex justify-between"><span>STP Benefit:</span> <span className="font-semibold text-emerald-400">Dynamic Risk Balancing</span></div>
              <div className="pt-2">
                <a
                  href={ASSETPLUS_ONBOARD_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-2.5 text-center rounded-xl bg-blue-600/40 hover:bg-blue-600 text-white font-semibold text-xs transition-all"
                >
                  Configure SWP / STP →
                </a>
              </div>
            </div>
          </div>

          {/* CARD 3: Term Insurance (Life Protection) */}
          <div className="p-8 rounded-2xl bg-blue-900/30 border border-blue-700/40 hover:border-emerald-400 transition-all shadow-xl flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-4 right-4 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">IRDAI REGISTERED</div>
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-600/30 border border-emerald-400/40 flex items-center justify-center text-xl mb-6">🛡️</div>
              <h3 className="text-2xl font-bold mb-3 text-white">Multi-Crore Term Insurance</h3>
              <p className="text-blue-200/80 text-sm mb-6 leading-relaxed">
                Shield your family and business continuity from life’s unpredictable events with robust, high-cover term life protection plans.
              </p>
            </div>
            <div className="border-t border-blue-800/60 pt-4 space-y-2 text-xs text-blue-200">
              <div className="flex justify-between"><span>Coverage:</span> <span className="font-semibold text-white">Up to ₹10Cr+ Cover</span></div>
              <div className="flex justify-between"><span>Claim Support:</span> <span className="font-semibold text-emerald-400">In-House Dedicated Desk</span></div>
              <div className="pt-2">
                <a
                  href={ASSETPLUS_PORTAL_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-2.5 text-center rounded-xl bg-emerald-600/40 hover:bg-emerald-600 text-white font-semibold text-xs transition-all"
                >
                  Consult Insurance Desk →
                </a>
              </div>
            </div>
          </div>

          {/* CARD 4: Health Insurance (Mediclaim Cards) */}
          <div className="p-8 rounded-2xl bg-blue-900/30 border border-blue-700/40 hover:border-emerald-400 transition-all shadow-xl flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-4 right-4 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">CASHLESS DESK</div>
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-600/30 border border-emerald-400/40 flex items-center justify-center text-xl mb-6">🏥</div>
              <h3 className="text-2xl font-bold mb-3 text-white">Health Insurance & Cards</h3>
              <p className="text-blue-200/80 text-sm mb-6 leading-relaxed">
                Comprehensive health mediclaim coverage featuring instant digital health cards, cashless hospital network access, and critical illness riders.
              </p>
            </div>
            <div className="border-t border-blue-800/60 pt-4 space-y-2 text-xs text-blue-200">
              <div className="flex justify-between"><span>Network:</span> <span className="font-semibold text-white">10,000+ Hospitals</span></div>
              <div className="flex justify-between"><span>Digital Access:</span> <span className="font-semibold text-emerald-400">Instant Health Card</span></div>
              <div className="pt-2">
                <a
                  href={ASSETPLUS_PORTAL_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-2.5 text-center rounded-xl bg-emerald-600/40 hover:bg-emerald-600 text-white font-semibold text-xs transition-all"
                >
                  Access Cashless Network →
                </a>
              </div>
            </div>
          </div>

          {/* CARD 5: Fixed Deposits & NPS */}
          <div className="p-8 rounded-2xl bg-blue-900/30 border border-blue-700/40 hover:border-amber-400 transition-all shadow-xl flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-xl bg-amber-600/30 border border-amber-400/40 flex items-center justify-center text-xl mb-6">🏦</div>
              <h3 className="text-2xl font-bold mb-3 text-white">Fixed Deposits & NPS</h3>
              <p className="text-blue-200/80 text-sm mb-6 leading-relaxed">
                Lock in secure yields with AAA-rated corporate & bank Fixed Deposits alongside tax-saving retirement compounding through the National Pension System.
              </p>
            </div>
            <div className="border-t border-blue-800/60 pt-4 space-y-2 text-xs text-blue-200">
              <div className="flex justify-between"><span>Fixed Income:</span> <span className="font-semibold text-white">High-Yield AAA FDs</span></div>
              <div className="flex justify-between"><span>Retirement:</span> <span className="font-semibold text-amber-400">NPS Tier I & II Tax Saver</span></div>
              <div className="pt-2">
                <a
                  href={ASSETPLUS_ONBOARD_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-2.5 text-center rounded-xl bg-amber-600/40 hover:bg-amber-600 text-white font-semibold text-xs transition-all"
                >
                  Explore Fixed Deposits →
                </a>
              </div>
            </div>
          </div>

          {/* CARD 6: Loan Against Mutual Funds */}
          <div className="p-8 rounded-2xl bg-blue-900/30 border border-blue-700/40 hover:border-purple-400 transition-all shadow-xl flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-4 right-4 px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-bold">INSTANT LIQUIDITY</div>
            <div>
              <div className="w-12 h-12 rounded-xl bg-purple-600/30 border border-purple-400/40 flex items-center justify-center text-xl mb-6">💳</div>
              <h3 className="text-2xl font-bold mb-3 text-white">Loan Against Mutual Funds</h3>
              <p className="text-blue-200/80 text-sm mb-6 leading-relaxed">
                Need urgent capital without breaking your long-term compounding? Pledge your mutual fund units digitally and get instant overdraft credit in hours.
              </p>
            </div>
            <div className="border-t border-blue-800/60 pt-4 space-y-2 text-xs text-blue-200">
              <div className="flex justify-between"><span>Compounding:</span> <span className="font-semibold text-white">Units Stay Invested</span></div>
              <div className="flex justify-between"><span>Disbursal:</span> <span className="font-semibold text-purple-300">Same-Day Overdraft</span></div>
              <div className="pt-2">
                <a
                  href={ASSETPLUS_PORTAL_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-2.5 text-center rounded-xl bg-purple-600/40 hover:bg-purple-600 text-white font-semibold text-xs transition-all"
                >
                  Apply For Digital Loan →
                </a>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 4. VERIFIED LICENSING & REGULATORY FOOTER */}
      <section className="border-t border-blue-800/60 bg-blue-950 px-6 py-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          <div>
            <h4 className="font-bold text-lg mb-1">Brewrich Wealth (Brewrich Trading)</h4>
            <p className="text-xs text-blue-300/80 max-w-md leading-relaxed">
              Institutional distribution, mutual fund advisory, and insurance solutions based in Theni, Tamil Nadu.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-4 text-xs text-blue-200">
            <div className="p-3.5 rounded-xl bg-blue-900/60 border border-blue-700">
              <span className="block font-bold text-white mb-0.5">AMFI Registered MFD</span>
              ARN-335693 | EUIN: E637441
            </div>
            <div className="p-3.5 rounded-xl bg-blue-900/60 border border-blue-700">
              <span className="block font-bold text-white mb-0.5">IRDAI Licensed Advisor</span>
              URN: CAI0405260445 (Composite)
            </div>
            <div className="p-3.5 rounded-xl bg-blue-900/60 border border-blue-700">
              <span className="block font-bold text-white mb-0.5">ISO 9001:2015 Certified</span>
              Udyam: UDYAM-TN-23-0001645
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
