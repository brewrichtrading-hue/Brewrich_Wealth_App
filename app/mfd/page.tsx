'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function MfdPage() {
  // Interactive State for SIP Calculator
  const [sipAmount, setSipAmount] = useState<number>(10000);
  const sipYears = 10;
  const expectedReturn = 0.14; 
  const monthlyRate = expectedReturn / 12;
  const totalMonths = sipYears * 12;
  const investedAmount = sipAmount * totalMonths;
  const futureValue = sipAmount * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) * (1 + monthlyRate);
  const estimatedGains = futureValue - investedAmount;

  // Interactive State for Loan Against Mutual Funds (LAMF)
  const [portfolioValue, setPortfolioValue] = useState<number>(2500000);
  const approvedLimit = portfolioValue * 0.80;

  const onboardingUrl = "https://mweb.assetplus.in/client_onboarding/?advisor=688b3679af6048595923afd2";
  const phoneWhatsAppNumber = "+919042747590";

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-slate-900 font-sans selection:bg-blue-600 selection:text-white">
      
      {/* ================= HERO SECTION (Betterment Royal Blue) ================= */}
      <section className="relative bg-blue-600 text-white overflow-hidden pt-20 pb-32 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-400/30 via-transparent to-blue-900/50 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/30 border border-blue-400/40 text-xs font-bold tracking-wide uppercase backdrop-blur-md text-blue-100">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Brewrich Institutional Wealth Platform
            </div>

            <h1 className="text-4xl sm:text-6xl font-serif tracking-tight leading-[1.1]">
              Build wealth with confidence and ease.
            </h1>

            <p className="text-lg sm:text-xl text-blue-100 font-normal max-w-2xl leading-relaxed">
              Investing and saving shouldn't take over your life. Brewrich automates your advisory, tax optimization, and credit lines for you.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href={onboardingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-bold text-base shadow-xl transition-all transform hover:-translate-y-0.5"
              >
                Get Started &rarr;
              </a>
              <a
                href={`https://wa.me/${phoneWhatsAppNumber.replace('+', '')}?text=Hi,%20I%20would%20like%20to%20schedule%20a%201-to-1%20wealth%20consultation.`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-4 rounded-xl bg-blue-700/80 hover:bg-blue-700 text-white font-semibold text-base border border-blue-400/30 backdrop-blur-md transition-all"
              >
                Talk to Advisor (WhatsApp)
              </a>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-blue-500/40 text-blue-100 text-sm">
              <div>
                <p className="font-bold text-white text-xl">₹500 / mo</p>
                <p className="text-xs text-blue-200">Minimum SIP Entry</p>
              </div>
              <div>
                <p className="font-bold text-white text-xl">₹1.25L</p>
                <p className="text-xs text-blue-200">LTCG Tax Free Cap</p>
              </div>
              <div>
                <p className="font-bold text-white text-xl">Trusted</p>
                <p className="text-xs text-blue-200">By Medical Leaders & HNWIs</p>
              </div>
            </div>
          </motion.div>

          {/* Hero Smartphone Mockup */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-5 flex justify-center"
          >
            <div className="relative w-full max-w-sm bg-slate-900 rounded-[3rem] p-4 border-4 border-slate-700 shadow-2xl shadow-black/60">
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-28 h-5 bg-slate-950 rounded-full z-20 flex items-center justify-center">
                <div className="w-12 h-1.5 bg-slate-800 rounded-full" />
              </div>

              <div className="bg-white text-slate-900 rounded-[2.2rem] p-5 pt-8 space-y-4 shadow-inner">
                <div className="flex justify-between items-center text-xs text-slate-500 font-medium">
                  <span>Automated Portfolio</span>
                  <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">XIRR 16.4%</span>
                </div>

                <div>
                  <p className="text-xs text-slate-500">Total Portfolio Value</p>
                  <p className="text-2xl font-black text-slate-900">₹48,93,420.10</p>
                  <p className="text-xs text-emerald-600 font-semibold mt-0.5">+₹4,22,150.80 All-time gain</p>
                </div>

                <div className="bg-blue-50 border border-blue-100 rounded-2xl p-3 space-y-2">
                  <div className="flex justify-between text-xs font-bold text-blue-900">
                    <span>Goal Progress</span>
                    <span>88% on track</span>
                  </div>
                  <div className="w-full bg-blue-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-blue-600 h-full rounded-full w-[88%]" />
                  </div>
                </div>

                <div className="pt-2">
                  <div className="text-xs font-semibold text-slate-600 mb-2">Compounding Trajectory</div>
                  <div className="h-24 w-full flex items-end gap-1.5 pt-2 border-b border-l border-slate-200 px-1">
                    {[35, 42, 50, 58, 65, 74, 82, 95, 110, 135].map((val, idx) => (
                      <div 
                        key={idx} 
                        style={{ height: `${val}%` }} 
                        className="flex-1 bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-sm"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </section>


      {/* ================= SPECIALIZED WEALTH FOR DOCTORS & HNWIS ================= */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl p-8 sm:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-8 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-800 text-xs font-bold uppercase tracking-wider">
                {/* Stethoscope Icon SVG */}
                <svg className="w-4 h-4 text-cyan-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8m-4 0v4m-4 8v1a3 3 0 003 3h2a3 3 0 003-3v-1" />
                </svg>
                Specialized Medical Wealth Practice
              </div>

              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900">
                Tailored Advisory for Doctors & High-Net-Worth Individuals
              </h2>

              <p className="text-slate-600 text-base leading-relaxed">
                We specialize in structuring, auditing, and transforming existing mutual fund portfolios into robust, multi-generational wealth creation legacies for medical professionals. 
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="bg-slate-50 border border-slate-200/80 p-4 rounded-2xl space-y-1">
                  <p className="text-xs font-bold text-blue-600 uppercase">Legacy Transformation</p>
                  <p className="text-sm font-semibold text-slate-800">Optimizing haphazard mutual fund holdings into unified compounding engines.</p>
                </div>
                <div className="bg-slate-50 border border-slate-200/80 p-4 rounded-2xl space-y-1">
                  <p className="text-xs font-bold text-blue-600 uppercase">Trusted by Medical Leaders</p>
                  <p className="text-xs text-slate-700 leading-normal">
                    Proudly advising distinguished practitioners including <strong className="text-slate-900">Dr. Kalaiyarasi</strong>, <strong className="text-slate-900">Dr. Daniel Benedict Devraj</strong>, <strong className="text-slate-900">Dr. Gokulnath</strong>, and <strong className="text-slate-900">Dr. Yeshwant</strong>.
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 bg-gradient-to-br from-blue-900 to-slate-900 rounded-2xl p-6 text-white space-y-4 shadow-xl">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center">
                <svg className="w-7 h-7 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold">Exclusive Medical Portfolio Audit</h3>
                <p className="text-xs text-slate-300 mt-1">Get an institutional review of your family office and mutual fund assets with zero obligation.</p>
              </div>
              <a
                href={onboardingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center w-full py-3 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all shadow-md"
              >
                Schedule Practitioner Review &rarr;
              </a>
            </div>
          </div>
        </div>
      </section>


      {/* ================= BETTERMENT EXACT 3-COLUMN PRODUCT SUITES ================= */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
        
        <div className="text-center space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-widest text-blue-600">Invest The Way You Want</h2>
          <p className="text-3xl sm:text-5xl font-serif text-slate-900">Engineered for Maximum Yield</p>
          <p className="text-slate-600 max-w-xl mx-auto text-base">
            Select your strategy and let institutional automation handle the rebalancing, tax-loss harvesting, and compounding.
          </p>
        </div>

        {/* 3-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Card 1: SIP */}
          <motion.div whileHover={{ y: -6 }} transition={{ duration: 0.2 }} className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden flex flex-col justify-between">
            <div className="p-8 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full">Most Popular</span>
              <h3 className="text-2xl font-serif font-bold text-slate-900">Automated SIP Investing</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Get a globally diversified mutual fund portfolio and let us handle all trading, rebalancing, and tax management for you.
              </p>
              <a href={onboardingUrl} target="_blank" rel="noopener noreferrer" className="inline-block text-blue-600 font-bold text-sm hover:underline">Get started &rarr;</a>
            </div>
            <div className="bg-gradient-to-b from-slate-50 to-blue-900/10 p-6 border-t border-slate-100 space-y-4">
              <div className="bg-white rounded-2xl p-4 shadow-md border border-slate-200 space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 font-medium">SIP Core Portfolio</span>
                  <span className="font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">14% p.a.</span>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Monthly Allocation</p>
                  <p className="text-xl font-black text-slate-900">₹{sipAmount.toLocaleString('en-IN')}</p>
                </div>
                <input 
                  type="range" min={1000} max={100000} step={1000} value={sipAmount}
                  onChange={(e) => setSipAmount(Number(e.target.value))}
                  className="w-full accent-blue-600 bg-slate-200 rounded-lg h-2 cursor-pointer"
                />
                <div className="pt-2 border-t border-slate-100 flex justify-between text-xs font-semibold">
                  <span className="text-slate-500">Est. 10Y Return:</span>
                  <span className="text-emerald-600">+₹{(estimatedGains / 100000).toFixed(2)} Lakhs</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Card 2: Self-Directed */}
          <motion.div whileHover={{ y: -6 }} transition={{ duration: 0.2 }} className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden flex flex-col justify-between">
            <div className="p-8 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-3 py-1 rounded-full">High Alpha</span>
              <h3 className="text-2xl font-serif font-bold text-slate-900">Self-Directed Investing</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Select and manage direct equity baskets and mutual funds along with institutional tax insights you won't get anywhere else.
              </p>
              <a href={onboardingUrl} target="_blank" rel="noopener noreferrer" className="inline-block text-blue-600 font-bold text-sm hover:underline">Get started &rarr;</a>
            </div>
            <div className="bg-gradient-to-b from-slate-50 to-purple-900/10 p-6 border-t border-slate-100 space-y-3">
              <div className="bg-white rounded-2xl p-4 shadow-md border border-slate-200 space-y-3">
                <div className="text-xs font-bold text-slate-700">Selected Tickers & Asset Baskets</div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-2 text-center text-xs font-bold text-slate-800 shadow-sm">NIFTY 50</div>
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-2 text-center text-xs font-bold text-slate-800 shadow-sm">RELIANCE</div>
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-2 text-center text-xs font-bold text-slate-800 shadow-sm">TCS</div>
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-2 text-center text-xs font-bold text-slate-800 shadow-sm">HDFC</div>
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-2 text-center text-xs font-bold text-slate-800 shadow-sm">INFY</div>
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-2 text-center text-xs font-bold text-blue-700 shadow-sm">+ Custom</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Card 3: Custom Portfolios & LAMF */}
          <motion.div whileHover={{ y: -6 }} transition={{ duration: 0.2 }} className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden flex flex-col justify-between">
            <div className="p-8 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">Instant Liquidity</span>
              <h3 className="text-2xl font-serif font-bold text-slate-900">Custom Portfolios & LAMF</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Design custom equity/debt allocations and unlock instant bank overdraft credit lines while units remain fully invested.
              </p>
              <a href={onboardingUrl} target="_blank" rel="noopener noreferrer" className="inline-block text-blue-600 font-bold text-sm hover:underline">Get started &rarr;</a>
            </div>
            <div className="bg-gradient-to-b from-slate-50 to-emerald-900/10 p-6 border-t border-slate-100 space-y-3">
              <div className="bg-white rounded-2xl p-4 shadow-md border border-slate-200 space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 font-medium">Pledged Portfolio</span>
                  <span className="font-bold text-slate-900">₹{(portfolioValue / 100000).toFixed(1)} Lakhs</span>
                </div>
                <input 
                  type="range" min={500000} max={10000000} step={500000} value={portfolioValue}
                  onChange={(e) => setPortfolioValue(Number(e.target.value))}
                  className="w-full accent-emerald-600 bg-slate-200 rounded-lg h-2 cursor-pointer"
                />
                <div className="pt-2 border-t border-slate-100 flex justify-between text-xs font-bold">
                  <span className="text-slate-500">Overdraft Limit (80% LTV):</span>
                  <span className="text-emerald-700">₹{approvedLimit.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </motion.div>

        </div>

      </section>


      {/* ================= CONSULTATION HUB ================= */}
      <section className="bg-blue-600 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold">Need Customized Portfolio Allocation?</h2>
          <p className="text-blue-100 text-base max-w-2xl mx-auto">
            Book a 1-to-1 consultation session with our certified financial planners. Get your portfolio audited and optimized.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <a
              href={`https://wa.me/${phoneWhatsAppNumber.replace('+', '')}?text=Hello,%20I%20would%20like%20to%20schedule%20a%20wealth%20consultation.`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-bold text-base shadow-lg transition-all"
            >
              Chat on WhatsApp ({phoneWhatsAppNumber})
            </a>
            <a
              href={`tel:${phoneWhatsAppNumber}`}
              className="px-8 py-4 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-base border border-blue-400/30 transition-all"
            >
              Direct Call ({phoneWhatsAppNumber})
            </a>
          </div>
        </div>
      </section>


      {/* ================= REGULATORY COMPLIANCE FOOTER ================= */}
      <footer className="bg-white border-t border-slate-200 text-slate-600 py-12 px-4 sm:px-6 lg:px-8 text-xs">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-8 border-b border-slate-200">
          
          <div className="space-y-3">
            <p className="font-bold text-slate-900 text-sm uppercase tracking-wider">Brewrich Wealth</p>
            <p className="text-slate-500">Helping individuals build long-term wealth using structured, disciplined, and AI-driven intelligent financial planning.</p>
            <p className="text-slate-600 font-medium">Brewrich 2151/1A, Sri Rajarajeshwari Nagar, plot no 21, Periyakulam - Theni Rd, Lakshmipuram, Thamarai Kulam, Tamil Nadu 625523</p>
          </div>

          <div className="space-y-2">
            <p className="font-bold text-slate-900 text-sm uppercase tracking-wider">Regulatory Credentials</p>
            <p><strong className="text-slate-800">AMFI Registered MFD:</strong> ARN-335693</p>
            <p><strong className="text-slate-800">EUIN:</strong> E637441</p>
            <p><strong className="text-slate-800">IRDAI Licensed Advisor:</strong> URN: CAI0405260445 (Composite)</p>
          </div>

          <div className="space-y-2">
            <p className="font-bold text-slate-900 text-sm uppercase tracking-wider">Accreditations & Quality</p>
            <p><strong className="text-slate-800">ISO 9001:2015 Certified:</strong> UDYAM-TN-23-0001645</p>
            <p><strong className="text-slate-800">Certifications:</strong> CFP | NISM Series V-A | NISM Series VII Certified</p>
          </div>

          <div className="space-y-2">
            <p className="font-bold text-slate-900 text-sm uppercase tracking-wider">Client Onboarding</p>
            <p className="text-slate-500">Direct secure digital account opening powered by authorized institutional infrastructure.</p>
            <a href={onboardingUrl} target="_blank" rel="noopener noreferrer" className="inline-block text-blue-600 hover:underline font-bold pt-1">
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
