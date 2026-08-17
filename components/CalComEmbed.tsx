'use client';

import React, { useState } from 'react';
import { Calendar, Clock, CheckCircle2, User, Phone, Mail, ArrowRight, ShieldCheck, AlertCircle, Sparkles, Briefcase, FileText } from 'lucide-react';

export default function CalComEmbed() {
  const [selectedDate, setSelectedDate] = useState<string>('Tomorrow');
  const [selectedDateLabel, setSelectedDateLabel] = useState<string>('Tomorrow (Feb 18, 2026)');
  const [selectedTime, setSelectedTime] = useState<string>('04:00 PM - 04:30 PM');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [portfolioSize, setPortfolioSize] = useState('₹10L - ₹25L');
  const [notes, setNotes] = useState('');
  const [isBooked, setIsBooked] = useState(false);
  const [bookingId, setBookingId] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const dates = [
    { day: 'Tomorrow', date: 'Feb 18, 2026', label: 'Tomorrow (Feb 18, 2026)' },
    { day: 'Thursday', date: 'Feb 19, 2026', label: 'Thursday (Feb 19, 2026)' },
    { day: 'Friday', date: 'Feb 20, 2026', label: 'Friday (Feb 20, 2026)' },
    { day: 'Saturday', date: 'Feb 21, 2026', label: 'Saturday (Feb 21, 2026)' },
  ];

  const times = [
    '10:30 AM - 11:00 AM',
    '02:00 PM - 02:30 PM',
    '04:00 PM - 04:30 PM',
    '06:30 PM - 07:00 PM',
  ];

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Front-end validation
    if (!name.trim() || !phone.trim() || !email.trim()) {
      setErrorMessage('Please fill in your name, phone number, and email address.');
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      // Real backend API call to /api/book-mfd
      const response = await fetch('/api/book-mfd', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_name: name.trim(),
          phone: phone.trim(),
          email: email.trim().toLowerCase(),
          consultation_date: selectedDateLabel,
          time_slot: selectedTime,
          target_allocation: portfolioSize,
          notes: notes.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.error || 'Unable to schedule consultation. Please try again.');
      }

      // Capture real generated ID from database / server
      setBookingId(data.bookingId || `BK-${Date.now().toString(36).toUpperCase()}`);
      setIsBooked(true);
    } catch (err: any) {
      console.error('MFD Booking Error:', err);
      setErrorMessage(err.message || 'Server connection error. Please check your internet and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full rounded-3xl bg-white border border-slate-200/80 p-6 sm:p-10 shadow-xl shadow-slate-200/60 transition-all">
      
      {/* Header bar */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider mb-2.5 border border-blue-100">
            <ShieldCheck className="h-3.5 w-3.5 text-blue-600" />
            <span>AMFI Certified Advisor Desk</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Schedule 1-on-1 Portfolio Consultation
          </h3>
          <p className="text-sm text-slate-500 mt-1">
            Complimentary 30-minute wealth structuring & tax-efficient mutual fund review.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-slate-50 px-3.5 py-2.5 rounded-full border border-slate-200/70 self-start sm:self-auto">
          <Clock className="h-4 w-4 text-blue-600" />
          <span>30 Mins • Google Meet / Phone</span>
        </div>
      </div>

      {isBooked ? (
        <div className="py-10 text-center space-y-5 animate-in fade-in zoom-in-95 duration-300">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 shadow-sm">
            <CheckCircle2 className="h-9 w-9" />
          </div>
          <div className="space-y-1">
            <div className="inline-block px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-extrabold border border-emerald-200 uppercase tracking-wider mb-1">
              Booking Confirmed #{bookingId}
            </div>
            <h4 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Consultation Scheduled!</h4>
            <p className="text-sm text-slate-600 max-w-md mx-auto">
              Thank you, <strong className="text-slate-900">{name || 'Investor'}</strong>. Our Senior Wealth Advisor has confirmed your slot for <strong className="text-blue-700">{selectedDateLabel} at {selectedTime}</strong>.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 max-w-md mx-auto text-xs text-slate-600 space-y-2 text-left shadow-sm">
            <div className="flex justify-between py-1 border-b border-slate-200/60">
              <span className="text-slate-500 font-medium">Record ID:</span>
              <span className="font-mono font-bold text-slate-900 truncate max-w-[220px]">{bookingId}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200/60">
              <span className="text-slate-500 font-medium">Email Dispatch:</span>
              <span className="font-bold text-slate-900 truncate max-w-[220px]">{email}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200/60">
              <span className="text-slate-500 font-medium">WhatsApp / SMS Alert:</span>
              <span className="font-bold text-slate-900">{phone}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200/60">
              <span className="text-slate-500 font-medium">Planned Allocation:</span>
              <span className="font-bold text-blue-700">{portfolioSize}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500 font-medium">Next Step:</span>
              <span className="font-semibold text-emerald-600">Calendar invite sent via email</span>
            </div>
          </div>

          <button
            onClick={() => {
              setIsBooked(false);
              setName('');
              setPhone('');
              setEmail('');
              setNotes('');
            }}
            className="btn-interactive px-6 py-3 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-bold transition-all"
          >
            Book Another Consultation
          </button>
        </div>
      ) : (
        <form onSubmit={handleBooking} className="space-y-6">
          {errorMessage && (
            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2.5 animate-in fade-in">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-red-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Step 1: Date Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
              1. Choose Date
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {dates.map((d) => {
                const isSelected = selectedDate === d.day;
                return (
                  <button
                    type="button"
                    key={d.day}
                    onClick={() => {
                      setSelectedDate(d.day);
                      setSelectedDateLabel(d.label);
                    }}
                    className={`btn-interactive flex flex-col items-center justify-center p-3.5 rounded-2xl border text-center transition-all ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    <span className={`text-xs font-medium ${isSelected ? 'text-blue-100' : 'text-slate-500'}`}>{d.day}</span>
                    <span className="text-sm font-extrabold mt-0.5">{d.date}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Time Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
              2. Select Time (IST)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {times.map((t) => {
                const isSelected = selectedTime === t;
                return (
                  <button
                    type="button"
                    key={t}
                    onClick={() => setSelectedTime(t)}
                    className={`btn-interactive flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border text-sm font-semibold transition-all ${
                      isSelected
                        ? 'bg-blue-50 text-blue-700 border-blue-500 shadow-sm'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    <Clock className={`h-4 w-4 ${isSelected ? 'text-blue-600' : 'text-slate-400'}`} />
                    <span>{t}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 3: Contact Info */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
              3. Investor Information
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Full Name *</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="Yogesh Nath"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full min-h-[48px] rounded-2xl bg-slate-50 border border-slate-200 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Phone (WhatsApp Updates) *</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full min-h-[48px] rounded-2xl bg-slate-50 border border-slate-200 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Email Address *</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder="investor@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full min-h-[48px] rounded-2xl bg-slate-50 border border-slate-200 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Planned Investment Horizon</label>
                <select
                  value={portfolioSize}
                  onChange={(e) => setPortfolioSize(e.target.value)}
                  className="w-full min-h-[48px] rounded-2xl bg-slate-50 border border-slate-200 px-4 text-sm text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                >
                  <option value="₹5L - ₹10L">₹5 Lakh - ₹10 Lakh (SIP / Lumpsum)</option>
                  <option value="₹10L - ₹25L">₹10 Lakh - ₹25 Lakh (Growth Basket)</option>
                  <option value="₹25L - ₹1Cr">₹25 Lakh - ₹1 Crore (HNI Portfolio)</option>
                  <option value="₹1Cr+">₹1 Crore+ (Family Office / Private)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Any specific queries or current holdings? (Optional)</label>
              <textarea
                rows={2}
                placeholder="e.g. Existing portfolio review, tax harvesting advice, lump sum vs SIP..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full rounded-2xl bg-slate-50 border border-slate-200 p-3.5 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-interactive w-full min-h-[52px] flex items-center justify-center gap-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-base shadow-lg shadow-blue-600/25 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Confirming Slot with Advisory Desk...</span>
              </div>
            ) : (
              <>
                <span>Confirm 1-on-1 Consultation</span>
                <ArrowRight className="h-5 w-5" />
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
