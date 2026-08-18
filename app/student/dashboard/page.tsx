'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function StudentDashboard() {
  const [profile, setProfile] = useState<any>(null);
  const [sessionUser, setSessionUser] = useState<any>(null);
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  
  const supabase = createClient();
  const router = useRouter();

  const adminEmail = 'brewrichtrading@gmail.com';

  useEffect(() => {
    async function loadStudentData() {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/mip');
        return;
      }

      setSessionUser(session.user);

      // Try fetching existing profile
      let { data } = await supabase
        .from('student_profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      // Auto-create profile if missing
      if (!data) {
        const randomId = 'BRW-MIP-2026-' + Math.random().toString(36).substring(2, 6).toUpperCase();
        const newProfile = {
          id: session.user.id,
          email: session.user.email,
          full_name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0],
          enrollment_id: randomId
        };
        
        const { data: insertedData } = await supabase
          .from('student_profiles')
          .insert([newProfile])
          .select()
          .single();
          
        data = insertedData || newProfile;
      }

      setProfile(data);
      setFullName(data?.full_name || '');
      setLoading(false);
    }

    loadStudentData();
  }, [supabase, router]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    const { error } = await supabase
      .from('student_profiles')
      .update({ full_name: fullName, updated_at: new Date() })
      .eq('id', profile.id);

    if (error) {
      setMessage('Failed to update name. Try again.');
    } else {
      setMessage('Profile updated successfully! This name will appear on your certificate.');
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <p className="text-xl animate-pulse">Loading your student portal...</p>
      </div>
    );
  }

  const isAdmin = sessionUser?.email === adminEmail;

  return (
    <main className="min-h-screen bg-slate-950 text-white p-6 md:p-12">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Top Navigation & Admin Shortcut */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-ping"></span>
            <span className="text-xs font-semibold text-slate-300">Portal Status: <strong className="text-green-400">Active & Whitelisted</strong></span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {isAdmin && (
              <Link 
                href="/admin" 
                className="bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30 px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2"
              >
                🛠️ Open Admin Panel
              </Link>
            )}
            <Link 
              href="/student/assessments" 
              className="bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 px-4 py-2 rounded-xl text-xs font-bold transition"
            >
              📝 View Assessments
            </Link>
            <Link 
              href="/student/certificate" 
              className="bg-amber-600/20 hover:bg-amber-600/30 text-amber-400 border border-amber-500/30 px-4 py-2 rounded-xl text-xs font-bold transition"
            >
              🎓 Certificate
            </Link>
          </div>
        </div>

        {/* Header Banner */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-8 rounded-2xl border border-blue-500/30 shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <span className="bg-blue-500/20 text-blue-400 text-xs font-semibold px-3 py-1 rounded-full border border-blue-400/30 uppercase tracking-wider">
              MIP Mentorship Program
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold mt-2">Welcome, {profile?.full_name || 'Scholar'}!</h1>
            <p className="text-slate-300 text-sm mt-1">Institutional Wealth & Disciplined Compounding Portal</p>
          </div>
          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 text-right">
            <p className="text-xs text-slate-400">Enrollment ID</p>
            <p className="text-lg font-mono font-bold text-blue-400">{profile?.enrollment_id || 'BRW-MIP-2026-ACTIVE'}</p>
          </div>
        </div>

        {/* Live Class & Reusable Meeting Link Box */}
        <div className="bg-slate-900/80 p-8 rounded-2xl border border-slate-800 shadow-xl">
          <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
            <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
            Live Institutional Class Room
          </h2>
          <p className="text-slate-400 text-sm mb-6">
            Join our live weekend mentoring sessions using your secure registered email account. Sessions are hosted via our reusable institutional link below.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <a
              href="https://meet.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto text-center bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-3.5 rounded-xl transition shadow-lg shadow-blue-600/30"
            >
              Join Live Class Now 🚀
            </a>
            <span className="text-xs text-slate-400">Secured to Google account: <strong className="text-white">{profile?.email}</strong></span>
          </div>
        </div>

        {/* 4-Week Program Schedule & Events Roadmap */}
        <div className="bg-slate-900/80 p-8 rounded-2xl border border-slate-800 shadow-xl space-y-6">
          <div>
            <h2 className="text-xl font-bold">MIP Program Schedule & Curriculum</h2>
            <p className="text-slate-400 text-sm mt-1">Scheduled live sessions and Sunday assessment unlock roadmap.</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            
            <div className="bg-slate-950/60 p-5 rounded-xl border border-slate-800/80">
              <span className="text-xs font-mono text-blue-400 uppercase tracking-widest">Week 1 Module</span>
              <h3 className="text-lg font-bold mt-1">Basics of Stock Market & Order Flow</h3>
              <p className="text-slate-400 text-xs mt-2">Live Session: Saturday, 10:00 AM</p>
              <p className="text-slate-400 text-xs mt-1">Assessment Unlocks: Sunday (20 Questions)</p>
            </div>

            <div className="bg-slate-950/60 p-5 rounded-xl border border-slate-800/80">
              <span className="text-xs font-mono text-blue-400 uppercase tracking-widest">Week 2 Module</span>
              <h3 className="text-lg font-bold mt-1">Risk Management & Capital Protection</h3>
              <p className="text-slate-400 text-xs mt-2">Live Session: Saturday, 10:00 AM</p>
              <p className="text-slate-400 text-xs mt-1">Assessment Unlocks: Sunday (20 Questions)</p>
            </div>

            <div className="bg-slate-950/60 p-5 rounded-xl border border-slate-800/80">
              <span className="text-xs font-mono text-blue-400 uppercase tracking-widest">Week 3 Module</span>
              <h3 className="text-lg font-bold mt-1">Strategy Building & Automated Backtesting</h3>
              <p className="text-slate-400 text-xs mt-2">Live Session: Saturday, 10:00 AM</p>
              <p className="text-slate-400 text-xs mt-1">Assessment Unlocks: Sunday (20 Questions)</p>
            </div>

            <div className="bg-slate-950/60 p-5 rounded-xl border border-slate-800/80">
              <span className="text-xs font-mono text-blue-400 uppercase tracking-widest">Week 4 Module</span>
              <h3 className="text-lg font-bold mt-1">Diversification on Mutual Funds & ETFs</h3>
              <p className="text-slate-400 text-xs mt-2">Live Session: Saturday, 10:00 AM</p>
              <p className="text-slate-400 text-xs mt-1">Assessment Unlocks & Certificate: Sunday</p>
            </div>

          </div>
        </div>

        {/* Profile & Certificate Name Settings */}
        <div className="bg-slate-900/80 p-8 rounded-2xl border border-slate-800 shadow-xl">
          <h2 className="text-xl font-bold mb-2">Student Profile & Certificate Settings</h2>
          <p className="text-slate-400 text-sm mb-6">
            Update your full legal name below. This exact name will be automatically printed on your official MIP Program completion certificate.
          </p>
          
          <form onSubmit={handleUpdateProfile} className="space-y-4 max-w-xl">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Registered Email (Locked)</label>
              <input 
                type="email" 
                disabled 
                value={profile?.email || ''} 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-400 cursor-not-allowed text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Full Name for Certificate</label>
              <input 
                type="text" 
                value={fullName} 
                onChange={(e) => setFullName(e.target.value)} 
                required
                placeholder="Enter your full name (e.g. Yogesh Nath S.)"
                className="w-full bg-slate-950 border border-slate-700 focus:border-blue-500 rounded-xl px-4 py-3 text-white text-sm outline-none transition"
              />
            </div>

            <button 
              type="submit" 
              disabled={saving}
              className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition"
            >
              {saving ? 'Saving...' : 'Save Profile Name'}
            </button>

            {message && <p className="text-sm text-green-400 mt-2 font-medium">{message}</p>}
          </form>
        </div>

      </div>
    </main>
  );
}
