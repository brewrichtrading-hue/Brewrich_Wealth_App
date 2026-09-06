'use client';

import React from 'react';
import { 
  Server, 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  AlertCircle, 
  Zap,
  Key,
  Shield
} from 'lucide-react';
import { BrokerConnectionInfo } from '@/lib/brewrich-ai/types';

interface BrokersTabProps {
  brokers: BrokerConnectionInfo[];
}

export default function BrokersTab({ brokers }: BrokersTabProps) {
  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      
      {/* 1. BROKERS HEADER */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-storm-50 text-storm font-bold text-xs uppercase tracking-wider mb-2">
              <Server className="w-3.5 h-3.5 text-bumblebee-600" />
              <span>SERVER-SIDE BROKER ADAPTERS</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-storm tracking-tight">
              Institutional Broker Integrations
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Secure server-side API connectors for Dhan and Firstock. All live order placement is currently locked.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3.5 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-slate-500" />
              <span>Live Trading: LOCKED</span>
            </span>
          </div>
        </div>

        {/* BROKER CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {brokers.map((broker) => (
            <div key={broker.brokerId} className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-5 hover:border-slate-300 transition-all">
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-storm text-white flex items-center justify-center font-bold text-sm">
                    {broker.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-storm">{broker.name}</h3>
                    <span className="text-[11px] text-slate-400 font-mono">ID: {broker.maskedClientId}</span>
                  </div>
                </div>

                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  {broker.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-200 text-xs">
                <div>
                  <span className="text-slate-400 text-[11px] block">Auth Status</span>
                  <span className="font-semibold text-storm">{broker.authStatus}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block">Execution Gate</span>
                  <span className="font-bold text-joyous flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    {broker.tradingStatus}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block">Last Verification</span>
                  <span className="font-semibold text-slate-600">{broker.lastVerified}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block">Rate Limit Tier</span>
                  <span className="font-semibold text-slate-600">{broker.rateLimitStatus}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white border border-slate-200 text-[11px] text-slate-500 flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Zero client secrets. Tokens and sessions remain exclusively in protected server-side memory.</span>
              </div>

            </div>
          ))}

        </div>
      </div>

      {/* 2. BROKER ARCHITECTURE NOTICE */}
      <div className="rounded-3xl bg-blue-50/60 border border-blue-200/80 p-6 flex flex-col sm:flex-row items-start gap-4 text-xs">
        <div className="w-10 h-10 rounded-2xl bg-storm text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
          <ShieldCheck className="w-5 h-5 text-bumblebee" />
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-storm">Strict Broker Boundary Isolation</h4>
          <p className="text-slate-600 leading-relaxed">
            Brewrich AI communicates with Dhan and Firstock only through server-side authenticated gateways. 
            The browser never receives API keys, vendor tokens, TOTP secrets, or direct order placement capabilities.
          </p>
        </div>
      </div>

    </div>
  );
}
