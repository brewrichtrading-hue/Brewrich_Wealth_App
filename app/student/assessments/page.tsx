'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function StudentAssessments() {
  const [profile, setProfile] = useState<any>(null);
  const [scores, setScores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    async function loadData() {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/mip');
        return;
      }

      // Fetch profile
      const { data: profileData } = await supabase
        .from('student_profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      // Fetch existing assessment scores
      const { data: scoreData } = await supabase
        .from('assessment_scores')
        .select('*')
        .eq('user_id', session.user.id);

      setProfile(profileData);
      setScores(scoreData || []);
      setLoading(false);
    }

    loadData();
  }, [supabase, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <p className="text-xl animate-pulse">Loading assessments portal...</p>
      </div>
    );
  }

  const weeks = [
    { week: 1, title: "Basics of Stock Market & Order Flow", unlocked: true },
    { week: 2, title: "Risk Management & Capital Protection", unlocked: false },
    { week: 3, title: "Strategy Building & Automated Backtesting", unlocked: false },
    { week: 4, title: "Diversification on Mutual Funds & ETFs", unlocked: false },
  ];

  return (
    <main className="min-h-screen bg-slate-950 text-white p-6 md:p-12">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-8 rounded-2xl border border-blue-500/30 shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <span className="bg-blue-500/20 text-blue-400 text-xs font-semibold px-3 py-1 rounded-full border border-blue-400/30 uppercase tracking-wider">
              MIP Certification Track
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold mt-2">Weekly Assessments</h1>
            <p className="text-slate-300 text-sm mt-1">Unlock your final completion certificate by completing all 4 Sunday evaluations (20 questions each).</p>
          </div>
          <button 
            onClick={() => router.push('/student/dashboard')}
            className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition"
          >
            Back to Dashboard
          </button>
        </div>

        {/* Weekly List */}
        <div className="grid gap-6">
          {weeks.map((w) => {
            const recordedScore = scores.find((s) => s.week_number === w.week);
            
            return (
              <div key={w.week} className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <span className="text-xs font-mono text-blue-400 uppercase tracking-widest">Week {w.week} Module</span>
                  <h3 className="text-xl font-bold mt-1">{w.title}</h3>
                  <p className="text-slate-400 text-xs mt-1">20 Questions • Weighted across core institutional modules</p>
                </div>

                <div className="flex items-center gap-4">
                  {recordedScore ? (
                    <div className="text-right">
                      <span className="bg-green-500/20 text-green-400 text-xs font-semibold px-3 py-1 rounded-full border border-green-500/30">
                        Completed ({recordedScore.score}/20)
                      </span>
                    </div>
                  ) : (
                    <button 
                      onClick={() => alert(`Week ${w.week} assessment questionnaire will load here!`)}
                      className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition shadow-lg shadow-blue-600/30"
                    >
                      Take Assessment 📝
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </main>
  );
}
