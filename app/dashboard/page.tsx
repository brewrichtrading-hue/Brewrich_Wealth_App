import React from 'react';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import LiveClassCard from '@/components/LiveClassCard';
import QuizModuleCard from '@/components/QuizModuleCard';
import { LiveClassSchedule } from '@/lib/types';
import { 
  GraduationCap, 
  Sparkles, 
  Calendar, 
  Video, 
  Award, 
  BookOpen, 
  ShieldCheck, 
  Download, 
  FileText, 
  CheckCircle, 
  Clock,
  LogOut,
  ExternalLink,
  Zap,
  TrendingUp
} from 'lucide-react';

export const revalidate = 0; // Fresh dynamic data on every request

export default async function DashboardPage() {
  const supabase = await createClient();

  // 1. Authenticate user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect('/?auth_redirect=login_required');
  }

  // 2. Verify paid status (is_paid === true)
  const { data: moduleStatus, error: dbError } = await supabase
    .from('module_status')
    .select('*')
    .or(`user_id.eq.${user.id},email.eq.${user.email}`)
    .order('is_paid', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!moduleStatus || !moduleStatus.is_paid) {
    redirect('/?access_denied=unpaid_member');
  }

  // 3. Upcoming Saturday & Sunday Live Class Schedule
  const liveClassSchedules: LiveClassSchedule[] = [
    {
      id: 'live-sat-01',
      title: 'Order Flow Footprint Imbalances & Delta Divergence',
      date: 'Saturday, Feb 21, 2026',
      day: 'Saturday',
      time: '07:30 PM - 09:30 PM IST',
      duration: '2 Hours Live',
      instructor: 'Lead Institutional Desk Trader',
      meetUrl: 'https://meet.google.com/zrg-vjmk-qwy', // Dynamic Google Meet Link
      topic: 'Live chart dissection of Cumulative Volume Delta (CVD) absorption, DOM ladder spoofing, and identifying institutional trapped buyers at market highs.',
      status: 'upcoming',
      tags: ['Order Flow', 'CVD Divergence', 'Footprint Imbalances', 'DOM'],
    },
    {
      id: 'live-sun-02',
      title: 'Dark Pool Block Accumulation & VWAP Bands Execution',
      date: 'Sunday, Feb 22, 2026',
      day: 'Sunday',
      time: '11:00 AM - 01:00 PM IST',
      duration: '2 Hours Live',
      instructor: 'Senior Quantitative Strategist',
      meetUrl: 'https://meet.google.com/zrg-vjmk-qwy', // Dynamic Google Meet Link
      topic: 'Quantitative modeling of Anchored VWAP standard deviation bands, institutional gamma flips, and asymmetric risk-reward trade management.',
      status: 'upcoming',
      tags: ['Dark Pools', 'Anchored VWAP', 'Gamma Flips', 'Risk Budgeting'],
    },
  ];

  // 4. Assessment Modules (Quiz 1 and Quiz 2)
  const isQuiz1Unlocked = moduleStatus?.quiz_1_unlocked ?? true; // Enrolled students get Quiz 1
  const isQuiz2Unlocked = moduleStatus?.quiz_2_unlocked ?? false; // Unlocked after passing Quiz 1 or by instructor

  return (
    <div className="flex flex-col w-full pb-16 bg-dark-950 min-h-screen">
      
      {/* 1. STUDENT PORTAL HEADER */}
      <section className="border-b border-slate-800/80 bg-gradient-to-b from-dark-900/90 to-dark-950 pt-8 pb-10 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            
            {/* User Details */}
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-amber-500 p-[1px] shadow-xl shadow-emerald-950/50">
                <div className="flex h-full w-full items-center justify-center rounded-[15px] bg-dark-950 text-2xl font-bold text-white">
                  {user.email?.charAt(0).toUpperCase()}
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    Active Institutional Member
                  </span>
                  <span className="text-xs text-slate-400">
                    ID: #{user.id.substring(0, 8)}
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-white">
                  Welcome to MIIP Alpha Portal
                </h1>
                <p className="text-xs text-slate-400">{user.email}</p>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="flex items-center gap-3">
              <div className="px-4 py-3 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
                <span className="block text-[10px] uppercase text-slate-400 font-medium">Batch</span>
                <span className="text-sm font-bold text-amber-400">Spring Cohort</span>
              </div>
              <div className="px-4 py-3 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
                <span className="block text-[10px] uppercase text-slate-400 font-medium">Assessment Status</span>
                <span className="text-sm font-bold text-emerald-400">
                  {moduleStatus.quiz_2_score ? 'Certified (100%)' : moduleStatus.quiz_1_score ? 'Quiz 1 Passed' : 'In Progress'}
                </span>
              </div>
            </div>

          </div>

        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        
        {/* 2. UPCOMING SATURDAY & SUNDAY CLASSES (RESPONSIVE CARD-BASED LAYOUT) */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-emerald-400 mb-1">
                <Video className="h-4 w-4" />
                <span>Live Interactive Mentorship</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Upcoming Weekend Live Classes
              </h2>
            </div>
            <p className="text-xs text-slate-400">
              Interactive Google Meet sessions with real-time screen sharing & Q&A.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {liveClassSchedules.map((schedule) => (
              <LiveClassCard key={schedule.id} schedule={schedule} />
            ))}
          </div>
        </section>

        {/* 3. DYNAMIC ASSESSMENT MODULES (QUIZ 1 & QUIZ 2 UNLOCK ENGINE) */}
        <section className="space-y-6 pt-6 border-t border-slate-800/80">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-amber-400 mb-1">
                <Award className="h-4 w-4" />
                <span>Institutional Certification</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Knowledge Mastery Assessments
              </h2>
            </div>
            <p className="text-xs text-slate-400">
              Score $\ge 80\%$ to unlock subsequent institutional modules and final verification badge.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Quiz 1: Market Microstructure & Order Flow */}
            <QuizModuleCard
              quizId="quiz-1"
              title="Assessment 1: Market Microstructure & Order Flow"
              module="Core Module 01 & 02"
              description="Test your mastery on Cumulative Volume Delta (CVD), Depth of Market (DOM) absorption, and identifying institutional liquidity sweeps."
              isUnlocked={isQuiz1Unlocked}
              score={moduleStatus.quiz_1_score}
              totalQuestions={5}
              timeLimitMinutes={10}
              passingScore={80}
            />

            {/* Quiz 2: Advanced Momentum Execution & Risk Budgeting */}
            <QuizModuleCard
              quizId="quiz-2"
              title="Assessment 2: Multi-Timeframe Momentum & Risk Models"
              module="Advanced Module 03 & 04"
              description="Evaluate your execution discipline on Anchored VWAP confluence, Gamma Exposure (GEX) flips, Kelly Criterion sizing, and drawdown rules."
              isUnlocked={isQuiz2Unlocked}
              score={moduleStatus.quiz_2_score}
              totalQuestions={5}
              timeLimitMinutes={10}
              passingScore={80}
            />

          </div>
        </section>

        {/* 4. QUANTITATIVE RESOURCE VAULT & ASSETS */}
        <section className="space-y-6 pt-6 border-t border-slate-800/80">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">
              Institutional Resource Vault
            </h3>
            <p className="text-xs text-slate-400">
              Downloadable algorithmic templates, order flow quick references, and risk calculator spreadsheets.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-emerald-400 text-sm font-bold">
                  <FileText className="h-4 w-4" />
                  <span>Order Flow Cheat Sheet</span>
                </div>
                <p className="text-xs text-slate-400">
                  Quick visual reference for absorption patterns and delta divergence.
                </p>
              </div>
              <button
                type="button"
                className="btn-interactive flex items-center justify-center h-10 w-10 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-all shrink-0"
                title="Download PDF"
              >
                <Download className="h-4 w-4" />
              </button>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-amber-400 text-sm font-bold">
                  <BookOpen className="h-4 w-4" />
                  <span>Kelly Criterion Sizer</span>
                </div>
                <p className="text-xs text-slate-400">
                  Excel sheet for fractional position sizing and maximum allowable drawdown.
                </p>
              </div>
              <button
                type="button"
                className="btn-interactive flex items-center justify-center h-10 w-10 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-all shrink-0"
                title="Download Sheet"
              >
                <Download className="h-4 w-4" />
              </button>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-teal-400 text-sm font-bold">
                  <Sparkles className="h-4 w-4" />
                  <span>Discord Alpha Desk</span>
                </div>
                <p className="text-xs text-slate-400">
                  Join the private institutional trader room for daily pre-market blueprints.
                </p>
              </div>
              <a
                href="https://discord.gg"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-interactive flex items-center justify-center h-10 w-10 rounded-xl bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-600/40 transition-all shrink-0"
                title="Open Discord"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>

          </div>
        </section>

      </div>
    </div>
  );
}
