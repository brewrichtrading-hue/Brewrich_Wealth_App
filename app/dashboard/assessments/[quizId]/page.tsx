'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { QuizData, QuizQuestion } from '@/lib/types';
import confetti from 'canvas-confetti';
import { 
  Award, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  ArrowLeft, 
  Clock, 
  AlertCircle, 
  RotateCcw,
  Sparkles,
  ShieldCheck
} from 'lucide-react';

const QUIZ_DATABASE: Record<string, QuizData> = {
  'quiz-1': {
    id: 'quiz-1',
    title: 'Assessment 1: Market Microstructure & Order Flow',
    module: 'Core Module 01 & 02',
    description: 'Evaluate your understanding of DOM depth, footprint imbalances, CVD divergence, and institutional liquidity sweeps.',
    passingScore: 80,
    timeLimitMinutes: 10,
    questions: [
      {
        id: 1,
        question: 'When Cumulative Volume Delta (CVD) makes lower lows while price pushes higher into resistance, what does this institutional divergence indicate?',
        options: [
          'Aggressive buyers are dominating the auction and a massive rally is imminent',
          'Passive limit sellers are absorbing aggressive buy market orders, signaling exhaustive buying and potential reversal',
          'Dark pool orders have been completely cancelled',
          'Market makers are widening spreads due to lack of volume',
        ],
        correctAnswer: 1,
        explanation: 'Delta divergence occurs when retail aggressive market buys are absorbed by institutional passive limit sell orders at resistance.',
      },
      {
        id: 2,
        question: 'What does a "stacked buy imbalance" (diagonal ratio >= 300%) on a footprint chart typically signify?',
        options: [
          'High retail fear and panic selling',
          'Aggressive institutional initiative buying lifting multiple consecutive offer price levels',
          'Arbitrage traders closing spread positions',
          'A failed auction requiring immediate liquidation',
        ],
        correctAnswer: 1,
        explanation: 'Stacked buy imbalances reflect consecutive price tiers where aggressive buyers overwhelm the ask, showing institutional urgency.',
      },
      {
        id: 3,
        question: 'How do institutional execution algorithms (e.g. TWAP/VWAP) minimize market impact when building massive positions?',
        options: [
          'By placing one single colossal market order at 09:15 AM',
          'By slicing the parent order into thousands of micro child orders pegged to historical liquidity distribution',
          'By broadcasting intentions on public order books',
          'By only trading illiquid penny stocks',
        ],
        correctAnswer: 1,
        explanation: 'Institutional execution algos fragment large block orders over time to match benchmark VWAP curves without causing slippage.',
      },
      {
        id: 4,
        question: 'In Auction Market Theory, what happens when price moves beyond the Value Area High (VAH) on high volume and expanding delta?',
        options: [
          'Mean reversion back to Point of Control (POC) is guaranteed',
          'The market has accepted new higher prices and initiated a directional trend auction',
          'The exchange halts trading for review',
          'Delta neutral options strategies must be initiated immediately',
        ],
        correctAnswer: 1,
        explanation: 'High-volume breakout beyond Value Area represents price discovery and buyer initiative taking control outside previous value.',
      },
      {
        id: 5,
        question: 'What is the structural role of resting limit orders on the Depth of Market (DOM)?',
        options: [
          'They provide liquidity to the market and act as support/resistance walls until filled or pulled',
          'They instantly execute at the current market price without queuing',
          'They are only visible to retail brokers',
          'They determine the daily opening price exclusively',
        ],
        correctAnswer: 0,
        explanation: 'Resting limit orders represent passive liquidity waiting to match with incoming aggressive market orders.',
      },
    ],
  },
  'quiz-2': {
    id: 'quiz-2',
    title: 'Assessment 2: Multi-Timeframe Momentum & Risk Models',
    module: 'Advanced Module 03 & 04',
    description: 'Test your execution discipline on Anchored VWAP confluence, Gamma Exposure (GEX) flips, Kelly Criterion sizing, and drawdown rules.',
    passingScore: 80,
    timeLimitMinutes: 10,
    questions: [
      {
        id: 1,
        question: 'What makes Anchored VWAP (AVWAP) from a major earnings announcement or swing low an institutional benchmark?',
        options: [
          'It is just an ordinary 20-period moving average',
          'It measures the exact average price paid per share weighted by volume since that specific catalyst event',
          'It predicts the precise close of the weekly bar',
          'It only tracks retail broker transactions',
        ],
        correctAnswer: 1,
        explanation: 'Anchored VWAP computes the volume-weighted average price from a defining market event, representing the breakeven benchmark for all participants since that point.',
      },
      {
        id: 2,
        question: 'When an index is in a Positive Gamma (Long Gamma) environment, how does market maker hedging affect price volatility?',
        options: [
          'Market makers buy dips and sell rips to re-hedge delta, dampening overall intraday volatility',
          'Market makers aggressively chase breakouts, increasing volatility exponentially',
          'The entire exchange experiences sudden flash crashes',
          'Gamma has zero correlation with market dealer hedging',
        ],
        correctAnswer: 0,
        explanation: 'In positive gamma regimes, dealers buy into market weakness and sell into market strength to stay delta-neutral, creating mean-reverting conditions.',
      },
      {
        id: 3,
        question: 'Why do institutional prop trading desks use Half-Kelly (0.5k) rather than Full-Kelly for position sizing?',
        options: [
          'Because Full-Kelly guarantees 100% loss of capital on day one',
          'Half-Kelly achieves ~75% of maximum compounding growth rate with an 80% reduction in account drawdown volatility',
          'Half-Kelly is a mandatory SEBI regulatory restriction',
          'Because it eliminates the need to calculate probability of win',
        ],
        correctAnswer: 1,
        explanation: 'Fractional Kelly sizing offers near-optimal geometric growth while drastically smoothing drawdown curves and protecting against parameter estimation errors.',
      },
      {
        id: 4,
        question: 'What is the most critical confirmation when trading an Opening Range Breakout (ORB) on an institutional momentum setup?',
        options: [
          'Price just crosses the 5-minute high regardless of volume',
          'Opening volume > 200% of 20-day average with positive CVD and expansion of relative strength against the benchmark index',
          'Social media sentiment trending bullish',
          'RSI indicator crossing above 50 on 1-minute chart',
        ],
        correctAnswer: 1,
        explanation: 'Institutional momentum requires high relative volume (RVOL), aggressive volume delta, and sector/index beta leadership.',
      },
      {
        id: 5,
        question: 'Under institutional risk budgeting, what is the mandatory protocol when a trader reaches their maximum weekly drawdown threshold (e.g. -5%)?',
        options: [
          'Double position size on the next trade to recover losses rapidly',
          'Halt all active trading, reduce risk-per-trade by 50%, and conduct a full trade journal audit with the risk manager',
          'Switch immediately to trading illiquid penny stock options',
          'Change brokers and ignore the rule',
        ],
        correctAnswer: 1,
        explanation: 'Disciplined drawdown protocols de-risk the account and enforce psychological detachment before resumed execution.',
      },
    ],
  },
};

