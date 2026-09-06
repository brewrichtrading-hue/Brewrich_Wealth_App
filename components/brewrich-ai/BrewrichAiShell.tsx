'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  LayoutDashboard, 
  Sparkles, 
  TrendingUp, 
  Zap, 
  Wallet, 
  FileText, 
  ShieldCheck, 
  Server, 
  ClipboardList, 
  Lock, 
  LogOut, 
  RefreshCw,
  Menu,
  X,
  User,
  Shield,
  Clock
} from 'lucide-react';
import { CockpitTab, CockpitDashboardData, BrewrichUserSession, BacktestDataset } from '@/lib/brewrich-ai/types';
import { getBrewrich400Backtest } from '@/lib/brewrich-ai/brewrich400Engine';
import BrewrichAiAuthModal from './BrewrichAiAuthModal';
import DashboardTab from './tabs/DashboardTab';
import Brewrich400Tab from './tabs/Brewrich400Tab';
import BacktestTab from './tabs/BacktestTab';
import PaperTradingTab from './tabs/PaperTradingTab';
import PortfolioTab from './tabs/PortfolioTab';
import OrdersTab from './tabs/OrdersTab';
import RiskSafetyTab from './tabs/RiskSafetyTab';
import BrokersTab from './tabs/BrokersTab';
import AuditLogTab from './tabs/AuditLogTab';
import LiveTradingLockedTab from './tabs/LiveTradingLockedTab';

