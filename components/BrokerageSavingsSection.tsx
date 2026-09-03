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
    <section className="relative py-20 px-6 bg-storm-50/50 text-storm border-t border-slate-200 overflow-hidden font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* STEP 1 & 2: INTRODUCTION & SIMPLE COMPARISON */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-bumblebee/20 border border-bumblebee/40 text-storm text-caption font-bold uppercase tracking-wider mb-4">
            <span>⚡ Transparent Pricing Advantage</span>
          </div>
          <h2 className="text-display font-extrabold tracking-tight mb-4 text-storm">
            ₹0 Brokerage on Equity Delivery
          </h2>
          <p className="text-slate-600 text-body mb-8 leading-relaxed">
            Keep more of what you earn. Pay ₹0 brokerage on Equity Delivery with Brewrich MIIP. See how much brokerage adds up when delivery trading activity is charged at a hypothetical 0.5%.
          </p>

          {/* Clean Two-Side Quick Comparison */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
            <div className="p-6 rounded-3xl bg-[#FEFEFE] border-2 border-storm/20 text-center shadow-brand">
              <span className="text-caption font-bold text-storm uppercase tracking-widest block mb-1">Brewrich MIIP</span>
              <div className="text-4xl font-black text-storm mb-1">₹0</div>
              <span className="text-caption text-slate-500 font-medium">Brokerage on Equity Delivery</span>
            </div>
            <div className="p-6 rounded-3xl bg-[#FEFEFE] border border-joyous/20 text-center shadow-brand">
              <span className="text-caption font-bold text-joyous uppercase tracking-widest block mb-1">Other Broker</span>
              <div className="text-4xl font-black text-slate-700 mb-1">0.5%</div>
              <span className="text-caption text-slate-500 font-medium">Per side (Buy & Sell)</span>
            </div>
          </div>
        </div>

        {/* STEP 3 & 4: INTERACTIVE CALCULATOR & LIVE CONTROLS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
          
          {/* Calculator Controls (Left Column - Surface Card) */}
          <div className="lg:col-span-7 p-8 rounded-3xl bg-[#FEFEFE] border border-slate-200 shadow-brand">
            <div className="flex justify-between items-center mb-4">
              <label htmlFor="daily-volume-slider" className="text-sm font-bold text-storm uppercase tracking-wider">
                Daily Delivery Trading Volume
              </label>
              <span className="text-2xl font-black text-storm bg-bumblebee/20 px-4 py-1.5 rounded-2xl border border-bumblebee/40">
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
                className="w-full h-2.5 bg-storm-100 rounded-lg appearance-none cursor-pointer accent-storm"
                aria-label="Daily Delivery Trading Volume"
              />
              <div className="flex justify-between text-caption text-slate-500 mt-2 font-medium">
                <span>₹1 Lakh</span>
                <span>₹25 Lakh</span>
                <span>₹50 Lakh</span>
                <span>₹1 Crore</span>
              </div>
            </div>

            {/* Quick Preset Buttons */}
            <div className="mb-8">
              <span className="text-caption text-slate-500 block mb-3 font-semibold uppercase tracking-wider">Select volume preset:</span>
              <div className="flex flex-wrap gap-2">
                {[100000, 500000, 1000000, 2500000, 5000000, 10000000].map((val) => (
                  <button
                    key={val}
                    onClick={() => setDailyVolume(val)}
                    className={`px-3.5 py-2 rounded-xl text-caption font-bold transition-all ${
                      dailyVolume === val 
                        ? 'bg-storm text-surface shadow-md' 
                        : 'bg-slate-100 text-slate-700 hover:bg-storm-50 hover:text-storm'
                    }`}
                  >
                    {val >= 10000000 ? '₹1 Cr' : val >= 100000 ? `₹${val / 100000} Lakh` : formatINR(val)}
                  </button>
                ))}
              </div>
            </div>

            {/* Micro Breakdown List */}
            <div className="space-y-3 border-t border-slate-100 pt-6 text-caption text-slate-600">
              <div className="flex justify-between">
                <span>Trading Days Calculated:</span>
                <span className="font-bold text-storm">{tradingDays} Trading Days / Year</span>
              </div>
              <div className="flex justify-between">
                <span>Other Broker Buy Rate (0.5%):</span>
                <span className="font-bold text-joyous">{formatINR(dailyBuyBrokerage)} / day</span>
              </div>
              <div className="flex justify-between">
                <span>Other Broker Sell Rate (0.5%):</span>
                <span className="font-bold text-joyous">{formatINR(dailySellBrokerage)} / day</span>
              </div>
            </div>
          </div>

          {/* STEP 5: LIVE RESULT CARD (Right Column - Deep Storm / Gold Card) */}
          <div className="lg:col-span-5 p-8 rounded-3xl bg-storm text-surface border border-storm-800 shadow-2xl flex flex-col justify-between">
            <div>
              <span className="text-caption font-extrabold text-bumblebee uppercase tracking-widest block mb-1">
                Your Potential Annual Saving
              </span>
              <div className="text-4xl md:text-5xl font-black text-bumblebee mb-6">
                {formatINR(annualSavings)}
              </div>

              {/* Comparison Table */}
              <div className="space-y-3 mb-8 text-sm">
                <div className="flex justify-between pb-2 border-b border-storm-700 text-caption text-slate-300 uppercase font-bold">
                  <span>Metric</span>
                  <span className="text-slate-300">Other Broker</span>
                  <span className="text-bumblebee">Brewrich MIIP</span>
                </div>
                <div className="flex justify-between text-slate-200">
                  <span>Buy Brokerage / Yr</span>
                  <span className="text-slate-400">{formatINR(annualBuyBrokerage)}</span>
                  <span className="font-bold text-bumblebee">₹0</span>
                </div>
                <div className="flex justify-between text-slate-200">
                  <span>Sell Brokerage / Yr</span>
                  <span className="text-slate-400">{formatINR(annualSellBrokerage)}</span>
                  <span className="font-bold text-bumblebee">₹0</span>
                </div>
                <div className="flex justify-between text-surface font-bold pt-2 border-t border-storm-700">
                  <span>Total Brokerage / Yr</span>
                  <span className="text-joyous-300">{formatINR(annualTotalBrokerage)}</span>
                  <span className="text-bumblebee">₹0</span>
                </div>
              </div>
            </div>

            <div className="text-[11px] text-slate-400 italic leading-relaxed border-t border-storm-700 pt-4">
              *Illustrative comparison using a hypothetical 0.5% delivery brokerage charge across 252 trading days. Actual charges may vary based on applicable terms.
            </div>
          </div>

        </div>

        {/* STEP 6 & 7 & 8: THE HARD TRUTH & EDUCATIONAL REALIZATION */}
        <div className="max-w-4xl mx-auto p-8 rounded-3xl bg-[#FEFEFE] border border-slate-200 shadow-brand mb-16">
          <h3 className="text-h3 font-bold text-storm mb-3">
            The Hard Truth About Brokerage
          </h3>
          <p className="text-slate-600 text-body leading-relaxed mb-6">
            Brokerage may look small on a single transaction. But repeated every trading day, the cost can become significant. 
            For example, at <strong className="text-storm">₹1,00,000 daily delivery trading volume</strong> over 252 trading days with 0.5% on buy and 0.5% on sell, the cost totals <strong className="text-joyous font-bold">₹2,52,000 in annual brokerage</strong> (₹1,26,000 on the buy side + ₹1,26,000 on the sell side). With Brewrich MIIP, that brokerage cost is <strong className="text-storm font-bold">₹0</strong>.
          </p>
          <div className="p-4 rounded-2xl bg-bumblebee/15 border border-bumblebee/30 text-storm text-body font-medium">
            💡 <strong className="text-storm">The percentage looks small. The annual number tells the real story.</strong> A 0.5% charge appears insignificant on one trade, but when applied repeatedly across 252 trading days, the cumulative cost becomes substantial.
          </div>
        </div>

        {/* STEP 9: FINAL SUBTLE EDUCATIONAL CTA */}
        <div className="text-center max-w-2xl mx-auto">
          <h4 className="text-h3 font-bold text-storm mb-2">Trade smarter. Keep more of your capital.</h4>
          <p className="text-slate-600 text-body mb-6">
            Explore Brewrich MIIP and understand how optimizing your trading costs can support your long-term results.
          </p>
          <a
            href="#pricing"
            className="btn-interactive inline-flex items-center justify-center px-8 py-4 rounded-2xl bg-storm hover:bg-storm-800 text-surface font-bold text-body transition-all shadow-xl shadow-storm/20"
          >
            Explore MIIP & Enroll Today →
          </a>
        </div>

      </div>
    </section>
  );
}
