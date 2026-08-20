'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function MfdPage() {
  // Interactive State for SIP Calculator
  const [sipAmount, setSipAmount] = useState<number>(10000);
  const sipYears = 10;
  const expectedReturn = 0.14; // 14% p.a. historical equity expectation
  
  const monthlyRate = expectedReturn / 12;
  const totalMonths = sipYears * 12;
  const investedAmount = sipAmount * totalMonths;
  const futureValue = sipAmount * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) * (1 + monthlyRate);
  const estimatedGains = futureValue - investedAmount;

  // Interactive State for Loan Against Mutual Funds (LAMF)
  const [portfolioValue, setPortfolioValue] = useState<number>(2500000);
  const approvedLimit = portfolioValue * 0.80; // 80% LTV

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
                <p className="text-xs text-blue-200">By High-Net-Worth Clients</p>
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


      {/* ================= BETTERMENT-STYLE 3-COLUMN PRODUCT GRID ================= */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
        
        <div className="text-center space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-widest text-blue-600">Invest The Way You Want</h2>
          <p className="text-3xl sm:text-5xl font-serif text-slate-900">Engineered for Maximum Yield</p>
          <p className="text-slate-600 max-w-xl mx-auto text-base">
            Select your strategy and let institutional automation handle the rebalancing, tax-loss harvesting, and compounding.
          </p>
        </div>

        {/* 3-Column Card Grid with White Top & Royal Blue Interactive Bottom */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Card 1: SIP & Mutual Funds */}
          <motion.div 
            whileHover={{ y: -6 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-3xl border border-slate-200/80 shadow-xl overflow-hidden flex flex-col justify-between"
          >
            <div className="p-8 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">
                01
              </div>
              <h3 className="text-2xl font-serif font-bold text-slate-900">SIP & Mutual Funds</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Build long-term wealth with automated monthly disciplined allocations and smart tax harvesting.
              </p>
            </div>

            {/* Interactive Blue Bottom Module */}
            <div className="bg-blue-600 p-6 text-white space-y-4">
              <div className="flex justify-between items-center text-xs text-blue-100">
                <span>Monthly Allocation:</span>
                <span className="font-bold text-white bg-blue-700 px-2.5 py-1 rounded-lg">₹{sipAmount.toLocaleString('en-IN')}/mo</span>
              </div>
              <input 
                type="range" 
                min={1000} 
                max={100000} 
                step={1000}
                value={sipAmount}
                onChange={(e) => setSipAmount(Number(e.target.value))}
                className="w-full accent-yellow-400 bg-blue-700 rounded-lg h-2 cursor-pointer"
              />
              <div className="pt-2 border-t border-blue-500/60 flex justify-between items-center text-xs">
                <span className="text-blue-100">Est. 10Y Growth:</span>
                <span className="font-bold text-yellow-300">+₹{(estimatedGains / 100000).toFixed(2)} Lakhs</span>
              </div>
              <a 
                href={onboardingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center w-full py-3.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-bold text-sm shadow-lg transition-all"
              >
                Start SIP Portfolio &rarr;
              </a>
            </div>
          </motion.div>

          {/* Card 2: Loan Against Mutual Funds (LAMF) */}
          <motion.div 
            whileHover={{ y: -6 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-3xl border border-slate-200/80 shadow-xl overflow-hidden flex flex-col justify-between"
          >
            <div className="p-8 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 font-bold text-lg">
                02
              </div>
              <h3 className="text-2xl font-serif font-bold text-slate-900">Loan Against Mutual Funds</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Unlock instant bank overdraft liquidity without breaking your compounding or triggering capital gains tax.
              </p>
            </div>

            {/* Interactive Blue/Purple Bottom Module */}
            <div className="bg-slate-900 p-6 text-white space-y-4">
              <div className="flex justify-between items-center text-xs text-slate-400">
                <span>Pledged Portfolio:</span>
                <span className="font-bold text-white bg-slate-800 px-2.5 py-1 rounded-lg">₹{(portfolioValue / 100000).toFixed(1)} Lakhs</span>
              </div>
              <input 
                type="range" 
                min={500000} 
                max={10000000} 
                step={500000}
                value={portfolioValue}
                onChange={(e) => setPortfolioValue(Number(e.target.value))}
                className="w-full accent-blue-500 bg-slate-800 rounded-lg h-2 cursor-pointer"
              />
              <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-xs">
                <span className="text-slate-400">Overdraft Limit (80% LTV):</span>
                <span className="font-bold text-emerald-400">₹{approvedLimit.toLocaleString('en-IN')}</span>
              </div>
              <a 
                href={onboardingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg transition-all"
              >
                Access Credit Line &rarr;
              </a>
            </div>
          </motion.div>

          {/* Card 3: Term & Health Insurance Protection */}
          <motion.div 
            whileHover={{ y: -6 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-3xl border border-slate-200/80 shadow-xl overflow-hidden flex flex-col justify-between"
          >
            <div className="p-8 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-lg">
                03
              </div>
              <h3 className="text-2xl font-serif font-bold text-slate-900">Term & Health Protection</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Multi-crore life cover and cashless health networks across 10,000+ top hospitals for family security.
              </p>
            </div>

            {/* Digital Policy Card Visual Bottom Module */}
            <div className="bg-emerald-950 p-6 text-white space-y-4">
              <div className="flex justify-between items-center text-xs text-emerald-300">
                <span className="font-bold uppercase tracking-wider">Verified Active Cover</span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <div className="bg-emerald-900/60 border border-emerald-500/30 rounded-2xl p-3.5">
                <p className="text-xs text-emerald-200">Composite Life Protection</p>
                <p className="text-xl font-black text-white">₹10 Crore+ Life Cover</p>
              </div>
              <a 
                href={onboardingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-lg transition-all"
              >
                Explore Protection Plans &rarr;
              </a>
            </div>
          </motion.div>

        </div>

        {/* Secondary Row: SWP/STP & NPS/FD */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-lg flex flex-col justify-between">
            <div className="space-y-4">
              <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wide">Cashflow Management</span>
              <h3 className="text-3xl font-serif font-bold text-slate-900">SWP & STP Automation</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Systematic Withdrawal Plans (SWP) for tax-efficient retirement income and Systematic Transfer Plans (STP) to dollar-cost average safely into equities.
              </p>
              <ul className="space-y-2 text-sm font-medium text-slate-700 pt-2">
                <li className="flex items-center gap-2">✓ Automated monthly payouts directly to your bank account</li>
                <li className="flex items-center gap-2">✓ Zero capital gains tax on principal drawdown components</li>
              </ul>
            </div>
            <div className="pt-8">
              <a href={onboardingUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-bold text-sm">
                Configure Cashflows &rarr;
              </a>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-lg flex flex-col justify-between">
            <div className="space-y-4">
              <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-bold uppercase tracking-wide">Retirement & Tax Shield</span>
              <h3 className="text-3xl font-serif font-bold text-slate-900">NPS & High-Yield FDs</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                National Pension System (NPS) allocations for additional tax deductions under Sec 80CCD(1B), combined with elite corporate fixed deposits.
              </p>
              <ul className="space-y-2 text-sm font-medium text-slate-700 pt-2">
                <li className="flex items-center gap-2">✓ Extra tax savings under Section 80CCD</li>
                <li className="flex items-center gap-2">✓ Curated high-yield corporate FD instruments</li>
              </ul>
            </div>
            <div className="pt-8">
              <a href={onboardingUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-bold text-sm">
                Secure Retirement &rarr;
              </a>
            </div>
          </div>

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
