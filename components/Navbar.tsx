'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { 
  Shield, 
  TrendingUp, 
  Menu, 
  X, 
  User as UserIcon, 
  LogOut, 
  LayoutDashboard, 
  GraduationCap, 
  PieChart, 
  Sparkles,
  ChevronRight
} from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isPaid, setIsPaid] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function checkAuth() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(session.user);
          // Check payment status
          const { data: status } = await supabase
            .from('module_status')
            .select('is_paid')
            .or(`user_id.eq.${session.user.id},email.eq.${session.user.email}`)
            .maybeSingle();
          if (status?.is_paid) {
            setIsPaid(true);
          }
        } else {
          setUser(null);
          setIsPaid(false);
        }
      } catch (e) {
        console.error('Navbar auth error:', e);
      } finally {
        setLoading(false);
      }
    }

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser(session.user);
      } else {
        setUser(null);
        setIsPaid(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [pathname]);

  const handleGoogleSignIn = async () => {
    try {
      const redirectOrigin = typeof window !== 'undefined' ? window.location.origin : '';
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${redirectOrigin}/auth/callback?next=${encodeURIComponent(pathname)}`,
        },
      });
    } catch (error) {
      console.error('Error initiating Google sign in:', error);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsPaid(false);
    router.push('/');
    router.refresh();
  };

  const navLinks = [
    { name: 'Home', href: '/', icon: TrendingUp },
    { name: 'Mutual Funds (MFD)', href: '/mfd', icon: PieChart },
    { name: 'MIIP Program', href: '/miip', icon: GraduationCap, badge: 'Flagship' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-dark-950/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 h-20">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-lg p-1">
          <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-amber-500 p-[1px] shadow-lg shadow-emerald-950/50">
            <div className="flex h-full w-full items-center justify-center rounded-[11px] bg-dark-950">
              <Shield className="h-6 w-6 text-emerald-400 group-hover:scale-110 transition-transform duration-300" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
              BREWRICH
              <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                WEALTH
              </span>
            </span>
            <span className="text-[10px] tracking-wider uppercase text-slate-400 font-medium">
              Institutional Alpha & Wealth
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`relative px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                  isActive
                    ? 'text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/40'
                }`}
              >
                <span>{link.name}</span>
                {link.badge && (
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}

          {/* Student Portal Link if user is authenticated / paid */}
          {user && (
            <Link
              href="/dashboard"
              className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                pathname.startsWith('/dashboard')
                  ? 'text-amber-400 bg-amber-950/40 border border-amber-700/40'
                  : 'text-amber-300/90 hover:text-amber-200 hover:bg-amber-950/20'
              }`}
            >
              <LayoutDashboard className="h-4 w-4" />
              <span>Student Portal</span>
              {isPaid && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              )}
            </Link>
          )}
        </nav>

        {/* Desktop Right Action Area (Auth / Portal) */}
        <div className="hidden md:flex items-center gap-3">
          {loading ? (
            <div className="h-10 w-24 rounded-lg bg-slate-800/50 animate-pulse" />
          ) : user ? (
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard"
                className="btn-interactive flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-medium text-sm shadow-lg shadow-emerald-900/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <LayoutDashboard className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>
              <button
                onClick={handleSignOut}
                title="Sign Out"
                className="btn-interactive flex items-center justify-center h-10 w-10 rounded-xl bg-slate-800/80 hover:bg-red-950/40 hover:text-red-400 text-slate-400 border border-slate-700/60 transition-all"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <button
                onClick={handleGoogleSignIn}
                className="btn-interactive flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-700/60 transition-all"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Sign In</span>
              </button>

              <Link
                href="/miip"
                className="btn-interactive flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-semibold text-sm shadow-lg shadow-amber-950/40 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Sparkles className="h-4 w-4" />
                <span>Join MIIP</span>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button (Strict 48px touch target) */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center justify-center min-h-[48px] min-w-[48px] rounded-xl bg-slate-900/90 border border-slate-800 text-slate-300 hover:text-white active:bg-slate-800 focus:outline-none"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {isOpen && (
        <div className="md:hidden fixed inset-x-0 top-20 bottom-0 z-40 bg-dark-950/95 backdrop-blur-2xl border-t border-slate-800 px-4 py-6 overflow-y-auto flex flex-col justify-between animate-in slide-in-from-top-4 duration-200">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-3">
              Navigation
            </p>
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`btn-interactive flex items-center justify-between w-full px-4 py-3.5 rounded-xl text-base font-medium transition-all ${
                    isActive
                      ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-700/50'
                      : 'bg-slate-900/60 text-slate-200 hover:bg-slate-800/80'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`h-5 w-5 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                    <span>{link.name}</span>
                  </div>
                  {link.badge ? (
                    <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      {link.badge}
                    </span>
                  ) : (
                    <ChevronRight className="h-4 w-4 text-slate-500" />
                  )}
                </Link>
              );
            })}

            <Link
              href="/dashboard"
              onClick={() => setIsOpen(false)}
              className={`btn-interactive flex items-center justify-between w-full px-4 py-3.5 rounded-xl text-base font-medium transition-all ${
                pathname.startsWith('/dashboard')
                  ? 'bg-amber-950/60 text-amber-400 border border-amber-700/50'
                  : 'bg-slate-900/60 text-amber-300/90 hover:bg-slate-800/80'
              }`}
            >
              <div className="flex items-center gap-3">
                <LayoutDashboard className="h-5 w-5 text-amber-400" />
                <span>Student Portal (Dashboard)</span>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-500" />
            </Link>
          </div>

          <div className="pt-6 border-t border-slate-800/80 space-y-3 pb-safe">
            {user ? (
              <div className="space-y-3">
                <div className="px-4 py-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold">
                    {user.email?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 truncate">
                    <p className="text-xs text-slate-400">Signed in as</p>
                    <p className="text-sm font-medium text-white truncate">{user.email}</p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setIsOpen(false);
                    handleSignOut();
                  }}
                  className="btn-interactive w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-red-950/30 border border-red-800/40 text-red-400 font-medium text-sm hover:bg-red-900/40"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    handleGoogleSignIn();
                  }}
                  className="btn-interactive w-full flex items-center justify-center gap-3 px-4 py-3.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-medium text-sm active:bg-slate-800"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>Sign in with Google</span>
                </button>

                <Link
                  href="/miip"
                  onClick={() => setIsOpen(false)}
                  className="btn-interactive w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-base shadow-lg shadow-amber-950/50"
                >
                  <Sparkles className="h-5 w-5" />
                  <span>Join MIIP Program (₹22,000)</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
