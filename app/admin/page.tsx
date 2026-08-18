'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminControlCenter() {
  const [students, setStudents] = useState<any[]>([]);
  const [questions, setQuestions] = useState<any[]>([]);
  const [liveLink, setLiveLink] = useState('https://meet.google.com');
  
  // New Question Form State
  const [weekNum, setWeekNum] = useState(1);
  const [questionText, setQuestionText] = useState('');
  const [optA, setOptA] = useState('');
  const [optB, setOptB] = useState('');
  const [optC, setOptC] = useState('');
  const [optD, setOptD] = useState('');
  const [correctOpt, setCorrectOpt] = useState('A');

  const [savingLink, setSavingLink] = useState(false);
  const [linkMessage, setLinkMessage] = useState('');
  const [addingQ, setAddingQ] = useState(false);
  const [qMessage, setQMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  
  const supabase = createClient();
  const router = useRouter();

  const adminEmail = 'brewrichtrading@gmail.com';

  useEffect(() => {
    async function verifyAndLoadAdmin() {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/miip');
        return;
      }

      if (session.user.email !== adminEmail) {
        router.push('/student/dashboard');
        return;
      }

      setAuthorized(true);
      await loadAdminData();
    }

    verifyAndLoadAdmin();
  }, [supabase, router]);

  async function loadAdminData() {
    // 1. Fetch Students
    const { data: studentData } = await supabase
      .from('student_profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (studentData) setStudents(studentData);

    // 2. Fetch Live Meeting Link
    const { data: settingsData } = await supabase
      .from('platform_settings')
      .select('*')
      .eq('key', 'live_meeting_link')
      .single();

    if (settingsData) setLiveLink(settingsData.value);

    // 3. Fetch Assessment Questions
    const { data: qData } = await supabase
      .from('assessment_questions')
      .select('*')
      .order('week_number', { ascending: true });

    if (qData) setQuestions(qData);

    setLoading(false);
  }

  const handleSaveLiveLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingLink(true);
    setLinkMessage('');

    const { error } = await supabase
      .from('platform_settings')
      .upsert({ key: 'live_meeting_link', value: liveLink }, { onConflict: 'key' });

    if (error) {
      setLinkMessage('Failed to update live link.');
    } else {
      setLinkMessage('Live meeting link updated successfully!');
    }
    setSavingLink(false);
  };

  const handleRemoveStudent = async (studentId: string, studentName: string) => {
    if (!confirm(`Are you sure you want to remove ${studentName || 'this student'}? This will revoke their portal access.`)) return;

    const { error } = await supabase
      .from('student_profiles')
      .delete()
      .eq('id', studentId);

    if (error) {
      alert('Failed to remove student. Try again.');
    } else {
      setStudents(students.filter(s => s.id !== studentId));
    }
  };

  const handleAddQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddingQ(true);
    setQMessage('');

    const newQuestion = {
      week_number: Number(weekNum),
      question_text: questionText,
      option_a: optA,
      option_b: optB,
      option_c: optC,
      option_d: optD,
      correct_option: correctOpt
    };

    const { error } = await supabase
      .from('assessment_questions')
      .insert([newQuestion]);

    if (error) {
      setQMessage('Error adding question. Make sure assessment_questions table exists in Supabase.');
    } else {
      setQMessage('Question added successfully!');
      setQuestionText('');
      setOptA('');
      setOptB('');
      setOptC('');
      setOptD('');
      loadAdminData();
    }
    setAddingQ(false);
  };

  const handleDeleteQuestion = async (qId: string) => {
    if (!confirm('Are you sure you want to delete this question?')) return;

    const { error } = await supabase
      .from('assessment_questions')
      .delete()
      .eq('id', qId);

    if (error) {
      alert('Failed to delete question.');
    } else {
      setQuestions(questions.filter(q => q.id !== qId));
    }
  };

  if (loading || !authorized) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <p className="text-xl animate-pulse">Verifying secure admin clearance...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Admin Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 p-8 rounded-2xl border border-blue-500/30 shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <span className="bg-red-500/20 text-red-400 text-xs font-semibold px-3 py-1 rounded-full border border-red-500/30 uppercase tracking-wider">
              🔒 Master Admin Control Center
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold mt-2">Full Platform Management</h1>
            <p className="text-slate-300 text-sm mt-1">Control live links, manage student enrollments, remove users, and modify quiz questions.</p>
          </div>
          <Link 
            href="/student/dashboard"
            className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition"
          >
            ← Back to Student View
          </Link>
        </div>

        {/* Live Class Link Control Box */}
        <div className="bg-slate-900/80 p-8 rounded-2xl border border-slate-800 shadow-xl space-y-4">
          <h2 className="text-xl font-bold">Live Classroom Link Control</h2>
          <p className="text-slate-400 text-sm">
            Update the Google Meet or Zoom URL below. Once saved, students clicking "Join Live Class Now" on their dashboard will automatically be directed to this link.
          </p>

          <form onSubmit={handleSaveLiveLink} className="space-y-4 max-w-2xl">
            <div className="flex gap-4">
              <input 
                type="url" 
                value={liveLink} 
                onChange={(e) => setLiveLink(e.target.value)} 
                required
                className="flex-1 bg-slate-950 border border-slate-700 focus:border-blue-500 rounded-xl px-4 py-3 text-white text-sm outline-none transition"
              />
              <button 
                type="submit" 
                disabled={savingLink}
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-xl text-sm transition shadow-lg shadow-blue-600/30"
              >
                {savingLink ? 'Saving...' : 'Update Live Link'}
              </button>
            </div>
            {linkMessage && <p className="text-sm text-green-400 font-medium">{linkMessage}</p>}
          </form>
        </div>

        {/* Student Management & Removal Section */}
        <div className="bg-slate-900/80 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
          <div className="p-6 border-b border-slate-800 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold">Student Directory & Removal Control</h2>
              <p className="text-slate-400 text-xs mt-1">Total Registered Scholars: {students.length}</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-xs uppercase tracking-wider bg-slate-950/50">
                  <th className="p-4">Enrollment ID</th>
                  <th className="p-4">Student Full Name</th>
                  <th className="p-4">Registered Email</th>
                  <th className="p-4">Enrolled On</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-sm">
                {students.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-500">No registered scholars found in the database yet.</td>
                  </tr>
                ) : (
                  students.map((student) => (
                    <tr key={student.id} className="hover:bg-slate-800/30 transition">
                      <td className="p-4 font-mono font-bold text-blue-400">{student.enrollment_id}</td>
                      <td className="p-4 font-semibold text-white">{student.full_name || 'Not Provided'}</td>
                      <td className="p-4 text-slate-300">{student.email}</td>
                      <td className="p-4 text-slate-400">{new Date(student.created_at).toLocaleDateString()}</td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleRemoveStudent(student.id, student.full_name)}
                          className="bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30 px-3 py-1.5 rounded-lg text-xs font-bold transition"
                        >
                          Remove Student 🗑️
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Assessment Question Bank Manager (CRUD) */}
        <div className="bg-slate-900/80 p-8 rounded-2xl border border-slate-800 shadow-xl space-y-6">
          <div>
            <h2 className="text-xl font-bold">Assessment Question Bank Manager (CRUD)</h2>
            <p className="text-slate-400 text-sm mt-1">Add or remove weekly assessment questions for student quizzes.</p>
          </div>

          <form onSubmit={handleAddQuestion} className="space-y-4 bg-slate-950/60 p-6 rounded-xl border border-slate-800">
            <h3 className="text-sm font-bold text-blue-400 uppercase tracking-wider">Add New Question</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Select Module Week</label>
                <select 
                  value={weekNum} 
                  onChange={(e) => setWeekNum(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm outline-none"
                >
                  <option value={1}>Week 1: Stock Market Basics</option>
                  <option value={2}>Week 2: Risk Management</option>
                  <option value={3}>Week 3: Strategy Backtesting</option>
                  <option value={4}>Week 4: MF & ETF Diversification</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Correct Answer Option</label>
                <select 
                  value={correctOpt} 
                  onChange={(e) => setCorrectOpt(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm outline-none"
                >
                  <option value="A">Option A</option>
                  <option value="B">Option B</option>
                  <option value="C">Option C</option>
                  <option value="D">Option D</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Question Text</label>
              <textarea 
                value={questionText} 
                onChange={(e) => setQuestionText(e.target.value)} 
                required
                rows={2}
                placeholder="Enter question statement here..."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm outline-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" placeholder="Option A" value={optA} onChange={(e) => setOptA(e.target.value)} required className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm outline-none" />
              <input type="text" placeholder="Option B" value={optB} onChange={(e) => setOptB(e.target.value)} required className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm outline-none" />
              <input type="text" placeholder="Option C" value={optC} onChange={(e) => setOptC(e.target.value)} required className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm outline-none" />
              <input type="text" placeholder="Option D" value={optD} onChange={(e) => setOptD(e.target.value)} required className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm outline-none" />
            </div>

            <button 
              type="submit" 
              disabled={addingQ}
              className="bg-green-600 hover:bg-green-500 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition"
            >
              {addingQ ? 'Adding Question...' : '+ Add Question to Database'}
            </button>

            {qMessage && <p className="text-sm font-medium text-green-400 mt-2">{qMessage}</p>}
          </form>

          {/* Existing Questions List */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold">Existing Question Bank ({questions.length})</h3>
            {questions.length === 0 ? (
              <p className="text-sm text-slate-500">No questions added yet. Use the form above to add assessment questions.</p>
            ) : (
              <div className="space-y-3">
                {questions.map((q) => (
                  <div key={q.id} className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 flex justify-between items-start gap-4">
                    <div>
                      <span className="text-xs font-mono bg-blue-600/20 text-blue-400 px-2 py-0.5 rounded border border-blue-500/30">Week {q.week_number}</span>
                      <p className="font-bold text-sm mt-2">{q.question_text}</p>
                      <div className="grid grid-cols-2 gap-2 text-xs text-slate-400 mt-2">
                        <p className={q.correct_option === 'A' ? 'text-green-400 font-bold' : ''}>A: {q.option_a}</p>
                        <p className={q.correct_option === 'B' ? 'text-green-400 font-bold' : ''}>B: {q.option_b}</p>
                        <p className={q.correct_option === 'C' ? 'text-green-400 font-bold' : ''}>C: {q.option_c}</p>
                        <p className={q.correct_option === 'D' ? 'text-green-400 font-bold' : ''}>D: {q.option_d}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleDeleteQuestion(q.id)}
                      className="text-red-400 hover:text-red-300 text-xs font-bold px-3 py-1.5 bg-red-600/10 border border-red-500/20 rounded-lg transition"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </main>
  );
}
