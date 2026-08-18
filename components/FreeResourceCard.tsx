'use client';

import React from 'react';
import { Download, BookOpen, CheckCircle2, FileText, Sparkles, ArrowDownToLine, Lock, Unlock } from 'lucide-react';

interface FreeResourceCardProps {
  id: string;
  badge: string;
  badgeColor: 'blue' | 'amber';
  title: string;
  subtitle: string;
  description: string;
  pdfUrl: string;
  fileSize: string;
  pageCount: string;
  highlights: string[];
  gradientTheme: string;
  accentColor: string;
  coverImageTheme: 'risk' | 'chart';
  isUnlocked?: boolean;
  onUnlockRequest?: () => void;
}

export default function FreeResourceCard({
  badge,
  badgeColor,
  title,
  subtitle,
  description,
  pdfUrl,
  fileSize,
  pageCount,
  highlights,
  gradientTheme,
  accentColor,
  coverImageTheme,
  isUnlocked = false,
  onUnlockRequest,
}: FreeResourceCardProps) {
  return (
    <div className="relative rounded-3xl bg-slate-900/90 border border-slate-800 p-6 sm:p-8 shadow-2xl shadow-slate-950 flex flex-col justify-between hover:border-slate-700 transition-all group overflow-hidden">
      
      {/* Subtle Ambient Background Light */}
      <div className={`absolute top-0 right-0 w-72 h-72 rounded-full blur-3xl pointer-events-none opacity-20 ${gradientTheme}`} />

      <div className="space-y-6 relative z-10">
        
        {/* Top Header & Badge */}
        <div className="flex items-center justify-between gap-2">
          <span className={`text-[11px] font-extrabold uppercase tracking-wider px-3.5 py-1.5 rounded-full border ${
            badgeColor === 'amber'
              ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
              : 'bg-blue-500/15 text-blue-300 border-blue-500/30'
          }`}>
            {badge}
          </span>

          <div className="flex items-center gap-2">
            {isUnlocked ? (
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                <Unlock className="h-3 w-3" />
                <span>Unlocked</span>
              </span>
            ) : (
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/30 flex items-center gap-1">
                <Lock className="h-3 w-3" />
                <span>Locked</span>
              </span>
            )}
            <span className="text-[11px] font-semibold text-slate-400 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700">
              {pageCount} • {fileSize}
            </span>
          </div>
        </div>

        {/* 3D Visual Book Mockup Container */}
        <div className="py-2 flex justify-center">
          <div className="relative w-full max-w-[260px] aspect-[4/5] rounded-2xl p-5 flex flex-col justify-between shadow-2xl transition-transform duration-300 group-hover:scale-[1.03] border border-white/10 overflow-hidden bg-gradient-to-br from-slate-900 via-[#0A1936] to-[#040C1D]">
            
            {/* Glossy Book Sheen Overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 pointer-events-none" />
            
            {/* Book Spine Left Strip */}
            <div className="absolute left-0 top-0 bottom-0 w-3.5 bg-gradient-to-r from-black/40 via-white/10 to-transparent border-r border-white/5" />

            {/* Book Header */}
            <div className="pl-2 space-y-1">
              <div className="flex items-center gap-1.5">
                <div className="h-5 w-5 rounded bg-blue-600/80 flex items-center justify-center text-[10px] font-extrabold text-white">
                  B
                </div>
                <span className="text-[9px] font-extrabold tracking-widest text-slate-300 uppercase">
                  BREWRICH WEALTH
                </span>
              </div>
              <p className="text-[8px] font-bold text-amber-400 uppercase tracking-wider">
                Proprietary Study Edition
              </p>
            </div>

            {/* Book Center Title Graphics */}
            <div className="pl-2 my-auto space-y-1.5">
              <div className="inline-block p-2 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm mb-1">
                <BookOpen className={`h-6 w-6 ${badgeColor === 'amber' ? 'text-amber-400' : 'text-blue-400'}`} />
              </div>
              <h4 className="text-base font-extrabold text-white leading-tight tracking-tight drop-shadow-md">
                {title}
              </h4>
              <p className="text-[10px] text-slate-300 font-medium leading-snug line-clamp-2">
                {subtitle}
              </p>
            </div>

            {/* Book Footer */}
            <div className="pl-2 pt-2 border-t border-white/10 flex items-center justify-between text-[8px] text-slate-400">
              <span className="font-bold text-slate-300">By Yogesh Nath S</span>
              {isUnlocked ? (
                <span className="font-mono text-emerald-400 font-extrabold flex items-center gap-1">
                  ✓ READY
                </span>
              ) : (
                <span className="font-mono text-amber-400 font-extrabold flex items-center gap-1">
                  🔒 ACCESS REQUIRED
                </span>
              )}
            </div>

          </div>
        </div>

        {/* Book Description */}
        <div>
          <h3 className="text-xl font-extrabold text-white tracking-tight">
            {title}
          </h3>
          <p className="text-xs text-blue-400 font-semibold mt-0.5">
            {subtitle}
          </p>
          <p className="text-xs text-slate-300 leading-relaxed mt-2.5">
            {description}
          </p>
        </div>

        {/* Chapter / Topic Highlights */}
        <div className="space-y-2 pt-2 border-t border-slate-800/80">
          <p className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">
            Included In This Guide:
          </p>
          <div className="space-y-1.5">
            {highlights.map((h, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-slate-300 font-medium">
                <CheckCircle2 className={`h-4 w-4 shrink-0 mt-0.5 ${badgeColor === 'amber' ? 'text-amber-400' : 'text-emerald-400'}`} />
                <span>{h}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Action Area */}
      <div className="pt-6 mt-6 border-t border-slate-800/80 relative z-10 space-y-2.5">
        {isUnlocked ? (
          <a
            href={pdfUrl}
            download
            target="_blank"
            rel="noopener noreferrer"
            className={`btn-interactive w-full min-h-[50px] flex items-center justify-center gap-2.5 rounded-full font-extrabold text-sm shadow-xl transition-all hover:scale-[1.01] active:scale-[0.99] animate-in fade-in ${
              badgeColor === 'amber'
                ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/25 ring-2 ring-amber-400/40'
                : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/30 ring-2 ring-blue-400/40'
            }`}
          >
            <ArrowDownToLine className="h-4 w-4" />
            <span>Instant Download PDF ({fileSize})</span>
          </a>
        ) : (
          <button
            type="button"
            onClick={onUnlockRequest}
            className={`btn-interactive w-full min-h-[50px] flex items-center justify-center gap-2.5 rounded-full font-extrabold text-sm shadow-xl transition-all hover:scale-[1.01] active:scale-[0.99] ${
              badgeColor === 'amber'
                ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20'
                : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/30'
            }`}
          >
            <Lock className="h-4 w-4" />
            <span>Unlock Free Download ({fileSize})</span>
          </button>
        )}

        <div className="flex items-center justify-center gap-3 text-[11px] text-slate-400 font-semibold">
          <span className="flex items-center gap-1">
            <Sparkles className="h-3 w-3 text-amber-400" />
            <span>{isUnlocked ? 'Direct Download Active' : 'Free Registration Required'}</span>
          </span>
          <span>•</span>
          <span>Zero Payment Required</span>
        </div>
      </div>

    </div>
  );
}