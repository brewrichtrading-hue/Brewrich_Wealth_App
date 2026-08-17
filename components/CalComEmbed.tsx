'use client';

import React, { useState } from 'react';
import { Calendar, Clock, CheckCircle2, User, Phone, Mail, ArrowRight, ShieldCheck } from 'lucide-react';

export default function CalComEmbed() {
  const [selectedDate, setSelectedDate] = useState<string>('Tomorrow');
  const [selectedTime, setSelectedTime] = useState<string>('04:00 PM - 04:30 PM');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [portfolioSize, setPortfolioSize] = useState('₹10L - ₹25L');
  const [isBooked, setIsBooked] = useState(false);
  const [loading, setLoading] = useState(false);

  const dates = [
    { day: 'Tomorrow', date: 'Feb 18, 2026' },
    { day: 'Thursday', date: 'Feb 19, 2026' },
    { day: 'Friday', date: 'Feb 20, 2026' },
    { day: 'Saturday', date: 'Feb 21, 2026' },
  ];

  const times = [
    '10:30 AM - 11:00 AM',
    '02:00 PM - 02:30 PM',
    '04:00 PM - 04:30 PM',
    '06:30 PM - 07:00 PM',
  ];

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setIsBooked(true);
    }, 1000);
  };

  return (
    <div className="w-full rounded-2xl border border-emerald-500/20 bg-slate-900/90 backdrop-blur-xl p-6 sm:p-8 shadow-2xl shadow-emerald-950/30">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>AMFI Certified Advisor Call</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white">
            Schedule 1-on-1 Account Opening Call
          </h3>
          <p className="text-sm text-slate-400 mt-1">
            Complimentary 30-minute portfolio review & tax-efficient wealth blueprint.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-800/80 px-3 py-2 rounded-xl border border-slate-700">
          <Clock className="h-4 w-4 text-emerald-400" />
          <span>30 Mins • Google Meet / Phone</span>
        </div>
      </div>

      {isBooked ? (
        <div className="py-12 text-center space-y-4 animate-in fade-in zoom-in-95 duration-300">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <h4 className="text-2xl font-bold text-white">Consultation Confirmed!</h4>
          <p className="text-sm text-slate-300 max-w-md mx-auto">
            Thank you, <strong className="text-emerald-400">{name || 'Investor'}</strong>. Our Senior Wealth Strategist has reserved your slot for <strong className="text-white">{selectedDate} at {selectedTime}</strong>.
          </p>
          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700 max-w-sm mx-auto text-xs text-slate-300 space-y-1 text-left">
            <p><strong>Confirmation Email:</strong> {email || 'Sent to registered email'}</p>
            <p><strong>Mobile Reminder:</strong> {phone || '+91 SMS Alert scheduled'}</p>
            <p><strong>Meeting Link:</strong> Sent via Calendar invite</p>
          </div>
          <button
            onClick={() => setIsBooked(false)}
            className="btn-interactive px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium transition-all"
          >
            Book Another Slot
          </button>
        </div>
      ) : (
        <form onSubmit={handleBooking} className="space-y-6">
          {/* Step 1: Date Selector */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2.5">
              1. Select Date
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {dates.map((d) => (
                <button
                  type="button"
                  key={d.day}
                  onClick={() => setSelectedDate(d.day)}
                  className={`btn-interactive flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
                    selectedDate === d.day
                      ? 'bg-emerald-600 text-white border-emerald-400 shadow-lg shadow-emerald-950/40'
                      : 'bg-slate-800/50 hover:bg-slate-800 text-slate-300 border-slate-700/60'
                  }`}
                >
                  <span className="text-xs font-medium opacity-80">{d.day}</span>
                  <span className="text-sm font-bold mt-0.5">{d.date}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Time Selector */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2.5">
              2. Select Time (IST)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {times.map((t) => (
                <button
                  type="button"
                  key={t}
                  onClick={() => setSelectedTime(t)}
                  className={`btn-interactive flex items-center justify-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                    selectedTime === t
                      ? 'bg-emerald-600/30 border-emerald-400 text-emerald-300 shadow-sm'
                      : 'bg-slate-800/50 hover:bg-slate-800 text-slate-300 border-slate-700/60'
                  }`}
                >
                  <Clock className="h-4 w-4 text-emerald-400" />
                  <span>{t}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Step 3: Contact Info */}
          <div className="space-y-4 pt-2 border-t border-slate-800">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
              3. Your Information
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="Yogesh Nath"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full min-h-[48px] rounded-xl bg-slate-800/80 border border-slate-700/80 pl-10 pr-4 text-sm text-white placeholder-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Phone (WhatsApp updates)</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full min-h-[48px] rounded-xl bg-slate-800/80 border border-slate-700/80 pl-10 pr-4 text-sm text-white placeholder-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder="investor@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full min-h-[48px] rounded-xl bg-slate-800/80 border border-slate-700/80 pl-10 pr-4 text-sm text-white placeholder-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Planned Investment Horizon</label>
                <select
                  value={portfolioSize}
                  onChange={(e) => setPortfolioSize(e.target.value)}
                  className="w-full min-h-[48px] rounded-xl bg-slate-800/80 border border-slate-700/80 px-4 text-sm text-white focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="₹5L - ₹10L">₹5 Lakh - ₹10 Lakh (SIP / Lumpsum)</option>
                  <option value="₹10L - ₹25L">₹10 Lakh - ₹25 Lakh (Growth Basket)</option>
                  <option value="₹25L - ₹1Cr">₹25 Lakh - ₹1 Crore (HNI Portfolio)</option>
                  <option value="₹1Cr+">₹1 Crore+ (Family Office / Private)</option>
                </select>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-interactive w-full min-h-[52px] flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-base shadow-xl shadow-emerald-950/50 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Reserving Desk Slot...</span>
              </div>
            ) : (
              <>
                <span>Confirm 1-on-1 Wealth Call</span>
                <ArrowRight className="h-5 w-5" />
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
