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
  TrendingUp,
  Shield
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
    redirect('/miip/free-resources?status=unpaid_member');
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
  const isQuiz1Unlocked = moduleStatus?.quiz_1_unlocked ?? true;
  const isQuiz2Unlocked = moduleStatus?.quiz_2_unlocked ?? false;

  return (
    <div className="flex flex-col w-full pb-20 bg-slate-50 min-h-screen">
      
      {/* 1. STUDENT PORTAL HEADER (BETTERMENT STYLE) */}
      <section className="bg-gradient-to-b from-[#0A358F] to-[#1456F0] text-white pt-10 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            
            {/* User Details */}
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-3xl bg-white text-blue-900 shadow-xl flex items-center justify-center text-2xl font-extrabold">
                {user.email?.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-white/20 text-white border border-white/20 backdrop-blur-sm">
                    Active Institutional Member
                  </span>
                  <span className="text-xs text-blue-200">
                    ID: #{user.id.substring(0, 8)}
                  </span>
                </div>
                <h1 className="text-xl sm:text-3xl font-extrabold text-white">
                  MIIP Alpha Student Portal
                </h1>
                <p className="text-xs text-blue-100">{user.email}</p>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="flex items-center gap-3">
              <div className="px-4 py-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-center">
                <span className="block text-[10px] uppercase text-blue-200 font-bold">Cohort</span>
                <span className="text-sm font-extrabold text-white">Spring Live Batch</span>
              </div>
              <div className="px-4 py-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-center">
                <span className="block text-[10px] uppercase text-blue-200 font-bold">Assessments</span>
                <span className="text-sm font-extrabold text-emerald-300">
                  {moduleStatus.quiz_2_score ? 'Certified (100%)' : moduleStatus.quiz_1_score ? 'Quiz 1 Passed' : 'In Progress'}
                </span>
              </div>
            </div>

          </div>

        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        
        {/* 2. UPCOMING SATURDAY & SUNDAY CLASSES */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-blue-600 mb-1">
                <Video className="h-4 w-4" />
                <span>Live Interactive Mentorship</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Upcoming Weekend Live Classes
              </h2>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Interactive Google Meet sessions with real-time screen sharing & Q&A.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {liveClassSchedules.map((schedule) => (
              <LiveClassCard key={schedule.id} schedule={schedule} />
            ))}
          </div>
        </section>

        {/* 3. DYNAMIC ASSESSMENT MODULES */}
        <section className="space-y-6 pt-6 border-t border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-amber-600 mb-1">
                <Award className="h-4 w-4" />
                <span>Institutional Certification</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Knowledge Mastery Assessments
              </h2>
            </div>
            <p className="text-xs text-slate-500 font-medium">
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

        {/* 4. QUANTITATIVE RESOURCE VAULT */}
        <section className="space-y-6 pt-6 border-t border-slate-200">
          <div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 mb-1">
              Institutional Resource Vault
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Downloadable algorithmic templates, order flow quick references, and risk calculator spreadsheets.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-md flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-blue-700 text-sm font-extrabold">
                  <FileText className="h-4 w-4" />
                  <span>Order Flow Cheat Sheet</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Quick visual reference for absorption patterns and delta divergence.
                </p>
              </div>
              <button
                type="button"
                className="btn-interactive flex items-center justify-center h-10 w-10 rounded-full bg-slate-100 text-slate-700 hover:text-slate-900 hover:bg-slate-200 transition-all shrink-0"
                title="Download PDF"
              >
                <Download className="h-4 w-4" />
              </button>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-md flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-amber-700 text-sm font-extrabold">
                  <BookOpen className="h-4 w-4" />
                  <span>Kelly Criterion Sizer</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Excel sheet for fractional position sizing and maximum drawdown controls.
                </p>
              </div>
              <button
                type="button"
                className="btn-interactive flex items-center justify-center h-10 w-10 rounded-full bg-slate-100 text-slate-700 hover:text-slate-900 hover:bg-slate-200 transition-all shrink-0"
                title="Download Sheet"
              >
                <Download className="h-4 w-4" />
              </button>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-md flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-emerald-700 text-sm font-extrabold">
                  <Sparkles className="h-4 w-4" />
                  <span>Discord Alpha Desk</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Join the private institutional trader room for daily pre-market blueprints.
                </p>
              </div>
              <a
                href="https://discord.gg"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-interactive flex items-center justify-center h-10 w-10 rounded-full bg-blue-50 text-blue-700 hover:bg-blue-100 transition-all shrink-0"
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
