'use client';

import React, { useState } from 'react';
import { 
  ClipboardList, 
  Search, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  Info,
  Clock
} from 'lucide-react';
import { AuditLogEvent } from '@/lib/brewrich-ai/types';

interface AuditLogTabProps {
  logs: AuditLogEvent[];
}

export default function AuditLogTab({ logs }: AuditLogTabProps) {
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          log.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'ALL' || log.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      
      {/* 1. AUDIT LOG HEADER */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-storm-50 text-storm font-bold text-xs uppercase tracking-wider mb-2">
              <ClipboardList className="w-3.5 h-3.5 text-bumblebee-600" />
              <span>APPEND-ORIENTED EVENT REGISTER</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-storm tracking-tight">
              Operational Audit & Security Log
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Immutable record of strategy evaluations, paper order dispatches, authentication events, and safety circuit checks.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3.5 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Zero Credential Exposure Verified</span>
            </span>
          </div>
        </div>

        {/* SEARCH & CATEGORY CONTROLS */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search event ID, action, or details..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-storm focus:outline-none focus:ring-2 focus:ring-storm transition-all"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5 self-start sm:self-auto text-xs">
            {['ALL', 'AUTH', 'STRATEGY', 'PAPER_EXECUTION', 'BROKER', 'SAFETY'].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                  filterCategory === cat
                    ? 'bg-storm text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* LOGS TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-3">Event ID</th>
                <th className="p-3">Timestamp</th>
                <th className="p-3">Category</th>
                <th className="p-3">Action</th>
                <th className="p-3">Details</th>
                <th className="p-3 text-center">Severity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-3 font-mono font-bold text-storm">{log.id}</td>
                    <td className="p-3 text-slate-500 font-mono text-[11px]">{log.timestamp}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold">
                        {log.category}
                      </span>
                    </td>
                    <td className="p-3 font-bold text-storm">{log.action}</td>
                    <td className="p-3 text-slate-600 max-w-md">{log.details}</td>
                    <td className="p-3 text-center">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        log.severity === 'SUCCESS' ? 'bg-emerald-100 text-emerald-800' :
                        log.severity === 'WARNING' ? 'bg-amber-100 text-amber-900' :
                        log.severity === 'CRITICAL' ? 'bg-rose-100 text-rose-900' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {log.severity}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400 text-xs font-semibold">
                    No audit records matching search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
