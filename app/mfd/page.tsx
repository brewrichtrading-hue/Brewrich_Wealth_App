'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function MfdPage() {
  // Interactive State for SIP Calculator
  const [sipAmount, setSipAmount] = useState<number>(10000);
  const sipYears = 10;
  const expectedReturn = 0.14; // 14% p.a. historical equity expectation
  
  // Compound Interest Calculation for SIP
  const monthlyRate = expectedReturn / 12;
  const totalMonths = sipYears * 12;
  const investedAmount = sipAmount * totalMonths;
  const futureValue = sipAmount * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) * (1 + monthlyRate);
  const estimatedGains = futureValue - investedAmount;

  // Interactive State for Loan Against Mutual Funds (LAMF)
  const [portfolioValue, setPortfolioValue] = useState<number>(2500000);
  const approvedLimit = portfolioValue * 0.80; // 80% LTV on equity mutual funds

  const onboardingUrl = "https://mweb.assetplus.in/client_onboarding/?advisor=688b3679af6048595923afd2";
  const phoneWhatsAppNumber = "+919042747590";

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-600 selection:text-white">
      
      {/* ================= HERO SECTION (Royal Blue Brand Background) ================= */}
      <section className="relative bg-blue-600 text-white overflow-hidden pt-20 pb-28 px-4 sm:px-6 lg:px-8">
        {/* Subtle radial gradient overlay for premium depth */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-500/40 via-transparent to-blue-900/60 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          
          {/* Hero Left Content */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/30 border border-blue-400/40 text-xs font-semibold tracking-wide uppercase backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Brewrich Institutional Wealth & Protection Platform
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight">
              Build wealth with confidence and ease.
            </h1>

            <p className="text-lg sm:text-xl text-blue-100 font-normal max-w-2xl leading-relaxed">
              Institutional-grade mutual fund advisory, automated tax-loss harvesting, instant liquidity credit lines, and multi-crore protection designed for modern investors.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href={onboardingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-bold text-base shadow-xl hover:shadow-yellow-400/20 transition-all duration-300 transform hover:-translate-y-0.5"
              >
                Get Started Now &rarr;
              </a>
              <a
                href={`https://wa.me/${phoneWhatsAppNumber.replace('+', '')}?text=Hi,%20I%20would%20like%20to%20schedule%20a%201-to-1%20wealth%20consultation.`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-4 rounded-xl bg-blue-700/80 hover:bg-blue-700 text-white font-semibold text-base border border-blue-400/30 backdrop-blur-md transition-all duration-300"
              >
                Talk to Advisor (WhatsApp)
              </a>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-blue-500/40 text-blue-100 text-sm">
              <div>
                <p className="font-bold text-white text-lg">₹500 / mo</p>
                <p className="text-xs text-blue-200">Minimum SIP Entry</p>
              </div>
              <div>
                <p className="font-bold text-white text-lg">₹1.25L</p>
                <p className="text-xs text-blue-200">LTCG Tax Free Cap</p>
              </div>
              <div>
                <p className="font-bold text-white text-lg">100% Digital</p>
                <p className="text-xs text-blue-200">Paperless Execution</p>
              </div>
            </div>
          </motion.div>

          {/* Hero Right Device Mockup (Betterment-Style Smartphone Frame) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-5 flex justify-center"
          >
            <div className="relative w-full max-w-sm bg-slate-900 rounded-[2.5rem] p-4 border-4 border-slate-700/60 shadow-2xl shadow-black/80">
              {/* Notch */}
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-28 h-5 bg-slate-950 rounded-full z-20 flex items-center justify-center">
                <div className="w-12 h-1.5 bg-slate-800 rounded-full" />
              </div>

              {/* Screen Content */}
              <div className="bg-slate-950 rounded-2xl p-4 pt-8 space-y-4 border border-slate-800 text-left">
                <div className="flex justify-between items-center text-xs text-slate-400">
                  <span>Automated Portfolio</span>
                  <span className="text-emerald-400 font-semibold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/50">Active XIRR 16.4%</span>
                </div>

                <div>
                  <p className="text-xs text-slate-400">Total Portfolio Value</p>
                  <p className="text-2xl font-bold text-white">₹48,93,420.10</p>
                  <p className="text-xs text-emerald-400 font-medium mt-0.5">+₹4,22,150.80 (All time)</p>
                </div>

                {/* Progress Card */}
                <div className="bg-blue-950/40 border border-blue-800/40 rounded-xl p-3 space-y-2">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-blue-200">Retirement Milestone</span>
                    <span className="text-blue-400">88% on track</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-blue-500 h-full rounded-full w-[88%]" />
                  </div>
                </div>

                {/* Mini Chart Mockup */}
                <div className="pt-2">
                  <div className="text-xs text-slate-400 mb-2">Compounding Trajectory (10Y)</div>
                  <div className="h-24 w-full flex items-end gap-1.5 pt-2 border-b border-l border-slate-800 px-1">
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


      {/* ================= MODULAR PRODUCT SUITES (Dark Slate Blocks) ================= */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
        
        <div className="text-center space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-widest text-blue-500">Precision Architecture</h2>
          <p className="text-3xl sm:text-4xl font-bold text-white">Institutional Product Suites</p>
          <p className="text-slate-400 max-w-xl mx-auto text-sm sm:text-base">
            Engineered for disciplined wealth accumulation, immediate liquidity, and robust family security.
          </p>
        </div>

        {/* 3-Column Betterment-Style Modular Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Card 1: SIP & Mutual Funds */}
          <motion.div 
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between shadow-xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full blur-2xl pointer-events-none" />
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold">
                01
              </div>
              <h3 className="text-xl font-bold text-white">SIP & Mutual Funds</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Automated monthly compounding with smart portfolio rebalancing and tax optimization.
              </p>

              {/* Interactive SIP Slider Widget */}
              <div className="bg-slate-950/80 rounded-xl p-4 border border-slate-800/80 space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Monthly Allocation:</span>
                  <span className="font-bold text-blue-400">₹{sipAmount.toLocaleString('en-IN')}/mo</span>
                </div>
                <input 
                  type="range" 
                  min={1000} 
                  max={100000} 
                  step={1000}
                  value={sipAmount}
                  onChange={(e) => setSipAmount(Number(e.target.value))}
                  className="w-full accent-blue-500 bg-slate-800 rounded-lg h-2 cursor-pointer"
                />
                <div className="pt-2 border-t border-slate-800/60 flex justify-between items-center text-xs">
                  <span className="text-slate-400">Est. Wealth Gained (10Y):</span>
                  <span className="font-bold text-emerald-400">+₹{(estimatedGains / 100000).toFixed(2)} Lakhs</span>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <a 
                href={onboardingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all shadow-lg shadow-blue-600/20"
              >
                Start SIP Portfolio &rarr;
              </a>
            </div>
          </motion.div>

          {/* Card 2: Loan Against Mutual Funds (LAMF) */}
          <motion.div 
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between shadow-xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/10 rounded-full blur-2xl pointer-events-none" />
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400 font-bold">
                02
              </div>
              <h3 className="text-xl font-bold text-white">Loan Against Mutual Funds</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Unlock instant bank overdraft limits while your underlying units remain 100% invested and compounding.
              </p>

              {/* Interactive LAMF Widget */}
              <div className="bg-slate-950/80 rounded-xl p-4 border border-slate-800/80 space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Pledged Portfolio:</span>
                  <span className="font-bold text-purple-400">₹{(portfolioValue / 100000).toFixed(1)} Lakhs</span>
                </div>
                <input 
                  type="range" 
                  min={500000} 
                  max={10000000} 
                  step={500000}
                  value={portfolioValue}
                  onChange={(e) => setPortfolioValue(Number(e.target.value))}
                  className="w-full accent-purple-500 bg-slate-800 rounded-lg h-2 cursor-pointer"
                />
                <div className="pt-2 border-t border-slate-800/60 flex justify-between items-center text-xs">
                  <span className="text-slate-400">Approved Overdraft Limit (80% LTV):</span>
                  <span className="font-bold text-emerald-400">₹{approvedLimit.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <a 
                href={onboardingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm transition-all border border-slate-700"
              >
                Access Credit Line &rarr;
              </a>
            </div>
          </motion.div>

          {/* Card 3: Term & Health Insurance Protection */}
          <motion.div 
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between shadow-xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-600/10 rounded-full blur-2xl pointer-events-none" />
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold">
                03
              </div>
              <h3 className="text-xl font-bold text-white">Term & Health Protection</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Multi-crore life cover and comprehensive cashless health networks designed for complete family security.
              </p>

              {/* Digital Policy Card Mockup */}
              <div className="bg-gradient-to-br from-slate-950 to-emerald-950/40 rounded-xl p-4 border border-emerald-500/20 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Composite Cover</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                </div>
                <div className="text-lg font-bold text-white">₹10 Crore+ Life Cover</div>
                <p className="text-xs text-slate-400">Cashless hospital network across 10,000+ elite medical centers pan-India.</p>
              </div>
            </div>

            <div className="pt-6">
              <a 
                href={onboardingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm transition-all border border-slate-700"
              >
                Explore Protection Plans &rarr;
              </a>
            </div>
          </motion.div>

        </div>

        {/* Secondary Grid Row: SWP, STP, Fixed Deposits & NPS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* SWP / STP Module */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="inline-block px-3 py-1 rounded bg-blue-500/20 text-blue-400 text-xs font-bold uppercase">Cashflow Management</div>
              <h3 className="text-2xl font-bold text-white">SWP & STP Automation</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Systematic Withdrawal Plans (SWP) for tax-efficient retirement cashflows and Systematic Transfer Plans (STP) to dollar-cost average lumpsum capital safely into equities.
              </p>
              <ul className="space-y-2 text-sm text-slate-300 pt-2">
                <li className="flex items-center gap-2">✓ Automated monthly payouts directly to your bank account</li>
                <li className="flex items-center gap-2">✓ Zero capital gains tax on principal drawdown components</li>
                <li className="flex items-center gap-2">✓ Dynamic asset rebalancing between debt and equity</li>
              </ul>
            </div>
            <div className="pt-8">
              <a 
                href={onboardingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 font-bold text-sm"
              >
                Configure Cashflows &rarr;
              </a>
            </div>
          </div>

          {/* NPS & Fixed Deposits Module */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="inline-block px-3 py-1 rounded bg-purple-500/20 text-purple-400 text-xs font-bold uppercase">Retirement & Safety</div>
              <h3 className="text-2xl font-bold text-white">NPS & Fixed Deposits</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                National Pension System (NPS) tier-1 & tier-2 allocations for additional ₹50,000 tax deductions under Sec 80CCD(1B), combined with high-yield corporate fixed deposits.
              </p>
              <ul className="space-y-2 text-sm text-slate-300 pt-2">
                <li className="flex items-center gap-2">✓ Extra tax savings under Section 80CCD</li>
                <li className="flex items-center gap-2">✓ Curated high-yield corporate FD instruments</li>
                <li className="flex items-center gap-2">✓ Low-cost pension fund management options</li>
              </ul>
            </div>
            <div className="pt-8">
              <a 
                href={onboardingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 font-bold text-sm"
              >
                Secure Retirement &rarr;
              </a>
            </div>
          </div>

        </div>

      </section>


      {/* ================= CONSULTATION HUB SECTION ================= */}
      <section className="bg-blue-900/20 border-y border-blue-800/30 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Need Customized Portfolio Allocation?</h2>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto">
            Book a 1-to-1 consultation session with our certified financial planners. Get your portfolio audited and optimized for maximum alpha and risk mitigation.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <a
              href={`https://wa.me/${phoneWhatsAppNumber.replace('+', '')}?text=Hello,%20I%20would%20like%20to%20schedule%20a%20wealth%20consultation.`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-base shadow-lg transition-all"
            >
              Chat on WhatsApp ({phoneWhatsAppNumber})
            </a>
            <a
              href={`tel:${phoneWhatsAppNumber}`}
              className="px-8 py-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-base border border-slate-700 transition-all"
            >
              Direct Call ({phoneWhatsAppNumber})
            </a>
          </div>
        </div>
      </section>


      {/* ================= MANDATORY REGULATORY COMPLIANCE FOOTER ================= */}
      <footer className="bg-slate-950 border-t border-slate-900 text-slate-400 py-12 px-4 sm:px-6 lg:px-8 text-xs">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-8 border-b border-slate-900">
          
          <div className="space-y-3">
            <p className="font-bold text-white text-sm uppercase tracking-wider">Brewrich Wealth</p>
            <p>Helping individuals build long-term wealth using structured, disciplined, and AI-driven intelligent financial planning.</p>
            <p className="text-slate-500">Based in Theni, Tamil Nadu.</p>
          </div>

          <div className="space-y-2">
            <p className="font-bold text-white text-sm uppercase tracking-wider">Regulatory Credentials</p>
            <p><strong className="text-slate-300">AMFI Registered MFD:</strong> ARN-335693</p>
            <p><strong className="text-slate-300">EUIN:</strong> E637441</p>
            <p><strong className="text-slate-300">IRDAI Licensed Advisor:</strong> URN: CAI0405260445 (Composite)</p>
          </div>

          <div className="space-y-2">
            <p className="font-bold text-white text-sm uppercase tracking-wider">Accreditations & Quality</p>
            <p><strong className="text-slate-300">ISO 9001:2015 Certified:</strong> UDYAM-TN-23-0001645</p>
            <p><strong className="text-slate-300">Certifications:</strong> CFP | NISM Series V-A | NISM Series VII Certified</p>
          </div>

          <div className="space-y-2">
            <p className="font-bold text-white text-sm uppercase tracking-wider">Client Onboarding</p>
            <p className="text-slate-400">Direct secure digital account opening powered by authorized institutional infrastructure.</p>
            <a 
              href={onboardingUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block text-blue-400 hover:underline font-semibold pt-1"
            >
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
