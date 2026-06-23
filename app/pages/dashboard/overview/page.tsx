"use client";

import DashboardLayout from "@/app/components/DashboardLayout";
import { useEffect, useState } from "react";
import {
  getAcademicSessions,
  createAcademicSession,
  type AcademicSession,
} from "@/lib/api";

const stats = [
  {
    label: "Total Students",
    value: "2,418",
    change: "+12%",
    up: true,
    color: "indigo",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    label: "Active Courses",
    value: "154",
    change: "+5%",
    up: true,
    color: "violet",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  },
  {
    label: "Avg. Score",
    value: "84.2",
    change: "+2.1",
    up: true,
    color: "emerald",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    label: "Pass Rate",
    value: "91.7%",
    change: "-0.3%",
    up: false,
    color: "amber",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    ),
  },
];

const colorMap: Record<string, { bg: string; text: string; ring: string }> = {
  indigo: { bg: "bg-indigo-50", text: "text-indigo-600", ring: "bg-indigo-500" },
  violet: { bg: "bg-violet-50", text: "text-violet-600", ring: "bg-violet-500" },
  emerald: { bg: "bg-emerald-50", text: "text-emerald-600", ring: "bg-emerald-500" },
  amber: { bg: "bg-amber-50", text: "text-amber-600", ring: "bg-amber-500" },
};

const recentStudents = [
  { name: "Ayla Torres", course: "Data Structures", score: 92, grade: "A", avatar: "AT" },
  { name: "Ben Nguyen", course: "Calculus II", score: 78, grade: "B+", avatar: "BN" },
  { name: "Clara Kim", course: "Physics I", score: 85, grade: "A-", avatar: "CK" },
  { name: "David Osei", course: "Web Development", score: 96, grade: "A+", avatar: "DO" },
  { name: "Elena Marsh", course: "Algorithms", score: 71, grade: "B", avatar: "EM" },
];

const topCourses = [
  { name: "Web Development", enrolled: 142, avg: 88, pct: 88 },
  { name: "Data Structures", enrolled: 118, avg: 82, pct: 82 },
  { name: "Calculus II", enrolled: 97, avg: 76, pct: 76 },
  { name: "Physics I", enrolled: 85, avg: 79, pct: 79 },
];

const gradeColor = (g: string) => {
  if (g.startsWith("A")) return "text-emerald-700 bg-emerald-50";
  if (g.startsWith("B")) return "text-indigo-700 bg-indigo-50";
  return "text-amber-700 bg-amber-50";
};

export default function OverviewPage() {
  const [sessions, setSessions] = useState<AcademicSession[]>([]);
  const [sessionCode, setSessionCode] = useState("");
  const [creating, setCreating] = useState(false);
  const [sessionError, setSessionError] = useState("");

  useEffect(() => {
    getAcademicSessions()
      .then((res) => { if (res.succeeded) setSessions(res.data); })
      .catch(() => {});
  }, []);

  const handleCreate = async () => {
    if (!sessionCode.trim()) return;
    setCreating(true);
    setSessionError("");
    try {
      const res = await createAcademicSession(sessionCode.trim());
      if (!res.succeeded) throw new Error(res.message || res.errors?.[0]);
      setSessionCode("");
      const updated = await getAcademicSessions();
      if (updated.succeeded) setSessions(updated.data);
    } catch (err: unknown) {
      setSessionError(err instanceof Error ? err.message : "Failed to create session");
    } finally {
      setCreating(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Good morning, Admin 👋</h2>
          <p className="text-slate-400 text-sm mt-1">Here's what's happening across your institution today.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s) => {
            const c = colorMap[s.color];
            return (
              <div key={s.label} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className={`w-10 h-10 rounded-xl ${c.bg} ${c.text} flex items-center justify-center`}>
                    {s.icon}
                  </div>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${s.up ? "text-emerald-700 bg-emerald-50" : "text-red-600 bg-red-50"}`}>
                    {s.change}
                  </span>
                </div>
                <p className="text-2xl font-bold text-slate-900 mt-4">{s.value}</p>
                <p className="text-xs text-slate-400 mt-0.5">{s.label}</p>
              </div>
            );
          })}
        </div>

        {/* Academic Sessions */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100">
            <h3 className="font-semibold text-slate-800">Academic Sessions</h3>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Session code (e.g., 2024/2025)"
                value={sessionCode}
                onChange={(e) => { setSessionCode(e.target.value); setSessionError(""); }}
                onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                className="flex-1 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition"
              />
              <button
                onClick={handleCreate}
                disabled={!sessionCode.trim() || creating}
                className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white text-sm font-semibold transition whitespace-nowrap"
              >
                {creating ? "Creating…" : "+ New Session"}
              </button>
            </div>
            {sessionError && (
              <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">{sessionError}</p>
            )}
            {sessions.length === 0 ? (
              <p className="text-sm text-slate-400">No sessions yet.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {sessions.map((s) => (
                  <span
                    key={s.id}
                    className="inline-flex items-center text-xs font-semibold px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100"
                  >
                    {s.sessionCode}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-5 gap-4">
          {/* Recent Scores */}
          <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-semibold text-slate-800">Recent Scores</h3>
              <a href="/pages/dashboard/students" className="text-xs text-indigo-600 hover:text-indigo-700 font-medium">View all →</a>
            </div>
            <div className="divide-y divide-slate-50">
              {recentStudents.map((s) => (
                <div key={s.name} className="flex items-center gap-4 px-6 py-3.5 hover:bg-slate-50/60 transition-colors">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                    {s.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">{s.name}</p>
                    <p className="text-xs text-slate-400 truncate">{s.course}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-slate-800">{s.score}</p>
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${gradeColor(s.grade)}`}>{s.grade}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Courses */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-semibold text-slate-800">Top Courses</h3>
              <a href="/pages/dashboard/courses" className="text-xs text-indigo-600 hover:text-indigo-700 font-medium">View all →</a>
            </div>
            <div className="p-6 space-y-5">
              {topCourses.map((c) => (
                <div key={c.name} className="space-y-1.5">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-slate-700 truncate pr-2">{c.name}</span>
                    <span className="text-slate-400 text-xs shrink-0">{c.enrolled} students</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-700"
                      style={{ width: `${c.pct}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate-400">Avg score: <span className="text-slate-600 font-medium">{c.avg}</span></p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
