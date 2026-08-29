'use client';

import React, { useState } from 'react';

export default function BrokerageSavingsSection() {
  // Slider state representing Daily Equity Delivery Trading Volume (ranges from ₹1,00,000 to ₹1,00,00,000)
  // Default set to ₹1,00,000 as requested by the key example
  const [dailyVolume, setDailyVolume] = useState<number>(100000);

  // Formatting helper for Indian Numbering System (e.g., ₹1,26,000)
  const formatINR = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Calculations based on prompt formula:
  // 252 trading days per year
  // Other broker charges 0.5% on BUY and 0.5% on SELL
  const tradingDays = 252;
  const buyRate = 0.005;
  const sellRate = 0.005;

  const dailyBuyBrokerage = dailyVolume * buyRate;
  const dailySellBrokerage = dailyVolume * sellRate;
  
  const annualBuyBrokerage = dailyBuyBrokerage * tradingDays;
  const annualSellBrokerage = dailySellBrokerage * tradingDays;
  const annualTotalBrokerage = annualBuyBrokerage + annualSellBrokerage;
  
  const brewrichBrokerage = 0;
  const annualSavings = annualTotalBrokerage - brewrichBrokerage;

  return (
    <section className="relative py-20 px-6 bg-slate-950 text-white border-t border-slate-900 overflow-hidden font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* STEP 1 & 2: INTRODUCTION & SIMPLE COMPARISON */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold uppercase tracking-wider mb-4">
            <span>⚡ Transparent Pricing Advantage</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">
            ₹0 Brokerage on Equity Delivery
          </h2>
          <p className="text-slate-400 text-base md:text-lg mb-8">
            Keep more of what you earn. Pay ₹0 brokerage on Equity Delivery with Brewrich MIIP. See how much brokerage adds up when delivery trading activity is charged at a hypothetical 0.5%.
          </p>

          {/* Clean Two-Side Quick Comparison */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
            <div className="p-6 rounded-2xl bg-blue-950/40 border border-blue-500/30 text-center shadow-lg">
              <span className="text-xs font-semibold text-blue-400 uppercase tracking-widest block mb-1">Brewrich MIIP</span>
              <div className="text-3xl font-black text-white mb-1">₹0</div>
              <span className="text-xs text-slate-400">Brokerage on Equity Delivery</span>
            </div>
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 text-center shadow-lg">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest block mb-1">Other Broker</span>
              <div className="text-3xl font-black text-slate-300 mb-1">0.5%</div>
              <span className="text-xs text-slate-500">Per side (Buy & Sell)</span>
            </div>
          </div>
        </div>

        {/* STEP 3 & 4: INTERACTIVE CALCULATOR & LIVE CONTROLS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
          
          {/* Calculator Controls (Left Column) */}
          <div className="lg:col-span-7 p-8 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-md shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <label htmlFor="daily-volume-slider" className="text-sm font-bold text-slate-300 uppercase tracking-wider">
                Daily Delivery Trading Volume
              </label>
              <span className="text-2xl font-black text-blue-400 bg-blue-500/10 px-4 py-1.5 rounded-xl border border-blue-500/20">
                {formatINR(dailyVolume)}
              </span>
            </div>

            {/* Slider Input */}
            <div className="mb-8">
              <input 
                id="daily-volume-slider"
                type="range" 
                min={100000} 
                max={10000000} 
                step={100000}
                value={dailyVolume}
                onChange={(e) => setDailyVolume(Number(e.target.value))}
                className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                aria-label="Daily Delivery Trading Volume"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-2 font-medium">
                <span>₹1 Lakh</span>
                <span>₹25 Lakh</span>
                <span>₹50 Lakh</span>
                <span>₹1 Crore</span>
              </div>
            </div>

            {/* Quick Preset Buttons */}
            <div className="mb-8">
              <span className="text-xs text-slate-400 block mb-3 font-medium">Select volume preset:</span>
              <div className="flex flex-wrap gap-2">
                {[100000, 500000, 1000000, 2500000, 5000000, 10000000].map((val) => (
                  <button
                    key={val}
                    onClick={() => setDailyVolume(val)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      dailyVolume === val 
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30' 
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {val >= 10000000 ? '₹1 Cr' : val >= 100000 ? `₹${val / 100000} Lakh` : formatINR(val)}
                  </button>
                ))}
              </div>
            </div>

            {/* Micro Breakdown List */}
            <div className="space-y-3 border-t border-slate-800 pt-6 text-xs text-slate-400">
              <div className="flex justify-between">
                <span>Trading Days Calculated:</span>
                <span className="font-semibold text-slate-200">{tradingDays} Trading Days / Year</span>
              </div>
              <div className="flex justify-between">
                <span>Other Broker Buy Rate (0.5%):</span>
                <span className="font-semibold text-slate-200">{formatINR(dailyBuyBrokerage)} / day</span>
              </div>
              <div className="flex justify-between">
                <span>Other Broker Sell Rate (0.5%):</span>
                <span className="font-semibold text-slate-200">{formatINR(dailySellBrokerage)} / day</span>
              </div>
            </div>
          </div>

          {/* STEP 5: LIVE RESULT CARD (Right Column) */}
          <div className="lg:col-span-5 p-8 rounded-3xl bg-gradient-to-br from-blue-950/80 via-slate-900 to-slate-900 border border-blue-500/30 shadow-2xl flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-blue-400 uppercase tracking-widest block mb-1">
                Your Potential Annual Saving
              </span>
              <div className="text-4xl md:text-5xl font-black text-emerald-400 mb-6">
                {formatINR(annualSavings)}
              </div>

              {/* Comparison Table */}
              <div className="space-y-3 mb-8 text-sm">
                <div className="flex justify-between pb-2 border-b border-slate-800/80 text-xs text-slate-400 uppercase font-semibold">
                  <span>Metric</span>
                  <span>Other Broker</span>
                  <span className="text-blue-400">Brewrich MIIP</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Buy Brokerage / Yr</span>
                  <span className="text-slate-400">{formatINR(annualBuyBrokerage)}</span>
                  <span className="font-bold text-emerald-400">₹0</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Sell Brokerage / Yr</span>
                  <span className="text-slate-400">{formatINR(annualSellBrokerage)}</span>
                  <span className="font-bold text-emerald-400">₹0</span>
                </div>
                <div className="flex justify-between text-slate-200 font-bold pt-2 border-t border-slate-800">
                  <span>Total Brokerage / Yr</span>
                  <span>{formatINR(annualTotalBrokerage)}</span>
                  <span className="text-emerald-400">₹0</span>
                </div>
              </div>
            </div>

            <div className="text-[11px] text-slate-500 italic leading-relaxed border-t border-slate-800/60 pt-4">
              *Illustrative comparison using a hypothetical 0.5% delivery brokerage charge across 252 trading days. Actual charges may vary based on applicable terms.
            </div>
          </div>

        </div>

        {/* STEP 6 & 7 & 8: THE HARD TRUTH & EDUCATIONAL REALIZATION */}
        <div className="max-w-4xl mx-auto p-8 rounded-3xl bg-slate-900/40 border border-slate-800/80 mb-16">
          <h3 className="text-xl md:text-2xl font-bold text-white mb-3">
            The Hard Truth About Brokerage
          </h3>
          <p className="text-slate-300 text-sm md:text-base leading-relaxed mb-6">
            Brokerage may look small on a single transaction. But repeated every trading day, the cost can become significant. 
            For example, at <strong className="text-white">₹1,00,000 daily delivery trading volume</strong> over 252 trading days with 0.5% on buy and 0.5% on sell, the cost totals <strong className="text-emerald-400">₹2,52,000 in annual brokerage</strong> (₹1,26,000 on the buy side + ₹1,26,000 on the sell side). With Brewrich MIIP, that brokerage cost is <strong className="text-blue-400">₹0</strong>.
          </p>
          <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-200 text-sm font-medium">
            💡 <strong className="text-white">The percentage looks small. The annual number tells the real story.</strong> A 0.5% charge appears insignificant on one trade, but when applied repeatedly across 252 trading days, the cumulative cost becomes substantial.
          </div>
        </div>

        {/* STEP 9: FINAL SUBTLE EDUCATIONAL CTA */}
        <div className="text-center max-w-2xl mx-auto">
          <h4 className="text-lg font-bold text-white mb-2">Trade smarter. Keep more of your capital.</h4>
          <p className="text-slate-400 text-xs md:text-sm mb-6">
            Explore Brewrich MIIP and understand how optimizing your trading costs can support your long-term results.
          </p>
          <a
            href="#pricing"
            className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all shadow-lg shadow-blue-600/30"
          >
            Explore MIIP & Enroll Today →
          </a>
        </div>

      </div>
    </section>
  );
}
