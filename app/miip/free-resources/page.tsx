'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import FreeResourceCard from '@/components/FreeResourceCard';
import RegisterFlowModal from '@/components/RegisterFlowModal';
import {
  Sparkles,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Award,
  Video,
  Users,
  CheckCircle2,
  Lock,
  ArrowUpRight,
  MessageCircle,
  TrendingUp,
  Flame,
  Zap,
  HelpCircle,
  Calendar,
  Layers,
  ChevronRight,
  AlertCircle
} from 'lucide-react';

function FreeResourcesContent() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const searchParams = useSearchParams();
  const fallbackStatus = searchParams?.get('status') || searchParams?.get('fallback');
  const isUnpaidFallback = fallbackStatus === 'unpaid_member' || fallbackStatus === 'cancelled';

  const resources = [
    {
      id: 'risk-guidebook',
      badge: 'Proprietary Risk Blueprint',
      badgeColor: 'blue' as const,
      title: 'The Institutional Risk & Position Sizing Guidebook',
      subtitle: 'Capital Preservation, Kelly Sizing & Safe Trader Planning',
      description: 'Master the mathematical foundation of long-term trading survival. Learn why 90% of retail traders fail and how institutions size positions based on volatility and covariance rather than emotion.',
      pdfUrl: '/BREWRICH_Institutional_Risk_Guidebook.pdf',
      fileSize: '830 KB',
      pageCount: '14 Pages',
      highlights: [
        'The Asymmetric Loss Penalty & Drawdown Recovery Curves',
        'Fractional Kelly Criterion for Retail Trading Accounts',
        'ATR Volatility-Adjusted Quantity Selection Formulas',
        '1:3+ Asymmetric Risk-Reward Trade Architecture',
        'Pre-Market Risk Audit Checklist & Trade Journal Rules',
      ],
      gradientTheme: 'bg-blue-600',
      accentColor: '#1456F0',
      coverImageTheme: 'risk' as const,
    },
    {
      id: 'chart-patterns',
      badge: 'Technical Strategy Bible',
      badgeColor: 'amber' as const,
      title: 'Mastering Chart Patterns & Candlestick Formations',
      subtitle: 'High-Probability Breakout, Breakdown & Reversal Strategies',
      description: 'A comprehensive institutional visual encyclopedia of high-conviction chart setups, volume delta absorption signals, candlestick confirmation triggers, and anchored VWAP confluence.',
      pdfUrl: '/BREWRICH_Chart_Patterns_Candlesticks_Mastery.pdf',
      fileSize: '4.5 MB',
      pageCount: '28 Pages',
      highlights: [
        'Auction Market Theory & Value Area Shifts (VAH, VAL, POC)',
        'Ascending Triangles, Bull Flags & High-Expectancy Breakouts',
        'Candlestick Reversals: Hammers, Engulfing & Morning Stars',
        'Dark Pool Footprints & False Breakout Trap Detection',
        'The 5-Step Systematic Trade Execution Rulebook',
      ],
      gradientTheme: 'bg-amber-500',
      accentColor: '#F59E0B',
      coverImageTheme: 'chart' as const,
    },
  ];

  return (
    <div className="flex flex-col w-full min-h-screen bg-slate-950 text-slate-100 pb-24 md:pb-16 selection:bg-blue-600 selection:text-white">
      
      {/* 1. SMART FALLBACK WELCOME BANNER (FOR UNPAID / CANCELLED MEMBERS) */}
      {isUnpaidFallback && (
        <div className="bg-gradient-to-r from-amber-950/80 via-slate-900 to-blue-950/80 border-b border-amber-500/30 px-4 py-3.5 sm:px-6 relative z-30">
          <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30">
                <Sparkles className="h-4 w-4" />
              </div>
              <p className="text-xs sm:text-sm text-slate-200">
                <strong className="text-amber-300">Complimentary Gift Unlocked:</strong> Your active cohort access is pending, but you can immediately download our core institutional study materials below!
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="btn-interactive px-4 py-1.5 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold shadow-md shrink-0"
            >
              Complete Enrollment • ₹22,000
            </button>
          </div>
        </div>
      )}

      {/* 2. HERO SECTION */}
      <section className="relative pt-16 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        
        {/* Glowing Ambient Radial Gradients */}
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none -z-0" />
        <div className="absolute bottom-0 left-10 w-[400px] h-[400px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none -z-0" />

        <div className="relative z-10 mx-auto max-w-5xl text-center space-y-6">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-bold uppercase tracking-wider shadow-sm">
            <BookOpen className="h-4 w-4 text-amber-400" />
            <span>Institutional Quantitative Knowledge Vault</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15]">
            Accelerate Your Edge With <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-amber-300">
              Complimentary Study Materials.
            </span>
          </h1>

          <p className="mx-auto max-w-2xl text-sm sm:text-lg text-slate-300 font-normal leading-relaxed">
            Download our two foundational institutional trading books. Master mathematical risk budgeting, position sizing controls, and high-probability candlestick breakout fractals.
          </p>

          {/* Quick Features Badges */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2 text-xs font-semibold text-slate-400">
            <div className="flex items-center gap-1.5 bg-slate-900/80 px-3.5 py-1.5 rounded-full border border-slate-800">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>100% Free Instant PDF Downloads</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-900/80 px-3.5 py-1.5 rounded-full border border-slate-800">
              <CheckCircle2 className="h-4 w-4 text-blue-400" />
              <span>Zero External Program Buzzwords</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-900/80 px-3.5 py-1.5 rounded-full border border-slate-800">
              <CheckCircle2 className="h-4 w-4 text-amber-400" />
              <span>Authored by SEBI-Registered Research Desk</span>
            </div>
          </div>

        </div>
      </section>

      {/* 3. DUAL LUXURY 3D BOOK CARDS SECTION */}
      <section className="px-4 sm:px-6 lg:px-8 relative z-20">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {resources.map((book) => (
              <FreeResourceCard key={book.id} {...book} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. VALUE COMPARISON TABLE (SELF-STUDY VS FULL LIVE COHORT) */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl rounded-3xl bg-slate-900/80 border border-slate-800 p-6 sm:p-10 shadow-2xl space-y-8">
          
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-400">
              The Evolution Pathway
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              Free Books vs. Full MIIP Live Cohort
            </h3>
            <p className="text-xs sm:text-sm text-slate-400">
              Our free guides build the theoretical foundation. The live cohort transforms you into an institutional executor.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase text-[11px] tracking-wider">
                  <th className="py-3 px-4">Feature / Deliverable</th>
                  <th className="py-3 px-4 text-center">Complimentary Free Books</th>
                  <th className="py-3 px-4 text-center text-blue-400 font-bold bg-blue-950/30 rounded-t-xl">
                    Full MIIP Live Cohort (₹22,000)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-white">Risk Sizing & Pattern Theory PDFs</td>
                  <td className="py-3.5 px-4 text-center text-emerald-400 font-bold">✓ Included</td>
                  <td className="py-3.5 px-4 text-center text-emerald-400 font-bold bg-blue-950/30">✓ Included</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-white">4-Week Weekend Live Google Meet Sessions</td>
                  <td className="py-3.5 px-4 text-center text-slate-600">✕ Self Study Only</td>
                  <td className="py-3.5 px-4 text-center text-emerald-400 font-bold bg-blue-950/30">✓ 8 Intensive Live Classes</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-white">Personal 1-on-1 Strategy Audit with Yogesh Nath S</td>
                  <td className="py-3.5 px-4 text-center text-slate-600">✕ Not Included</td>
                  <td className="py-3.5 px-4 text-center text-emerald-400 font-bold bg-blue-950/30">✓ Dedicated 45-Min Private Session</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-white">Protected Student Portal & HD Class Recordings</td>
                  <td className="py-3.5 px-4 text-center text-slate-600">✕ Not Included</td>
                  <td className="py-3.5 px-4 text-center text-emerald-400 font-bold bg-blue-950/30">✓ Lifetime Portal Access</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-white">Dual Assessment Unlocks & Completion Certificate</td>
                  <td className="py-3.5 px-4 text-center text-slate-600">✕ Not Included</td>
                  <td className="py-3.5 px-4 text-center text-emerald-400 font-bold bg-blue-950/30">✓ Verified Official Credential</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-white">Private Alpha Desk Discord & WhatsApp Room</td>
                  <td className="py-3.5 px-4 text-center text-slate-600">✕ Not Included</td>
                  <td className="py-3.5 px-4 text-center text-emerald-400 font-bold bg-blue-950/30">✓ Daily Order Flow Setups</td>
                </tr>
              </tbody>
            </table>
          </div>

        </div>
      </section>

      {/* 5. COHORT UPGRADE CALL TO ACTION CARD */}
      <section className="px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl rounded-3xl bg-gradient-to-r from-[#0A358F] via-[#0D44B8] to-[#1456F0] p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden space-y-6">
          
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-3 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 border border-white/20 text-xs font-extrabold uppercase tracking-wider">
                <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                <span>Next Weekend Batch Enrolling Now</span>
              </div>
              <h3 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                Ready for Live Institutional Execution?
              </h3>
              <p className="text-xs sm:text-sm text-blue-100 max-w-xl leading-relaxed">
                Join our next live cohort. Learn directly from Lead Strategist Yogesh Nath S on Google Meet, unlock verified assessments, and receive your personalized strategy audit.
              </p>
            </div>

            <div className="flex flex-col items-center sm:items-end gap-3 shrink-0 w-full md:w-auto">
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="btn-interactive w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-white text-blue-900 font-extrabold text-base shadow-xl hover:bg-blue-50 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Sparkles className="h-5 w-5 text-blue-700" />
                <span>Join MIIP Cohort • ₹22,000</span>
                <ArrowRight className="h-5 w-5 text-blue-700" />
              </button>

              <Link
                href="/miip"
                className="text-xs text-blue-200 hover:text-white font-semibold flex items-center gap-1 transition-colors"
              >
                <span>Read Full Program Syllabus & Curriculum</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* Trust strip */}
          <div className="pt-4 border-t border-white/15 flex flex-wrap items-center justify-center md:justify-start gap-6 text-xs text-blue-100 font-semibold relative z-10">
            <div className="flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5 text-blue-200" />
              <span>Razorpay 256-Bit Encrypted</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-300" />
              <span>Instant Portal Activation</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Award className="h-3.5 w-3.5 text-amber-300" />
              <span>SEBI-Registered Desk</span>
            </div>
          </div>

        </div>
      </section>

      {/* 6. WHATSAPP ADVISORY ASSISTANCE */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 text-center">
        <div className="mx-auto max-w-md space-y-2">
          <p className="text-xs text-slate-400">Have questions about the study guides or the live cohort?</p>
          <a
            href="https://wa.link/u0v00a"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs font-extrabold text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            <MessageCircle className="h-4 w-4" />
            <span>Connect directly with Yogesh Nath on WhatsApp &rarr;</span>
          </a>
        </div>
      </section>

      {/* Registration & Razorpay Flow Modal */}
      <RegisterFlowModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

    </div>
  );
}

export default function FreeResourcesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
          <div className="h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <FreeResourcesContent />
    </Suspense>
  );
}
