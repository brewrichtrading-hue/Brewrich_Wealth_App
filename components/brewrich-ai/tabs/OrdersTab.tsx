'use client';

import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  Filter, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  ArrowUpRight, 
  ArrowDownRight 
} from 'lucide-react';
import { PaperOrder } from '@/lib/brewrich-ai/types';

interface OrdersTabProps {
  orders: PaperOrder[];
}

export default function OrdersTab({ orders }: OrdersTabProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSide, setFilterSide] = useState<'ALL' | 'BUY' | 'SELL'>('ALL');

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.symbol.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          order.reason.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSide = filterSide === 'ALL' || order.side === filterSide;
    return matchesSearch && matchesSide;
  });

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      
      {/* 1. ORDERS HEADER */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-storm-50 text-storm font-bold text-xs uppercase tracking-wider mb-2">
              <FileText className="w-3.5 h-3.5 text-bumblebee-600" />
              <span>SIMULATED PAPER ORDER BOOK</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-storm tracking-tight">
              Paper Execution Order Book
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Deterministic transaction log verifying idempotency, execution prices, and strategy trigger justifications.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Duplicate Protection Active</span>
            </span>
          </div>
        </div>

        {/* SEARCH & FILTER CONTROLS */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search symbol, Order ID, or reason..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-storm focus:outline-none focus:ring-2 focus:ring-storm transition-all"
            />
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="text-xs font-semibold text-slate-400">Action:</span>
            {(['ALL', 'BUY', 'SELL'] as const).map((side) => (
              <button
                key={side}
                onClick={() => setFilterSide(side)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  filterSide === side
                    ? 'bg-storm text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {side}
              </button>
            ))}
          </div>
        </div>

        {/* ORDERS TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-3">Order ID</th>
                <th className="p-3">Timestamp</th>
                <th className="p-3">Action</th>
                <th className="p-3">Security</th>
                <th className="p-3 text-right">Quantity</th>
                <th className="p-3 text-right">Execution Price</th>
                <th className="p-3 text-right">Total Value</th>
                <th className="p-3">Trigger Reason</th>
                <th className="p-3 text-center">Execution Mode</th>
                <th className="p-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr key={order.orderId} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-3 font-mono font-bold text-storm">{order.orderId}</td>
                    <td className="p-3 text-slate-500 font-mono text-[11px]">{order.timestamp}</td>
                    <td className="p-3">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        order.side === 'BUY' ? 'bg-blue-100 text-blue-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {order.side === 'BUY' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                        {order.side}
                      </span>
                    </td>
                    <td className="p-3 font-bold text-storm">{order.symbol}</td>
                    <td className="p-3 text-right font-mono text-slate-800">{order.quantity}</td>
                    <td className="p-3 text-right font-mono text-slate-800">₹{order.price.toLocaleString('en-IN')}</td>
                    <td className="p-3 text-right font-mono font-bold text-storm">₹{order.orderValue.toLocaleString('en-IN')}</td>
                    <td className="p-3 text-slate-600 max-w-xs truncate" title={order.reason}>{order.reason}</td>
                    <td className="p-3 text-center">
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold">
                        {order.executionMode}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={10} className="p-8 text-center text-slate-400 text-xs font-semibold">
                    No orders matching search criteria.
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
