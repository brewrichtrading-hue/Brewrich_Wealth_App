'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { GraduationCap, ArrowRight } from 'lucide-react';

export default function MIPLoginPage() {
  const [loading, setLoading] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  const handleGoogleLogin = async () => {
    setLoading(true);
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${origin}/student/dashboard`,
      },
    });

    if (error) {
      console.error('Login error:', error.message);
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl space-y-6 text-center">
        
        <div className="w-16 h-16 bg-blue-600/20 border border-blue-500/30 rounded-2xl flex items-center justify-center mx-auto text-blue-400">
          <GraduationCap className="w-8 h-8" />
        </div>

        <div>
          <span className="bg-blue-500/20 text-blue-400 text-xs font-semibold px-3 py-1 rounded-full border border-blue-400/30 uppercase tracking-wider">
            MIP Student Portal
          </span>
          <h1 className="text-2xl font-bold mt-3">Access Your Mentorship</h1>
          <p className="text-slate-400 text-sm mt-1">Sign in with your registered Google account to enter the student hub.</p>
        </div>

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 bg-white hover:bg-slate-100 text-slate-900 font-bold py-3.5 px-6 rounded-xl transition shadow-lg disabled:opacity-50"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
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
          {loading ? 'Connecting...' : 'Sign in with Google'}
        </button>

        <div className="border-t border-slate-800 pt-4 flex items-center justify-between text-xs text-slate-400">
          <Link href="/" className="hover:text-white transition">
            ← Back to Home
          </Link>
          <Link href="/miip" className="text-blue-400 hover:underline flex items-center gap-1">
            Program Details <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

      </div>
    </main>
  );
}
