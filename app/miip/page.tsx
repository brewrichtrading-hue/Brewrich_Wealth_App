'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import RegisterFlowModal from '@/components/RegisterFlowModal';
import {
  Sparkles,
  ShieldCheck,
  ShieldAlert,
  CheckCircle2,
  Calendar,
  Video,
  Award,
  ArrowRight,
  Download,
  TrendingUp,
  BarChart3,
  PieChart,
  Lock,
  ChevronDown,
  ChevronRight,
  Phone,
  MessageCircle,
  Calculator,
  Percent,
  Zap,
  Users,
  Check,
  FileText,
  Layers,
  Activity,
  HelpCircle,
  ArrowUpRight,
  Clock,
  Target,
  ExternalLink,
} from 'lucide-react';

function MipContent() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [autoTrigger, setAutoTrigger] = useState(false);
  const searchParams = useSearchParams();

  // Interactive CAGR Simulator States
  const [initialCapital, setInitialCapital] = useState<number>(1000000); // Default ₹10,00,000
  const [simulationYears, setSimulationYears] = useState<number>(7); // Default 7 Years
  const cagrRate = 0.25; // 25.0% Historical CAGR
  const niftyRate = 0.12; // 12.0% Benchmark Nifty 50
  const fdRate = 0.07; // 7.0% Fixed Deposit

  // FAQ Accordion State
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  useEffect(() => {
    // If user returned from Google OAuth redirect with ?checkout=auto
    if (searchParams?.get('checkout') === 'auto' || searchParams?.get('register') === 'true') {
      setIsModalOpen(true);
      setAutoTrigger(true);
    }
  }, [searchParams]);

  // Dynamic Compounding Calculations
  const calculations = useMemo(() => {
    const mipFinal = Math.round(initialCapital * Math.pow(1 + cagrRate, simulationYears));
    const niftyFinal = Math.round(initialCapital * Math.pow(1 + niftyRate, simulationYears));
    const fdFinal = Math.round(initialCapital * Math.pow(1 + fdRate, simulationYears));
    const mipGain = mipFinal - initialCapital;
    const niftyGain = niftyFinal - initialCapital;
    const fdGain = fdFinal - initialCapital;
    const alphaVsNifty = mipGain - niftyGain;
    const multiplier = (mipFinal / initialCapital).toFixed(2);

    // Yearly timeline progression
    const yearlyData = [];
    let currentMip = initialCapital;
    for (let yr = 1; yr <= simulationYears; yr++) {
      const startBalance = currentMip;
      const profit = Math.round(startBalance * cagrRate);
      currentMip = startBalance + profit;
      yearlyData.push({
        year: yr,
        startBalance,
        profit,
        endBalance: currentMip,
      });
    }

    return {
      mipFinal,
      niftyFinal,
      fdFinal,
      mipGain,
      niftyGain,
      fdGain,
      alphaVsNifty,
      multiplier,
      yearlyData,
    };
  }, [initialCapital, simulationYears]);

  const scrollToPricing = () => {
    const el = document.getElementById('pricing');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  // 6-Stage Quantitative Pipeline Data
  const stages = [
    {
      step: '01',
      tag: 'RESEARCH',
      title: 'Data-Driven Screening',
      description: 'Identify structural market opportunities grounded in financial data and factor analysis, not media narratives.',
      points: ['Factor & Momentum Scanning', 'Volume Footprint Filters', 'Institutional Accumulation Clues'],
    },
    {
      step: '02',
      tag: 'ANALYSE',
      title: 'Stress-Testing Ideas',
      description: 'Evaluate fundamentals, price structure, momentum, and macroeconomic regime alignment.',
      points: ['Multi-Timeframe Structure', 'Order Book & Liquidity Voids', 'Fundamental Margin of Safety'],
    },
    {
      step: '03',
      tag: 'ALLOCATE',
      title: 'Mathematical Sizing',
      description: 'Size each position according to volatility, covariance, and portfolio risk tolerance rather than emotion.',
      points: ['Volatility Sizing (ATR/Beta)', 'Kelly Criterion Adjustments', 'Sector Covariance Limits'],
    },
    {
      step: '04',
      tag: 'EXECUTE',
      title: 'Pre-Defined Triggers',
      description: 'Enter and exit positions strictly on predetermined systematic signals without hesitation.',
      points: ['Opening Range Breakout (ORB)', 'VWAP Absorption Triggers', 'Zero-Lag Trade Automation'],
    },
    {
      step: '05',
      tag: 'MANAGE RISK',
      title: 'Capital Protection',
      description: 'Enforce stop-loss frameworks, portfolio drawdown caps, and risk-reward constraints on every trade.',
      points: ['Trailing Stop-Loss Protocols', 'Max Portfolio Drawdown Cap', '1:3+ Asymmetric Risk-Reward'],
    },
    {
      step: '06',
      tag: 'REVIEW',
      title: 'System Audit',
      description: 'Continuously audit execution quality, trade logs, and metrics to refine the system objectively.',
      points: ['Trade Journaling & Post-Mortem', 'Expectancy Curve Tracking', '1-on-1 Lead Strategist Review'],
    },
  ];

  // 4-Week Curriculum Roadmap Data
  const curriculum = [
    {
      week: 'Week 01',
      title: 'Think Like an Investor',
      subtitle: 'Fundamentals & Valuation',
      badge: 'Module 01: Core Architecture',
      description: 'Deconstruct institutional market structure and establish fundamental filters before risking capital.',
      topics: [
        'Institutional Market Microstructure vs Retail Liquidity Traps',
        'Capital Allocator Mindset & Risk Budget Architecture',
        '8 Fundamental Screening Pillars (Unit Economics & Pricing Power)',
        'Financial Analysis: EBITDA Margins, ROE, ROCE & FCF Conversion',
        'Valuation Models: DCF Basics, Relative PE/PB & Margin of Safety',
      ],
    },
    {
      week: 'Week 02',
      title: 'Build the Strategy',
      subtitle: 'Technicals, Triggers & Sizing',
      badge: 'Module 02: Execution Engine',
      description: 'Master quantitative price action, dark pool footprints, and objective entry/exit rules.',
      topics: [
        'Auction Market Theory, Volume Profile & Value Area Shifts',
        'Cumulative Volume Delta (CVD) Anomalies & Absorption Detection',
        'Sector Rotation Dynamics & Leading Momentum Ranking',
        'Mathematical Position Sizing Controls (Volatility & Beta Adjustments)',
        'Pre-Defined Entry Triggers, Trailing Stops & Asymmetric Risk Ratios',
      ],
    },
    {
      week: 'Week 03',
      title: 'Test Before You Trust',
      subtitle: 'Backtesting, CAGR & Sharpe',
      badge: 'Module 03: Quant Verification',
      description: 'Verify your edge with statistical backtesting engines across bull, bear, and choppy market regimes.',
      topics: [
        'Building a Multi-Regime Backtesting Engine (2018–2025)',
        'Quantifying CAGR, Win Rate, Max Drawdown & Profit Factor',
        'Sharpe Ratio, Sortino Ratio & Risk-Adjusted Alpha Metrics',
        'Monte Carlo Simulations & Extreme Stress-Testing',
        'Eliminating Curve-Fitting & Psychological Survivorship Bias',
      ],
    },
    {
      week: 'Week 04',
      title: 'Build Your Portfolio',
      subtitle: 'Asset Allocation & 1-on-1 Audit',
      badge: 'Module 04: Live Deployment',
      description: 'Construct a resilient multi-asset portfolio and participate in a personal strategy audit.',
      topics: [
        'Institutional Asset Allocation (Core Equities, Momentum, Hedging, Cash)',
        'Dynamic Portfolio Rebalancing & Systematic Profit Locking',
        'Formulating Your Personal Institutional Trading Playbook',
        'Assessment Certifications (Quiz 1 & Quiz 2 Unlocks)',
        'Personal 1-on-1 Strategy Audit with Lead Strategist Yogesh Nath S',
      ],
    },
  ];

  // Backtesting Annual Performance
  const yearlyPerformance = [
    { year: '2018', return: '+18.4%', regime: 'Consolidation / Volatile' },
    { year: '2019', return: '+27.1%', regime: 'Bullish Momentum' },
    { year: '2020', return: '+34.8%', regime: 'Post-Crash Expansion' },
    { year: '2021', return: '+29.6%', regime: 'Broad-Based Rally' },
    { year: '2022', return: '+11.7%', regime: 'Global Tightening / Chop' },
    { year: '2023', return: '+31.5%', regime: 'Mid & Small Cap Surge' },
    { year: '2024', return: '+24.8%', regime: 'Institutional Trend' },
    { year: '2025', return: '+26.3%', regime: 'Factor Rotation Alpha' },
  ];

  // FAQ Data
  const faqs = [
    {
      q: 'What is the exact schedule and format of the weekend live sessions?',
      a: 'The Momentum Investing Program runs for 4 consecutive weeks. Live sessions take place every Saturday and Sunday via Google Meet (typically 10:00 AM - 12:30 PM IST). Every session is highly interactive with live screen-sharing, market case studies, and dedicated Q&A. All sessions are recorded in full HD and uploaded to your Student Portal within 2 hours.',
    },
    {
      q: 'Do I need a coding or advanced mathematical background?',
      a: 'No programming or complex mathematics is required. We provide ready-to-use quantitative spreadsheets, Google Sheets calculators, TradingView indicator setups, and structured backtested rules. The focus is on systematic decision-making, discipline, and capital allocation.',
    },
    {
      q: 'How does the 1-on-1 Strategy Audit process work?',
      a: 'During Week 4, each student schedules a private 45-minute 1-on-1 strategy session with Lead Strategist Yogesh Nath S. You will review your customized momentum playbook, analyze your portfolio sizing, calibrate your risk parameters, and address personal execution bottlenecks.',
    },
    {
      q: 'How long do I have access to the Student Portal and recordings?',
      a: 'You receive lifetime access to the Brewrich Student Portal. This includes all 4-week HD session recordings, future strategy updates, algorithmic cheat sheets, and ongoing access to our private community alpha desk.',
    },
    {
      q: 'How do I earn the official Program Credential & Certificate?',
      a: 'Upon completing Module 4, you will unlock the Institutional Assessment Engine on your Student Portal (Quiz 1 and Quiz 2). Achieving a passing score of 70%+ automatically issues your verified Certificate of Program Completion, signed by our SEBI-registered Research Director.',
    },
    {
      q: 'What starting capital is recommended to apply this system?',
      a: 'The framework works effectively for portfolios ranging from ₹1,00,000 to ₹50,00,000+. Because position sizing is expressed mathematically as a percentage of capital and volatility, the rules apply equally to small accounts and institutional sizes.',
    },
    {
      q: 'What happens after I complete payment of ₹22,000?',
      a: 'Payment via Razorpay is verified instantly. Your account is immediately granted access to the Student Portal, and you receive an email with your Google Meet cohort link, calendar invites, preparatory syllabus reading materials, and Discord alpha desk access.',
    },
  ];

  return (
    <div className="flex flex-col w-full pb-24 md:pb-16 bg-slate-50 text-slate-900">

      {/* ========================================================================= */}
      {/* 1. TOP HERO SECTION & BROCHURE DOWNLOAD (BETTERMENT ROYAL BLUE STYLE) */}
      {/* ========================================================================= */}
      <section className="relative bg-gradient-to-b from-[#0A358F] via-[#0D44B8] to-[#1456F0] text-white pt-20 pb-28 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Subtle Ambient Glows */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none -z-0" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl pointer-events-none -z-0" />

        <div className="relative z-10 mx-auto max-w-5xl text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold uppercase tracking-wider shadow-sm">
            <Sparkles className="h-4 w-4 text-amber-300" />
            <span>High-Ticket Quantitative Mentorship</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.1]">
            Momentum Investing <br className="hidden sm:inline" />
            <span className="text-blue-100 drop-shadow-sm">Program (MIP)</span>
          </h1>

          {/* Subheadline */}
          <p className="mx-auto max-w-3xl text-base sm:text-xl text-blue-100 font-normal leading-relaxed">
            Transition from retail liquidity prey to a systematic momentum executor. Master order flow, dark pool accumulation, and quantitative trade execution.
          </p>

          {/* Trust Badges */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 pt-2 text-xs sm:text-sm text-blue-100 font-semibold">
            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full border border-white/15 backdrop-blur-sm">
              <Calendar className="h-4 w-4 text-amber-300 shrink-0" />
              <span>Weekend Live Batches</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full border border-white/15 backdrop-blur-sm">
              <Video className="h-4 w-4 text-emerald-300 shrink-0" />
              <span>Google Meet Live Interactive</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full border border-white/15 backdrop-blur-sm">
              <Award className="h-4 w-4 text-teal-300 shrink-0" />
              <span>Certification on Quiz Completion</span>
            </div>
          </div>

          {/* Clean Action Buttons (Narrative-Driven Hero) */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 max-w-md mx-auto">
            <button
              type="button"
              onClick={scrollToPricing}
              className="btn-interactive w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-white text-blue-900 font-extrabold text-base shadow-xl shadow-blue-950/30 hover:bg-blue-50 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Sparkles className="h-5 w-5 text-blue-700" />
              <span>Enroll in Cohort</span>
              <ArrowRight className="h-5 w-5 text-blue-700" />
            </button>

            <a
              href="/BREWRICH_Momentum_Institutional_Investing_Program_MIIP.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-interactive w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 py-4 rounded-full bg-blue-800/80 hover:bg-blue-800 text-white font-bold text-sm border border-white/25 shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Download className="h-4 w-4 text-blue-200" />
              <span>Download Brochure (PDF)</span>
            </a>
          </div>

          {/* Quick Metrics Strip */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-3 max-w-3xl mx-auto text-xs text-blue-100">
            <span className="px-3 py-1 rounded-full bg-white/10 border border-white/15">
              <strong>1 Month</strong> Live Cohort
            </span>
            <span className="px-3 py-1 rounded-full bg-white/10 border border-white/15">
              <strong>10 Pillars</strong> Architecture
            </span>
            <span className="px-3 py-1 rounded-full bg-white/10 border border-white/15">
              <strong>1-on-1</strong> Strategy Audit
            </span>
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 font-bold">
              25.0% Historical CAGR
            </span>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. INTERACTIVE CAGR & CAPITAL GROWTH SIMULATOR */}
      {/* ========================================================================= */}
      <section className="-mt-12 px-4 sm:px-6 lg:px-8 relative z-20">
        <div className="mx-auto max-w-5xl rounded-3xl bg-white border border-slate-200/80 p-6 sm:p-10 shadow-2xl shadow-slate-300/60 space-y-8">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-700">
                <Calculator className="h-4 w-4" />
                <span>Interactive Capital Growth Simulator</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                Visualizing 25.0% Momentum Compounding
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Model your wealth trajectory powered by our verified 7-year multi-regime quantitative strategy.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-blue-50 border border-blue-200/80 text-blue-800 text-xs font-bold shrink-0">
              <Activity className="h-4 w-4 text-blue-600" />
              <span>Simulated CAGR: 25.0%</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Controls (Sliders & Presets) */}
            <div className="lg:col-span-6 space-y-6">
              
              {/* Capital Slider */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                    Starting Capital
                  </label>
                  <span className="text-2xl font-extrabold text-blue-700">
                    ₹{initialCapital.toLocaleString('en-IN')}
                  </span>
                </div>
                <input
                  type="range"
                  min={500000}
                  max={5000000}
                  step={100000}
                  value={initialCapital}
                  onChange={(e) => setInitialCapital(Number(e.target.value))}
                  className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-[11px] text-slate-500 font-semibold">
                  <span>₹5 Lakh</span>
                  <span>₹25 Lakh</span>
                  <span>₹50 Lakh</span>
                </div>

                {/* Quick Preset Buttons */}
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase">Presets:</span>
                  {[500000, 1000000, 2500000, 5000000].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setInitialCapital(val)}
                      className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                        initialCapital === val
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      ₹{(val / 100000).toFixed(0)}L
                    </button>
                  ))}
                </div>
              </div>

              {/* Timeline Slider */}
              <div className="space-y-3 pt-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                    Simulation Horizon
                  </label>
                  <span className="text-xl font-extrabold text-slate-900">
                    {simulationYears} {simulationYears === 1 ? 'Year' : 'Years'}
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={7}
                  step={1}
                  value={simulationYears}
                  onChange={(e) => setSimulationYears(Number(e.target.value))}
                  className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-[11px] text-slate-500 font-semibold">
                  <span>1 Year</span>
                  <span>4 Years</span>
                  <span>7 Years (2018–2025)</span>
                </div>
              </div>

              {/* Annual Timeline Breakdown Mini Table */}
              <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 pb-1 border-b border-slate-200/60">
                  <span>Horizon Progress</span>
                  <span>Portfolio Value</span>
                  <span>Annual Growth</span>
                </div>
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {calculations.yearlyData.map((row) => (
                    <div key={row.year} className="flex items-center justify-between text-xs font-medium text-slate-600">
                      <span className="font-bold text-slate-800">Year {row.year}</span>
                      <span className="text-blue-700 font-extrabold">₹{row.endBalance.toLocaleString('en-IN')}</span>
                      <span className="text-emerald-600 font-bold">+₹{row.profit.toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Display Card (Results & Benchmark Matrix) */}
            <div className="lg:col-span-6 rounded-3xl bg-gradient-to-br from-blue-900 to-[#0A358F] text-white p-6 sm:p-8 space-y-6 shadow-xl">
              <div>
                <p className="text-xs uppercase tracking-widest text-blue-200 font-bold">
                  Projected Portfolio Value ({simulationYears} Yrs)
                </p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
                    ₹{calculations.mipFinal.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs font-bold text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-400/30">
                    {calculations.multiplier}x Capital
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
                  <span className="text-[10px] uppercase text-blue-200 block font-bold">Initial Principal</span>
                  <span className="text-base font-extrabold text-white">₹{initialCapital.toLocaleString('en-IN')}</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-400/30">
                  <span className="text-[10px] uppercase text-emerald-300 block font-bold">Net Alpha Gain</span>
                  <span className="text-base font-extrabold text-emerald-300">+₹{calculations.mipGain.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Comparative Benchmark Matrix */}
              <div className="space-y-3 pt-2 border-t border-white/15">
                <p className="text-xs font-bold uppercase tracking-wider text-blue-200">
                  Strategy Comparison ({simulationYears} Years)
                </p>
                
                {/* MIP */}
                <div className="p-3 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-white block">MIP Quantitative Momentum</span>
                    <span className="text-[10px] text-blue-200">25.0% Verified CAGR</span>
                  </div>
                  <span className="text-sm font-extrabold text-white">₹{calculations.mipFinal.toLocaleString('en-IN')}</span>
                </div>

                {/* Nifty 50 */}
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-200 block">Nifty 50 Index</span>
                    <span className="text-[10px] text-slate-300">12.0% Benchmark</span>
                  </div>
                  <span className="text-sm font-bold text-slate-200">₹{calculations.niftyFinal.toLocaleString('en-IN')}</span>
                </div>

                {/* FD */}
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-200 block">Fixed Deposit / Debt</span>
                    <span className="text-[10px] text-slate-300">7.0% Conservative</span>
                  </div>
                  <span className="text-sm font-bold text-slate-200">₹{calculations.fdFinal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={scrollToPricing}
                  className="btn-interactive w-full flex items-center justify-center gap-2 py-3.5 rounded-full bg-white text-blue-900 font-extrabold text-sm shadow-md hover:bg-blue-50 transition-all"
                >
                  <span>Lock In Your 2025 Cohort Seat</span>
                  <ArrowRight className="h-4 w-4 text-blue-700" />
                </button>
              </div>

            </div>

          </div>

          <p className="text-[11px] text-slate-400 text-center italic border-t border-slate-100 pt-4">
            * Compounding simulations are mathematical projections based on historical 2018–2025 backtesting performance. Past performance does not guarantee future results.
          </p>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. THE RETAIL TRAP VS. THE SYSTEM */}
      {/* ========================================================================= */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl space-y-14">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-red-600 bg-red-50 px-3 py-1 rounded-full border border-red-200">
              02 // Market Challenges
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
              The Market Isn&apos;t Your Problem. <br />
              <span className="text-blue-700">Your Process Is.</span>
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Most retail investors don&apos;t lose money because they lack tips, news, or stock ideas. They fail because they lack an institutional framework for managing portfolio risk and capital allocation.
            </p>
          </div>

          {/* 3 Retail Traps vs Advantage Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* The Retail Disadvantage */}
            <div className="p-8 sm:p-10 rounded-3xl bg-red-50/50 border border-red-200/80 shadow-md space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-2xl bg-red-100 text-red-700 flex items-center justify-center font-bold">
                    <ShieldAlert className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-extrabold text-slate-900">The Retail Trap</h3>
                    <p className="text-xs text-red-700 font-semibold">90% of individual traders fail here</p>
                  </div>
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-red-100 text-red-800">Flawed Model</span>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-white border border-red-100 space-y-1 shadow-sm">
                  <div className="flex items-center gap-2 text-xs font-extrabold text-red-700 uppercase">
                    <span>✕ No Structured Process</span>
                  </div>
                  <p className="text-xs text-slate-600">
                    Buying on impulse, news releases, or social media hype with zero exit protocol.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-red-100 space-y-1 shadow-sm">
                  <div className="flex items-center gap-2 text-xs font-extrabold text-red-700 uppercase">
                    <span>✕ Absence of Discipline</span>
                  </div>
                  <p className="text-xs text-slate-600">
                    Changing strategies after two losing trades instead of following statistical expectancy.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-red-100 space-y-1 shadow-sm">
                  <div className="flex items-center gap-2 text-xs font-extrabold text-red-700 uppercase">
                    <span>✕ Zero Risk Control</span>
                  </div>
                  <p className="text-xs text-slate-600">
                    Over-concentrating capital in single positions without stop-loss or drawdown limits.
                  </p>
                </div>
              </div>
            </div>

            {/* The Institutional Advantage */}
            <div className="p-8 sm:p-10 rounded-3xl bg-blue-50/50 border border-blue-200/80 shadow-md space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-extrabold text-slate-900">The MIP Institutional Edge</h3>
                    <p className="text-xs text-blue-700 font-semibold">Systematic, rule-based alpha</p>
                  </div>
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-100 text-blue-800">Proven Alpha</span>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-white border border-blue-100 space-y-1 shadow-sm">
                  <div className="flex items-center gap-2 text-xs font-extrabold text-emerald-700 uppercase">
                    <span>✓ Order Flow & Dark Pool Footprints</span>
                  </div>
                  <p className="text-xs text-slate-600">
                    Detect institutional accumulation and Volume Delta absorption before retail breakouts form.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-blue-100 space-y-1 shadow-sm">
                  <div className="flex items-center gap-2 text-xs font-extrabold text-emerald-700 uppercase">
                    <span>✓ Mathematical Sizing & Kelly Sizing</span>
                  </div>
                  <p className="text-xs text-slate-600">
                    Position size derived dynamically from ATR volatility and beta covariance, keeping risk capped.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-blue-100 space-y-1 shadow-sm">
                  <div className="flex items-center gap-2 text-xs font-extrabold text-emerald-700 uppercase">
                    <span>✓ Pre-Programmed Systematic Execution</span>
                  </div>
                  <p className="text-xs text-slate-600">
                    Zero guesswork. Execute predetermined triggers with systematic trailing stops and multi-regime risk budgeting.
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Emotion vs System Transformation Matrix */}
          <div className="p-8 sm:p-10 rounded-3xl bg-white border border-slate-200/80 shadow-xl space-y-8">
            <div className="text-center space-y-2 max-w-xl mx-auto">
              <span className="text-xs font-bold uppercase tracking-widest text-blue-600">
                03 // Emotional Investing vs Execution
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Trade With Systems. Not Emotions.
              </h3>
              <p className="text-xs sm:text-sm text-slate-500">
                Replace psychological vulnerability with systematic institutional discipline.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-red-600 uppercase">Fear</span>
                  <span className="text-slate-400">vs</span>
                  <span className="text-blue-700 uppercase">Rules</span>
                </div>
                <div className="h-1 w-full bg-gradient-to-r from-red-400 to-blue-600 rounded-full" />
                <p className="text-xs text-slate-600">
                  Panic selling on noise is replaced with <strong>absolute execution discipline</strong>.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-red-600 uppercase">Greed</span>
                  <span className="text-slate-400">vs</span>
                  <span className="text-blue-700 uppercase">Data</span>
                </div>
                <div className="h-1 w-full bg-gradient-to-r from-red-400 to-blue-600 rounded-full" />
                <p className="text-xs text-slate-600">
                  Late entries at peak prices are replaced with <strong>statistical conviction</strong>.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-red-600 uppercase">Hope</span>
                  <span className="text-slate-400">vs</span>
                  <span className="text-blue-700 uppercase">Process</span>
                </div>
                <div className="h-1 w-full bg-gradient-to-r from-red-400 to-blue-600 rounded-full" />
                <p className="text-xs text-slate-600">
                  Delayed stop-losses on losing trades are replaced with <strong>long-term consistency</strong>.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-red-600 uppercase">Impulse</span>
                  <span className="text-slate-400">vs</span>
                  <span className="text-blue-700 uppercase">Automation</span>
                </div>
                <div className="h-1 w-full bg-gradient-to-r from-red-400 to-blue-600 rounded-full" />
                <p className="text-xs text-slate-600">
                  Broken position sizing rules are replaced with <strong>emotionless capital control</strong>.
                </p>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. THE 6-STAGE QUANTITATIVE FRAMEWORK */}
      {/* ========================================================================= */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white border-y border-slate-200/80">
        <div className="mx-auto max-w-6xl space-y-14">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              06 // The Framework
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
              Build a System. <br />
              <span className="text-blue-700">Not a Guess.</span>
            </h2>
            <p className="text-base text-slate-600">
              Our end-to-end 6-stage quantitative strategy architecture engineered for high-conviction research and long-term risk preservation.
            </p>
          </div>

          {/* 6-Stage Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stages.map((stage) => (
              <div
                key={stage.step}
                className="p-8 rounded-3xl bg-slate-50 border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-blue-300 transition-all space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-extrabold text-blue-700">{stage.step}</span>
                    <span className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full bg-blue-100 text-blue-800">
                      {stage.tag}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">{stage.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {stage.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-200 space-y-2">
                  {stage.points.map((pt) => (
                    <div key={pt} className="flex items-center gap-2 text-xs font-medium text-slate-700">
                      <CheckCircle2 className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* 10 Pillars Preview Bar */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-900 to-[#0A358F] text-white shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-[10px] uppercase font-bold text-blue-200 tracking-wider">
                  The Institutional Discipline
                </span>
                <h4 className="text-xl font-extrabold text-white">
                  10 Interconnected Pillars of Portfolio Design
                </h4>
              </div>
              <span className="text-xs bg-white/10 px-3 py-1 rounded-full border border-white/20 text-blue-100 font-semibold self-start sm:self-auto">
                Prioritizes Survivability Over Speculation
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-2 text-xs font-semibold">
              {[
                '01 Capital Allocation',
                '02 Portfolio Construction',
                '03 Risk Management',
                '04 Asset Selection',
                '05 Position Sizing',
                '06 Market Regimes',
                '07 Fundamental Research',
                '08 Portfolio Monitoring',
                '09 Performance Evaluation',
                '10 Investment Discipline',
              ].map((pillar) => (
                <div key={pillar} className="p-2.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/15 text-center truncate">
                  {pillar}
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. FOUR-WEEK CURRICULUM ROADMAP */}
      {/* ========================================================================= */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl space-y-14">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              11 // Curriculum Roadmap
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
              Four-Week Masterclass Curriculum
            </h2>
            <p className="text-base text-slate-600">
              A high-density institutional transformation delivered through weekend live interactive Google Meet sessions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {curriculum.map((item, idx) => (
              <div
                key={item.week}
                className={`p-8 rounded-3xl border shadow-lg space-y-5 transition-all ${
                  idx === 3
                    ? 'bg-gradient-to-br from-[#0B1B3D] to-[#0A358F] text-white border-blue-900'
                    : 'bg-white border-slate-200/80 text-slate-900'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-extrabold px-3 py-1 rounded-full ${
                      idx === 3
                        ? 'bg-amber-400 text-slate-950'
                        : 'bg-blue-100 text-blue-800 border border-blue-200'
                    }`}
                  >
                    {item.week}
                  </span>
                  <span
                    className={`text-xs font-bold uppercase tracking-wider ${
                      idx === 3 ? 'text-blue-200' : 'text-slate-500'
                    }`}
                  >
                    Weekend Intensive
                  </span>
                </div>

                <div>
                  <h3 className="text-2xl font-extrabold tracking-tight">{item.title}</h3>
                  <p className={`text-xs font-bold mt-0.5 ${idx === 3 ? 'text-blue-200' : 'text-blue-700'}`}>
                    {item.subtitle}
                  </p>
                  <p className={`text-xs sm:text-sm mt-2 leading-relaxed ${idx === 3 ? 'text-slate-200' : 'text-slate-600'}`}>
                    {item.description}
                  </p>
                </div>

                <div className="space-y-2.5 pt-3 border-t border-slate-200/40">
                  {item.topics.map((topic) => (
                    <div key={topic} className="flex items-start gap-2.5 text-xs font-medium">
                      <CheckCircle2
                        className={`h-4 w-4 shrink-0 mt-0.5 ${
                          idx === 3 ? 'text-amber-300' : 'text-emerald-600'
                        }`}
                      />
                      <span className={idx === 3 ? 'text-slate-100' : 'text-slate-700'}>{topic}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-2">
                  <span
                    className={`inline-block text-[11px] font-bold px-3 py-1 rounded-xl ${
                      idx === 3
                        ? 'bg-white/10 text-white border border-white/20'
                        : 'bg-slate-100 text-slate-600 border border-slate-200'
                    }`}
                  >
                    {item.badge}
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. VERIFIED QUANTITATIVE BACKTESTING (2018–2025) */}
      {/* ========================================================================= */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white border-y border-slate-200/80">
        <div className="mx-auto max-w-6xl space-y-14">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              12 // Quantitative Backtesting
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
              Don&apos;t Just Believe the System. <br />
              <span className="text-blue-700">Test It.</span>
            </h2>
            <p className="text-base text-slate-600">
              Hypothetical multi-regime simulation report over a 7-year timeline (2018–2025) with initial capital ₹10,00,000.
            </p>
          </div>

          {/* Core Stat Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 text-center">
            
            <div className="p-5 rounded-3xl bg-slate-50 border border-slate-200 shadow-sm">
              <span className="text-[10px] font-extrabold uppercase text-slate-500 tracking-wider">CAGR</span>
              <p className="text-2xl sm:text-3xl font-extrabold text-blue-700 mt-1">25.0%</p>
              <span className="text-[10px] text-slate-500 font-medium">Compound Annual</span>
            </div>

            <div className="p-5 rounded-3xl bg-slate-50 border border-slate-200 shadow-sm">
              <span className="text-[10px] font-extrabold uppercase text-slate-500 tracking-wider">Win Rate</span>
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">58%</p>
              <span className="text-[10px] text-slate-500 font-medium">Positive Expectancy</span>
            </div>

            <div className="p-5 rounded-3xl bg-slate-50 border border-slate-200 shadow-sm">
              <span className="text-[10px] font-extrabold uppercase text-slate-500 tracking-wider">Max Drawdown</span>
              <p className="text-2xl sm:text-3xl font-extrabold text-red-600 mt-1">-14.8%</p>
              <span className="text-[10px] text-slate-500 font-medium">Strict Downside Cap</span>
            </div>

            <div className="p-5 rounded-3xl bg-slate-50 border border-slate-200 shadow-sm">
              <span className="text-[10px] font-extrabold uppercase text-slate-500 tracking-wider">Sharpe Ratio</span>
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">1.42</p>
              <span className="text-[10px] text-slate-500 font-medium">High Risk-Adjusted</span>
            </div>

            <div className="p-5 rounded-3xl bg-slate-50 border border-slate-200 shadow-sm">
              <span className="text-[10px] font-extrabold uppercase text-slate-500 tracking-wider">Profit Factor</span>
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">1.68</p>
              <span className="text-[10px] text-slate-500 font-medium">Gross Win/Loss Ratio</span>
            </div>

            <div className="p-5 rounded-3xl bg-slate-50 border border-slate-200 shadow-sm">
              <span className="text-[10px] font-extrabold uppercase text-slate-500 tracking-wider">Best Year</span>
              <p className="text-2xl sm:text-3xl font-extrabold text-emerald-600 mt-1">+38.6%</p>
              <span className="text-[10px] text-slate-500 font-medium">Maximum Upside Capture</span>
            </div>

          </div>

          {/* Year-by-Year Return Breakdown Table */}
          <div className="rounded-3xl bg-slate-50 border border-slate-200/80 p-6 sm:p-8 shadow-md space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-4">
              <div>
                <h4 className="text-lg font-bold text-slate-900">Year-by-Year Return Track Record</h4>
                <p className="text-xs text-slate-500">Consistent performance across diverse market cycles.</p>
              </div>
              <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-blue-100 text-blue-800 self-start sm:self-auto">
                Simulation Period: 2018–2025 (7 Yrs)
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
              {yearlyPerformance.map((item) => (
                <div key={item.year} className="p-4 rounded-2xl bg-white border border-slate-200/80 text-center shadow-sm">
                  <span className="text-xs font-bold text-slate-500">{item.year}</span>
                  <p className="text-xl font-extrabold text-emerald-600 my-1">{item.return}</p>
                  <span className="text-[9px] text-slate-400 block truncate">{item.regime}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Market Regime Behavior Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="p-6 rounded-3xl bg-emerald-50/70 border border-emerald-200/80 space-y-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-800">Bull Market</span>
              <p className="text-3xl font-extrabold text-emerald-700">+32.4%</p>
              <p className="text-xs text-slate-600">Full trend participation with aggressive momentum pyramiding.</p>
            </div>

            <div className="p-6 rounded-3xl bg-blue-50/70 border border-blue-200/80 space-y-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-blue-800">High Volatility</span>
              <p className="text-3xl font-extrabold text-blue-700">+18.7%</p>
              <p className="text-xs text-slate-600">Dynamic position sizing with tight stops preserving profits.</p>
            </div>

            <div className="p-6 rounded-3xl bg-amber-50/70 border border-amber-200/80 space-y-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-amber-800">Sideways Market</span>
              <p className="text-3xl font-extrabold text-amber-700">+14.2%</p>
              <p className="text-xs text-slate-600">Mean reversion extraction and sector factor rotation.</p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-100 border border-slate-200 space-y-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-800">Bear Market</span>
              <p className="text-3xl font-extrabold text-slate-800">+8.6%</p>
              <p className="text-xs text-slate-600">Capital preservation mode & tactical cash/hedging allocation.</p>
            </div>

          </div>

          <div className="text-center text-xs text-slate-400 max-w-2xl mx-auto space-y-1">
            <p>* Illustrative hypothetical backtested simulation only. Not actual client performance.</p>
            <p>SEBI-Registered Research Analyst Advisory. Investments in securities are subject to market risks.</p>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. MEET YOUR MENTOR & WHATSAPP INSTANT CONNECT */}
      {/* ========================================================================= */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl space-y-14">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              14 // Lead Mentor
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
              Meet Your Strategist
            </h2>
            <p className="text-base text-slate-600">
              Learn directly from the architect behind Brewrich&apos;s quantitative momentum research desk.
            </p>
          </div>

          {/* Mentor Profile Hero Card */}
          <div className="rounded-3xl bg-white border border-slate-200/80 shadow-2xl p-8 sm:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              
              {/* Image Column */}
              <div className="lg:col-span-5 flex flex-col items-center">
                <div className="relative w-64 h-72 sm:w-72 sm:h-80 rounded-3xl overflow-hidden shadow-2xl border-4 border-white ring-4 ring-blue-500/20">
                  <img
                    src="/YOGESH NATH IMAGE.jpg"
                    alt="Yogesh Nath S - Lead Strategist & Quant Research Director"
                    className="w-full h-full object-cover object-top"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A358F]/80 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-4 right-4 text-white text-left">
                    <span className="text-[10px] uppercase font-extrabold tracking-wider bg-blue-600/90 px-2 py-0.5 rounded-md">
                      Program Director
                    </span>
                    <p className="text-lg font-extrabold mt-0.5">Yogesh Nath S</p>
                  </div>
                </div>
              </div>

              {/* Bio Details Column */}
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-extrabold uppercase tracking-wider mb-2">
                    <span>Lead Strategist & Quant Research Director</span>
                  </div>
                  <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
                    Yogesh Nath S
                  </h3>
                  <p className="text-sm font-semibold text-slate-500 mt-1">
                    Quant Research Director & Founder • 7+ Years Market Experience
                  </p>
                </div>

                {/* Featured Quote */}
                <div className="p-4 rounded-2xl bg-slate-50 border-l-4 border-blue-600 italic text-slate-800 text-base font-semibold shadow-sm">
                  &ldquo;This is not a stock course. It&apos;s a system.&rdquo;
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-1 text-xs font-bold text-slate-700">
                  <span className="px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200">
                    7+ Years Market Experience
                  </span>
                  <span className="px-3 py-1.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
                    Momentum Investor
                  </span>
                  <span className="px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                    Data Driven Approach
                  </span>
                  <span className="px-3 py-1.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                    Senior Data Analyst
                  </span>
                </div>

                {/* WhatsApp Quick Connect Button */}
                <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <a
                    href="https://wa.link/u0v00a"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-interactive flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg shadow-emerald-600/25 transition-all hover:scale-[1.01] active:scale-[0.99]"
                  >
                    <MessageCircle className="h-5 w-5" />
                    <span>Connect on WhatsApp (Direct Desk)</span>
                    <ArrowUpRight className="h-4 w-4" />
                  </a>

                  <button
                    type="button"
                    onClick={scrollToPricing}
                    className="btn-interactive flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition-all"
                  >
                    <span>View Registration Options</span>
                  </button>
                </div>

                {/* Office Info */}
                <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center gap-4">
                  <span className="flex items-center gap-1">
                    <Phone className="h-3.5 w-3.5 text-slate-400" />
                    +91 90427 47590
                  </span>
                  <span>
                    Brewrich 2151/1A, Sri Rajarajeshwari Nagar, plot no 21, Periyakulam - Theni Rd, Lakshmipuram, Thamarai Kulam, Tamil Nadu 625523
                  </span>
                </div>
              </div>

            </div>
          </div>

          {/* Who This Program Is For Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-md space-y-3">
              <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <Users className="h-6 w-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900">Serious Investors</h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Investors seeking a repeatable, data-backed system to deploy capital with confidence and strict risk controls.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-md space-y-3">
              <div className="h-12 w-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                <PieChart className="h-6 w-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900">Entrepreneurs & Founders</h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Leaders who want their liquid capital managed with institutional rigor rather than watching minute charts all day.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-md space-y-3">
              <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <TrendingUp className="h-6 w-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900">Traders & Analysts</h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Traders transitioning from emotional retail guesswork to systematic algorithmic order flow execution.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. PROGRAM CREDENTIAL & CERTIFICATION */}
      {/* ========================================================================= */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white border-y border-slate-200/80">
        <div className="mx-auto max-w-5xl space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              15 // Official Credential
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
              Verified Program Certification
            </h2>
            <p className="text-base text-slate-600">
              Earn an institutional Certificate of Program Completion issued upon completing the Module 4 assessment quizzes.
            </p>
          </div>

          {/* Certificate Mockup Card */}
          <div className="rounded-3xl border-2 border-slate-300 bg-gradient-to-br from-slate-50 via-white to-blue-50/30 p-8 sm:p-12 shadow-2xl space-y-8 relative overflow-hidden">
            
            {/* Top Certificate Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-2xl bg-[#0A358F] text-white flex items-center justify-center font-extrabold text-xl shadow-md">
                  B
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900">BREWRICH WEALTH</h3>
                  <p className="text-[10px] text-blue-700 font-bold uppercase tracking-wider">
                    SEBI-Registered Research Analyst Advisory
                  </p>
                </div>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                  PROGRAM CREDENTIAL
                </span>
                <p className="text-[10px] text-slate-500 mt-1 uppercase font-semibold">
                  COMPLETION • 4-WEEK LIVE COHORT
                </p>
              </div>
            </div>

            {/* Certificate Body */}
            <div className="text-center space-y-4 py-4 max-w-2xl mx-auto">
              <span className="text-xs uppercase tracking-widest text-slate-500 font-bold">
                CERTIFICATE OF
              </span>
              <h4 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                PROGRAM COMPLETION
              </h4>
              <p className="text-xs text-slate-500">This certificate is proudly presented to</p>
              <div className="py-2 border-b-2 border-slate-300 max-w-md mx-auto">
                <span className="text-2xl sm:text-3xl font-extrabold text-blue-900 uppercase tracking-wider">
                  [PARTICIPANT NAME]
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-xl mx-auto pt-2">
                for successfully completing the <strong>Momentum Investing Program (MIP)</strong>, a structured one-month live program focused on institutional thinking, quantitative research, portfolio construction, risk management, and systematic capital allocation.
              </p>
            </div>

            {/* Credential Highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4 border-y border-slate-200">
              <div className="p-3 rounded-2xl bg-white border border-slate-200 text-center">
                <span className="text-xs font-extrabold text-blue-700 block">01 // 1 MONTH</span>
                <span className="text-[11px] text-slate-600 font-medium">Live Cohort</span>
              </div>
              <div className="p-3 rounded-2xl bg-white border border-slate-200 text-center">
                <span className="text-xs font-extrabold text-blue-700 block">02 // 4 WEEKS</span>
                <span className="text-[11px] text-slate-600 font-medium">Structured Curriculum</span>
              </div>
              <div className="p-3 rounded-2xl bg-white border border-slate-200 text-center">
                <span className="text-xs font-extrabold text-blue-700 block">03 // SAT + SUN</span>
                <span className="text-[11px] text-slate-600 font-medium">Live Sessions</span>
              </div>
              <div className="p-3 rounded-2xl bg-white border border-slate-200 text-center">
                <span className="text-xs font-extrabold text-blue-700 block">04 // 1-ON-1</span>
                <span className="text-[11px] text-slate-600 font-medium">Strategy Audit</span>
              </div>
            </div>

            {/* Certificate Footer Signature & Seal */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pt-2">
              <div>
                <p className="text-base font-extrabold text-slate-900">Yogesh Nath S</p>
                <p className="text-xs text-slate-500">Lead Strategist & Quant Research Director</p>
                <p className="text-[10px] text-blue-700 font-bold">BREWRICH WEALTH ADVISORY</p>
              </div>

              <div className="flex items-center gap-3 self-center sm:self-auto">
                <div className="h-16 w-16 rounded-full border-2 border-dashed border-blue-600 flex flex-col items-center justify-center text-center p-1 bg-blue-50 text-blue-800">
                  <Award className="h-5 w-5 text-blue-700" />
                  <span className="text-[8px] font-extrabold uppercase">BREWRICH VERIFIED</span>
                </div>
              </div>

              <div className="text-left sm:text-right text-xs text-slate-500">
                <p>CERTIFICATE ID: <strong className="text-slate-800">[ISSUED ON QUIZ PASS]</strong></p>
                <p>DATE: <strong className="text-slate-800">[COMPLETION DATE]</strong></p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 9. INTERACTIVE FAQ & OBJECTION HANDLING ACCORDION */}
      {/* ========================================================================= */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              Direct Inquiries
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-base text-slate-600">
              Clear answers regarding weekend schedules, software requirements, and the 1-on-1 audit process.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div
                  key={faq.q}
                  className="rounded-3xl bg-white border border-slate-200/80 shadow-md overflow-hidden transition-all"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(index)}
                    className="w-full p-6 sm:p-7 text-left flex items-center justify-between gap-4 focus:outline-none"
                  >
                    <span className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-3">
                      <HelpCircle className="h-5 w-5 text-blue-600 shrink-0" />
                      <span>{faq.q}</span>
                    </span>
                    <div
                      className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                        isOpen ? 'bg-blue-600 text-white rotate-180' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-6 sm:px-7 pb-6 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-4 animate-in fade-in duration-200">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="p-6 rounded-3xl bg-slate-100 text-center space-y-2">
            <p className="text-xs font-bold text-slate-700">Have a specific question not covered here?</p>
            <a
              href="https://wa.link/u0v00a"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-extrabold text-emerald-700 hover:text-emerald-800"
            >
              <MessageCircle className="h-4 w-4" />
              <span>Ask Yogesh Nath directly on WhatsApp &rarr;</span>
            </a>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 10. BOTTOM PRICING, LIVE SCARCITY TRACKER & REGISTRATION CARD */}
      {/* ========================================================================= */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-100 border-t border-slate-200/80">
        <div className="mx-auto max-w-4xl space-y-8">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              Next Cohort Registration
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
              Invest in Your Edge
            </h2>
            <p className="text-base text-slate-600">
              Direct access to institutional quantitative mentorship, live Google Meet sessions, and a personalized 1-on-1 audit.
            </p>
          </div>

          {/* Main Pricing & Registration Card */}
          <div className="rounded-3xl bg-white border border-slate-200/80 shadow-2xl p-8 sm:p-12 space-y-8 relative overflow-hidden">
            
            {/* Live Scarcity Tracker Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-amber-50 border border-amber-200">
              <div className="flex items-center gap-2.5">
                <span className="flex h-3 w-3 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500" />
                </span>
                <span className="text-xs font-extrabold text-amber-900 uppercase tracking-wider">
                  Live Scarcity Tracker: Limited 25 Seats Per Cohort
                </span>
              </div>
              <span className="text-xs font-bold text-amber-800 bg-amber-100 px-3 py-1 rounded-full self-start sm:self-auto">
                Next Weekend Batch Enrolling
              </span>
            </div>

            {/* Price Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-100 pb-8">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-slate-500 block">
                  Cohort Registration Fee
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight">
                    ₹22,000
                  </span>
                  <span className="text-sm font-bold text-slate-500">
                    INR (All-Inclusive)
                  </span>
                </div>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-xs font-extrabold px-3.5 py-1.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
                  Lifetime Student Portal Access
                </span>
              </div>
            </div>

            {/* What is Included Checklist */}
            <div className="space-y-4">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Everything Included in Your ₹22,000 Enrollment:
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {[
                  '4-Week Intensive Weekend Live Sessions (Saturday & Sunday on Google Meet)',
                  'Personal 1-on-1 Strategy Audit directly with Yogesh Nath S',
                  'Protected Student Portal Dashboard with HD Recordings & Algorithmic Models',
                  'Quantitative Position Sizing Calculators & Factor Backtesting Engines',
                  'Dual Assessment Unlocks (Quiz 1 & Quiz 2) with Verified Certificate',
                  'Exclusive Discord & WhatsApp Alpha Desk for Daily Order Flow Insights',
                  'Lifetime Access to Strategy Updates & Refinements',
                  'Zero Hidden Fees • 100% Tax Invoice Provided',
                ].map((feature) => (
                  <div key={feature} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 font-medium">
                    <CheckCircle2 className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Registration Action Area */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="btn-interactive w-full min-h-[56px] flex items-center justify-center gap-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-lg shadow-xl shadow-blue-600/30 transition-all hover:scale-[1.01] active:scale-[0.99]"
              >
                <Sparkles className="h-5 w-5 text-amber-300" />
                <span>Register Now • ₹22,000</span>
                <ArrowRight className="h-5 w-5" />
              </button>

              <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-semibold pt-2">
                <div className="flex items-center gap-1.5">
                  <Lock className="h-4 w-4 text-blue-600" />
                  <span>256-Bit SSL Razorpay Encrypted</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  <span>Instant Student Portal Activation</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Award className="h-4 w-4 text-amber-500" />
                  <span>SEBI-Registered Research Analyst Desk</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 11. STICKY MOBILE-FRIENDLY "REGISTER NOW" BOTTOM BAR */}
      {/* ========================================================================= */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-xl border-t border-slate-200 p-3 sm:p-4 md:hidden pb-safe shadow-2xl">
        <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold text-blue-700 tracking-wider">
              MIP Live Cohort
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-extrabold text-slate-900">₹22,000</span>
              <span className="text-[10px] text-slate-500 font-semibold">INR</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="btn-interactive flex-1 min-h-[48px] flex items-center justify-center gap-2 rounded-full bg-blue-600 active:bg-blue-700 text-white font-extrabold text-sm shadow-md shadow-blue-600/30"
          >
            <Sparkles className="h-4 w-4 text-amber-300" />
            <span>Register Now</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Registration & Razorpay Flow Modal */}
      <RegisterFlowModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setAutoTrigger(false);
        }}
        autoTriggerCheckout={autoTrigger}
      />

    </div>
  );
}

export default function MiipPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-600">
          <div className="h-8 w-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <MipContent />
    </Suspense>
  );
}

