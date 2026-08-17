import React from 'react';
import Link from 'next/link';
import { Shield, Lock, Award, Mail, Phone, MapPin, ArrowUpRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-800/80 bg-dark-950 text-slate-400">
      {/* Main Footer Links */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-amber-500 p-[1px]">
                <div className="flex h-full w-full items-center justify-center rounded-[11px] bg-dark-950">
                  <Shield className="h-5 w-5 text-emerald-400" />
                </div>
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                BREWRICH <span className="text-emerald-400">WEALTH</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Empowering HNIs, retail investors, and ambitious traders with quantitative momentum strategies, institutional order execution, and disciplined wealth compounding.
            </p>
            <div className="flex items-center gap-4 text-xs text-slate-400 pt-2">
              <div className="flex items-center gap-1.5 bg-slate-900/80 px-2.5 py-1.5 rounded-lg border border-slate-800">
                <Lock className="h-3.5 w-3.5 text-emerald-400" />
                <span>256-Bit SSL Encrypted</span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-900/80 px-2.5 py-1.5 rounded-lg border border-slate-800">
                <Award className="h-3.5 w-3.5 text-amber-400" />
                <span>AMFI Registered</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              Solutions
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/mfd" className="hover:text-emerald-400 transition-colors flex items-center gap-1">
                  <span>Mutual Fund Distribution</span>
                  <ArrowUpRight className="h-3.5 w-3.5 opacity-60" />
                </Link>
              </li>
              <li>
                <Link href="/miip" className="hover:text-amber-400 transition-colors flex items-center gap-1">
                  <span>MIIP Institutional Program</span>
                  <ArrowUpRight className="h-3.5 w-3.5 opacity-60" />
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-white transition-colors">
                  Student Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Programs */}
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              Curriculum
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <span className="hover:text-white transition-colors cursor-default">
                  Market Microstructure
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-default">
                  Order Flow & Liquidity
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-default">
                  Multi-Timeframe Momentum
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-default">
                  Institutional Risk Models
                </span>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              Direct Desk
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-emerald-400 shrink-0" />
                <a href="mailto:support@brewrichwealth.com" className="hover:text-white transition-colors truncate">
                  support@brewrichwealth.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-amber-400 shrink-0" />
                <a href="tel:+919876543210" className="hover:text-white transition-colors">
                  +91 98765 43210
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                <span>Financial District, BKC, Mumbai & Bengaluru</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Regulatory & Risk Disclosures */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 text-xs leading-relaxed text-slate-400 space-y-3">
          <p>
            <strong className="text-slate-400">AMFI / SEBI Regulatory Disclaimers:</strong> Mutual Fund investments are subject to market risks, read all scheme related documents carefully. Brewrich Wealth operates as an AMFI Registered Mutual Fund Distributor. The NAV of the schemes may go up or down depending upon the factors and forces affecting the securities market including the fluctuations in the interest rates.
          </p>
          <p>
            <strong className="text-slate-400">Educational & Trading Disclaimer:</strong> The Momentum Institutional Investing Program (MIIP) is an educational mentorship initiative. Trading in equities, derivatives, and institutional securities carries substantial capital risk and is not suitable for all investors. No representation or guarantee is made that any strategy will achieve profits similar to historical performances.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 text-slate-400">
            <p>© {new Date().getFullYear()} Brewrich Wealth Management & Institutional Trading. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <span className="hover:text-slate-400 transition-colors cursor-pointer">Privacy Policy</span>
              <span className="hover:text-slate-400 transition-colors cursor-pointer">Terms of Service</span>
              <span className="hover:text-slate-400 transition-colors cursor-pointer">Refund Policy</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
