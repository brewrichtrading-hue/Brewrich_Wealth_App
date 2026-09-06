'use client';

import React, { useState } from 'react';
import { Lock, ShieldCheck, Sparkles, AlertCircle, ArrowRight } from 'lucide-react';

interface BrewrichAiAuthModalProps {
  isOpen: boolean;
  onSuccess: (email: string) => void;
  onCancel?: () => void;
}

export default function BrewrichAiAuthModal({ isOpen, onSuccess }: BrewrichAiAuthModalProps) {
  const [email, setEmail] = useState('wealth@brewrich.in');
  const [password, setPassword] = useState('••••••••••••');
  const [otp, setOtp] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/brewrich-ai/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, otp }),
      });

      const data = await res.json();
      if (data.success) {
        onSuccess(email);
      } else {
        setError(data.error || 'Authentication failed. Please verify credentials.');
      }
    } catch {
      setError('Connection error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-storm/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-[#FEFEFE] rounded-3xl border border-storm-100 shadow-2xl p-8 sm:p-10 text-storm overflow-hidden">
        
        {/* Subtle Brand Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-storm via-bumblebee to-storm" />

        {/* Header */}
        <div className="text-center space-y-2 mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-storm-50 border border-storm-100 text-storm font-bold text-xs uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-bumblebee-600" />
            <span>Personal Wealth Cockpit</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-storm">
            BREWRICH AI
          </h2>

          <p className="text-xs sm:text-sm text-slate-500 font-normal">
            Private quantitative wealth platform. Authenticate to enter the cockpit.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-storm mb-1.5 uppercase tracking-wider">
              Principal Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold text-storm focus:outline-none focus:ring-2 focus:ring-storm focus:border-transparent transition-all"
              placeholder="wealth@brewrich.in"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-storm mb-1.5 uppercase tracking-wider">
              Master Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold text-storm focus:outline-none focus:ring-2 focus:ring-storm focus:border-transparent transition-all"
              placeholder="••••••••••••"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-storm uppercase tracking-wider">
                2FA Authenticator Code <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                2FA Ready
              </span>
            </div>
            <input
              type="text"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-mono font-bold tracking-widest text-storm focus:outline-none focus:ring-2 focus:ring-storm focus:border-transparent transition-all"
              placeholder="6-digit TOTP code"
            />
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-joyous-50 border border-joyous-200 text-joyous text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 py-3.5 px-6 rounded-2xl bg-storm hover:bg-storm-800 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-storm/20 transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {isSubmitting ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Enter Cockpit</span>
                <ArrowRight className="w-4 h-4 text-bumblebee" />
              </>
            )}
          </button>
        </form>

        {/* Security Notice */}
        <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1">
            <Lock className="w-3 h-3 text-slate-400" />
            Encrypted Session
          </span>
          <span className="font-semibold text-slate-500">Live Trading: 🔒 Locked</span>
        </div>

      </div>
    </div>
  );
}