export default function AssessmentPage() {
  const params = useParams();
  const router = useRouter();
  const quizId = (params.quizId as string) || 'quiz-1';
  const quiz = QUIZ_DATABASE[quizId] || QUIZ_DATABASE['quiz-1'];

  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [scorePercentage, setScorePercentage] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [unlockedNext, setUnlockedNext] = useState(false);

  const handleSelect = (questionIndex: number, optionIndex: number) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionIndex]: optionIndex,
    }));
  };

  const handleSubmit = async () => {
    let correctCount = 0;
    quiz.questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctAnswer) {
        correctCount++;
      }
    });

    const calculatedScore = Math.round((correctCount / quiz.questions.length) * 100);
    setScorePercentage(calculatedScore);
    setIsSubmitted(true);
    setSubmitting(true);

    if (calculatedScore >= quiz.passingScore) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10b981', '#f59e0b', '#34d399', '#ffffff'],
      });
    }

    try {
      const res = await fetch('/api/quiz/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quizId: quiz.id,
          score: calculatedScore,
        }),
      });
      const data = await res.json();
      if (data.unlockedNext) {
        setUnlockedNext(true);
      }
    } catch (e) {
      console.error('Failed to submit quiz score:', e);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRetake = () => {
    setSelectedAnswers({});
    setIsSubmitted(false);
    setScorePercentage(0);
    setUnlockedNext(false);
  };

  const answeredCount = Object.keys(selectedAnswers).length;
  const isAllAnswered = answeredCount === quiz.questions.length;
  const isPassed = scorePercentage >= quiz.passingScore;

  return (
    <div className="flex flex-col w-full pb-16 bg-dark-950 min-h-screen">
      
      {/* Top Breadcrumb Header */}
      <div className="border-b border-slate-800/80 bg-slate-900/60 py-4 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl flex items-center justify-between">
          <Link
            href="/dashboard"
            className="btn-interactive flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Return to Student Dashboard</span>
          </Link>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Clock className="h-3.5 w-3.5 text-amber-400" />
            <span>Time Limit: {quiz.timeLimitMinutes} Mins</span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Assessment Overview Card */}
        <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30">
              {quiz.module}
            </span>
            <span className="text-xs text-slate-400 font-medium">
              Passing Benchmark: <strong className="text-amber-400">{quiz.passingScore}%</strong>
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            {quiz.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            {quiz.description}
          </p>

          {/* Progress Tracker */}
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>
              Progress: <strong className="text-white">{answeredCount} of {quiz.questions.length} Answered</strong>
            </span>
            <span className="text-emerald-400 font-semibold">
              {Math.round((answeredCount / quiz.questions.length) * 100)}% Complete
            </span>
          </div>
        </div>

        {/* Score Report Header if Submitted */}
        {isSubmitted && (
          <div
            className={`p-6 sm:p-8 rounded-2xl border animate-in zoom-in-95 duration-300 space-y-4 ${
              isPassed
                ? 'bg-emerald-950/30 border-emerald-500/50 shadow-xl shadow-emerald-950/40'
                : 'bg-amber-950/30 border-amber-500/50 shadow-xl shadow-amber-950/40'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div
                  className={`h-16 w-16 rounded-2xl flex items-center justify-center text-3xl font-extrabold ${
                    isPassed
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  }`}
                >
                  {scorePercentage}%
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">
                    {isPassed ? 'Assessment Passed!' : 'Benchmark Not Met'}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300">
                    {isPassed
                      ? `Congratulations! You scored ${scorePercentage}% (Passing bar: ${quiz.passingScore}%).`
                      : `You scored ${scorePercentage}%. Review the rationales below and retake to achieve 80%+`}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleRetake}
                  className="btn-interactive flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
                >
                  <RotateCcw className="h-4 w-4" />
                  <span>Retake Assessment</span>
                </button>

                {quiz.id === 'quiz-1' && isPassed && (
                  <Link
                    href="/dashboard/assessments/quiz-2"
                    className="btn-interactive flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 text-white text-xs font-bold shadow-lg"
                  >
                    <span>Proceed to Quiz 2</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Question List */}
        <div className="space-y-6">
          {quiz.questions.map((q, qIndex) => {
            const selectedOpt = selectedAnswers[qIndex];
            const isAnswered = typeof selectedOpt === 'number';

            return (
              <div
                key={q.id}
                className="p-6 sm:p-8 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <h4 className="text-base sm:text-lg font-bold text-white leading-snug">
                    <span className="text-emerald-400 mr-2">Q{qIndex + 1}.</span>
                    {q.question}
                  </h4>
                </div>

                {/* Option List */}
                <div className="space-y-2.5 pt-2">
                  {q.options.map((opt, optIndex) => {
                    const isSelected = selectedOpt === optIndex;
                    let optionStyle = 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800/60';

                    if (isSubmitted) {
                      if (optIndex === q.correctAnswer) {
                        optionStyle = 'bg-emerald-950/50 border-emerald-500 text-emerald-200';
                      } else if (isSelected && optIndex !== q.correctAnswer) {
                        optionStyle = 'bg-red-950/50 border-red-500 text-red-200';
                      }
                    } else if (isSelected) {
                      optionStyle = 'bg-emerald-950/60 border-emerald-400 text-white shadow-md shadow-emerald-950/40';
                    }

                    return (
                      <button
                        key={optIndex}
                        type="button"
                        onClick={() => handleSelect(qIndex, optIndex)}
                        disabled={isSubmitted}
                        className={`btn-interactive w-full text-left p-4 rounded-xl border transition-all flex items-start gap-3 ${optionStyle}`}
                      >
                        <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-slate-800/80 text-xs font-bold text-slate-300 shrink-0 mt-0.5">
                          {String.fromCharCode(65 + optIndex)}
                        </span>
                        <span className="text-xs sm:text-sm leading-relaxed flex-1">
                          {opt}
                        </span>

                        {isSubmitted && optIndex === q.correctAnswer && (
                          <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
                        )}
                        {isSubmitted && isSelected && optIndex !== q.correctAnswer && (
                          <XCircle className="h-5 w-5 text-red-400 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Question Explanation if Submitted */}
                {isSubmitted && (
                  <div className="mt-4 p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-1">
                    <p className="font-bold text-amber-400">Institutional Strategy Rationale:</p>
                    <p className="leading-relaxed">{q.explanation}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Submit Bottom Bar */}
        {!isSubmitted && (
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-400 text-center sm:text-left">
              <span>{isAllAnswered ? 'All questions answered! Click submit to calculate score.' : `Please complete all ${quiz.questions.length} questions before submitting.`}</span>
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={!isAllAnswered || submitting}
              className="btn-interactive w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold text-sm shadow-xl shadow-emerald-950/50 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {submitting ? 'Calculating Score...' : 'Submit Assessment'}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
