'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Lock, 
  Unlock, 
  Award, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  AlertCircle, 
  BarChart3 
} from 'lucide-react';

interface QuizModuleCardProps {
  quizId: string;
  title: string;
  module: string;
  description: string;
  isUnlocked: boolean;
  score?: number | null;
  totalQuestions: number;
  timeLimitMinutes: number;
  passingScore: number;
}

export default function QuizModuleCard({
  quizId,
  title,
  module,
  description,
  isUnlocked,
  score,
  totalQuestions,
  timeLimitMinutes,
  passingScore,
}: QuizModuleCardProps) {
  const hasAttempted = typeof score === 'number' && score !== null;
  const isPassed = hasAttempted && (score as number) >= passingScore;

  return (
    <div
      className={`relative rounded-3xl border p-7 flex flex-col justify-between transition-all duration-300 ${
        isUnlocked
          ? isPassed
            ? 'bg-emerald-50/40 border-emerald-300 shadow-lg shadow-emerald-500/5'
            : 'bg-white border-slate-200/80 hover:border-blue-300 shadow-lg shadow-slate-200/50'
          : 'bg-slate-50 border-slate-200 opacity-70'
      }`}
    >
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
            {module}
          </span>

          {isUnlocked ? (
            hasAttempted ? (
              isPassed ? (
                <span className="flex items-center gap-1 text-xs font-extrabold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Passed ({score}%)
                </span>
              ) : (
                <span className="flex items-center gap-1 text-xs font-extrabold text-amber-800 bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
                  <AlertCircle className="h-3.5 w-3.5" />
                  Retry Needed ({score}%)
                </span>
              )
            ) : (
              <span className="flex items-center gap-1 text-xs font-extrabold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                <Unlock className="h-3.5 w-3.5" />
                Unlocked
              </span>
            )
          ) : (
            <span className="flex items-center gap-1 text-xs font-bold text-slate-500 bg-slate-200/60 px-3 py-1 rounded-full">
              <Lock className="h-3.5 w-3.5" />
              Locked Assessment
            </span>
          )}
        </div>

        <h4 className="text-lg font-extrabold text-slate-900 mb-2 leading-snug">
          {title}
        </h4>
        <p className="text-xs sm:text-sm text-slate-600 mb-5 leading-relaxed">
          {description}
        </p>

        {/* Assessment Stats */}
        <div className="grid grid-cols-3 gap-2 py-3 px-3 rounded-2xl bg-slate-50 border border-slate-200/60 text-center mb-6">
          <div>
            <span className="block text-[10px] uppercase text-slate-500 font-bold">Questions</span>
            <span className="text-xs sm:text-sm font-extrabold text-slate-900">{totalQuestions} MCQs</span>
          </div>
          <div>
            <span className="block text-[10px] uppercase text-slate-500 font-bold">Time Limit</span>
            <span className="text-xs sm:text-sm font-extrabold text-slate-900">{timeLimitMinutes} Mins</span>
          </div>
          <div>
            <span className="block text-[10px] uppercase text-slate-500 font-bold">Passing Bar</span>
            <span className="text-xs sm:text-sm font-extrabold text-blue-700">{passingScore}%</span>
          </div>
        </div>
      </div>

      {/* Card Action Area */}
      <div>
        {isUnlocked ? (
          <Link
            href={`/dashboard/assessments/${quizId}`}
            className="btn-interactive w-full min-h-[48px] flex items-center justify-center gap-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm shadow-md shadow-blue-600/25 transition-all hover:scale-[1.01] active:scale-[0.99]"
          >
            <Award className="h-4 w-4" />
            <span>{hasAttempted ? 'Retake Assessment' : 'Start Assessment'}</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        ) : (
          <div className="flex items-center justify-center gap-2 min-h-[48px] rounded-full bg-slate-100 border border-slate-200 text-xs text-slate-500 font-semibold cursor-not-allowed">
            <Lock className="h-4 w-4 text-slate-400" />
            <span>Unlocks after Module Completion</span>
          </div>
        )}
      </div>
    </div>
  );
}
