'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    async function checkAdminAndLoadData() {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/mip');
        return;
      }

      // Restrict to your authorized admin email or allow testing
      const adminEmail = 'brewrichtrading@gmail.com'; 
      if (session.user.email !== adminEmail) {
        alert('Access Denied: Admin privileges required.');
        router.push('/student/dashboard');
        return;
      }

      setIsAdmin(true);

      // Fetch all student profiles
      const { data, error } = await supabase
        .from('student_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (data) {
        setStudents(data);
      }
      setLoading(false);
    }

    checkAdminAndLoadData();
  }, [supabase, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <p className="text-xl animate-pulse">Verifying admin credentials...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 p-8 rounded-2xl border border-blue-500/30 shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <span className="bg-red-500/20 text-red-400 text-xs font-semibold px-3 py-1 rounded-full border border-red-500/30 uppercase tracking-wider">
              Restricted Admin Control
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold mt-2">MIP Student Directory</h1>
            <p className="text-slate-300 text-sm mt-1">Manage enrollments, track participants, and monitor program access.</p>
          </div>
          <button 
            onClick={() => router.push('/student/dashboard')}
            className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition"
          >
            Go to Student View
          </button>
        </div>

        {/* Students Table */}
        <div className="bg-slate-900/80 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
          <div className="p-6 border-b border-slate-800">
            <h2 className="text-xl font-bold">Registered Scholars ({students.length})</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-xs uppercase tracking-wider bg-slate-950/50">
                  <th className="p-4">Enrollment ID</th>
                  <th className="p-4">Student Name</th>
                  <th className="p-4">Email Address</th>
                  <th className="p-4">Registration Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-sm">
                {students.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-6 text-center text-slate-500">No registered students found yet.</td>
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
