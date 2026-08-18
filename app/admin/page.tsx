'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminControlCenter() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  
  const supabase = createClient();
  const router = useRouter();

  const adminEmail = 'brewrichtrading@gmail.com';

  useEffect(() => {
    async function verifyAndLoadAdmin() {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/mip');
        return;
      }

      // Strict security check for admin email
      if (session.user.email !== adminEmail) {
        router.push('/student/dashboard');
        return;
      }

      setAuthorized(true);

      // Fetch all registered student profiles from database
      const { data, error } = await supabase
        .from('student_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (data) {
        setStudents(data);
      }
      setLoading(false);
    }

    verifyAndLoadAdmin();
  }, [supabase, router]);

  if (loading || !authorized) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <p className="text-xl animate-pulse">Verifying secure admin clearance...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Admin Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 p-8 rounded-2xl border border-blue-500/30 shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <span className="bg-red-500/20 text-red-400 text-xs font-semibold px-3 py-1 rounded-full border border-red-500/30 uppercase tracking-wider">
              🔒 Master Admin Control Center
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold mt-2">MIP Scholar Directory</h1>
            <p className="text-slate-300 text-sm mt-1">Manage enrollments, inspect unique credentials, and monitor platform activity.</p>
          </div>
          <Link 
            href="/student/dashboard"
            className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition"
          >
            ← Back to Student View
          </Link>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 shadow-xl">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Registered Scholars</p>
            <p className="text-3xl font-extrabold text-blue-400 mt-2">{students.length}</p>
          </div>
          <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 shadow-xl">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Program Track</p>
            <p className="text-3xl font-extrabold text-green-400 mt-2">MIP 2026</p>
          </div>
          <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 shadow-xl">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Admin Clearance</p>
            <p className="text-xl font-bold text-amber-400 mt-3 truncate">{adminEmail}</p>
          </div>
        </div>

        {/* Registered Students Table */}
        <div className="bg-slate-900/80 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
          <div className="p-6 border-b border-slate-800 flex justify-between items-center">
            <h2 className="text-xl font-bold">Enrolled Participants</h2>
            <span className="text-xs text-slate-400 font-mono">Live Supabase Database View</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-xs uppercase tracking-wider bg-slate-950/50">
                  <th className="p-4">Enrollment ID</th>
                  <th className="p-4">Student Full Name</th>
                  <th className="p-4">Registered Email</th>
                  <th className="p-4">Enrolled On</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-sm">
                {students.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-slate-500">No registered scholars found in the database yet.</td>
                  </tr>
                ) : (
                  students.map((student) => (
                    <tr key={student.id} className="hover:bg-slate-800/30 transition">
                      <td className="p-4 font-mono font-bold text-blue-400">{student.enrollment_id}</td>
                      <td className="p-4 font-semibold text-white">{student.full_name || 'Not Provided'}</td>
                      <td className="p-4 text-slate-300">{student.email}</td>
                      <td className="p-4 text-slate-400">{new Date(student.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </main>
  );
}
