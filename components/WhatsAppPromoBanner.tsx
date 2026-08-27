'use client';

import React, { useState } from 'react';
import { 
  MessageCircle, 
  Sparkles, 
  ArrowRight, 
  TrendingUp, 
  Radio, 
  Bell, 
  ShieldCheck, 
  X,
  Zap
} from 'lucide-react';

const WHATSAPP_CHANNEL_URL = 'https://whatsapp.com/channel/0029VbBGuNtHFxPACzxaXg3d';

interface WhatsAppPromoProps {
  variant?: 'ticker' | 'floating' | 'card' | 'compact';
  title?: string;
  subtitle?: string;
  className?: string;
}

// 1. Top Announcement Ticker Bar
export function WhatsAppTicker() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="relative bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950 border-b border-blue-500/30 text-white px-3 sm:px-4 py-2.5 z-50 text-xs sm:text-sm font-medium shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <span className="flex h-2 w-2 relative shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold uppercase tracking-wider shrink-0 border border-emerald-500/30">
            <Radio className="h-3 w-3 animate-pulse" />
            <span>Live Channel</span>
          </div>

          <p className="truncate text-slate-200">
            <strong className="text-white font-bold">Brewrich Alpha Desk:</strong> Daily market levels, live weekend class links & institutional momentum breakdowns.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <a
            href={WHATSAPP_CHANNEL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-sm transition-all hover:scale-105 active:scale-95"
          >
            <MessageCircle className="h-3.5 w-3.5 fill-current" />
            <span className="hidden sm:inline">Join WhatsApp Channel</span>
            <span className="sm:hidden">Join</span>
            <ArrowRight className="h-3 w-3" />
          </a>

          <button
            onClick={() => setDismissed(true)}
            aria-label="Dismiss banner"
            className="p-1 text-slate-400 hover:text-white rounded-md transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

// 2. Floating Bottom-Right Pulse Pill
export function WhatsAppFloatingPill() {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center group">
      <a
        href={WHATSAPP_CHANNEL_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2.5 pl-3.5 pr-4 py-3 rounded-full bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-2xl shadow-emerald-950/60 border border-emerald-400/40 backdrop-blur-lg transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 active:scale-95"
      >
        <div className="relative flex items-center justify-center">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-40" />
          <MessageCircle className="h-5 w-5 fill-current text-white relative z-10" />
        </div>
        <div className="flex flex-col text-left">
          <span className="text-[10px] uppercase font-extrabold tracking-wider text-emerald-100 leading-none">
            Brewrich Channel
          </span>
          <span className="text-xs font-black text-white leading-tight">
            Get Market Alpha &rarr;
          </span>
        </div>
      </a>
    </div>
  );
}

// 3. Rich Inline Conversion Banner Card
export function WhatsAppInlineBanner({
  title = "Join the Official Brewrich WhatsApp Channel",
  subtitle = "Direct access to daily market microstructure setups, weekend live class reminders, and institutional momentum strategies.",
  className = "",
}: {
  title?: string;
  subtitle?: string;
  className?: string;
}) {
  return (
    <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-blue-950 border border-blue-500/30 p-6 sm:p-8 lg:p-10 shadow-2xl shadow-black/60 ${className}`}>
      
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        
        <div className="space-y-4 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <Zap className="h-3.5 w-3.5" />
            <span>Instant Alpha & Live Broadcasts</span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug">
            {title}
          </h3>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            {subtitle}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 text-xs text-slate-200">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span>Pre-market index & sector blueprints</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span>Real-time Order Flow & Dark Pool alerts</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span>Saturday/Sunday Google Meet class links</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span>Zero spam • 100% curated institutional insights</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center gap-3 shrink-0">
          <a
            href={WHATSAPP_CHANNEL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-interactive flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-base shadow-xl shadow-emerald-950/60 transition-all hover:scale-105 active:scale-95 text-center"
          >
            <MessageCircle className="h-5 w-5 fill-current" />
            <span>Join Free Channel Now</span>
            <ArrowRight className="h-5 w-5" />
          </a>

          <span className="text-center text-[11px] text-slate-400">
            Free forever • Over 1,000+ active traders
          </span>
        </div>

      </div>
    </div>
  );
}

// 4. Compact Banner for sidebars or concise sections
export function WhatsAppCompactBanner({ className = "" }: { className?: string }) {
  return (
    <div className={`rounded-2xl bg-slate-900 border border-emerald-500/30 p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl ${className}`}>
      <div className="flex items-center gap-3.5">
        <div className="h-12 w-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
          <MessageCircle className="h-6 w-6 fill-current" />
        </div>
        <div>
          <h4 className="font-bold text-white text-sm">Join Official WhatsApp Channel</h4>
          <p className="text-xs text-slate-400">Instant market updates, Google Meet links & alpha signals.</p>
        </div>
      </div>

      <a
        href={WHATSAPP_CHANNEL_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-interactive px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md transition-all shrink-0 text-center w-full sm:w-auto"
      >
        Join Channel &rarr;
      </a>
    </div>
  );
}

export default function WhatsAppPromoBanner({
  variant = 'card',
  title,
  subtitle,
  className,
}: WhatsAppPromoProps) {
  if (variant === 'ticker') return <WhatsAppTicker />;
  if (variant === 'floating') return <WhatsAppFloatingPill />;
  if (variant === 'compact') return <WhatsAppCompactBanner className={className} />;
  return <WhatsAppInlineBanner title={title} subtitle={subtitle} className={className} />;
}
