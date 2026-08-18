'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function StudentCertificate() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    async function loadProfile() {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/miip');
        return;
      }

      const { data } = await supabase
        .from('student_profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      setProfile(data);
      setLoading(false);
    }

    loadProfile();
  }, [supabase, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <p className="text-xl animate-pulse">Loading certificate generator...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white p-6 md:p-12 flex flex-col items-center justify-center">
      <div className="max-w-4xl w-full space-y-6">
        
        <div className="flex justify-between items-center">
          <button 
            onClick={() => router.push('/student/dashboard')}
            className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition"
          >
            ← Back to Dashboard
          </button>
          
          <button 
            onClick={() => window.print()}
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition shadow-lg shadow-blue-600/30"
          >
            Download / Print Certificate 🖨️
          </button>
        </div>

        {/* Certificate Card Container */}
        <div className="bg-gradient-to-b from-slate-900 to-slate-950 border-4 border-amber-500/40 p-10 md:p-16 rounded-3xl shadow-2xl text-center relative overflow-hidden">
          
          {/* Decorative Corner Borders */}
          <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-amber-400"></div>
          <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-amber-400"></div>
          <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-amber-400"></div>
          <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-amber-400"></div>

          <p className="text-amber-400 uppercase tracking-widest text-xs font-semibold mb-2">Brewrich Wealth • Institutional Desk</p>
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-white mb-4">Certificate of Completion</h1>
          
          <p className="text-slate-400 text-sm italic mb-8">This is proudly presented to</p>

          <div className="my-6">
            <h2 className="text-4xl md:text-6xl font-serif font-extrabold text-amber-200 border-b border-amber-500/30 pb-4 inline-block px-12">
              {profile?.full_name || 'Valued Student'}
            </h2>
          </div>

          <p className="text-slate-300 text-sm md:text-base max-w-2xl mx-auto mb-10 leading-relaxed">
            For successfully mastering the <strong className="text-white">Momentum Institutional Program (MIP)</strong>, completing rigorous institutional assessments in Market Basics, Risk Management, Strategy Backtesting, and Portfolio Diversification.
          </p>

          <div className="flex flex-col sm:flex-row justify-between items-center border-t border-slate-800 pt-8 mt-8 text-xs text-slate-400 gap-4">
            <div>
              <p className="font-mono text-blue-400 font-bold">Enrollment ID: {profile?.enrollment_id}</p>
              <p className="mt-1">Verified Institutional Scholar</p>
            </div>
            <div className="text-right">
              <p className="font-serif font-bold text-white text-sm">Yogesh Nath S.</p>
              <p className="text-slate-400">Founder, Brewrich Wealth (CFP)</p>
            </div>
          </div>

        </div>

      </div>
    </main>
  );
}
