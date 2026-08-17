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
      className={`relative rounded-2xl border p-6 flex flex-col justify-between transition-all duration-300 ${
        isUnlocked
          ? isPassed
            ? 'bg-emerald-950/20 border-emerald-500/40 shadow-lg shadow-emerald-950/30'
            : 'bg-slate-900/80 border-slate-700/80 hover:border-emerald-500/50 shadow-lg'
          : 'bg-slate-950/60 border-slate-800/60 opacity-75'
      }`}
    >
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
            {module}
          </span>

          {isUnlocked ? (
            hasAttempted ? (
              isPassed ? (
                <span className="flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Passed ({score}%)
                </span>
              ) : (
                <span className="flex items-center gap-1 text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/30">
                  <AlertCircle className="h-3.5 w-3.5" />
                  Retry Needed ({score}%)
                </span>
              )
            ) : (
              <span className="flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30">
                <Unlock className="h-3.5 w-3.5" />
                Unlocked
              </span>
            )
          ) : (
            <span className="flex items-center gap-1 text-xs font-bold text-slate-400 bg-slate-900 px-2.5 py-1 rounded-full border border-slate-800">
              <Lock className="h-3.5 w-3.5" />
              Locked Assessment
            </span>
          )}
        </div>

        <h4 className="text-lg font-bold text-white mb-2 leading-snug">
          {title}
        </h4>
        <p className="text-xs sm:text-sm text-slate-400 mb-5 leading-relaxed">
          {description}
        </p>

        {/* Assessment Stats */}
        <div className="grid grid-cols-3 gap-2 py-3 px-3 rounded-xl bg-slate-900/60 border border-slate-800/80 text-center mb-6">
          <div>
            <span className="block text-[10px] uppercase text-slate-400 font-medium">Questions</span>
            <span className="text-xs sm:text-sm font-bold text-white">{totalQuestions} MCQs</span>
          </div>
          <div>
            <span className="block text-[10px] uppercase text-slate-400 font-medium">Time Limit</span>
            <span className="text-xs sm:text-sm font-bold text-white">{timeLimitMinutes} Mins</span>
          </div>
          <div>
            <span className="block text-[10px] uppercase text-slate-400 font-medium">Passing Bar</span>
            <span className="text-xs sm:text-sm font-bold text-amber-400">{passingScore}%</span>
          </div>
        </div>
      </div>

      {/* Card Action Area */}
      <div>
        {isUnlocked ? (
          <Link
            href={`/dashboard/assessments/${quizId}`}
            className="btn-interactive w-full min-h-[48px] flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold text-sm shadow-md shadow-emerald-950/50 transition-all hover:scale-[1.01] active:scale-[0.99]"
          >
            <Award className="h-4 w-4" />
            <span>{hasAttempted ? 'Retake Assessment' : 'Start Assessment'}</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        ) : (
          <div className="flex items-center justify-center gap-2 min-h-[48px] rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400 font-medium cursor-not-allowed">
            <Lock className="h-4 w-4 text-slate-400" />
            <span>Unlocks after Module Completion in Live Class</span>
          </div>
        )}
      </div>
    </div>
  );
}
