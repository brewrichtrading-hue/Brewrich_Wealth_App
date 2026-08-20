import React from 'react';
import Link from 'next/link';
import { Shield, Lock, Award, Mail, Phone, MapPin, ArrowUpRight, CheckCircle2 } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-[#0B1B3D] text-slate-300">
      {/* Main Footer Links */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-600 shadow-md text-white">
                <Shield className="h-5 w-5" />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-white">
                BREWRICH <span className="text-blue-400">WEALTH</span>
              </span>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed max-w-sm font-normal">
              Institutional asset management and momentum execution architecture. Empowering investors with disciplined compounding, zero hidden fees, and transparent wealth advisory.
            </p>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300 pt-2">
              <div className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-full border border-slate-700">
                <Lock className="h-3.5 w-3.5 text-blue-400" />
                <span>256-Bit SSL Encrypted</span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-full border border-slate-700">
                <Award className="h-3.5 w-3.5 text-amber-400" />
                <span>AMFI Registered MFD</span>
              </div>
            </div>
          </div>

          {/* Wealth Solutions */}
          <div>
            <h3 className="text-xs font-bold text-white tracking-wider uppercase mb-4">
              Wealth Solutions
            </h3>
            <ul className="space-y-2.5 text-sm font-medium">
              <li>
                <Link href="/mfd" className="hover:text-white transition-colors flex items-center gap-1">
                  <span>Mutual Fund Distribution</span>
                  <ArrowUpRight className="h-3.5 w-3.5 opacity-60 text-blue-400" />
                </Link>
              </li>
              <li>
                <Link href="/miip" className="hover:text-white transition-colors flex items-center gap-1">
                  <span>MIP Mentorship</span>
                  <ArrowUpRight className="h-3.5 w-3.5 opacity-60 text-amber-400" />
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-white transition-colors">
                  Student Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Quantitative Curriculum */}
          <div>
            <h3 className="text-xs font-bold text-white tracking-wider uppercase mb-4">
              Institutional Alpha
            </h3>
            <ul className="space-y-2.5 text-sm font-medium text-slate-400">
              <li>
                <span className="hover:text-slate-200 transition-colors cursor-default">
                  Market Microstructure & DOM
                </span>
              </li>
              <li>
                <span className="hover:text-slate-200 transition-colors cursor-default">
                  Dark Pool & Volume Delta
                </span>
              </li>
              <li>
                <span className="hover:text-slate-200 transition-colors cursor-default">
                  Anchored VWAP & GEX Flips
                </span>
              </li>
              <li>
                <span className="hover:text-slate-200 transition-colors cursor-default">
                  Asymmetric Risk Budgeting
                </span>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xs font-bold text-white tracking-wider uppercase mb-4">
              Direct Advisory Desk
            </h3>
            <ul className="space-y-2.5 text-sm font-medium">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-blue-400 shrink-0" />
                <a href="mailto:support@brewrichwealth.com" className="hover:text-white transition-colors truncate">
                  support@brewrichwealth.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-emerald-400 shrink-0" />
                <a href="tel:+919876543210" className="hover:text-white transition-colors">
                  +91 98765 43210
                </a>
              </li>
              <li className="flex items-start gap-2 text-slate-400">
                <MapPin className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                <span>Brewrich 2151/1A, Sri Rajarajeshwari Nagar, plot no 21, Periyakulam - Theni Rd, Lakshmipuram, Thamarai Kulam, Tamil Nadu 625523</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Regulatory & Risk Disclosures */}
        <div className="mt-12 pt-8 border-t border-slate-800 text-xs leading-relaxed text-slate-400 space-y-3">
          <p>
            <strong className="text-slate-300">AMFI / SEBI Regulatory Disclaimers:</strong> Mutual Fund investments are subject to market risks, read all scheme related documents carefully. Brewrich Wealth operates as an AMFI Registered Mutual Fund Distributor. The NAV of the schemes may go up or down depending upon the factors and forces affecting the securities market including fluctuations in interest rates.
          </p>
          <p>
            <strong className="text-slate-300">Educational & Trading Disclaimer:</strong> The Momentum Investing Program (MIP) is an educational mentorship program. Trading in equities, derivatives, and institutional securities carries substantial risk of capital loss and is not suitable for all investors.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 text-slate-400">
            <p>© {new Date().getFullYear()} Brewrich Wealth Management & Institutional Trading. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <span className="hover:text-slate-300 transition-colors cursor-pointer">Privacy Policy</span>
              <span className="hover:text-slate-300 transition-colors cursor-pointer">Terms of Service</span>
              <span className="hover:text-slate-300 transition-colors cursor-pointer">Disclosures</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