export default function BrewrichAiShell() {
  const [activeTab, setActiveTab] = useState<CockpitTab>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [data, setData] = useState<CockpitDashboardData | null>(null);
  const [backtestData, setBacktestData] = useState<BacktestDataset | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const [session, setSession] = useState<BrewrichUserSession>({
    isAuthenticated: true, // Defaults to authenticated for seamless cockpit access; modal available for re-auth
    email: 'wealth@brewrich.in',
    name: 'Brewrich Principal',
    role: 'owner',
    twoFactorVerified: true,
  });

  const [showAuthModal, setShowAuthModal] = useState(false);

  // Fetch cockpit data
  const loadCockpitData = useCallback(async () => {
    try {
      setIsRefreshing(true);
      const [dashRes, btRes] = await Promise.all([
        fetch('/api/brewrich-ai/dashboard'),
        fetch('/api/brewrich-ai/backtest'),
      ]);
      const json = await dashRes.json();
      if (json.success) {
        setData(json.data);
      }
      const btJson = await btRes.json();
      if (btJson.success) {
        setBacktestData(btJson.backtest);
      }
    } catch (err) {
      console.warn('⚠️ [BREWRICH AI] Cockpit data load warning:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadCockpitData();
  }, [loadCockpitData]);

  const handleLogout = async () => {
    await fetch('/api/brewrich-ai/auth', { method: 'DELETE' });
    setSession({ isAuthenticated: false, role: 'guest', twoFactorVerified: false });
    setShowAuthModal(true);
  };

  const handleAuthSuccess = (email: string) => {
    setSession({
      isAuthenticated: true,
      email,
      name: 'Brewrich Principal',
      role: 'owner',
      twoFactorVerified: true,
    });
    setShowAuthModal(false);
    loadCockpitData();
  };

  const navItems: { id: CockpitTab; label: string; icon: React.ComponentType<{ className?: string }>; badge?: string; isLocked?: boolean }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'brewrich400', label: 'Brewrich 400', icon: Sparkles, badge: 'Core' },
    { id: 'backtest', label: 'Backtest', icon: TrendingUp },
    { id: 'paper-trading', label: 'Paper Trading', icon: Zap, badge: 'Active' },
    { id: 'portfolio', label: 'Portfolio', icon: Wallet },
    { id: 'orders', label: 'Orders', icon: FileText },
    { id: 'risk', label: 'Risk & Safety', icon: ShieldCheck },
    { id: 'brokers', label: 'Brokers', icon: Server },
    { id: 'audit', label: 'Audit Log', icon: ClipboardList },
    { id: 'live-locked', label: 'Live Trading', icon: Lock, isLocked: true },
  ];

  return (
    <div className="flex flex-col w-full min-h-screen bg-slate-50 text-storm selection:bg-bumblebee selection:text-storm font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* AUTHENTICATION MODAL */}
      <BrewrichAiAuthModal 
        isOpen={showAuthModal || !session.isAuthenticated} 
        onSuccess={handleAuthSuccess} 
      />

      {/* 1. TOP COCKPIT APP BAR */}
      <header className="sticky top-0 z-40 bg-storm text-white border-b border-storm-700 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Brand Identity */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-bumblebee flex items-center justify-center font-extrabold text-storm text-base shadow-sm">
              B
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold tracking-tight text-white text-base sm:text-lg">BREWRICH AI</span>
                <span className="px-2 py-0.5 rounded-full bg-white/10 text-bumblebee text-[10px] font-bold uppercase tracking-wider">
                  Cockpit
                </span>
              </div>
              <span className="text-[11px] text-blue-200 hidden sm:block">Personal Wealth & Momentum Engine</span>
            </div>
          </div>

          {/* Center Status Indicators (Desktop) */}
          <div className="hidden md:flex items-center gap-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>PAPER MODE ACTIVE</span>
            </div>
            
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-blue-200 text-xs font-bold">
              <Lock className="w-3.5 h-3.5 text-bumblebee" />
              <span>LIVE: LOCKED</span>
            </div>
          </div>

          {/* Right Actions & User Menu */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={loadCockpitData}
              disabled={isRefreshing}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-blue-100 transition-all active:scale-95 disabled:opacity-50"
              title="Refresh Cockpit Data"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>

            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 border border-white/10 text-xs font-semibold text-white">
              <User className="w-3.5 h-3.5 text-bumblebee" />
              <span className="truncate max-w-[120px]">{session.email}</span>
            </div>

            <button
              onClick={handleLogout}
              className="p-2 rounded-xl bg-white/10 hover:bg-rose-500/20 hover:text-rose-300 text-blue-200 text-xs font-semibold transition-all"
              title="Log Out of Cockpit"
            >
              <LogOut className="w-4 h-4" />
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl bg-white/10 text-white md:hidden"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* 2. HORIZONTAL TAB NAVIGATION (DESKTOP) */}
        <div className="hidden md:block bg-storm-900 border-t border-storm-700/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex space-x-1 overflow-x-auto py-2 scrollbar-none" aria-label="Tabs">
              {navItems.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`group inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                      isActive
                        ? 'bg-bumblebee text-storm shadow-sm'
                        : tab.isLocked
                          ? 'text-blue-300 hover:text-white hover:bg-white/5 opacity-80'
                          : 'text-blue-100 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-storm' : tab.isLocked ? 'text-bumblebee-400' : 'text-blue-200'}`} />
                    <span>{tab.label}</span>
                    {tab.badge && !isActive && (
                      <span className="px-1.5 py-0.2 rounded-md bg-white/10 text-[10px] font-bold text-bumblebee">
                        {tab.badge}
                      </span>
                    )}
                    {tab.isLocked && (
                      <Lock className="w-3 h-3 text-bumblebee" />
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      {/* MOBILE DRAWER NAVIGATION */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-30 bg-storm/80 backdrop-blur-sm pt-16 animate-fadeIn">
          <div className="bg-storm-900 border-b border-storm-700 p-4 space-y-1.5 shadow-2xl max-h-[calc(100vh-4rem)] overflow-y-auto">
            {navItems.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between p-3 rounded-2xl text-xs font-bold transition-all ${
                    isActive ? 'bg-bumblebee text-storm' : 'text-blue-100 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-storm' : 'text-blue-300'}`} />
                    <span>{tab.label}</span>
                  </div>
                  {tab.isLocked && <Lock className="w-3.5 h-3.5 text-bumblebee" />}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. MAIN COCKPIT BODY */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* LOADING PLACEHOLDER */}
        {isLoading || !data ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <RefreshCw className="w-8 h-8 text-storm animate-spin mx-auto" />
            <div className="text-sm font-bold text-storm">Initializing Brewrich AI Cockpit...</div>
            <p className="text-xs text-slate-400">Loading strategy engine state and paper portfolio.</p>
          </div>
        ) : (
          <>
            {activeTab === 'dashboard' && (
              <DashboardTab data={data} onNavigate={setActiveTab} />
            )}
            {activeTab === 'brewrich400' && (
              <Brewrich400Tab strategy={data.strategy} />
            )}
            {activeTab === 'backtest' && (
              <BacktestTab backtest={backtestData || getBrewrich400Backtest()} />
            )}
            {activeTab === 'paper-trading' && (
              <PaperTradingTab portfolio={data.portfolio} recentOrders={data.recentOrders} onRefresh={loadCockpitData} />
            )}
            {activeTab === 'portfolio' && (
              <PortfolioTab portfolio={data.portfolio} />
            )}
            {activeTab === 'orders' && (
              <OrdersTab orders={data.recentOrders} />
            )}
            {activeTab === 'risk' && (
              <RiskSafetyTab risk={data.risk} />
            )}
            {activeTab === 'brokers' && (
              <BrokersTab brokers={data.brokers} />
            )}
            {activeTab === 'audit' && (
              <AuditLogTab logs={data.recentAuditLogs} />
            )}
            {activeTab === 'live-locked' && (
              <LiveTradingLockedTab onNavigate={setActiveTab} />
            )}
          </>
        )}

      </main>

      {/* 4. FOOTER STATUS BAR */}
      <footer className="bg-white border-t border-slate-200 py-4 px-4 sm:px-6 lg:px-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <div>
            <span className="font-bold text-storm">BREWRICH AI</span> — Personal Wealth Cockpit • Brewrich 400 Wealth Strategy Engine
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="text-emerald-700 font-semibold">● Paper Execution Active</span>
            <span className="text-storm font-semibold">🔒 Live Trading Locked</span>
            <span>Zero Definedge Dependencies</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
