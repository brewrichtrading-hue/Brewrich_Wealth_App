'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import confetti from 'canvas-confetti';
import { 
  ShieldCheck, 
  Sparkles, 
  Lock, 
  X, 
  ArrowRight, 
  CheckCircle, 
  AlertCircle,
  CreditCard,
  GraduationCap
} from 'lucide-react';

interface RegisterFlowModalProps {
  isOpen: boolean;
  onClose: () => void;
  autoTriggerCheckout?: boolean;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function RegisterFlowModal({
  isOpen,
  onClose,
  autoTriggerCheckout = false,
}: RegisterFlowModalProps) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'auth_check' | 'ready_to_pay' | 'processing' | 'success' | 'error'>('auth_check');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    if (!isOpen) return;

    // Load Razorpay Script if not already loaded
    if (!document.getElementById('razorpay-checkout-script')) {
      const script = document.createElement('script');
      script.id = 'razorpay-checkout-script';
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);
    }

    async function checkUserSession() {
      setLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(session.user);
          // Check if already paid
          const { data: status } = await supabase
            .from('module_status')
            .select('is_paid')
            .or(`user_id.eq.${session.user.id},email.eq.${session.user.email}`)
            .maybeSingle();

          if (status?.is_paid) {
            router.push('/dashboard');
            onClose();
            return;
          }

          setStep('ready_to_pay');
          if (autoTriggerCheckout) {
            triggerRazorpayPayment(session.user);
          }
        } else {
          setStep('auth_check');
        }
      } catch (err: any) {
        console.error('Session check error:', err);
      } finally {
        setLoading(false);
      }
    }

    checkUserSession();
  }, [isOpen, autoTriggerCheckout]);

  // Trigger Google OAuth sign-in flow
  const handleGoogleSignIn = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${origin}/auth/callback?next=/miip?checkout=auto`,
        },
      });
      if (error) {
        throw error;
      }
    } catch (err: any) {
      console.error('Google Sign In failed:', err);
      setErrorMessage(err.message || 'Unable to initialize Google Sign In.');
      setLoading(false);
    }
  };

  // Trigger Razorpay payment gateway
  const triggerRazorpayPayment = async (currentUser?: any) => {
    const activeUser = currentUser || user;
    if (!activeUser) {
      setStep('auth_check');
      return;
    }

    setLoading(true);
    setStep('processing');
    setErrorMessage(null);

    try {
      // 1. Create order on server (₹22,000 INR)
      const res = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: activeUser.email }),
      });

      const orderData = await res.json();
      if (!res.ok || !orderData.orderId) {
        throw new Error(orderData.error || 'Failed to generate Razorpay order token.');
      }

      // 2. Configure Razorpay options
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency || 'INR',
        name: 'Brewrich Wealth Management',
        description: 'Momentum Institutional Investing Program (MIIP)',
        order_id: orderData.orderId,
        image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=200&q=80',
        prefill: {
          name: activeUser.user_metadata?.full_name || activeUser.email?.split('@')[0] || 'Trader',
          email: activeUser.email,
        },
        theme: {
          color: '#059669', // Emerald brand color
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
            setStep('ready_to_pay');
          },
        },
        handler: async function (response: any) {
          // 3. Verify payment signature on server
          try {
            const verifyRes = await fetch('/api/razorpay/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                email: activeUser.email,
              }),
            });

            const verifyData = await verifyRes.json();
            if (verifyRes.ok && verifyData.success) {
              setStep('success');
              // Trigger confetti celebration
              confetti({
                particleCount: 120,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#10b981', '#f59e0b', '#34d399', '#ffffff'],
              });

              setTimeout(() => {
                router.push('/dashboard');
                onClose();
              }, 2000);
            } else {
              throw new Error(verifyData.error || 'Signature verification failed.');
            }
          } catch (err: any) {
            console.error('Verification error:', err);
            setErrorMessage(err.message || 'Payment completed, but access sync failed. Please contact direct desk.');
            setStep('error');
          } finally {
            setLoading(false);
          }
        },
      };

      // 4. Open Razorpay Popup
      if (typeof window.Razorpay !== 'undefined') {
        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        throw new Error('Razorpay SDK failed to load. Please check your internet connection.');
      }
    } catch (err: any) {
      console.error('Payment initiation error:', err);
      setErrorMessage(err.message || 'Could not launch payment gateway.');
      setStep('ready_to_pay');
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl bg-dark-900 border border-slate-700/80 p-6 sm:p-8 shadow-2xl shadow-emerald-950/60 overflow-hidden">
        
        {/* Background glow accents */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 h-10 w-10 flex items-center justify-center rounded-xl bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 transition-all focus:outline-none"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Program Header Badge */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-emerald-600 p-[1px]">
            <div className="flex h-full w-full items-center justify-center rounded-[11px] bg-dark-950">
              <GraduationCap className="h-6 w-6 text-amber-400" />
            </div>
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Enroll in MIIP</h3>
            <p className="text-xs text-amber-400/90 font-medium">
              Momentum Institutional Investing Program
            </p>
          </div>
        </div>

        {/* Dynamic Step Content */}
        {step === 'auth_check' && (
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/60 space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-300">Program Fee:</span>
                <span className="font-bold text-white text-lg">₹22,000 <span className="text-xs font-normal text-slate-400">INR</span></span>
              </div>
              <div className="flex justify-between items-center text-xs text-slate-400 border-t border-slate-700/60 pt-2">
                <span>Access Duration:</span>
                <span className="text-emerald-400 font-medium">Lifetime + Weekend Live Classes</span>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Step 1: Authenticate with Google
              </p>
              <p className="text-xs text-slate-400">
                To link your institutional student portal credentials and unlocked assessments, please sign in with your Google account.
              </p>

              {errorMessage && (
                <div className="p-3 rounded-xl bg-red-950/40 border border-red-800 text-xs text-red-400 flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="btn-interactive w-full min-h-[52px] flex items-center justify-center gap-3 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-base shadow-lg transition-all active:scale-[0.99] disabled:opacity-50"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>
            </div>
          </div>
        )}

        {step === 'ready_to_pay' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-800/40 flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                {user?.email?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 truncate">
                <p className="text-xs text-emerald-400 font-medium">Logged in via Google</p>
                <p className="text-sm font-semibold text-white truncate">{user?.email}</p>
              </div>
              <CheckCircle className="h-5 w-5 text-emerald-400" />
            </div>

            <div className="space-y-3 p-4 rounded-xl bg-slate-800/50 border border-slate-700">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-300">Total Investment:</span>
                <span className="text-2xl font-bold text-emerald-400">₹22,000</span>
              </div>
              <p className="text-xs text-slate-400">
                Includes Weekend Live Classes, Order Flow Engine, Assessment Certifications, and Discord Alpha Desk access.
              </p>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-red-950/40 border border-red-800 text-xs text-red-400 flex items-start gap-2">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <button
              type="button"
              onClick={() => triggerRazorpayPayment()}
              disabled={loading}
              className="btn-interactive w-full min-h-[52px] flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-base shadow-xl shadow-emerald-950/50 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
            >
              <CreditCard className="h-5 w-5" />
              <span>Proceed to Razorpay Checkout (₹22,000)</span>
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        )}

        {step === 'processing' && (
          <div className="py-10 text-center space-y-4 animate-in fade-in">
            <div className="mx-auto h-12 w-12 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            <h4 className="text-lg font-bold text-white">Opening Secure Gateway...</h4>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              Please complete the transaction in the Razorpay window. Do not refresh or close this tab.
            </p>
          </div>
        )}

        {step === 'success' && (
          <div className="py-8 text-center space-y-4 animate-in zoom-in-95">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 border border-emerald-500 text-emerald-400">
              <CheckCircle className="h-10 w-10" />
            </div>
            <h4 className="text-2xl font-bold text-white">Enrollment Confirmed!</h4>
            <p className="text-sm text-emerald-300">
              Your transaction was verified and your Student Portal access has been granted.
            </p>
            <p className="text-xs text-slate-400">
              Redirecting to your protected dashboard now...
            </p>
          </div>
        )}

        {step === 'error' && (
          <div className="py-6 text-center space-y-4 animate-in fade-in">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-500/20 text-red-400">
              <AlertCircle className="h-8 w-8" />
            </div>
            <h4 className="text-lg font-bold text-white">Payment Sync Issue</h4>
            <p className="text-xs text-red-300 max-w-sm mx-auto">{errorMessage}</p>
            <button
              onClick={() => setStep('ready_to_pay')}
              className="btn-interactive px-6 py-2.5 rounded-xl bg-slate-800 text-white text-sm font-medium hover:bg-slate-700"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Security Trust Badges */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5">
            <Lock className="h-3.5 w-3.5 text-emerald-400" />
            <span>256-Bit Encrypted Checkout</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-amber-400" />
            <span>Razorpay Verified Merchant</span>
          </div>
        </div>

      </div>
    </div>
  );
}
